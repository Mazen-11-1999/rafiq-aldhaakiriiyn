import { auth } from './firebase';
import { OperationType, FirestoreErrorInfo } from '../types';

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      // Note: tenantId and providerInfo are optional and can be added if needed
    },
    operationType,
    path
  };
  
  const errorJson = JSON.stringify(errInfo);
  console.error('Firestore Error: ', errorJson);
  
  // Prevent throwing uncaught errors for quota limits or temporary networks so the app stays functional online/offline
  const errorLower = errorJson.toLowerCase();
  if (
    errorLower.includes('quota') || 
    errorLower.includes('exhausted') || 
    errorLower.includes('offline') || 
    errorLower.includes('network') ||
    errorLower.includes('resource-exhausted')
  ) {
    console.warn('Firestore limits/resource exhaustion encountered. App is operating in local/cached mode.', errorJson);
    return;
  }
  
  throw new Error(errorJson);
}
