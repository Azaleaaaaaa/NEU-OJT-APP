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

// Navigation function
function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
}

// Sign-in with Google
document.getElementById("googleSignInButton").addEventListener("click", async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        if (user.email.endsWith("@neu.edu.ph")) {
            const userRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                await setDoc(userRef, {
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    createdAt: new Date(),
                });
            }

            updateUserProfile(user);
        } else {
            alert("Use your institutional email.");
            await signOut(auth);
        }
    } catch (error) {
        console.error("Sign-in error:", error);
    }
});

// Log out
document.getElementById("logOutButton").addEventListener("click", () => logout());
document.getElementById("choicesLogoutButton").addEventListener("click", () => logout());

async function logout() {
    try {
        await signOut(auth);
        navigateTo("login-page");
    } catch (error) {
        console.error("Logout error:", error);
    }
}

// Update profile
function updateUserProfile(user) {
    document.getElementById("userName").textContent = `Welcome, ${user.displayName}`;
    document.getElementById("userEmail").textContent = user.email;
    document.getElementById("userProfilePicture").src = user.photoURL || "./logo/default-profile.png";
    navigateTo("main-page");
}

// Authentication state listener
onAuthStateChanged(auth, (user) => {
    if (user && user.email.endsWith("@neu.edu.ph")) {
        updateUserProfile(user);
    } else {
        navigateTo("login-page");
    }
});

// Page navigations
document.getElementById("nextPageButton").addEventListener("click", () => navigateTo("choices-page"));
document.getElementById("uploadRequirementsButton").addEventListener("click", () => navigateTo("upload-requirements"));
document.getElementById("enterStudentInfoButton").addEventListener("click", () => navigateTo("student-info"));
document.getElementById("generateEndorsementButton").addEventListener("click", () => navigateTo("endorsement-letter"));

// Back buttons
document.getElementById("uploadBackButton").addEventListener("click", () => navigateTo("choices-page"));
document.getElementById("studentInfoBackButton").addEventListener("click", () => navigateTo("choices-page"));
