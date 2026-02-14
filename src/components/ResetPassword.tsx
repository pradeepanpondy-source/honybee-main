import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'form' | 'success' | 'error'>('form');
    const [message, setMessage] = useState('');

    if (!token) {
        return (
            <div className="min-h-screen bg-honeybee-light flex items-center justify-center px-4 page-fade-in">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Invalid Reset Link</h2>
                    <p className="text-gray-500 mb-4">This password reset link is invalid. No token was provided.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="mt-4 px-6 py-2 bg-honeybee-secondary text-white rounded-lg font-bold hover:bg-honeybee-secondary/90 transition-colors"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        if (password.length < 6) {
            setMessage('Password must be at least 6 characters.');
            return;
        }

        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setStatus('success');
            } else {
                setStatus('error');
                setMessage(data.error || 'Failed to reset password. Please try again.');
            }
        } catch {
            setStatus('error');
            setMessage('Network error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-honeybee-light flex items-center justify-center px-4 page-fade-in">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-green-700 mb-2">✅ Password Updated!</h2>
                    <p className="text-gray-500 mb-6">Your password has been successfully changed. You can now log in with your new password.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-8 py-3 bg-honeybee-secondary text-white rounded-xl font-bold uppercase tracking-widest hover:bg-honeybee-secondary/90 transition-all shadow-lg"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen bg-honeybee-light flex items-center justify-center px-4 page-fade-in">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Reset Failed</h2>
                    <p className="text-gray-500 mb-6">{message}</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-8 py-3 bg-honeybee-secondary text-white rounded-xl font-bold uppercase tracking-widest hover:bg-honeybee-secondary/90 transition-all shadow-lg"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-honeybee-light flex items-center justify-center px-4 page-fade-in">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-black text-honeybee-secondary mb-2 tracking-tight">Reset Password</h1>
                    <p className="text-honeybee-secondary/60 text-sm font-medium">Enter your new password below</p>
                </div>

                {message && (
                    <div className="text-sm text-center mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 font-medium">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="new-password" className="block text-[10px] font-black text-honeybee-secondary/50 uppercase tracking-widest mb-1.5 ml-1">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-honeybee-primary bg-white transition-all text-sm"
                                aria-label="New Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-honeybee-secondary focus:outline-none transition-colors"
                            >
                                {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirm-password" className="block text-[10px] font-black text-honeybee-secondary/50 uppercase tracking-widest mb-1.5 ml-1">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                id="confirm-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-honeybee-primary bg-white transition-all text-sm"
                                aria-label="Confirm Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-honeybee-secondary focus:outline-none transition-colors"
                            >
                                {showConfirm ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-honeybee-secondary text-white rounded-xl font-black uppercase tracking-widest hover:bg-honeybee-secondary/90 active:scale-[0.98] transition-all shadow-lg shadow-honeybee-secondary/20 disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-sm text-honeybee-primary hover:underline font-semibold"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
