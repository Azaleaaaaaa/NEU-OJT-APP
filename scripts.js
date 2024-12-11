import { signInWithGoogle } from "./GoogleAuth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { auth } from "./GoogleAuth.js";

// Navigation function to switch between pages
function navigateTo(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));

    // Show the target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        console.log(`Navigated to: ${pageId}`);
    } else {
        console.error(`Page not found: ${pageId}`);
    }
}

// Ensure that the Next Page button on the Main Page properly navigates to the Choices Page
const nextPageButton = document.getElementById("nextPageButton");
if (nextPageButton) {
    nextPageButton.addEventListener("click", () => {
        console.log("Navigating to choices-page");
        navigateTo('choices-page');
    });
} else {
    console.error("Next Page button not found!");
}

// Log out function
function logout() {
    auth.signOut().then(() => {
        navigateTo('login-page');
        console.log("User signed out successfully");
    }).catch((error) => {
        console.error("Error during sign-out:", error);
    });
}

// Update user profile in UI
function updateUserProfile(user) {
    if (user) {
        document.getElementById("userName").textContent = `Welcome, ${user.displayName}`;
        document.getElementById("userEmail").textContent = user.email;
        document.getElementById("userProfilePicture").src = user.photoURL || "./logo/default-profile.png";
        navigateTo("main-page");
    } else {
        console.error("Invalid user object provided for updateUserProfile");
    }
}

// Handle Google sign-in
const googleSignInButton = document.getElementById("googleSignInButton");
if (googleSignInButton) {
    googleSignInButton.addEventListener("click", async () => {
        try {
            const user = await signInWithGoogle();
            if (user && user.email.endsWith("@neu.edu.ph")) {
                updateUserProfile(user);
            } else {
                alert("Please use your institutional email (@neu.edu.ph) to sign in.");
                console.warn("Sign-in failed or incorrect email domain.");
            }
        } catch (error) {
            console.error("Error during Google sign-in:", error);
        }
    });
} else {
    console.error("Google Sign-In button not found!");
}

// Monitor authentication state
onAuthStateChanged(auth, (user) => {
    if (user && user.email.endsWith("@neu.edu.ph")) {
        updateUserProfile(user);
    } else {
        navigateTo("login-page");
        console.log("User is not authenticated or email domain is incorrect");
    }
});

// Show the login page initially
document.addEventListener('DOMContentLoaded', () => {
    navigateTo('login-page');
    console.log("DOMContentLoaded: Navigated to login-page");
});

// Handling navigation from Choices Page
document.getElementById("uploadRequirementsButton")?.addEventListener("click", () => {
    console.log("Navigating to upload-requirements page");
    navigateTo('upload-requirements');
});

document.getElementById("enterStudentInfoButton")?.addEventListener("click", () => {
    console.log("Navigating to student-info page");
    navigateTo('student-info');
});

document.getElementById("generateEndorsementButton")?.addEventListener("click", () => {
    console.log("Navigating to endorsement-letter page");
    navigateTo('endorsement-letter');
});
// Back Button in Upload Requirements Page
document.querySelector('.back-btn.upload-back')?.addEventListener("click", () => {
    console.log("Navigating back to choices-page");
    navigateTo('choices-page');
});
// Back Button in Student Info Page
document.querySelector('.back-btn.student-info-back')?.addEventListener("click", () => {
    console.log("Navigating back to choices-page");
    navigateTo('choices-page');
});
// Logout Button in Choices Page (under Generate Endorsement Letter)
document.querySelector('.logout-btn.choices-logout')?.addEventListener("click", () => {
    console.log("Logging out from choices-page");
    logout();
});
