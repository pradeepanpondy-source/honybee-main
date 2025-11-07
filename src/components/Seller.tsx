
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
};

const Seller: React.FC = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [sellerType, setSellerType] = useState<string>('');
  // Removed unused selectedOption state to fix eslint error
  const user = null; // For guest users, assume no authenticated user
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
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 3) {
      // Final submission
      const isGuest = localStorage.getItem('guestMode') === 'true';
      if (!user && !isGuest) {
        alert('Please sign in to submit the application.');
        navigate('/login');
        return;
      }

      if (!sellerType) {
        alert('Please select a seller type (Honey or Bee Hive).');
        return;
      }

      // Basic validation
      if (!formData.email || !formData.name || !formData.acceptTerms) {
        alert('Please fill all required fields and accept terms.');
        return;
      }

      if (!user) {
        // For non-authenticated users, store application locally as guest
        const guestApplication = { ...formData, sellerType, submittedAt: new Date(), kycVerified: false };
        localStorage.setItem('guestSellerApplication', JSON.stringify(guestApplication));
        // Move to finish screen first
        setStep(4);
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/applications');
        }, 3000);
        return;
      }

      try {
        // For now, store locally or send to PHP backend later
        const submissionData = { ...formData, sellerType, submittedAt: new Date(), kycVerified: false };
        console.log('Submitting data:', submissionData);
        // Move to finish screen first
        setStep(4);
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/applications');
        }, 3000);
      } catch (error: unknown) {
        console.error('Error submitting application:', error);
        alert(`Failed to submit application: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
      }
      return;
    }

    // Here you can add form validation and submission logic for intermediate steps
    nextStep();
  };

  const renderProgress = () => {
    const steps = ['Personal Information', 'Address', 'Contact', 'Finish'];
    return (
      <div className="flex justify-center space-x-8 mb-8">
        {steps.map((label, index) => {
          const current = index + 1;
          const isActive = current === step;
          const isCompleted = current < step;
          return (
            <div key={label} className="flex flex-col items-center text-center">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isActive || isCompleted ? 'border-purple-700' : 'border-gray-300'
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
                    className={`w-3 h-3 rounded-full ${
                      isActive ? 'bg-purple-700' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
              <span
                className={`mt-1 text-xs font-semibold ${
                  isActive || isCompleted ? 'text-purple-700' : 'text-gray-400'
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

  const renderFinish = () => {
    // Auto-redirect is handled in handleSubmit
    return (
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
        <h2 className="text-2xl font-bold mb-2">Application Submitted Successfully!</h2>
        <p className="mb-4 text-gray-600">Your seller application has been submitted successfully.</p>
        <p className="mb-6 text-sm text-gray-500">Redirecting to your dashboard in a moment...</p>
        <button
          onClick={() => navigate('/applications')}
          className="gradient-bg-primary text-black font-semibold py-3 px-8 rounded-full hover:shadow-lg transition-all duration-300"
        >
          Go to Dashboard Now
        </button>
      </div>
    );
  };





  return (
    <div className="min-h-screen py-12 px-4 md:px-6">
      <h1 className="text-center font-semibold text-lg md:text-xl mb-4">Register as a Seller</h1>
      <>
        {step === 0 && renderOptionButtons()}
        {step > 0 && renderProgress()}
        {step === 1 && renderPersonalInfo()}
        {step === 2 && renderAddress()}
        {step === 3 && renderContact()}
        {step === 4 && renderFinish()}
      </>
    </div>
  );
};

export default Seller;
