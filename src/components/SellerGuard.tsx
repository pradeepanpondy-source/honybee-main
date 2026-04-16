import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSeller } from '../hooks/useSeller';
import LoadingSkeleton from './LoadingSkeleton';
import { RefreshCw, Home, Clock } from 'lucide-react';

interface SellerGuardProps {
  children: React.ReactNode;
}

const SellerGuard: React.FC<SellerGuardProps> = ({ children }) => {
  const { seller, loading, refreshSeller } = useSeller();
  const navigate = useNavigate();
  const location = useLocation();
  const [refreshing, setRefreshing] = React.useState(false);

  if (loading) {
    return <LoadingSkeleton />;
  }

  // No seller profile → send to registration page
  if (!seller) {
    return <Navigate to="/seller" replace />;
  }

  // Approved sellers → render the protected route
  if (seller.is_approved) {
    return <>{children}</>;
  }

  // ── Unapproved seller ─────────────────────────────────────────────────────
  // Allow /applications and /settings (so they can view their application status)
  const allowedPaths = ['/applications', '/settings'];
  if (allowedPaths.includes(location.pathname)) {
    return <>{children}</>;
  }

  // For all other protected routes (products, analytics, earnings, orders)
  // redirect to /home with a banner state flag instead of showing a dead-end page
  if (['/products', '/analytics', '/earnings', '/orders'].includes(location.pathname)) {
    return <Navigate to="/home" state={{ sellerPending: true }} replace />;
  }

  // ── "Verification Pending" info card (reached from /applications, /settings etc.) ──
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshSeller();   // Re-query DB without page reload — preserves session
    setRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-honeybee-light flex flex-col justify-center items-center p-4 page-fade-in">
      <div className="bg-white max-w-md w-full rounded-[2.5rem] shadow-2xl p-8 md:p-12 text-center border border-honeybee-primary/10">

        {/* Icon */}
        <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <Clock className="w-12 h-12 text-honeybee-primary animate-pulse" />
        </div>

        <h2 className="text-3xl font-black text-honeybee-secondary mb-3 tracking-tight">
          Verification Pending
        </h2>
        <div className="w-20 h-1.5 bg-honeybee-primary mx-auto rounded-full mb-8" />

        <p className="text-gray-600 mb-6 leading-relaxed">
          Your seller account is currently under review by our admin team.
          Full dashboard access is restricted until verification is complete.
        </p>

        <div className="bg-amber-50 rounded-2xl p-5 mb-8 text-left border border-amber-100">
          <p className="text-sm text-amber-800 font-medium leading-relaxed">
            📧 You'll receive an email notification once approved. This usually takes 24–48 hours.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {/* Refresh status — queries DB directly, no page reload */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="w-full bg-white border-2 border-honeybee-secondary/10 text-honeybee-secondary font-black uppercase tracking-widest text-xs py-4 px-6 rounded-2xl hover:bg-honeybee-light transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Checking…' : 'Refresh Status'}
          </button>

          <button
            onClick={() => navigate('/home')}
            className="w-full bg-honeybee-secondary text-white font-black uppercase tracking-widest text-xs py-4 px-6 rounded-2xl hover:bg-black transition-all duration-300 shadow-xl shadow-honeybee-secondary/20 active:scale-95 flex items-center justify-center gap-3"
          >
            <Home className="w-4 h-4" />
            Return to Homepage
          </button>
        </div>

        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-honeybee-secondary/30">
          Seller Reference:{' '}
          <span className="font-mono text-honeybee-secondary/50">{seller.seller_id}</span>
        </p>
      </div>
    </div>
  );
};

export default SellerGuard;
