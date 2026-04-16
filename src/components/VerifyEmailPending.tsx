import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, RefreshCw, ArrowLeft, CheckCircle } from 'lucide-react';

const VerifyEmailPending: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [resendMessage, setResendMessage] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Accept state from either signup or login redirect
  const state = (location.state as any) || {};
  const email   = state.email   || '';
  const userId  = state.userId  || '';
  const name    = state.name    || '';

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || resendStatus === 'loading') return;
    setResendStatus('loading');
    setResendMessage('');

    try {
      const response = await fetch('/api/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          userId, 
          name,
          isResend: true 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResendStatus('success');
        setResendMessage('✅ Verification email resent! Check your inbox and spam folder.');
        setCooldown(60); // 60-second cooldown
      } else {
        setResendStatus('error');
        setResendMessage(data.error || 'Failed to resend email. Please try again.');
        if (data.retryAfter) setCooldown(data.retryAfter);
      }
    } catch {
      setResendStatus('error');
      setResendMessage('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-honeybee-light flex items-center justify-center px-4 page-fade-in">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">

        {/* Icon */}
        <div className="w-20 h-20 bg-honeybee-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="h-10 w-10 text-honeybee-primary" />
        </div>

        <h2 className="text-2xl font-bold text-honeybee-secondary mb-2">
          Check Your Email
        </h2>
        <p className="text-gray-500 mb-3">
          We've sent a verification link to:
        </p>

        {email && (
          <div className="inline-block bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 mb-4">
            <p className="text-sm font-semibold text-honeybee-secondary">{email}</p>
          </div>
        )}

        <p className="text-sm text-gray-400 mb-6">
          Click the link in the email to activate your account.
          <br />
          <span className="text-amber-600 font-medium">⏱ The link expires in 15 minutes.</span>
        </p>

        {/* Steps */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-left mb-6 space-y-2">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">What to do</p>
          {[
            'Open your email inbox',
            'Look for an email from BeeBridge',
            'Click the "Verify Email" button',
            'Come back and log in',
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
              <span className="text-sm text-amber-800">{step}</span>
            </div>
          ))}
        </div>

        {/* Resend button */}
        <button
          onClick={handleResend}
          disabled={resendStatus === 'loading' || cooldown > 0}
          className={`w-full py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
            cooldown > 0 || resendStatus === 'loading'
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-honeybee-secondary text-white hover:bg-honeybee-secondary/90 shadow-lg shadow-honeybee-secondary/20 transform hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {resendStatus === 'loading' ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : cooldown > 0 ? (
            `Resend in ${cooldown}s`
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Resend Verification Email
            </>
          )}
        </button>

        {/* Status feedback */}
        {resendMessage && (
          <div className={`mt-4 p-3 rounded-xl text-sm font-medium ${
            resendStatus === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            {resendMessage}
          </div>
        )}

        {/* Back to login */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-honeybee-primary hover:underline font-semibold flex items-center gap-1 mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPending;
