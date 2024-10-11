// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { initializeFirestore, persistentLocalCache, persistentSingleTabManager } from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
    apiKey: "AIzaSyA0VBQ-psO6K6YAP0HTuX_rl1SS2yKaZ9o",
    authDomain: "crsa-terrain.firebaseapp.com",
    projectId: "crsa-terrain",
    storageBucket: "crsa-terrain.appspot.com",
    messagingSenderId: "820439888591",
    appId: "1:820439888591:web:afc1dfa0fdfedd99eebdba",
    measurementId: "G-8H8F4G0TLT"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with local cache, and single tab manager, and ttl of 30 minutes
const db = initializeFirestore(app,{ localCache: persistentLocalCache({ ttlSeconds: 60*30, tabManager: persistentSingleTabManager() }) });
const auth = getAuth(app);
const storage = getStorage(app);
export { db, auth, storage};
