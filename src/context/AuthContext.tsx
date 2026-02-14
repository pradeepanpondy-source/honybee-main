import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
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
  const isSigningUp = useRef(false);

  useEffect(() => {
    // Check for Supabase session
    const checkUser = async () => {
      try {
        const { data: { session }, error: _sessionError } = await supabase.auth.getSession();

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

        // Skip setting user during signup flow to prevent brief home page redirect
        if (isSigningUp.current) {
          setLoading(false);
          return;
        }

        if (session?.user) {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
            email: session.user.email || '',
          });

          // For Google OAuth users: auto-create user_profiles with provider='google', is_verified=true
          if (event === 'SIGNED_IN' && session.user.app_metadata?.provider === 'google') {
            try {
              await supabase.from('user_profiles').upsert({
                user_id: session.user.id,
                provider: 'google',
                is_verified: true,
              }, { onConflict: 'user_id' });
            } catch (err) {
              console.error('Error upserting Google user profile:', err);
            }
          }
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
    // Prevent onAuthStateChange from setting user during signup
    isSigningUp.current = true;

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

      if (error) throw error;

      const newUserId = data.user?.id || '';

      // Create user_profiles record with provider='local', is_verified=false
      if (newUserId) {
        try {
          await supabase.from('user_profiles').upsert({
            user_id: newUserId,
            provider: 'local',
            is_verified: false,
          }, { onConflict: 'user_id' });
        } catch (profileError) {
          console.error('Error creating user profile:', profileError);
        }

        // Send verification email via API
        try {
          await fetch('/api/send-verification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, userId: newUserId, name }),
          });
        } catch (emailError) {
          console.error('Error sending verification email:', emailError);
        }
      }

      // Force explicit login flow: sign out immediately
      if (data.session) {
        await supabase.auth.signOut();
      }

      // Clear user state explicitly
      setUser(null);

      return {
        id: newUserId,
        name: name,
        email: data.user?.email || email,
      };
    } catch (err) {
      throw err;
    } finally {
      isSigningUp.current = false;
    }
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
