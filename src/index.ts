/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { initializeApp } from "@firebase/app";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  SAMLAuthProvider,
  OAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBYBZpD_pkutXksLGhgBAKO9SN0RJ-QjzI",
  authDomain: "ian-another-test.firebaseapp.com",
  databaseURL: "https://ian-another-test-default-rtdb.firebaseio.com",
  projectId: "ian-another-test",
  storageBucket: "ian-another-test.appspot.com",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const DEFAULT_MSG = "No User";

// document.addEventListener("DOMContentLoaded", quickstart);
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("signout")?.addEventListener("click", userSignOut);
  document.getElementById("pw")?.addEventListener("click", pwSignin);
  document.getElementById("oidc")?.addEventListener("click", oidcSignin);
  document.getElementById("saml")?.addEventListener("click", samlSignin);
});

function userSignOut() {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      document.getElementById("message")!.innerHTML = DEFAULT_MSG;
    })
    .catch((error) => {
      console.log(error);
    });
}

function pwSignin() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      document.getElementById("message")!.innerHTML = "Welcome, " + user.email;
    } else {
      document.getElementById("message")!.innerHTML = "No user signed in.";
    }
  });

  const email = "example@gmail.com";
  const password = "hunter2";
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      console.log(error);
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}

function samlSignin() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      document.getElementById("message")!.innerHTML = "Welcome, " + user.email;
    } else {
      document.getElementById("message")!.innerHTML = "No user signed in.";
    }
  });

  const provider = new SAMLAuthProvider("saml.google");
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = SAMLAuthProvider.credentialFromResult(result);
      const token = credential?.toJSON();
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = SAMLAuthProvider.credentialFromError(error);
      console.log(error);
      console.log(credential);
      // ...
    });
}

function oidcSignin() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      document.getElementById("message")!.innerHTML = "Welcome, " + user.email;
    } else {
      document.getElementById("message")!.innerHTML = "No user signed in.";
    }
  });

  const provider = new OAuthProvider("oidc.gcip-openid-provider");
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = OAuthProvider.credentialFromResult(result);
      const token = credential?.toJSON();
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = OAuthProvider.credentialFromError(error);
      console.log(error);
      console.log(credential);
      // ...
    });
}
