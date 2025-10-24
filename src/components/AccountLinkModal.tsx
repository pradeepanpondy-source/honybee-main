import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';

interface AccountLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  googleEmail: string;
}

const AccountLinkModal: React.FC<AccountLinkModalProps> = ({ isOpen, onClose, googleEmail }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { linkGoogleAccount } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await linkGoogleAccount(email, password);
      onClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to link accounts. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Link Your Accounts</h2>
        <p className="text-gray-600 mb-4">
          We found an existing account with the email <strong>{googleEmail}</strong>.
          To link your Google account, please enter your existing email and password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onClose}
              variant="light"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Linking...' : 'Link Accounts'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountLinkModal;
