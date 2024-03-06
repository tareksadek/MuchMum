import { initializeApp, getApps, getApp } from '@firebase/app';
import { getAuth } from '@firebase/auth';
import { getStorage } from '@firebase/storage';
import { getFunctions } from '@firebase/functions';

import {
  initializeFirestore, 
  persistentLocalCache,
  persistentSingleTabManager, 
  getFirestore,
  Firestore,
} from '@firebase/firestore';
import { firebaseConfig } from '../setup/setup';

const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Determine if we're running in a browser environment
const isClientSide = typeof window !== 'undefined';
console.log(isClientSide)
let firestore: Firestore;

firestore = getFirestore(firebaseApp);

export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);
export const functions = getFunctions(firebaseApp);

export { firestore, firebaseApp };
export default firebaseApp;

