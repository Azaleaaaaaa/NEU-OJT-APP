import { signInWithGoogle } from "./GoogleAuth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { auth } from "./GoogleAuth.js";

// Navigation function to switch between pages
function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        console.log(`Navigated to: ${pageId}`);
    } else {
        console.error(`Page not found: ${pageId}`);
    }
}

// Ensure that the Next Page button on the Main Page properly navigates to the Choices Page
document.getElementById("nextPageButton")?.addEventListener("click", () => {
    console.log("Navigating to choices-page");
    navigateTo('choices-page');
});

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

// Monitor authentication state
onAuthStateChanged(auth, (user) => {
    if (user && user.email.endsWith("@neu.edu.ph")) {
        updateUserProfile(user);
    } else {
        navigateTo("login-page");
        console.log("User is not authenticated or email domain is incorrect");
    }
});

// Navigation from Choices Page
document.getElementById("uploadRequirementsButton")?.addEventListener("click", () => navigateTo('upload-requirements'));
document.getElementById("enterStudentInfoButton")?.addEventListener("click", () => navigateTo('student-info'));
document.getElementById("generateEndorsementButton")?.addEventListener("click", () => navigateTo('endorsement-letter'));

// Back buttons
document.getElementById("uploadBackButton")?.addEventListener("click", () => navigateTo('choices-page'));
document.getElementById("studentInfoBackButton")?.addEventListener("click", () => navigateTo('choices-page'));
document.getElementById("endorsementBackButton")?.addEventListener("click", () => navigateTo('choices-page'));
