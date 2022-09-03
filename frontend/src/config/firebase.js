import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDh3J6mjrfboP_SyD1PzzGG1zng7qkYsUE",
    authDomain: "social-media-3bea3.firebaseapp.com",
    projectId: "social-media-3bea3",
    storageBucket: "social-media-3bea3.appspot.com",
    messagingSenderId: "80580318107",
    appId: "1:80580318107:web:fe660ac56dee832695873e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;
