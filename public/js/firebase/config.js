// public/js/firebase/config.js

// Firebase App (the core Firebase SDK)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdQl4RnM9onY59VV9UW-nRUHmYN1p0rl0",
  authDomain: "the-citadel-school.firebaseapp.com",
  projectId: "the-citadel-school",
  storageBucket: "the-citadel-school.appspot.com",
  messagingSenderId: "794877916498",
  appId: "1:794877916498:web:716b2a2088f5f250de368b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Init Firestore
const db = getFirestore(app);

export { db, collection, addDoc, serverTimestamp };
