import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDVpTmV1MhPJfI10UCN59zx3JdthWpmosU",
  authDomain: "clinic-db-2f4ac.firebaseapp.com",
  projectId: "clinic-db-2f4ac",
  storageBucket: "clinic-db-2f4ac.appspot.com",
  messagingSenderId: "65375916944",
  appId: "1:65375916944:web:6d1d7798e5034e0b861915"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
