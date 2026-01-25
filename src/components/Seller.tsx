
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSeller } from '../hooks/useSeller';
import { supabase } from '../lib/supabase';

import Button from './Button';
import { sellerRegistrationSchema, sanitizeInput } from '../utils/validation';


type FormData = {
  email: string;
  name: string;
  profilePic: File | null;
  acceptTerms: boolean;
  city: string;
  state: string;
  zip: string;
  phone: string;
  idProof: File | null;
  sellerType: string;
  latitude: number | null;
  longitude: number | null;
  detectedAddress: string;
};

const initialFormData: FormData = {
  email: '',
  name: '',
  profilePic: null,
  acceptTerms: false,
  city: '',
  state: '',
  zip: '',
  phone: '',
  idProof: null,
  sellerType: '',
  latitude: null,
  longitude: null,
  detectedAddress: '',
};

const Seller = () => {
  const [step, setStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [sellerType, setSellerType] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  // Removed unused selectedOption state to fix eslint error
  const { user } = useAuth();
  const { seller, loading: sellerLoading, refreshSeller } = useSeller();
  const navigate = useNavigate();

  if (sellerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Verifying registration status...</p>
        </div>
      </div>
    );
  }

  // If seller already exists, prevent re-registration
  if (seller) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Already Registered</h2>
          <p className="text-gray-600 mb-6">
            You have already registered as a seller.
            {seller.is_approved
              ? " Access your dashboard to manage your products."
              : " Your application is currently under review."}
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/applications')}
              className="w-full bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate('/home')}
              className="w-full bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition"
            >
              Return Home
            </button>
          </div>
          <p className="mt-4 text-xs text-gray-400">Seller ID: {seller.seller_id}</p>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 3) {
      nextStep(); // Go to location step instead of finishing
      return;
    }

    if (step === 4 && !formData.detectedAddress) {
      setMessage({ type: 'error', text: 'Please detect your location before submitting.' });
      return;
    }

    if (step === 4 || (step === 4 && formData.detectedAddress)) {
      // Final submission logic
      if (!user) {
        setMessage({ type: 'error', text: 'Please sign in to submit the application.' });
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      // Ensure session is active
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        setMessage({ type: 'error', text: 'Session expired. Please sign in again.' });
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      if (!sellerType) {
        setMessage({ type: 'error', text: 'Please select a seller type (Honey or Bee Hive).' });
        return;
      }

      // 1. Strict Input Validation & Sanitization
      const validationData = {
        name: sanitizeInput(formData.name),
        email: user.email,
        seller_type: sellerType as 'honey' | 'beehive',
        phone: sanitizeInput(formData.phone),
        address: sanitizeInput(formData.detectedAddress || `${formData.city}, ${formData.state}, ${formData.zip}`),
        city: sanitizeInput(formData.city),
        state: sanitizeInput(formData.state),
        zip: sanitizeInput(formData.zip),
      };

      const validation = sellerRegistrationSchema.safeParse(validationData);
      if (!validation.success) {
        setMessage({ type: 'error', text: validation.error.issues[0].message });
        return;
      }

      if (!formData.acceptTerms) {
        setMessage({ type: 'error', text: 'Please accept the terms and conditions.' });
        return;
      }

      try {
        const sellerId = `SELLER-${Date.now()}`;
        let profilePicUrl = '';
        let idProofUrl = '';

        // Upload profile picture to Supabase storage
        if (formData.profilePic) {
          // Path: email/seller_id/filename
          const profileFileName = `${user.email}/${sellerId}/profile_${Date.now()}.${formData.profilePic.name.split('.').pop()}`;
          const { error: profileError } = await supabase.storage
            .from('sellerid_details')
            .upload(profileFileName, formData.profilePic);

          if (profileError) throw profileError;

          const { data: profileData } = supabase.storage
            .from('sellerid_details')
            .getPublicUrl(profileFileName);

          profilePicUrl = profileData.publicUrl;
        }

        // Upload ID proof to Supabase storage
        if (formData.idProof) {
          const idFileName = `${user.email}/${sellerId}/id_${Date.now()}.${formData.idProof.name.split('.').pop()}`;
          const { error: idError } = await supabase.storage
            .from('sellerid_details')
            .upload(idFileName, formData.idProof);

          if (idError) throw idError;

          const { data: idData } = supabase.storage
            .from('sellerid_details')
            .getPublicUrl(idFileName);

          idProofUrl = idData.publicUrl;
        }

        // Insert seller data directly into Supabase sellers table
        const { error } = await supabase
          .from('sellers')
          .insert([{
            user_id: user.id,
            seller_id: sellerId,
            name: formData.name,
            email: user.email, // Enforce auth email source of truth
            seller_type: sellerType,
            phone: formData.phone,
            // Use detected address if available, otherwise manual address
            address: formData.detectedAddress || `${formData.city}, ${formData.state}, ${formData.zip}`,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            id_proof_url: idProofUrl,
            profile_pic_url: profilePicUrl,
            is_approved: false,
            kyc_verified: false,
            // Try to save coords if schema supports it, otherwise they are ignored (or error if strictly typed, but Supabase JS usually handles extra fields depending on setup)
            latitude: formData.latitude,
            longitude: formData.longitude
          }]);

        if (error) {
          throw error;
        }

        setMessage({ type: 'success', text: 'Seller registration submitted successfully! Your application will be reviewed.' });
        await refreshSeller(); // Ensure seller state is updated before navigation
        localStorage.setItem('justRegisteredSeller', 'true'); // Flag to prevent redirect loop
        navigate('/applications'); // Navigate immediately after state update
      } catch (error) {
        console.error('Error submitting application:', error);
        setMessage({ type: 'error', text: `Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
      }
      return;
    }

    // Here you can add form validation and submission logic for intermediate steps
    nextStep();
  };

  const renderProgress = () => {
    const steps = ['Personal Information', 'Address', 'Contact', 'Location', 'Finish'];
    return (
      <div className="flex justify-center space-x-8 mb-8">
        {steps.map((label, index) => {
          const current = index + 1;
          const isActive = current === step;
          const isCompleted = current < step;
          return (
            <div key={label} className="flex flex-col items-center text-center">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isActive || isCompleted ? 'border-purple-700' : 'border-gray-300'
                  }`}
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4 text-purple-700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  <div
                    className={`w-3 h-3 rounded-full ${isActive ? 'bg-purple-700' : 'bg-gray-300'
                      }`}
                  />
                )}
              </div>
              <span
                className={`mt-1 text-xs font-semibold ${isActive || isCompleted ? 'text-purple-700' : 'text-gray-400'
                  }`}
              >
                {label.split(' ').map((word, i) => (
                  <React.Fragment key={i}>
                    {word}
                    <br />
                  </React.Fragment>
                ))}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderOptionButtons = () => (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <div className="flex justify-center gap-8">
        <button
          onClick={() => {
            setSellerType('honey');
            if (!user) {
              setStep(1);
            } else {
              setStep(1);
            }
          }}
          className="gradient-bg-primary hover:shadow-2xl text-black font-semibold py-4 px-10 rounded-full transition-all duration-300 ease-out modern-shadow-hover transform hover:scale-105"
        >
          Sell Honey
        </button>
        <button
          onClick={() => {
            setSellerType('beehive');
            if (!user) {
              setStep(1);
            } else {
              setStep(1);
            }
          }}
          className="gradient-bg-primary hover:shadow-2xl text-black font-semibold py-4 px-10 rounded-full transition-all duration-300 ease-out modern-shadow-hover transform hover:scale-105"
        >
          Sell Bee Hive
        </button>
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-6">Personal Information</h2>
      <label className="block mb-2 text-sm font-medium text-gray-700">Your Email</label>
      <div className="relative">
        <input
          type="email"
          name="email"
          value={user?.email || ''} // Force use of auth email
          readOnly
          disabled
          className="w-full mb-4 px-3 py-2 border rounded bg-gray-200 text-gray-600 cursor-not-allowed"
        />
        <svg
          className="w-4 h-4 text-gray-500 absolute right-3 top-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <label className="block mb-2 text-sm font-medium text-gray-700">Your Name</label>
      <input
        type="text"
        name="name"
        placeholder="e.g. John Doe"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full mb-4 px-3 py-2 border rounded bg-gray-100 text-gray-700 placeholder-gray-400"
      />
      <label className="block mb-2 text-sm font-medium text-gray-700">Profile Picture</label>
      <input
        type="file"
        name="profilePic"
        accept="image/*"
        onChange={handleFileChange}
        required
        className="w-full mb-2 px-3 py-2 border rounded bg-gray-100 text-gray-700"
      />
      {
        formData.profilePic && (
          <p className="text-sm text-gray-600 mb-4">
            File: {formData.profilePic.name} | Size: {(formData.profilePic.size / 1024).toFixed(2)} KB | Type: {formData.profilePic.type}
          </p>
        )
      }
      <label className="inline-flex items-center mb-4">
        <input
          type="checkbox"
          name="acceptTerms"
          checked={formData.acceptTerms}
          onChange={handleChange}
          required
          className="form-checkbox text-purple-700"
        />
        <span className="ml-2 text-sm text-gray-700">I Accept Terms & Conditions</span>
      </label>
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => {
            setStep(0);
            // Removed setSelectedOption call as it no longer exists
          }}
          className="text-purple-700 underline"
        >
          Back to Options
        </button>
        <Button type="submit" variant="primary" className="flex items-center space-x-2">
          <span>Next</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
          </svg>
        </Button>
      </div>
    </form >
  );

  const renderAddress = () => (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-6">Address</h2>
      <label className="block mb-2 text-sm font-medium text-gray-700">City</label>
      <input
        type="text"
        name="city"
        value={formData.city}
        onChange={handleChange}
        required
        className="w-full mb-4 px-3 py-2 border rounded bg-gray-100 text-gray-700 placeholder-gray-400"
      />
      <label className="block mb-2 text-sm font-medium text-gray-700">State</label>
      <input
        type="text"
        name="state"
        value={formData.state}
        onChange={handleChange}
        required
        className="w-full mb-4 px-3 py-2 border rounded bg-gray-100 text-gray-700 placeholder-gray-400"
      />
      <label className="block mb-2 text-sm font-medium text-gray-700">Zip</label>
      <input
        type="text"
        name="zip"
        value={formData.zip}
        onChange={handleChange}
        required
        className="w-full mb-4 px-3 py-2 border rounded bg-gray-100 text-gray-700 placeholder-gray-400"
      />
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={prevStep}
          className="text-purple-700 underline"
        >
          Back
        </button>
        <Button type="submit" variant="primary" className="flex items-center space-x-2">
          <span>Next</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
          </svg>
        </Button>
      </div>
    </form>
  );

  const renderContact = () => (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-6">Contact</h2>
      <label className="block mb-2 text-sm font-medium text-gray-700">Phone</label>
      <input
        type="text"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        required
        className="w-full mb-4 px-3 py-2 border rounded bg-gray-100 text-gray-700 placeholder-gray-400"
      />
      <label className="block mb-2 text-sm font-medium text-gray-700">ID Proof</label>
      <input
        type="file"
        name="idProof"
        accept="image/*,.pdf"
        onChange={handleFileChange}
        required
        className="w-full mb-2 px-3 py-2 border rounded bg-gray-100 text-gray-700"
      />
      {formData.idProof && (
        <p className="text-sm text-gray-600 mb-4">
          File: {formData.idProof.name} | Size: {(formData.idProof.size / 1024).toFixed(2)} KB | Type: {formData.idProof.type}
        </p>
      )}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={prevStep}
          className="text-purple-700 underline"
        >
          Back
        </button>
        <Button type="submit" variant="primary">
          Sign up
        </Button>
      </div>
    </form>
  );

  const renderLocation = () => (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow text-center">
      <h2 className="text-xl font-bold mb-4">Location Access</h2>
      <p className="mb-6 text-gray-600">Please allow location access to verify your selling region and improve customer discovery.</p>

      {!formData.detectedAddress ? (
        <Button
          onClick={() => {
            if ("geolocation" in navigator) {
              navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                  // Reverse geocoding implementation
                  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                  const data = await response.json();
                  const address = data.display_name; // Or construct a shorter one

                  setFormData(prev => ({
                    ...prev,
                    latitude,
                    longitude,
                    detectedAddress: address
                  }));

                  // Auto-submit after detection
                  // handleSubmit(new Event('submit') as any); // Trigger submit
                } catch (error) {
                  console.error("Geocoding error:", error);
                  alert("Could not detect address. Please try again.");
                }
              }, (error) => {
                console.error("Location error:", error);
                alert("Location access denied. You can proceed without it.");
              });
            } else {
              alert("Geolocation is not supported by your browser.");
            }
          }}
          variant="primary"
          className="w-full flex justify-center items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Detect My Location
        </Button>
      ) : (
        <div className="animate-fade-in">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
            <p className="text-green-800 font-semibold mb-1">Location Detected!</p>
            <p className="text-gray-700 text-sm">{formData.detectedAddress}</p>
          </div>
          <Button onClick={handleSubmit} variant="primary" className="w-full">
            Complete Registration
          </Button>
        </div>
      )}

    </div>
  );

  const renderFinish = () => (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow text-center">
      <svg
        className="mx-auto mb-6 w-16 h-16 text-green-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
      </svg>
      <h2 className="text-2xl font-bold mb-2">Application Submitted</h2>
      <p className="mb-4">Your seller application has been submitted successfully. You will be redirected to your dashboard shortly.</p>
      <a href="/applications" className="text-purple-700 underline">
        Go to Dashboard
      </a>
    </div>
  );





  return (
    <div className="min-h-screen py-12 px-4 md:px-6">
      <h1 className="text-center font-semibold text-lg md:text-xl mb-4">Register as a Seller</h1>
      {message && (
        <div className={`max-w-md mx-auto mb-4 p-3 rounded-lg text-center ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-600' : 'bg-red-50 border border-red-200 text-red-600'}`}>
          {message.text}
        </div>
      )}
      <>
        {step === 0 && renderOptionButtons()}
        {step > 0 && renderProgress()}
        {step === 1 && renderPersonalInfo()}
        {step === 2 && renderAddress()}
        {step === 3 && renderContact()}
        {step === 4 && renderLocation()}
        {step === 5 && renderFinish()}
      </>
    </div>
  );
};

export default Seller;
