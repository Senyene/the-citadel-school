// public/js/firebase/config.js

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdQl4RnM9onY59VV9UW-nRUHmYN1p0rl0",
  authDomain: "the-citadel-school.firebaseapp.com",
  projectId: "the-citadel-school",
  storageBucket: "the-citadel-school.firebasestorage.app",
  messagingSenderId: "794877916498",
  appId: "1:794877916498:web:716b2a2088f5f250de368b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
