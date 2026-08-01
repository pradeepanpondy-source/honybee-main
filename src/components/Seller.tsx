
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Removed unused selectedOption state to fix eslint error
  const { user } = useAuth();
  const { seller, loading: sellerLoading, refreshSeller } = useSeller();
  const navigate = useNavigate();

  if (sellerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-honeybee-primary/20 border-t-honeybee-primary rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium tracking-tight">Verifying registration status...</p>
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
              className="w-full bg-honeybee-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-honeybee-primary transition"
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



  // Check if we are validating current step requirements before moving next
  const validateStep = (currentStep: number) => {
    const stepErrors: Record<string, string> = {};
    if (currentStep === 1) { // Personal Info
      if (!formData.name) stepErrors.name = "Name is required";
      if (!formData.profilePic) stepErrors.profilePic = "Profile picture is required";
      if (!formData.acceptTerms) stepErrors.acceptTerms = "You must accept terms";
    }
    if (currentStep === 2) { // Address
      if (!formData.city) stepErrors.city = "City is required";
      if (!formData.state) stepErrors.state = "State is required";
      if (!formData.zip) stepErrors.zip = "Zip is required";
      else if (!/^\d{6}$/.test(formData.zip)) stepErrors.zip = "Invalid Pincode";
    }
    if (currentStep === 3) { // Contact
      if (!formData.phone) stepErrors.phone = "Phone is required";
      else if (!/^\d{10}$/.test(formData.phone)) stepErrors.phone = "Invalid mobile number";
      if (!formData.idProof) stepErrors.idProof = "ID Proof is required";
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step < 4) {
      if (validateStep(step)) {
        nextStep();
      }
      return;
    }

    // Step 4: Location & Final Submit
    if (step === 4 && !formData.detectedAddress) {
      setMessage({ type: 'error', text: 'Please detect your location before submitting.' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (step === 4) {
      if (!user) {
        setMessage({ type: 'error', text: 'Please sign in to submit the application.' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      setIsSubmitting(true);
      setMessage(null);

      try {
        const effectiveSellerType = sellerType || 'honey';

        // 1. Validation
        const validationData = {
          name: sanitizeInput(formData.name),
          email: user.email,
          seller_type: effectiveSellerType as 'honey' | 'beehive',
          phone: sanitizeInput(formData.phone),
          address: sanitizeInput(formData.detectedAddress || `${formData.city}, ${formData.state}, ${formData.zip}`),
          city: sanitizeInput(formData.city),
          state: sanitizeInput(formData.state),
          zip: sanitizeInput(formData.zip),
        };

        const validation = sellerRegistrationSchema.safeParse(validationData);
        if (!validation.success) {
          const errMsg = validation.error.issues[0]?.message || 'Validation failed. Please check your inputs.';
          setMessage({ type: 'error', text: errMsg });
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setIsSubmitting(false);
          return;
        }

        const sellerId = `SELLER-${Date.now()}`;
        let profilePicUrl = '';
        let idProofUrl = '';

        // Upload profile picture to Supabase storage (graceful fallback)
        if (formData.profilePic) {
          try {
            const ext = formData.profilePic.name.split('.').pop() || 'jpg';
            const profileFileName = `${user.email}/${sellerId}/profile_${Date.now()}.${ext}`;
            const { error: profileError } = await supabase.storage
              .from('sellerid_details')
              .upload(profileFileName, formData.profilePic, { upsert: true });

            if (!profileError) {
              const { data: profileData } = supabase.storage
                .from('sellerid_details')
                .getPublicUrl(profileFileName);
              profilePicUrl = profileData.publicUrl;
            } else {
              console.warn('[Seller] Profile pic upload warning:', profileError);
            }
          } catch (err) {
            console.warn('[Seller] Profile pic upload catch:', err);
          }
        }

        // Upload ID proof to Supabase storage (graceful fallback)
        if (formData.idProof) {
          try {
            const ext = formData.idProof.name.split('.').pop() || 'pdf';
            const idFileName = `${user.email}/${sellerId}/id_${Date.now()}.${ext}`;
            const { error: idError } = await supabase.storage
              .from('sellerid_details')
              .upload(idFileName, formData.idProof, { upsert: true });

            if (!idError) {
              const { data: idData } = supabase.storage
                .from('sellerid_details')
                .getPublicUrl(idFileName);
              idProofUrl = idData.publicUrl;
            } else {
              console.warn('[Seller] ID proof upload warning:', idError);
            }
          } catch (err) {
            console.warn('[Seller] ID proof upload catch:', err);
          }
        }

        // Insert seller data into Supabase
        const insertData: any = {
          user_id: user.id,
          seller_id: sellerId,
          name: formData.name,
          email: user.email,
          seller_type: effectiveSellerType,
          phone: formData.phone,
          address: formData.detectedAddress || `${formData.city}, ${formData.state}, ${formData.zip}`,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          id_proof_url: idProofUrl,
          profile_pic_url: profilePicUrl,
          is_approved: false,
          kyc_verified: false,
        };

        if (formData.latitude !== null) insertData.latitude = formData.latitude;
        if (formData.longitude !== null) insertData.longitude = formData.longitude;

        const { error: insertError } = await supabase.from('sellers').insert([insertData]);

        if (insertError) {
          console.error('[Seller] Insert error:', insertError);
          throw insertError;
        }

        setMessage({ type: 'success', text: 'Seller registration submitted successfully!' });
        setStep(5);
        localStorage.setItem('justRegisteredSeller', 'true');
        refreshSeller().catch(e => console.warn('[Seller] Background refresh failed:', e));
      } catch (error: any) {
        console.error('Error submitting application:', error);
        setMessage({ type: 'error', text: `Registration failed: ${error?.message || 'Unknown error'}` });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderProgress = () => {
    const steps = ['Personal Information', 'Address', 'Contact', 'Location', 'Finish'];
    return (
      <div className="flex justify-center gap-2 md:space-x-8 mb-8 w-full px-2">
        {steps.map((label, index) => {
          const current = index + 1;
          const isActive = current === step;
          const isCompleted = current < step;
          return (
            <div key={label} className="flex flex-col items-center text-center flex-1 md:flex-none">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isActive || isCompleted ? 'border-honeybee-primary' : 'border-gray-300'
                  }`}
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4 text-honeybee-primary"
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
                    className={`w-3 h-3 rounded-full ${isActive ? 'bg-honeybee-primary' : 'bg-gray-300'
                      }`}
                  />
                )}
              </div>
              <span
                className={`mt-1 text-xs font-semibold ${isActive || isCompleted ? 'text-honeybee-primary' : 'text-gray-400'
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
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8">
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
        // required // Handled by validatStep
        className={`w-full mb-1 px-3 py-2 border rounded bg-gray-100 text-gray-700 placeholder-gray-400 ${errors.name ? 'border-red-500' : ''}`}
      />
      {errors.name && <p className="text-red-500 text-xs mb-3">{errors.name}</p>}

      <label className="block mb-2 text-sm font-medium text-gray-700">Profile Picture</label>
      <input
        type="file"
        name="profilePic"
        accept="image/*"
        onChange={handleFileChange}
        // required
        className={`w-full mb-1 px-3 py-2 border rounded bg-gray-100 text-gray-700 ${errors.profilePic ? 'border-red-500' : ''}`}
      />
      {errors.profilePic && <p className="text-red-500 text-xs mb-3">{errors.profilePic}</p>}
      {
        formData.profilePic && (
          <p className="text-sm text-gray-600 mb-4">
            File: {formData.profilePic.name} | Size: {(formData.profilePic.size / 1024).toFixed(2)} KB | Type: {formData.profilePic.type}
          </p>
        )
      }
      <label className="inline-flex items-start gap-2 mb-4 cursor-pointer">
        <input
          type="checkbox"
          name="acceptTerms"
          checked={formData.acceptTerms}
          onChange={handleChange}
          className="form-checkbox text-honeybee-primary mt-0.5 flex-shrink-0"
        />
        <span className="text-sm text-gray-700">
          I accept the{' '}
          <a
            href="/terms-and-conditions?from=seller"
            target="_blank"
            rel="noopener noreferrer"
            className="text-honeybee-primary underline underline-offset-2 hover:text-honeybee-secondary transition-colors font-semibold"
          >
            Terms &amp; Conditions
          </a>
          {' '}of BeeBridge
        </span>
      </label>
      {errors.acceptTerms && <p className="text-red-500 text-xs mb-4">{errors.acceptTerms}</p>}

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => {
            setStep(0);
            // Removed setSelectedOption call as it no longer exists
          }}
          className="text-honeybee-primary underline"
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
        // required
        className={`w-full mb-1 px-3 py-2 border rounded bg-gray-100 text-gray-700 placeholder-gray-400 ${errors.city ? 'border-red-500' : ''}`}
      />
      {errors.city && <p className="text-red-500 text-xs mb-3">{errors.city}</p>}

      <label className="block mb-2 text-sm font-medium text-gray-700">State</label>
      <input
        type="text"
        name="state"
        value={formData.state}
        onChange={handleChange}
        // required
        className={`w-full mb-1 px-3 py-2 border rounded bg-gray-100 text-gray-700 placeholder-gray-400 ${errors.state ? 'border-red-500' : ''}`}
      />
      {errors.state && <p className="text-red-500 text-xs mb-3">{errors.state}</p>}

      <label className="block mb-2 text-sm font-medium text-gray-700">Zip</label>
      <input
        type="text"
        name="zip"
        value={formData.zip}
        onChange={handleChange}
        // required
        className={`w-full mb-1 px-3 py-2 border rounded bg-gray-100 text-gray-700 placeholder-gray-400 ${errors.zip ? 'border-red-500' : ''}`}
      />
      {errors.zip && <p className="text-red-500 text-xs mb-3">{errors.zip}</p>}

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={prevStep}
          className="text-honeybee-primary underline"
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
        // required
        className={`w-full mb-1 px-3 py-2 border rounded bg-gray-100 text-gray-700 placeholder-gray-400 ${errors.phone ? 'border-red-500' : ''}`}
      />
      {errors.phone && <p className="text-red-500 text-xs mb-3">{errors.phone}</p>}

      <label className="block mb-2 text-sm font-medium text-gray-700">ID Proof</label>
      <input
        type="file"
        name="idProof"
        accept="image/*,.pdf"
        onChange={handleFileChange}
        // required
        className={`w-full mb-1 px-3 py-2 border rounded bg-gray-100 text-gray-700 ${errors.idProof ? 'border-red-500' : ''}`}
      />
      {errors.idProof && <p className="text-red-500 text-xs mb-3">{errors.idProof}</p>}

      {formData.idProof && (
        <p className="text-sm text-gray-600 mb-4">
          File: {formData.idProof.name} | Size: {(formData.idProof.size / 1024).toFixed(2)} KB | Type: {formData.idProof.type}
        </p>
      )}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={prevStep}
          className="text-honeybee-primary underline"
        >
          Back
        </button>
        {/* Changed button text to Next because we have one more step (Location) */}
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

  const [locationState, setLocationState] = useState<'idle' | 'requesting' | 'denied'>('idle');
  const [locationError, setLocationError] = useState('');

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Your browser does not support geolocation. Please enter your address manually above.');
      setLocationState('denied');
      return;
    }
    setLocationState('requesting');
    // Delay the native popup so the loading buffer renders first
    setTimeout(() => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            setFormData(prev => ({ ...prev, latitude, longitude, detectedAddress: data.display_name }));
            setLocationState('idle');
          } catch {
            setLocationError('Could not detect address. Your coordinates were captured — you may proceed.');
            setFormData(prev => ({ ...prev, latitude, longitude, detectedAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
            setLocationState('idle');
          }
        },
        (err) => {
          let msg = 'Location access denied.';
          if (err.code === err.PERMISSION_DENIED) msg = 'Location access denied. Please enable location in your browser settings or enter your address manually above.';
          else if (err.code === err.POSITION_UNAVAILABLE) msg = 'Location information is unavailable. Please try again.';
          else if (err.code === err.TIMEOUT) msg = 'Location request timed out. Please try again.';
          setLocationError(msg);
          setLocationState('denied');
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    }, 350);
  };

  const renderLocation = () => (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow text-center">
      <h2 className="text-xl font-bold mb-4">Location Access</h2>
      <p className="mb-6 text-gray-600 text-sm">
        Allow location access to verify your selling region and improve customer discovery.
      </p>

      {/* Loading buffer — shown before browser popup appears */}
      {locationState === 'requesting' && (
        <div className="flex flex-col items-center gap-4 py-6 animate-fadeIn" role="status" aria-live="polite">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-honeybee-primary/20 border-t-honeybee-primary animate-spin" />
            <svg className="absolute w-6 h-6 text-honeybee-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-honeybee-secondary font-bold">Preparing location services…</p>
          <p className="text-gray-500 text-sm">Your browser will ask for permission shortly.</p>
          <div className="w-full space-y-2 opacity-40 mt-2">
            <div className="h-2 bg-gray-200 rounded-full w-3/4 mx-auto animate-pulse" />
            <div className="h-2 bg-gray-200 rounded-full w-1/2 mx-auto animate-pulse" />
          </div>
        </div>
      )}

      {/* Denied state */}
      {locationState === 'denied' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-left animate-fadeIn">
          <p className="text-red-700 font-semibold text-sm mb-1">⚠ Location Access Failed</p>
          <p className="text-red-600 text-xs leading-relaxed">{locationError}</p>
          <button
            type="button"
            onClick={() => { setLocationState('idle'); setLocationError(''); }}
            className="mt-3 text-xs text-honeybee-primary underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Success — location detected */}
      {!formData.detectedAddress && locationState === 'idle' && (
        <button
          type="button"
          onClick={handleDetectLocation}
          className="w-full bg-honeybee-primary text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-honeybee-primary/90 transition-colors mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Detect My Location
        </button>
      )}

      {formData.detectedAddress && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4 text-left animate-fadeIn">
          <p className="text-green-800 font-semibold mb-1">✓ Location Detected!</p>
          <p className="text-gray-700 text-sm break-words">{formData.detectedAddress}</p>
          <button
            type="button"
            onClick={() => { setFormData(prev => ({ ...prev, detectedAddress: '', latitude: null, longitude: null })); setLocationState('idle'); }}
            className="mt-2 text-xs text-gray-500 underline"
          >
            Detect again
          </button>
        </div>
      )}

      <div className="flex justify-between items-center gap-4 mt-4">
        <button type="button" onClick={prevStep} className="text-honeybee-primary underline text-sm">
          Back
        </button>
        <Button
          onClick={handleSubmit}
          variant="primary"
          className="flex-1"
          disabled={isSubmitting || locationState === 'requesting'}
        >
          {isSubmitting ? 'Processing…' : 'Complete Registration'}
        </Button>
      </div>
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
      <button onClick={() => navigate('/applications')} className="text-honeybee-primary underline">
        Go to Dashboard
      </button>
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
