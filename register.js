// Navigation function
function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('hidden');
    } else {
        console.error(`Page ${pageId} not found.`);
    }
}

// Validate institutional email
@@ -30,15 +35,15 @@ function isInstitutionalEmail(email) {
    return univDomain.test(email);
}

// Update user profile in UI
// Update user profile in the UI
function updateUserProfile(user) {
    document.getElementById("userName").textContent = `Welcome, ${user.displayName}`;
    document.getElementById("userEmail").textContent = user.email;
    document.getElementById("userProfilePicture").src = user.photoURL || "./logo/default-profile.png";
    navigateTo("main-page");  // Navigate to the main page after updating the profile
    navigateTo("main-page"); // Navigate to the main page
}

// Handle Google sign-in
// Google Sign-In
document.getElementById("googleSignInButton").addEventListener("click", async () => {
    try {
        const result = await signInWithPopup(auth, provider);
@@ -61,14 +66,14 @@ document.getElementById("googleSignInButton").addEventListener("click", async ()
            updateUserProfile(user);
        } else {
            alert("Please use your institutional email (@neu.edu.ph) to sign in.");
            await signOut(auth);  // Log the user out if the email is invalid
            await signOut(auth);
        }
    } catch (error) {
        console.error("Error during sign-in:", error);
    }
});

// Log out function
// Log Out Function
function logOut() {
    signOut(auth)
        .then(() => {
@@ -80,7 +85,7 @@ function logOut() {
        });
}

// Monitor authentication state
// Monitor Authentication State
onAuthStateChanged(auth, (user) => {
    if (user && isInstitutionalEmail(user.email)) {
        updateUserProfile(user);
@@ -89,19 +94,32 @@ onAuthStateChanged(auth, (user) => {
    }
});

// Ensure the Next button navigates to the Choices page
// Event Listener for Main Page Navigation
document.getElementById("nextPageButton").addEventListener("click", () => {
    navigateTo('choices-page');  // Navigates to the Choices Page
    navigateTo('choices-page');
});
// Event Listeners for Choices Page Buttons
document.getElementById("uploadRequirementsButton").addEventListener("click", () => {
    navigateTo('upload-requirements');
});
document.getElementById("enterStudentInfoButton").addEventListener("click", () => {
    navigateTo('student-info');
});
document.getElementById("generateEndorsementButton").addEventListener("click", () => {
    navigateTo('endorsement-letter');
});

// Event listeners for choices page buttons
document.querySelector('.btn.primary:nth-child(1)').addEventListener("click", () => {
    navigateTo('upload-requirements'); // Navigate to Upload Requirements Page
// Back Buttons for Upload Requirements and Student Info Pages
document.querySelector('.upload-back').addEventListener("click", () => {
    navigateTo('choices-page');
});

document.querySelector('.btn.primary:nth-child(2)').addEventListener("click", () => {
    navigateTo('student-info'); // Navigate to Enter Student Info Page
document.querySelector('.student-info-back').addEventListener("click", () => {
    navigateTo('choices-page');
});

// Add logout functionality to the new logout button in the Choices page
document.querySelector('.logout-btn').addEventListener("click", logOut);
// Second Logout Button in the Choices Page
document.querySelector('.choices-logout').addEventListener("click", logOut);
