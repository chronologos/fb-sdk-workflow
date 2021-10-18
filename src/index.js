const { initializeApp } = require("firebase/app");
const {
    getAuth,
    signOut,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect,
    signInWithCredential,
    SAMLAuthProvider,
    OAuthProvider,
    linkWithPopup,
    reauthenticateWithPopup,
    browserPopupRedirectResolver,
    browserSessionPersistence,
    browserLocalPersistence,
    indexedDBLocalPersistence
} = require("firebase/auth");
const jwt_decode = require("jwt-decode");

const firebaseConfig = {
    apiKey: "AIzaSyBYBZpD_pkutXksLGhgBAKO9SN0RJ-QjzI",
    authDomain: "ian-another-test.firebaseapp.com",
    databaseURL: "https://ian-another-test-default-rtdb.firebaseio.com",
    projectId: "ian-another-test",
    storageBucket: "ian-another-test.appspot.com",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp, {
    persistence: [indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence],
    popupRedirectResolver: browserPopupRedirectResolver,
});
const DEFAULT_MSG = "No user signed in.";

// top level mutable state
var federatedSigninFunction = signInWithPopup;
var credential;

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("signout")?.addEventListener("click", userSignOut);
    document.getElementById("pw")?.addEventListener("click", pwSignin);
    document.getElementById("oidc")?.addEventListener("click", oidcSignin);
    document.getElementById("saml")?.addEventListener("click", samlSignin);
    document.getElementById("federatedLinkWithPopup")?.addEventListener("click", federatedLinkWithPopup);
    document.getElementById("popupReauthOidc")?.addEventListener("click", popupReauth);
    document.getElementById("popupReauthSaml")?.addEventListener("click", popupReauthSaml);

    document.getElementById("usePopup")?.addEventListener("click", () => {
        federatedSigninFunction = signInWithPopup;
    });
    document.getElementById("useRedirect")?.addEventListener("click", () => {
        // NOTE: this isn't entirely correct, need to call getRedirectResult to get result...
        federatedSigninFunction = signInWithRedirect;
    });


    authStateChangeHandler(auth.currentUser);
    onAuthStateChanged(auth, authStateChangeHandler);

    // Call test fns directly.
    oidcDirectSignIn("ya29.a0ARrdaM8QNvFXzird0J7ykx3Ve9Jj3YVxR-28hhw9wWp1_XxuK8GMq7n2RR15uhadOchYK_BrGnnOfv8VwYZUrNYJCyEH8YBsxK1OSDq9kKoNV4FcPrGOvQAEx3_9g2uyuovnwPBB333cxv7egLuD54F91Ta-tA");
});

function authStateChangeHandler(user) {
    if (user) {
        document.getElementById("message").innerHTML = "Welcome, " + user.email;
        document.getElementById("additional-info").innerHTML = JSON.stringify(user.toJSON(), null, 2);
        user.getIdToken().then((tokStr) => {
            document.getElementById("id-token").innerHTML = JSON.stringify(jwt_decode(tokStr), null, 2);
        })
    } else {
        document.getElementById("message").innerHTML = DEFAULT_MSG;
        document.getElementById("additional-info").innerHTML = "";
        document.getElementById("id-token").innerHTML = "";
    }
}

function userSignOut() {
    signOut(auth)
        .then(() => {
            credential = null;
            document.getElementById("message").innerHTML = DEFAULT_MSG;
        })
        .catch((error) => {
            console.log(error);
        });
}

function pwSignin() {
    const email = "example@gmail.com";
    const password = "hunter2";
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log(JSON.stringify(userCredential));
        })
        .catch((error) => {
            console.log(error);
            const errorCode = error.code;
            const errorMessage = error.message;
        });
}

function samlSignin() {
    const provider = new SAMLAuthProvider("saml.google");
    federatedSigninFunction(auth, provider)
        .then((result) => {
            console.log(JSON.stringify(result));
            credential = SAMLAuthProvider.credentialFromResult(result);
            console.log(JSON.stringify(credential));
            result.user.getIdTokenResult().then((tok) => {
                console.log(tok.claims.firebase);
            });
        })
        .catch((error) => {
            const credential = SAMLAuthProvider.credentialFromError(error);
            console.log(error);
            console.log(credential);
        });
}

function oidcSignin() {
    const provider = new OAuthProvider("oidc.gcip-openid-provider");
    federatedSigninFunction(auth, provider)
        .then((result) => {
            console.log(JSON.stringify(result));
            credential = OAuthProvider.credentialFromResult(result);
            console.log(JSON.stringify(credential));
        })
        .catch((error) => {
            const credential = OAuthProvider.credentialFromError(error);
            console.log(error);
            console.log(credential);
        });
}

// The token needs to be obtained properly.
function oidcDirectSignIn(tok) {
    const provider = new OAuthProvider("oidc.gcip-openid-provider");
    const credential = provider.credential({
        idToken: tok,
    })
    signInWithCredential(auth, credential)
        .then((result) => {
            var credential = OAuthProvider.credentialFromResult(result);
            console.log(credential);
            // ...
        })
        .catch((error) => {
            const credential = OAuthProvider.credentialFromError(error);
            console.log(error);
            console.log(credential);
        });
}

function popupReauth() {
    const provider = new OAuthProvider("oidc.gcip-openid-provider");
    reauthenticateWithPopup(auth.currentUser, provider)
        .then((result) => {
            credential = OAuthProvider.credentialFromResult(result);
            console.log(JSON.stringify(credential));
        })
        .catch((error) => {
            const credential = OAuthProvider.credentialFromError(error);
            console.log(error);
            console.log(credential);
        });
}

function popupReauthSaml() {
    const provider = new SAMLAuthProvider("saml.google");
    reauthenticateWithPopup(auth.currentUser, provider)
        .then((result) => {
            credential = SAMLAuthProvider.credentialFromResult(result);
            console.log(JSON.stringify(credential));
        })
        .catch((error) => {
            const credential = SAMLAuthProvider.credentialFromError(error);
            console.log(error);
            console.log(credential);
        });
}

function federatedLinkWithPopup() {
    const provider = new OAuthProvider("oidc.gcip-openid-provider");
    linkWithPopup(auth.currentUser, provider).then((result) => {
        // Accounts successfully linked.
        credential = OAuthProvider.credentialFromResult(result);
        console.log(JSON.stringify(credential));
        // ...
    }).catch((error) => {
        const credential = OAuthProvider.credentialFromError(error);
        console.log(error);
        console.log(credential);
    });
}