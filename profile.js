// =====================================
// WORLDELITE — PROFILE / LOGIN SYSTEM
// =====================================

const USER_KEY = "worldelite_user";

function getUser() {
    try {
        return JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
        return null;
    }
}

function saveUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function logoutUser() {
    localStorage.removeItem(USER_KEY);
    showProfile();
}

function showLoginForm() {
    const container = document.getElementById("profileContent");
    if (!container) return;

    container.innerHTML = `
        <div class="profile-box">
            <h2>Welcome back</h2>
            <p>Login to your WorldElite profile.</p>

            <input
                id="loginEmail"
                type="email"
                placeholder="Email"
                autocomplete="email"
            >

            <input
                id="loginPassword"
                type="password"
                placeholder="Password"
                autocomplete="current-password"
            >

            <button onclick="loginUser()">Login</button>

            <p class="profile-switch">
                Don't have an account?
                <button class="text-button" onclick="showSignupForm()">
                    Sign Up
                </button>
            </p>
        </div>
    `;
}

function showSignupForm() {
    const container = document.getElementById("profileContent");
    if (!container) return;

    container.innerHTML = `
        <div class="profile-box">
            <h2>Create your account</h2>
            <p>Join WorldElite.</p>

            <input
                id="signupName"
                type="text"
                placeholder="Full name"
                autocomplete="name"
            >

            <input
                id="signupEmail"
                type="email"
                placeholder="Email"
                autocomplete="email"
            >

            <input
                id="signupPassword"
                type="password"
                placeholder="Password"
                autocomplete="new-password"
            >

            <button onclick="signupUser()">Create Account</button>

            <p class="profile-switch">
                Already have an account?
                <button class="text-button" onclick="showLoginForm()">
                    Login
                </button>
            </p>
        </div>
    `;
}

function signupUser() {
    const name = document.getElementById("signupName")?.value.trim();
    const email = document.getElementById("signupEmail")?.value.trim();
    const password = document.getElementById("signupPassword")?.value;

    if (!name || !email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    if (password.length < 6) {
        alert("Password must contain at least 6 characters.");
        return;
    }

    const user = {
        name: name,
        email: email,
        createdAt: new Date().toISOString()
    };

    /*
      IMPORTANT:
      This is only a local demo account.
      The password is NOT stored.
      A real account system will later use a backend/authentication service.
    */

    saveUser(user);

    alert("Account created successfully.");

    showProfile();
}

function loginUser() {
    const email = document.getElementById("loginEmail")?.value.trim();

    if (!email) {
        alert("Please enter your email.");
        return;
    }

    const user = getUser();

    if (!user || user.email !== email) {
        alert("No local account found with this email.");
        return;
    }

    showProfile();
}

function showProfile() {
    const container = document.getElementById("profileContent");
    if (!container) return;

    const user = getUser();

    if (!user) {
        container.innerHTML = `
            <div class="profile-box profile-guest">
                <div class="profile-icon">👤</div>

                <h2>WorldElite Profile</h2>

                <p>
                    Create an account to personalize your WorldElite
                    experience.
                </p>

                <button onclick="showLoginForm()">
                    Login
                </button>

                <button class="secondary-button" onclick="showSignupForm()">
                    Sign Up
                </button>
            </div>
        `;

        return;
    }

    const favorites =
        typeof getFavorites === "function"
            ? getFavorites()
            : [];

    container.innerHTML = `
        <div class="profile-box profile-user">

            <div class="profile-avatar">
                ${escapeHTMLProfile(user.name.charAt(0).toUpperCase())}
            </div>

            <h2>${escapeHTMLProfile(user.name)}</h2>

            <p class="profile-email">
                ${escapeHTMLProfile(user.email)}
            </p>

            <div class="profile-stat">
                <span>☆</span>
                <strong>${favorites.length}</strong>
                <small>Favorites</small>
            </div>

            <button onclick="showFavoritesFromProfile()">
                View Favorites
            </button>

            <button
                class="secondary-button logout-button"
                onclick="logoutUser()"
            >
                Log Out
            </button>
        </div>
    `;
}

function showFavoritesFromProfile() {
    const favorites = getFavorites();

    const container = document.getElementById("profileContent");
    if (!container) return;

    if (!favorites.length) {
        container.innerHTML = `
            <div class="profile-box">
                <h2>Your Favorites</h2>
                <p>You haven't added any billionaires yet.</p>

                <button onclick="showProfile()">
                    Back to Profile
                </button>
            </div>
        `;

        return;
    }

    container.innerHTML = `
        <div class="profile-box favorites-profile">
            <h2>Your Favorites</h2>

            <div class="profile-favorites-list">
                ${favorites.map(person => `
                    <div class="profile-favorite-item">
                        <div>
                            <strong>
                                ${escapeHTMLProfile(person.name)}
                            </strong>

                            <small>
                                ${escapeHTMLProfile(person.country || "Unknown")}
                            </small>
                        </div>

                        <span>
                            $${formatProfileWorth(person.netWorth)}
                        </span>
                    </div>
                `).join("")}
            </div>

            <button onclick="showProfile()">
                Back to Profile
            </button>
        </div>
    `;
}

function formatProfileWorth(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "—";
    }

    if (number >= 1000) {
        return (number / 1000).toFixed(1) + "T";
    }

    return number.toFixed(1) + "B";
}

function escapeHTMLProfile(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

document.addEventListener("DOMContentLoaded", () => {
    showProfile();
});
