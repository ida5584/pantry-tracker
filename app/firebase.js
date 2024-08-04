// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import {getAnalytics} from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB27PHtdZvt_GXImhHWLatySN-Ym9u2twU",
  authDomain: "hspantryapp-c6df0.firebaseapp.com",
  projectId: "hspantryapp-c6df0",
  storageBucket: "hspantryapp-c6df0.appspot.com",
  messagingSenderId: "994225069223",
  appId: "1:994225069223:web:8f6161b6c5d2121082cf82"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
const analytics = getAnalytics(app)
export {firestore}