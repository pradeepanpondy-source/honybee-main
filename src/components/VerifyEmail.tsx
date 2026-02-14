import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const VerifyEmail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const [countdown, setCountdown] = useState(3);

    const token = searchParams.get('token');

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Invalid verification link. No token provided.');
                return;
            }

            try {
                const response = await fetch(`/api/verify-email?token=${encodeURIComponent(token)}`);
                const data = await response.json();

                if (response.ok && data.valid) {
                    setStatus('success');
                    setMessage('Email Verified Successfully!');
                } else {
                    setStatus('error');
                    setMessage(data.error || 'Verification failed. Please try again.');
                }
            } catch {
                setStatus('error');
                setMessage('Network error. Please try again later.');
            }
        };

        verifyToken();
    }, [token]);

    // Auto-redirect countdown on success
    useEffect(() => {
        if (status === 'success' && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
        if (status === 'success' && countdown === 0) {
            navigate('/login');
        }
    }, [status, countdown, navigate]);

    return (
        <div className="min-h-screen bg-honeybee-light flex items-center justify-center px-4 page-fade-in">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                {status === 'loading' && (
                    <>
                        <div className="w-16 h-16 border-4 border-honeybee-primary/20 border-t-honeybee-primary rounded-full animate-spin mx-auto mb-6" />
                        <h2 className="text-xl font-bold text-honeybee-secondary mb-2">Verifying your email...</h2>
                        <p className="text-gray-500 text-sm">Please wait while we verify your email address.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-green-700 mb-2">{message}</h2>
                        <p className="text-gray-500 mb-6">Your email has been verified. You can now log in to your account.</p>
                        <div className="bg-gray-50 rounded-lg py-3 px-4 mb-4">
                            <p className="text-sm text-gray-600">
                                Redirecting to login in <span className="font-bold text-honeybee-primary">{countdown}</span> seconds...
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/login')}
                            className="text-sm text-honeybee-primary hover:underline font-semibold"
                        >
                            Go to Login Now →
                        </button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-red-600 mb-2">Verification Failed</h2>
                        <p className="text-gray-500 mb-6">{message}</p>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/signup')}
                                className="w-full py-3 bg-honeybee-secondary text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-honeybee-secondary/90 transition-all shadow-lg"
                            >
                                Sign Up Again
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-all"
                            >
                                Back to Login
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
