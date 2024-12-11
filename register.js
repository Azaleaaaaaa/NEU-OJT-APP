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

// Validate institutional email
function isInstitutionalEmail(email) {
    const univDomain = /@neu\.edu\.ph$/;
    return univDomain.test(email);
}

// Update user profile in UI
function updateUserProfile(user) {
    document.getElementById("userName").textContent = `Welcome, ${user.displayName}`;
    document.getElementById("userEmail").textContent = user.email;
    document.getElementById("userProfilePicture").src = user.photoURL || "./logo/default-profile.png";
    navigateTo("main-page");  // Navigate to the main page after updating the profile
}

// Handle Google sign-in
document.getElementById("googleSignInButton").addEventListener("click", async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        if (isInstitutionalEmail(user.email)) {
            const userRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                await setDoc(userRef, {
                    displayName: user.displayName,
                    institutional_email: user.email,
                    photoUrl: user.photoURL,
                    createdAt: new Date(),
                    role: "Student",
                });
            }

            updateUserProfile(user);
        } else {
            alert("Please use your institutional email (@neu.edu.ph) to sign in.");
            await signOut(auth);  // Log the user out if the email is invalid
        }
    } catch (error) {
        console.error("Error during sign-in:", error);
    }
});

// Log out function
function logOut() {
    signOut(auth)
        .then(() => {
            alert("You have successfully logged out.");
            navigateTo("login-page");
        })
        .catch((error) => {
            console.error("Error during log-out:", error);
        });
}

// Monitor authentication state
onAuthStateChanged(auth, (user) => {
    if (user && isInstitutionalEmail(user.email)) {
        updateUserProfile(user);
    } else {
        navigateTo("login-page");
    }
});

// Ensure the Next button navigates to the Choices page
document.getElementById("nextPageButton").addEventListener("click", () => {
    navigateTo('choices-page');  // Navigates to the Choices Page
});

// Event listeners for choices page buttons
document.querySelector('.btn.primary:nth-child(1)').addEventListener("click", () => {
    navigateTo('upload-requirements'); // Navigate to Upload Requirements Page
});

document.querySelector('.btn.primary:nth-child(2)').addEventListener("click", () => {
    navigateTo('student-info'); // Navigate to Enter Student Info Page
});

// Add logout functionality to the new logout button in the Choices page
document.querySelector('.logout-btn').addEventListener("click", logOut);
