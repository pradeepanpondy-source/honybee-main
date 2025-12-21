
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

import Button from './Button';


type FormData = {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  country: string;
  profilePic: File | null;
  acceptTerms: boolean;
  city: string;
  state: string;
  zip: string;
  countryCode: string;
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
  password: '',
  confirmPassword: '',
  country: '',
  profilePic: null,
  acceptTerms: false,
  city: '',
  state: '',
  zip: '',
  countryCode: '',
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
  const navigate = useNavigate();

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
      // If logic needs to force location, handle here. 
      // For now, we allow submission or "Location" is step 4.
      // Wait, steps are 0-indexed?
      // 0: Options, 1: Personal, 2: Address, 3: Contact, 4: Location (New), 5: Finish
      // My previous renderFinish usage was Step 4.
      // So Location is Step 4. Finish is Step 5.
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

      // Basic validation
      if (!formData.email || !formData.name || !formData.acceptTerms) {
        setMessage({ type: 'error', text: 'Please fill all required fields and accept terms.' });
        return;
      }

      try {
        let profilePicUrl = '';
        let idProofUrl = '';

        // Upload profile picture to Supabase storage
        if (formData.profilePic) {
          const profileFileName = `${user.id}/seller-profiles/profile_${Date.now()}.${formData.profilePic.name.split('.').pop()}`;
          const { error: profileError } = await supabase.storage
            .from('kyc-documents')
            .upload(profileFileName, formData.profilePic);

          if (profileError) throw profileError;

          const { data: profileData } = supabase.storage
            .from('kyc-documents')
            .getPublicUrl(profileFileName);

          profilePicUrl = profileData.publicUrl;
        }

        // Upload ID proof to Supabase storage
        if (formData.idProof) {
          const idFileName = `${user.id}/seller-id-proofs/id_${Date.now()}.${formData.idProof.name.split('.').pop()}`;
          const { error: idError } = await supabase.storage
            .from('kyc-documents')
            .upload(idFileName, formData.idProof);

          if (idError) throw idError;

          const { data: idData } = supabase.storage
            .from('kyc-documents')
            .getPublicUrl(idFileName);

          idProofUrl = idData.publicUrl;
        }

        // Insert seller data directly into Supabase sellers table
        const { error } = await supabase
          .from('sellers')
          .insert([{
            user_id: user.id,
            seller_id: `SELLER-${Date.now()}`,
            name: formData.name,
            email: formData.email,
            seller_type: sellerType,
            phone: formData.phone,
            // Use detected address if available, otherwise manual address
            address: formData.detectedAddress || `${formData.city}, ${formData.state}, ${formData.zip}, ${formData.country}`,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country,
            country_code: formData.countryCode,
            id_proof_url: idProofUrl,
            profile_pic_url: profilePicUrl,
            is_approved: false,
            kyc_verified: false,
            // Try to save coords if schema supports it, otherwise they are ignored (or error if strictly typed, but Supabase JS usually handles extra fields depending on setup)
            // latitude: formData.latitude, 
            // longitude: formData.longitude
          }]);

        if (error) {
          throw error;
        }

        setMessage({ type: 'success', text: 'Seller registration submitted successfully! Your application will be reviewed.' });
        setTimeout(() => navigate('/applications'), 2000);
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
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full mb-4 px-3 py-2 border rounded bg-gray-100 text-gray-700 placeholder-gray-400"
      />
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
      <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
        className="w-full mb-4 px-3 py-2 border rounded bg-gray-100 text-gray-700 placeholder-gray-400"
      />
      <label className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
      <input
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
        className="w-full mb-4 px-3 py-2 border rounded bg-gray-100 text-gray-700 placeholder-gray-400"
      />
      <label className="block mb-2 text-sm font-medium text-gray-700">Country</label>
      <input
        type="text"
        name="country"
        placeholder="Country..."
        value={formData.country}
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
      {formData.profilePic && (
        <p className="text-sm text-gray-600 mb-4">
          File: {formData.profilePic.name} | Size: {(formData.profilePic.size / 1024).toFixed(2)} KB | Type: {formData.profilePic.type}
        </p>
      )}
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
    </form>
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
      <label className="block mb-2 text-sm font-medium text-gray-700">Country Code</label>
      <input
        type="text"
        name="countryCode"
        value={formData.countryCode}
        onChange={handleChange}
        required
        className="w-full mb-6 px-3 py-2 border rounded bg-gray-100 text-gray-700 placeholder-gray-400"
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

      <button
        onClick={() => setStep(4)} // Skip to finish/submit manually if needed
        className="mt-4 text-gray-400 text-sm underline hover:text-gray-600"
      >
        Skip this step
      </button>
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
