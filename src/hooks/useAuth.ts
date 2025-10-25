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

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    await setDoc(doc(db, 'users', user.uid), {
      name: user.displayName,
      email: user.email,
      uid: user.uid,
      loginMethod: 'google',
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      providerId: user.providerId,
      lastLogin: new Date(),
      googleProfile: {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        providerId: user.providerId
      }
    }, { merge: true });


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
