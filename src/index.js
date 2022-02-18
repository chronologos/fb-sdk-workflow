const { initializeApp } = require("firebase/app");
const {
    getAuth,
    signOut,
    onAuthStateChanged,
    confirmPasswordReset,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect,
    signInWithCredential,
    SAMLAuthProvider,
    OAuthProvider,
    linkWithPopup,
    reauthenticateWithPopup,
    browserPopupRedirectResolver,
    fetchSignInMethodsForEmail,
    getRedirectResult,
    checkActionCode,
    applyActionCode,
    browserSessionPersistence,
    browserLocalPersistence,
    indexedDBLocalPersistence,
    getMultiFactorResolver,
    EmailAuthProvider,
    verifyBeforeUpdateEmail,
    linkWithCredential,
    multiFactor,
    RecaptchaVerifier,
    PhoneAuthProvider,
    signInWithPhoneNumber,
    PhoneMultiFactorGenerator,
    AuthErrorCodes,
    sendEmailVerification,
    initializeAuth
} = require("firebase/auth");
const jwt_decode = require("jwt-decode");

const firebaseConfig = {
    apiKey: "AIzaSyBYBZpD_pkutXksLGhgBAKO9SN0RJ-QjzI",
    authDomain: "ian-another-test.firebaseapp.com",
    databaseURL: "https://ian-another-test-default-rtdb.firebaseio.com",
    projectId: "ian-another-test",
    storageBucket: "ian-another-test.appspot.com",
    appVerificationDisabledForTesting: true,
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = initializeAuth(firebaseApp, {
    persistence: [indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence],
    popupRedirectResolver: browserPopupRedirectResolver,
});

// 2022-02-17 Doesn't work?
// // use fake reCAPTCHA
// console.log("using fake reCAPTCHA");
// console.log(JSON.stringify(auth));
// auth.settings.appVerificationDisabledForTesting = true;
// console.log(JSON.stringify(auth));
window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);

const DEFAULT_MSG = "No user signed in.";

// top level mutable state
var federatedSigninFunction = signInWithPopup;
var credential;

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("signout")?.addEventListener("click", userSignOut);
    document.getElementById("pw")?.addEventListener("click", pwSignin);
    document.getElementById("resetpw")?.addEventListener("click", resetPw);
    document.getElementById("oidc")?.addEventListener("click", oidcSignin);
    document.getElementById("twitch")?.addEventListener("click", twitchSignin);
    document.getElementById("saml")?.addEventListener("click", samlSignin);

    document
        .getElementById("verifyEmail")
        ?.addEventListener("click", verifyEmail);

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
    auth.languageCode = 'fr';
    console.log("auth language set");
    authStateChangeHandler(auth.currentUser);
    onAuthStateChanged(auth, authStateChangeHandler);

    // Call test fns directly.
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

async function resetPw() {
    const actionCodeSettings = {
        url: 'https://ian-another-test.firebaseapp.com',
    };
    await sendPasswordResetEmail(auth, 'iantay@google.com', actionCodeSettings);
    let verificationCode = prompt("code?");
    await confirmPasswordReset('user@example.com', code);
}

function pwSignin() {
    const email = "iantay@google.com";
    const password = "1231233!a";
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log(JSON.stringify(userCredential));
        }).catch((error) => {
            if (error.code == AuthErrorCodes.MFA_REQUIRED) {
                // The user is a multi-factor user. Second factor challenge is required.
                resolver = getMultiFactorResolver(auth, error);
                var phoneInfoOptions = {
                    multiFactorHint: resolver.hints[0],
                    session: resolver.session
                };
                const provider = new PhoneAuthProvider(auth);
                var appVerifier = window.recaptchaVerifier;
                provider.verifyPhoneNumber(phoneInfoOptions, appVerifier)
                    .then((verificationId) => {
                        let verificationCode = prompt("code?");
                        const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
                        const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
                        resolver.resolveSignIn(multiFactorAssertion)
                            .then((userCredential) => {
                                console.log("mfa sign-in success!");
                                console.log(JSON.stringify(userCredential));
                            });

                    }).catch((error) => {
                        console.log("failed verifyPhoneNumber")
                        console.log(error);
                    })


            } else {
                console.log(error);
            }
        }
        )
};


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
    provider.addScope('openid');
    provider.addScope('profile');
    provider.addScope('email');
    provider.addScope('https://www.googleapis.com/auth/calendar')
    provider.addScope('https://www.googleapis.com/auth/bigquery')
    provider.addScope('https://www.googleapis.com/auth/admin.datatransfer');
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

function twitchSignin() {
    const provider = new OAuthProvider("oidc.twitch");
    provider.addScope('openid');
    provider.addScope('user:read:email');
    provider.setCustomParameters({
        claims: JSON.stringify(
            { "id_token": { "email": null, "email_verified": null }, "userinfo": { "picture": null } })
    })
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

function verifyEmail() {
    const user = auth.currentUser;
    if (user === null) {
        console.log("null user")
        return;
    }
    console.log("verify email")
    sendEmailVerification(user, {
        url: "https://ian-another-test.firebaseapp.com",
    }).then(() => {
        let code = prompt("action code?");
        console.log("sending action code");
        applyActionCode(auth, code);
    });
}