// Import the functions you need from the SDKs you need
import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyBxefVt_zrEMwty5L_IbJJs0anSUfYMOZc',
  authDomain: 'nextjs-projects-95963.firebaseapp.com',
  projectId: 'nextjs-projects-95963',
  storageBucket: 'nextjs-projects-95963.firebasestorage.app',
  messagingSenderId: '925279405428',
  appId: '1:925279405428:web:fcfc3871e3c390f9ca5821',
  measurementId: 'G-88PJ9QK5LS',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
