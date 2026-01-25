import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSeller } from '../hooks/useSeller';
import LoadingSkeleton from './LoadingSkeleton';

interface SellerGuardProps {
    children: React.ReactNode;
}

const SellerGuard: React.FC<SellerGuardProps> = ({ children }) => {
    const { seller, loading } = useSeller();
    const navigate = useNavigate();
    const location = useLocation();

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
            <div className="min-h-screen bg-honeybee-light flex flex-col justify-center items-center p-4 page-fade-in">
                <div className="bg-white max-w-md w-full rounded-[2.5rem] shadow-2xl p-8 md:p-12 text-center border border-honeybee-primary/10">
                    <div className="w-24 h-24 bg-honeybee-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                        <svg
                            className="w-12 h-12 text-honeybee-primary animate-pulse"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    <h2 className="text-3xl font-black text-honeybee-secondary mb-3 tracking-tight scale-arrival">Verification Pending</h2>
                    <div className="w-20 h-1.5 bg-honeybee-primary mx-auto rounded-full mb-8"></div>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Your seller account is currently under review by our admin team.
                        Access to dashboard features is restricted until verification is complete.
                    </p>

                    <div className="bg-honeybee-light rounded-2xl p-6 mb-8 text-left border border-honeybee-primary/5">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-honeybee-secondary mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-honeybee-secondary/70 font-medium leading-relaxed">
                                You will receive an email notification once your account has been approved. This usually takes 24-48 hours.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => navigate(0)}
                            className="w-full bg-white border-2 border-honeybee-secondary/5 text-honeybee-secondary font-black uppercase tracking-widest text-xs py-4 px-6 rounded-2xl hover:bg-honeybee-light transition-all duration-300 flex items-center justify-center gap-3 active:scale-95"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh Status
                        </button>
                        <button
                            onClick={() => navigate('/home')}
                            className="w-full bg-honeybee-secondary text-white font-black uppercase tracking-widest text-xs py-4 px-6 rounded-2xl hover:bg-black transition-all duration-300 shadow-xl shadow-honeybee-secondary/20 active:scale-95"
                        >
                            Return to Homepage
                        </button>
                    </div>

                    <p className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-honeybee-secondary/30">
                        Seller Reference: <span className="font-mono text-honeybee-secondary/50">{seller.seller_id}</span>
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default SellerGuard;
