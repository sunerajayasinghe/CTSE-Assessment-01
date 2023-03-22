import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB_3QAWWRUVHjDgUrTAKDUxAD9-sUSJwsA",
  authDomain: "laundry-app-22ab6.firebaseapp.com",
  projectId: "laundry-app-22ab6",
  storageBucket: "laundry-app-22ab6.appspot.com",
  messagingSenderId: "458987403208",
  appId: "1:458987403208:web:10d90f2bd218d9a1bdf2fd",
  measurementId: "G-QN5STYVTWC"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore();

export { auth, db };
