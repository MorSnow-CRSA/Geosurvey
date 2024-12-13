// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
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

const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence, but only if it hasn't been initialized
const auth = getAuth(app);

// Initialize Firestore with local cache
const db = getFirestore(app);



const storage = getStorage(app);

export { db, auth, storage };