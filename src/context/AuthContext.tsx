import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
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

export class UnverifiedEmailError extends Error {
  userId: string;
  userEmail: string;
  constructor(userId: string, email: string) {
    super('UNVERIFIED_EMAIL');
    this.name = 'UnverifiedEmailError';
    this.userId = userId;
    this.userEmail = email;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Helper: build our User object from a Supabase user ─────────────────────
const toUser = (u: { id: string; email?: string | null; user_metadata?: Record<string, string> }): User => ({
  id: u.id,
  name: u.user_metadata?.full_name || u.user_metadata?.name || '',
  email: u.email || '',
});

// ── Helper: wait for supabase.auth.getSession() with a timeout ─────────────
const getSessionWithTimeout = async (ms = 6000) => {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('getSession timed out')), ms)
  );
  return Promise.race([supabase.auth.getSession(), timeoutPromise]);
};

// ── Helper: check if a local user's email is verified in user_profiles ──────
const isEmailVerified = async (userId: string): Promise<boolean> => {
  try {
    const { data } = await supabase
      .from('user_profiles')
      .select('provider, is_verified')
      .eq('user_id', userId)
      .single();
    if (!data) return true; // no profile row → allow (Google / legacy)
    if (data.provider === 'local' && !data.is_verified) return false;
  } catch {
    // DB error → don't block login
  }
  return true;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  
  // Safe setter that guards against unnecessary reference changes
  const setUser = useCallback((newUser: User | null) => {
    setUserState(prev => {
      if (!prev && !newUser) return prev;
      if (prev && newUser && prev.id === newUser.id && prev.email === newUser.email && prev.name === newUser.name) return prev;
      return newUser;
    });
  }, []);
  
  const [loading, setLoading] = useState(true);

  // Flags so the global listener doesn't stomp on in-progress auth flows
  const isHandlingAuth = useRef(false);
  const isSigningUp    = useRef(false);

  // ── Boot: restore session once on mount ──────────────────────────────────
  const restoreSession = useCallback(async () => {
    console.debug('[Auth] Restoring session…');
    try {
      const { data: { session } } = await getSessionWithTimeout(6000) as Awaited<ReturnType<typeof supabase.auth.getSession>>;

      if (session?.user) {
        console.debug('[Auth] Session found for', session.user.email);
        const verified = await isEmailVerified(session.user.id);
        if (!verified) {
          console.debug('[Auth] Session user not verified — signing out');
          await supabase.auth.signOut();
          setUser(null);
        } else {
          setUser(toUser(session.user));
        }
      } else {
        console.debug('[Auth] No active session');
        setUser(null);
      }
    } catch (err) {
      console.warn('[Auth] Session restore error:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Hard upper-bound timeout so the app never hangs indefinitely
    const safetyTimer = setTimeout(() => {
      setLoading(prev => {
        if (prev) {
          console.warn('[Auth] Safety timeout fired — forcing loading=false');
          return false;
        }
        return prev;
      });
    }, 8000);

    restoreSession();

    // ── Global auth state listener ────────────────────────────────────────
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.debug('[Auth] onAuthStateChange:', event, session?.user?.email);

        // Skip while signup or login flow is actively managing state
        if (isSigningUp.current || isHandlingAuth.current) {
          console.debug('[Auth] Skipping listener (auth flow in progress)');
          return;
        }

        if (!session?.user) {
          setUser(null);
          setLoading(false);
          return;
        }

        const u = session.user;

        // Auto-create profile for Google sign-ins detected by listener
        if (event === 'SIGNED_IN' && u.app_metadata?.provider === 'google') {
          try {
            await supabase.from('user_profiles').upsert(
              { user_id: u.id, provider: 'google', is_verified: true },
              { onConflict: 'user_id' }
            );
          } catch (e) {
            console.error('[Auth] Error upserting Google profile:', e);
          }
        }

        const verified = await isEmailVerified(u.id);
        if (!verified) {
          console.debug('[Auth] Listener: user not verified — signing out');
          await supabase.auth.signOut();
          setUser(null);
        } else {
          setUser(toUser(u));
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
      clearTimeout(safetyTimer);
    };
  }, [restoreSession]);

  // ── signInWithEmail ───────────────────────────────────────────────────────
  const signInWithEmail = async (email: string, password: string): Promise<User> => {
    isHandlingAuth.current = true;
    console.debug('[Auth] signInWithEmail start');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('[Auth] signInWithPassword error:', error);
        throw error;
      }

      const supabaseUser = data.user!;
      console.debug('[Auth] signInWithPassword success. Verifying email status…');

      // Verification check performed directly — no reliance on listener
      const verified = await isEmailVerified(supabaseUser.id);
      if (!verified) {
        console.debug('[Auth] User not verified — signing out');
        await supabase.auth.signOut();
        setUser(null);
        throw new UnverifiedEmailError(supabaseUser.id, supabaseUser.email || email);
      }

      const loggedInUser = toUser(supabaseUser);
      setUser(loggedInUser); // update state IMMEDIATELY — don't wait for listener
      console.debug('[Auth] Login complete, user set:', loggedInUser.email);
      return loggedInUser;
    } finally {
      // Always release flag — listener can resume normal operation
      isHandlingAuth.current = false;
    }
  };

  // ── signUpWithEmail ───────────────────────────────────────────────────────
  const signUpWithEmail = async (name: string, email: string, password: string): Promise<User> => {
    isSigningUp.current = true;
    console.debug('[Auth] signUpWithEmail start');

    try {
      // 1. Race the Supabase auth call with an 8 second timeout to prevent infinite hang
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Signup request timed out on the network. Please try again.')), 8000)
      );

      const signUpPromise = supabase.auth.signUp({
        email,
        password,
        options: { 
          data: { full_name: name, name },
          emailRedirectTo: `${window.location.origin}/verify-email`
        },
      });

      // Strongly typed race resolution
      const { data, error } = await Promise.race([signUpPromise, timeoutPromise]) as Awaited<ReturnType<typeof supabase.auth.signUp>>;

      if (error) {
        console.error('[Auth] signUp error:', error);
        throw error;
      }

      const newUserId = data.user?.id || '';
      console.debug('[Auth] signUp success, userId:', newUserId);

      if (newUserId) {
        // Fire-and-forget background tasks
        (async () => {
          try {
            // 1. Create unverified profile row
            const { error: profileError } = await supabase.from('user_profiles').upsert(
              { user_id: newUserId, provider: 'local', is_verified: false },
              { onConflict: 'user_id' }
            );
            if (profileError) console.error('[Auth] Profile upsert error:', profileError);

            // 2. Trigger custom verification email
            const controller = new AbortController();
            const fetchTimeout = setTimeout(() => controller.abort(), 4000);
            
            await fetch('/api/send-verification', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, userId: newUserId, name }),
              signal: controller.signal
            });
            clearTimeout(fetchTimeout);

            // 3. Force sign-out (session is created by default on signup)
            await supabase.auth.signOut();
          } catch (e) {
            console.error('[Auth] Background signup tasks failed:', e);
          }
        })();
      }
      
      setUser(null);
      return { id: newUserId, name, email: data.user?.email || email };
    } finally {
      isSigningUp.current = false;
    }
  };

  // ── Google OAuth ──────────────────────────────────────────────────────────
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) throw error;
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      localStorage.setItem('justLoggedOut', 'true');
      localStorage.removeItem('guestMode');
      setUser(null);
      const { error } = await supabase.auth.signOut();
      if (error) console.error('[Auth] Logout error:', error);
    } catch (e) {
      console.error('[Auth] Logout error:', e);
    }
  };

  // ── Password Reset ────────────────────────────────────────────────────────
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
