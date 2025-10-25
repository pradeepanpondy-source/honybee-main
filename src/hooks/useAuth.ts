import { useState, useEffect } from 'react';
import { User, signInWithPopup, signOut, onAuthStateChanged, signInWithEmailAndPassword, linkWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

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

  const signInWithGoogle = async (): Promise<User> => {
    try {
      // Configure Google provider with custom client ID and scopes
      googleProvider.setCustomParameters({
        client_id: '378321462417-i479i9akc5vndsp3a9na8p29vku1etjl.apps.googleusercontent.com',
        prompt: 'select_account'
      });

      // Add additional scopes for profile and email access
      googleProvider.addScope('profile');
      googleProvider.addScope('email');

      // Always use popup sign-in for both desktop and mobile devices (no redirect)
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Store comprehensive user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName,
        email: user.email,
        uid: user.uid,
        loginMethod: 'google',
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        providerId: user.providerId,
        lastLogin: new Date(),
        // Store additional Google profile data
        googleProfile: {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          providerId: user.providerId
        }
      }, { merge: true });

      // Wait for Firestore write to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      // Return user data - navigation will be handled by the component
      return user;
    } catch (error: unknown) {
      console.error('Error signing in with Google:', error);

      // Handle popup blocked - show error instead of falling back to redirect
      if (error && typeof error === 'object' && 'code' in error && error.code === 'auth/popup-blocked') {
        throw new Error('Popup blocked. Please allow popups for this site and try again.');
      }

      // Handle account linking for existing email accounts
      if (error && typeof error === 'object' && 'code' in error && error.code === 'auth/account-exists-with-different-credential') {
        // This will require user input, so we'll throw a specific error
        throw new Error('ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL');
      }

      // Handle popup closed by user
      if (error && typeof error === 'object' && 'code' in error && error.code === 'auth/popup-closed-by-user') {
        throw new Error('Google sign-in was cancelled.');
      }

      // Handle network errors
      if (error && typeof error === 'object' && 'code' in error && error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your internet connection.');
      }

      throw error;
    }
  };

  const linkGoogleAccount = async (email: string, password: string) => {
    try {
      // First sign in with email/password
      const emailResult = await signInWithEmailAndPassword(auth, email, password);
      const user = emailResult.user;

      // Now link the Google account
      const googleResult = await signInWithPopup(auth, googleProvider);
      const googleCredential = GoogleAuthProvider.credentialFromResult(googleResult);

      if (googleCredential) {
        await linkWithCredential(user, googleCredential);

        // Update user data in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName || googleResult.user.displayName,
          email: user.email,
          uid: user.uid,
          loginMethod: 'linked', // Both email and Google
          lastLogin: new Date(),
        }, { merge: true });
      }

      return user;
    } catch (error: unknown) {
      console.error('Error linking Google account:', error);
      throw error;
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
    linkGoogleAccount,
     logout,
  };
};
