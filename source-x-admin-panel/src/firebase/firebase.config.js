import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAneCvvsitHeDD62JN6DRgjQAHOk3Rymzo",
  authDomain: "source-x-70395.firebaseapp.com",
  projectId: "source-x-70395",
  storageBucket: "source-x-70395.firebasestorage.app",
  messagingSenderId: "101184837288",
  appId: "1:101184837288:web:dc057e0a7031d1321f549d",
  measurementId: "G-XY53V7ECD4"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);