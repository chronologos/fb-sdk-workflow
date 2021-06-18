import { initializeApp } from "@firebase/app";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, UserCredential } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDt0jTr0fM09gzSRfOurxYUp3B8UrQeY8c",
  authDomain: "ian-firebase-auth-sdk.firebaseapp.com",
  databaseURL: "https://ian-firebase-auth-sdk-default-rtdb.firebaseio.com",
  projectId: "ian-firebase-auth-sdk",
  storageBucket: "ian-firebase-auth-sdk.appspot.com",
  messagingSenderId: "686234783976",
  appId: "1:686234783976:web:84f4117cb5f56557ddb95d",
};
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
onAuthStateChanged(auth, user => {
    console.log(user);
})

document.addEventListener("DOMContentLoaded", function () {
const loadEl = document.querySelector("#load");
    loadEl!.textContent = `Firebase SDK loaded`;
})

async () => {
    return await signInWithEmailAndPassword(auth, "test@gmail.com", "1231233!a");
}
