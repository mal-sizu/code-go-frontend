// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAT8g_dv3gLmW0JWhyxn5nyH1Qzqt2eBn0",
  authDomain: "project15-f83f5.firebaseapp.com",
  projectId: "project15-f83f5",
  storageBucket: "project15-f83f5.firebasestorage.app",
  messagingSenderId: "154183976219",
  appId: "1:154183976219:web:e108476fb5e5a7c61cbfbe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };