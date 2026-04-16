import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link — no token provided. Please check your email for the correct link.');
        return;
      }

      try {
        const response = await fetch(`/api/verify-email?token=${encodeURIComponent(token)}`);
        const data = await response.json();

        if (response.ok && data.valid) {
          setStatus('success');
          setMessage('Your email has been verified successfully!');
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed. The link may have expired (15 min limit).');
        }
      } catch {
        setStatus('error');
        setMessage('Network error. Please check your connection and try again.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-screen bg-honeybee-light flex items-center justify-center px-4 page-fade-in">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">

        {/* Loading */}
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Loader2 className="h-12 w-12 animate-spin text-honeybee-primary" />
            </div>
            <h2 className="text-xl font-bold text-honeybee-secondary mb-2">Verifying your email…</h2>
            <p className="text-gray-400 text-sm">Please wait, this only takes a moment.</p>
          </>
        )}

        {/* Success */}
        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">Email Verified!</h2>
            <p className="text-gray-500 mb-6">{message}</p>
            <div className="bg-green-50 rounded-xl py-4 px-5 mb-6 border border-green-200">
              <p className="text-sm text-green-700 font-semibold">
                🎉 Your account is now active. You can log in and start exploring BeeBridge.
              </p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-honeybee-secondary text-white py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-honeybee-secondary/90 transition-all shadow-lg shadow-honeybee-secondary/20 flex items-center justify-center gap-2"
            >
              Go to Login
              <ArrowRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Error */}
        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Verification Failed</h2>
            <p className="text-gray-500 mb-6">{message}</p>

            <div className="space-y-3">
              {/* Go to verify-email-pending to resend */}
              <Link
                to="/verify-email-pending"
                className="block w-full bg-honeybee-secondary text-white py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-honeybee-secondary/90 transition-all text-center"
              >
                Resend Verification Email
              </Link>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-all"
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
