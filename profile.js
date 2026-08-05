// ==========================================
// WORLDELITE — PROFILE
// DOES NOT TOUCH BILLIONAIRE DATA
// ==========================================

const USER_KEY = "worldelite_user";

function getWorldEliteUser() {
    try {
        return JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
        return null;
    }
}

function saveWorldEliteUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function logoutUser() {
    localStorage.removeItem(USER_KEY);
    renderProfile();
}

function renderProfile() {
    const container = document.getElementById("profileContent");

    // IMPORTANT:
    // If profileContent does not exist,
    // do absolutely nothing.
    // This prevents Profile from breaking the main app.
    if (!container) return;

    const user = getWorldEliteUser();

    if (!user) {
        container.innerHTML = `
            <div class="profile-box">
                <div class="profile-icon">👤</div>

                <h2>WorldElite Profile</h2>

                <p>
                    Sign in to personalize your WorldElite experience.
                </p>

                <button onclick="showLoginForm()">
                    Login
                </button>

                <button
                    class="secondary-button"
                    onclick="showSignupForm()"
                >
                    Sign Up
                </button>
            </div>
        `;

        return;
    }

    let favorites = [];

    if (typeof getFavorites === "function") {
        favorites = getFavorites();
    }

    container.innerHTML = `
        <div class="profile-box">

            <div class="profile-avatar">
                ${escapeProfile(user.name?.charAt(0)?.toUpperCase() || "U")}
            </div>

            <h2>
                ${escapeProfile(user.name)}
            </h2>

            <p>
                ${escapeProfile(user.email)}
            </p>

            <div class="profile-stat">
                <span>☆</span>
                <strong>${favorites.length}</strong>
                <small> Favorites</small>
            </div>

            <button onclick="showProfileFavorites()">
                View Favorites
            </button>

            <button
                class="secondary-button"
                onclick="logoutUser()"
            >
                Log Out
            </button>

        </div>
    `;
}

function showLoginForm() {
    const container = document.getElementById("profileContent");

    if (!container) return;

    container.innerHTML = `
        <div class="profile-box">

            <h2>Welcome back</h2>

            <p>Login to WorldElite.</p>

            <input
                id="worldEliteLoginEmail"
                type="email"
                placeholder="Email"
            >

            <button onclick="loginWorldElite()">
                Login
            </button>

            <p>
                Don't have an account?
            </p>

            <button
                class="secondary-button"
                onclick="showSignupForm()"
            >
                Sign Up
            </button>

        </div>
    `;
}

function showSignupForm() {
    const container = document.getElementById("profileContent");

    if (!container) return;

    container.innerHTML = `
        <div class="profile-box">

            <h2>Create Account</h2>

            <p>Join WorldElite.</p>

            <input
                id="worldEliteSignupName"
                type="text"
                placeholder="Name"
            >

            <input
                id="worldEliteSignupEmail"
                type="email"
                placeholder="Email"
            >

            <button onclick="signupWorldElite()">
                Create Account
            </button>

            <p>
                Already have an account?
            </p>

            <button
                class="secondary-button"
                onclick="showLoginForm()"
            >
                Login
            </button>

        </div>
    `;
}

function signupWorldElite() {
    const name =
        document.getElementById("worldEliteSignupName")?.value.trim();

    const email =
        document.getElementById("worldEliteSignupEmail")?.value.trim();

    if (!name || !email) {
        alert("Please enter your name and email.");
        return;
    }

    const user = {
        name,
        email,
        createdAt: new Date().toISOString()
    };

    saveWorldEliteUser(user);

    renderProfile();
}

function loginWorldElite() {
    const email =
        document.getElementById("worldEliteLoginEmail")?.value.trim();

    const user = getWorldEliteUser();

    if (!user) {
        alert("No account found. Please sign up first.");
        return;
    }

    if (email !== user.email) {
        alert("Email does not match the saved account.");
        return;
    }

    renderProfile();
}

function showProfileFavorites() {
    const container = document.getElementById("profileContent");

    if (!container) return;

    let favorites = [];

    if (typeof getFavorites === "function") {
        favorites = getFavorites();
    }

    if (!favorites.length) {
        container.innerHTML = `
            <div class="profile-box">

                <h2>Your Favorites</h2>

                <p>
                    You haven't added any billionaires yet.
                </p>

                <button onclick="renderProfile()">
                    Back to Profile
                </button>

            </div>
        `;

        return;
    }

    container.innerHTML = `
        <div class="profile-box">

            <h2>Your Favorites</h2>

            <div class="profile-favorites-list">

                ${favorites.map(person => `
                    <div class="profile-favorite-item">

                        <div>
                            <strong>
                                ${escapeProfile(person.name)}
                            </strong>

                            <small>
                                ${escapeProfile(
                                    person.country || "Unknown"
                                )}
                            </small>
                        </div>

                        <span>
                            ${formatProfileWorth(person.netWorth)}
                        </span>

                    </div>
                `).join("")}

            </div>

            <button onclick="renderProfile()">
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
        return "$" + (number / 1000).toFixed(1) + "T";
    }

    return "$" + number.toFixed(1) + "B";
}

function escapeProfile(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

// Only render Profile if its container actually exists.
document.addEventListener("DOMContentLoaded", function () {

    const profileContainer =
        document.getElementById("profileContent");

    if (profileContainer) {
        renderProfile();
    }

});
