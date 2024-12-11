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
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        console.log(`Navigated to: ${pageId}`);
    } else {
        console.error(`Page ${pageId} not found.`);
    }
}

// Validate institutional email
function isInstitutionalEmail(email) {
    const univDomain = /@neu\.edu\.ph$/;
    return univDomain.test(email);
}

// Update user profile in the UI
function updateUserProfile(user) {
    document.getElementById("userName").textContent = `Welcome, ${user.displayName}`;
    document.getElementById("userEmail").textContent = user.email;
    document.getElementById("userProfilePicture").src = user.photoURL || "./logo/default-profile.png";

    // Ensure the buttons appear after profile picture and are centered
    document.getElementById("buttonsContainer").style.display = "flex";
    document.getElementById("buttonsContainer").style.flexDirection = "column";
    document.getElementById("buttonsContainer").style.alignItems = "center";
    document.getElementById("buttonsContainer").style.marginTop = "20px";

    navigateTo("main-page");
}

// Google Sign-In
document.getElementById("googleSignInButton")?.addEventListener("click", async () => {
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
            await signOut(auth);
        }
    } catch (error) {
        console.error("Error during sign-in:", error);
    }
});

// Log Out Function
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

// Monitor Authentication State
onAuthStateChanged(auth, (user) => {
    if (user && isInstitutionalEmail(user.email)) {
        updateUserProfile(user);
    } else {
        navigateTo("login-page");
    }
});

// Event Listener for Next Page Button on the Main Page
const nextPageButton = document.getElementById("nextPageButton");
if (nextPageButton) {
    nextPageButton.addEventListener("click", () => {
        console.log("Navigating to choices-page");
        navigateTo('choices-page');
    });
} else {
    console.error("Next Page button not found!");
}

// Event Listener for Logout Button on the Main Page
const mainPageLogoutButton = document.getElementById("logOutButton");
if (mainPageLogoutButton) {
    mainPageLogoutButton.addEventListener("click", () => {
        console.log("Logging out from main-page");
        logOut();
    });
} else {
    console.error("Logout button not found on main page!");
}

// Event Listeners for Choices Page Buttons
document.getElementById("uploadRequirementsButton")?.addEventListener("click", () => {
    navigateTo('upload-requirements');
});

document.getElementById("enterStudentInfoButton")?.addEventListener("click", () => {
    navigateTo('student-info');
});

document.getElementById("generateEndorsementButton")?.addEventListener("click", () => {
    navigateTo('endorsement-letter');
});

// Back Buttons for Upload Requirements and Student Info Pages
document.querySelector('.upload-back')?.addEventListener("click", () => {
    navigateTo('choices-page');
});

document.querySelector('.student-info-back')?.addEventListener("click", () => {
    navigateTo('choices-page');
});

// Second Logout Button in the Choices Page
document.querySelector('.choices-logout')?.addEventListener("click", logOut);
