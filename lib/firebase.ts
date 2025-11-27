import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDEPDsdrqSUFnGK-QNa9oaOjzUhTw65KQk",
    authDomain: "intellect-protocol.firebaseapp.com",
    projectId: "intellect-protocol",
    storageBucket: "intellect-protocol.firebasestorage.app",
    messagingSenderId: "669001442932",
    appId: "1:669001442932:web:c191f449239ad3ca2e5321"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
