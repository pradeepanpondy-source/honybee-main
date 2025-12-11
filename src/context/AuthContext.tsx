import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  name: string;
  email: string;
}



interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<User>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<User>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for Supabase session
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (session?.user) {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
            email: session.user.email || '',
          });
        } else {
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

    // Fallback timeout in case Supabase hangs
    const timeout = setTimeout(() => {
      setLoading(prev => {
        if (prev) {
          console.warn('Auth check timed out, forcing loading false');
          return false;
        }
        return prev;
      });
    }, 5000);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {

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

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const loggedInUser = {
      id: data.user?.id || '',
      name: data.user?.user_metadata?.full_name || data.user?.user_metadata?.name || '',
      email: data.user?.email || email,
    };

    // State update handled by onAuthStateChange, but we return data here
    return loggedInUser;
  };

  const signUpWithEmail = async (name: string, email: string, password: string) => {
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

    if (error) throw error;

    // Force explicit login flow: if Supabase auto-creates a session, sign out immediately.
    // This supports the requirement: Signup -> Go to Login -> Manual Login.
    if (data.session) {
      await supabase.auth.signOut();
    }

    return {
      id: data.user?.id || '',
      name: name,
      email: data.user?.email || email,
    };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google'
    });
    if (error) throw error;
  };



  const logout = async () => {
    try {
      // Set flag to prevent auto-redirect to home
      localStorage.setItem('justLoggedOut', 'true');
      // Clear any guest mode flag
      localStorage.removeItem('guestMode');
      // Clear user immediately
      setUser(null);
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) console.error('Logout error:', error);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      resetPassword,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
