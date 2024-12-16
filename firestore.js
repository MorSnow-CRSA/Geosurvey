import { initializeApp } from 'firebase/app';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentSingleTabManager,
  CACHE_SIZE_UNLIMITED,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { useNetInfo } from '@react-native-community/netinfo';
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

// Initialize Firestore with enhanced offline capabilities
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    ttlSeconds: 60*60*24*30, // 30 days cache
    tabManager: persistentSingleTabManager(),
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  })
});

const storage = getStorage(app);






export { db, auth, storage };