import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyEmailPending: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [resendMessage, setResendMessage] = useState('');
    const [cooldown, setCooldown] = useState(0);

    // Get email, userId, name from route state
    const email = (location.state as any)?.email || '';
    const userId = (location.state as any)?.userId || '';
    const name = (location.state as any)?.name || '';

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleResend = async () => {
        if (cooldown > 0) return;
        setResendStatus('loading');
        setResendMessage('');

        try {
            const response = await fetch('/api/resend-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, userId, name }),
            });

            const data = await response.json();

            if (response.ok) {
                setResendStatus('success');
                setResendMessage('Verification email resent! Check your inbox.');
                setCooldown(60);
            } else {
                setResendStatus('error');
                setResendMessage(data.error || 'Failed to resend email.');
                if (data.retryAfter) {
                    setCooldown(data.retryAfter);
                }
            }
        } catch {
            setResendStatus('error');
            setResendMessage('Network error. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-honeybee-light flex items-center justify-center px-4 page-fade-in">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                {/* Email Icon */}
                <div className="w-20 h-20 bg-honeybee-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-honeybee-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold text-honeybee-secondary mb-2">Check your email</h2>
                <p className="text-gray-500 mb-2">We've sent a verification link to your email.</p>
                {email && (
                    <p className="text-sm font-semibold text-honeybee-secondary mb-6 bg-gray-50 py-2 px-4 rounded-lg inline-block">
                        {email}
                    </p>
                )}

                <p className="text-sm text-gray-400 mb-6">
                    Click the link in the email to verify your account. The link expires in 15 minutes.
                </p>

                {/* Resend button */}
                <button
                    onClick={handleResend}
                    disabled={resendStatus === 'loading' || cooldown > 0}
                    className={`w-full py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all ${cooldown > 0 || resendStatus === 'loading'
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-honeybee-secondary text-white hover:bg-honeybee-secondary/90 shadow-lg shadow-honeybee-secondary/20 transform hover:scale-[1.02] active:scale-[0.98]'
                        }`}
                >
                    {resendStatus === 'loading'
                        ? 'Sending...'
                        : cooldown > 0
                            ? `Resend in ${cooldown}s`
                            : 'Resend Email'}
                </button>

                {/* Status messages */}
                {resendMessage && (
                    <div className={`mt-4 p-3 rounded-lg text-sm ${resendStatus === 'success'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-600 border border-red-200'
                        }`}>
                        {resendMessage}
                    </div>
                )}

                {/* Back to login */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-sm text-honeybee-primary hover:underline font-semibold"
                    >
                        ← Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailPending;
