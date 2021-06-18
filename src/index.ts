import { initializeApp } from "@firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth"

const firebaseApp = initializeApp({});
const auth = getAuth(firebaseApp);
onAuthStateChanged(auth, user => {
    console.log(user);
})
