import { GoogleAuthProvider, signInWithPopup, getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCsfIKXHr0AY8RneP2VWpjdR038aMNkCsw",
    authDomain: "out-of-bounds-ojt-app.firebaseapp.com",
    projectId: "out-of-bounds-ojt-app",
    storageBucket: "out-of-bounds-ojt-app.appspot.com",
    messagingSenderId: "1059978490785",
    appId: "1:1059978490785:web:d08f9e40b5b0e58efed1e0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Function to check if email is institutional
function isInstitutionalEmail(email: string | null): boolean {
    return email?.endsWith("@neu.edu.ph") ?? false;
}

// Function to sign in with Google
export async function signInWithGoogle(): Promise<any> {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        if (user && isInstitutionalEmail(user.email)) {
            const userRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(userRef);

            if (!docSnap.exists()) {
                await setDoc(userRef, {
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    uid: user.uid
                });
            }
            return user;
        } else {
            alert("Please sign in with your institutional email.");
            return null;
        }
    } catch (error) {
        console.error("Error during Google sign-in:", error);
        return null;
    }
}

export { auth, signOut, onAuthStateChanged };
