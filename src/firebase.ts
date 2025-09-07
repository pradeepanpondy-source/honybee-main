import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCvZx_FU_BtRFTVNr9aotQKU_siKGP1v1I",
  authDomain: "beebridge.firebaseapp.com",
  projectId: "beebridge",
  storageBucket: "beebridge.firebasestorage.app",
  messagingSenderId: "378321462417",
  appId: "1:378321462417:web:d69bada8dffabedb318b30",
  measurementId: "G-C0CPML4GKE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
