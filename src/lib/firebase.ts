import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { 
  doc, 
  getDocFromServer, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Initialize Firestore with modern persistence configuration
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
}, firebaseConfig.firestoreDatabaseId); 

export const auth = getAuth(app);
export { getRedirectResult };
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    // Try popup first as it's the smoothest experience
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/popup-blocked') {
      console.warn('Popup blocked, attempting redirect sign-in. Ensure this domain is authorized in Firebase Console.');
      try {
        await signInWithRedirect(auth, googleProvider);
      } catch (redirectError) {
        console.error('Redirect sign-in failed', redirectError);
        throw redirectError;
      }
    } else if (error.code === 'auth/cancelled-popup-request') {
      console.log('Sign-in popup was closed or cancelled prematurely.');
    } else {
      console.error('Error signing in with Google', error);
    }
    throw error;
  }
};

// Test connection strictly for AI Studio projects
async function testConnection() {
  try {
    // Only test if we're not in a build environment
    if (typeof window !== 'undefined') {
      await getDocFromServer(doc(db, 'test', 'connection')).catch(() => {
        // Ignore errors if the document doesn't exist, we just want to test connectivity
      });
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration or internet connection.");
    }
  }
}
testConnection();
