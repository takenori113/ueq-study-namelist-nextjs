import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCl1EDeOcxqQzKTkmhbg-l-D87PLufnjMg",
  authDomain: "people-list-with-photo.firebaseapp.com",
  projectId: "people-list-with-photo",
  storageBucket: "people-list-with-photo.appspot.com",
  messagingSenderId: "233026555434",
  appId: "1:233026555434:web:2d819c5719d27c74873d53",
  measurementId: "G-W5CW8LXP0D",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage();
export const firestore = getFirestore();
export const auth = getAuth();
export { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut };
