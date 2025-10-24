import { useState, useEffect } from 'react';
import { User, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error: unknown) {
      console.error('Error signing in with Google:', error);
      const firebaseError = error as { code?: string };
      if (firebaseError.code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked by the browser. Please allow popups for this site and try again.');
      } else if (firebaseError.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in was canceled. Please try again.');
      } else if (firebaseError.code === 'auth/cancelled-popup-request') {
        throw new Error('Another sign-in popup is already open. Please close it and try again.');
      } else {
        // Always sign in with Google - remove the generic error message
        throw new Error('Please sign in with Google to continue.');
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    signInWithGoogle,
    logout,
  };
};
