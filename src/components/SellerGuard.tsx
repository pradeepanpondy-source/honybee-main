import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSeller } from '../hooks/useSeller';
import LoadingSkeleton from './LoadingSkeleton';

interface SellerGuardProps {
    children: React.ReactNode;
}

const SellerGuard: React.FC<SellerGuardProps> = ({ children }) => {
    const { seller, loading } = useSeller();
    const navigate = useNavigate();

    // Check if user just registered as seller to prevent redirect loop
    const justRegisteredSeller = localStorage.getItem('justRegisteredSeller') === 'true';
    if (justRegisteredSeller) {
        localStorage.removeItem('justRegisteredSeller');
        return <>{children}</>;
    }

    if (loading) {
        return <LoadingSkeleton />;
    }

    // If request finishes and no seller profile exists, they need to register
    if (!seller) {
        return <Navigate to="/seller" replace />;
    }

    // If seller exists but is not approved, only allow access to dashboard and settings
    if (!seller.is_approved) {
        const allowedPaths = ['/applications', '/settings'];
        if (allowedPaths.includes(location.pathname)) {
            return <>{children}</>;
        }

        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
                <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                    <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                            className="w-10 h-10 text-yellow-500 animate-pulse"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Pending</h2>
                    <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full mb-6"></div>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Your seller account is currently under review by our admin team.
                        Access to dashboard features is restricted until verification is complete.
                    </p>

                    <div className="bg-blue-50 rounded-lg p-4 mb-8 text-left">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-blue-700">
                                You will receive an email notification once your account has been approved. This usually takes 24-48 hours.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-white border border-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Check Status Again
                        </button>
                        <button
                            onClick={() => navigate('/home')}
                            className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200"
                        >
                            Return to Home
                        </button>
                    </div>

                    <p className="mt-8 text-xs text-gray-400">
                        Seller ID: <span className="font-mono text-gray-500">{seller.seller_id}</span>
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default SellerGuard;
