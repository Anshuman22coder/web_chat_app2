import {initializeApp} from "firebase/app"
import{getAuth,GoogleAuthProvider,signInWithPopup} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB4P4BE81-x-o8dolA32cHI7EQumzCYTr0",
  authDomain: "chat-app-f4849.firebaseapp.com",
  projectId: "chat-app-f4849",
  storageBucket: "chat-app-f4849.firebasestorage.app",
  messagingSenderId: "303890613832",
  appId: "1:303890613832:web:0f2453c38d6a1756bf3a7d",
 
};

const app=initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const provider =new GoogleAuthProvider();
export const signInWithGoogle=()=>signInWithPopup(auth,provider);