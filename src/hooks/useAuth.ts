import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  name: string;
  email: string;
}

interface SignUpResult extends User {
  needsConfirmation: boolean;
}

export const useAuth = (): {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<User>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<SignUpResult>;
  signInWithGoogle: () => Promise<void>;
  linkGoogleAccount: () => Promise<void>;
  logout: () => Promise<void>;
} => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for Supabase session
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Session check:', { session, error });

        if (session?.user) {
          console.log('User found in session:', session.user);
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
            email: session.user.email || '',
          });
        } else {
          console.log('No session found, user should see login page');
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user ? 'user logged in' : 'user logged out');

        if (session?.user) {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
            email: session.user.email || '',
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || '',
          email: data.user.email || email,
        });
      }

      return {
        id: data.user?.id || '',
        name: data.user?.user_metadata?.full_name || data.user?.user_metadata?.name || '',
        email: data.user?.email || email,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (name: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            name: name,
          }
        }
      });

      if (error) {
        throw error;
      }

      // Return user data but don't set state here - let auth state change handle it
      return {
        id: data.user?.id || '',
        name: name,
        email: data.user?.email || email,
        needsConfirmation: !data.session, // Indicate if email confirmation is needed
      };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google'
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const linkGoogleAccount = async () => {
    // Implement account linking if needed
    throw new Error('Account linking not implemented yet');
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase logout error:', error);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
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
