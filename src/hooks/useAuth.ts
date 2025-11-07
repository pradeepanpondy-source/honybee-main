import { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

interface User {
  id: number;
  name: string;
  email: string;
}

const API_BASE_URL = 'http://localhost:8000/api';

export const useAuth = (): {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<User>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<User>;
  signInWithGoogle: () => Promise<void>;
  linkGoogleAccount: () => Promise<void>;
  logout: () => Promise<void>;
} => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and validate it
    const token = localStorage.getItem('authToken');
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile.php`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Extract user info from profile or set basic user info
        setUser({
          id: data.profile?.user_id || 0,
          name: data.profile?.name || '',
          email: data.profile?.email || '',
        });
      } else {
        // Token invalid, remove it
        localStorage.removeItem('authToken');
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('authToken', data.token);
      setUser(data.user);

      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/signup.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      localStorage.setItem('authToken', data.token);
      setUser(data.user);

      return data.user;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      try {
        const response = await fetch(`${API_BASE_URL}/google_login.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: codeResponse.code }),
        });

        // Check if response has content before parsing JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server returned invalid response. Please check your backend configuration.');
        }

        const text = await response.text();
        if (!text) {
          throw new Error('Server returned empty response. Please check if Google OAuth is configured correctly.');
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error('Failed to parse response:', text);
          throw new Error('Server returned invalid JSON response.');
        }

        if (!response.ok) {
          throw new Error(data.error || 'Google login failed');
        }

        localStorage.setItem('authToken', data.token);
        setUser(data.user);
      } catch (error) {
        console.error('Google login error:', error);
        throw error;
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
    },
  });

  const signInWithGoogle = async () => {
    googleLogin();
  };

  const linkGoogleAccount = async () => {
    // Implement account linking if needed
    throw new Error('Account linking not implemented yet');
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        await fetch(`${API_BASE_URL}/logout.php`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
    }
  };

  return {
    user,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    linkGoogleAccount,
    logout,
  };
};
