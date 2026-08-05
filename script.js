// ================================
// WorldElite — Profile System
// ================================

const FAVORITES_KEY = "worldelite_favorites";
const USER_KEY = "worldelite_user";

function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
    } catch {
        return [];
    }
}

function saveFavorites(favorites) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
        return null;
    }
}

// ================================
// FAVORITES
// ================================

function isFavorite(name) {
    return getFavorites().includes(name);
}

function toggleFavorite(name) {
    let favorites = getFavorites();

    if (favorites.includes(name)) {
        favorites = favorites.filter(x => x !== name);
    } else {
        favorites.push(name);
    }

    saveFavorites(favorites);

    if (typeof renderApp === "function") {
        renderApp();
    }
}

// ================================
// PROFILE
// ================================

function showProfile() {
    const app = document.getElementById("app");

    if (!app) return;

    const user = getCurrentUser();
    const favorites = getFavorites();

    app.innerHTML = `
        <div class="profile-page">

            <div class="profile-header">
                <div class="profile-avatar">
                    👤
                </div>

                <h1>
                    ${user?.name || "WorldElite User"}
                </h1>

                <p>
                    ${user?.email || "Guest account"}
                </p>
            </div>

            <div class="profile-card">
                <div class="profile-card-icon">⭐</div>

                <div>
                    <h3>Favorites</h3>
                    <p>${favorites.length} billionaires saved</p>
                </div>
            </div>

            <div class="profile-card">
                <div class="profile-card-icon">🌍</div>

                <div>
                    <h3>WorldElite</h3>
                    <p>Global wealth & business intelligence</p>
                </div>
            </div>

            <div class="profile-actions">

                <button onclick="showFavorites()" class="profile-button">
                    ⭐ My Favorites
                </button>

                <button onclick="showSettings()" class="profile-button">
                    ⚙️ Settings
                </button>

                <button onclick="logout()" class="profile-button logout-button">
                    🚪 Log Out
                </button>

            </div>

        </div>
    `;

    updateNavigation("profile");
}

// ================================
// FAVORITES PAGE
// ================================

function showFavorites() {
    const app = document.getElementById("app");

    if (!app) return;

    const favorites = getFavorites();

    app.innerHTML = `
        <div class="page">

            <div class="page-title">
                <button onclick="showProfile()" class="back-button">
                    ←
                </button>

                <div>
                    <h1>My Favorites</h1>
                    <p>${favorites.length} saved</p>
                </div>
            </div>

            <div id="favorites-list"></div>

        </div>
    `;

    const list = document.getElementById("favorites-list");

    if (favorites.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div>⭐</div>
                <h2>No favorites yet</h2>
                <p>Add billionaires to your favorites from their profile.</p>

                <button onclick="showRankings()" class="primary-button">
                    Explore Rankings
                </button>
            </div>
        `;

        return;
    }

    if (typeof billionaires === "undefined") {
        list.innerHTML = `
            <div class="empty-state">
                <h2>Data unavailable</h2>
            </div>
        `;
        return;
    }

    const people = billionaires.filter(person =>
        favorites.includes(person.name)
    );

    if (people.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <h2>No saved profiles found</h2>
                <p>The data may have been updated.</p>
            </div>
        `;
        return;
    }

    people.forEach(person => {
        list.innerHTML += createFavoriteCard(person);
    });

    updateNavigation("profile");
}

// ================================
// FAVORITE CARD
// ================================

function createFavoriteCard(person) {

    const country = person.country || "Unknown";
    const flag = getFlag(country);

    return `
        <div class="favorite-card">

            <div class="favorite-avatar">
                ${flag}
            </div>

            <div class="favorite-info">

                <h3>${person.name}</h3>

                <p>
                    ${country}
                </p>

                <strong>
                    $${formatMoney(person.netWorth)}
                </strong>

            </div>

            <button
                onclick="removeFavorite('${escapeQuotes(person.name)}')"
                class="remove-favorite"
            >
                ★
            </button>

        </div>
    `;
}

// ================================
// REMOVE FAVORITE
// ================================

function removeFavorite(name) {

    let favorites = getFavorites();

    favorites = favorites.filter(
        item => item !== name
    );

    saveFavorites(favorites);

    showFavorites();
}

// ================================
// SETTINGS
// ================================

function showSettings() {

    const app = document.getElementById("app");

    if (!app) return;

    app.innerHTML = `
        <div class="page">

            <div class="page-title">

                <button
                    onclick="showProfile()"
                    class="back-button"
                >
                    ←
                </button>

                <div>
                    <h1>Settings</h1>
                    <p>Customize WorldElite</p>
                </div>

            </div>

            <div class="settings-section">

                <div class="setting-row">
                    <div>
                        <h3>🌙 Dark Mode</h3>
                        <p>Use the dark WorldElite interface</p>
                    </div>

                    <label class="switch">
                        <input
                            type="checkbox"
                            id="darkModeToggle"
                            checked
                            onchange="toggleDarkMode(this.checked)"
                        >
                        <span class="slider"></span>
                    </label>
                </div>

                <div class="setting-row">
                    <div>
                        <h3>🔄 Automatic Data</h3>
                        <p>WorldElite updates its data automatically</p>
                    </div>

                    <span class="status-badge">
                        ON
                    </span>
                </div>

                <div class="setting-row">
                    <div>
                        <h3>🌍 Global Rankings</h3>
                        <p>Track billionaires around the world</p>
                    </div>

                    <span class="status-badge">
                        ACTIVE
                    </span>
                </div>

            </div>

        </div>
    `;

    updateNavigation("profile");
}

// ================================
// DARK MODE
// ================================

function toggleDarkMode(enabled) {

    document.body.classList.toggle(
        "light-mode",
        !enabled
    );

    localStorage.setItem(
        "worldelite_dark_mode",
        enabled ? "true" : "false"
    );
}

// ================================
// LOGOUT
// ================================

function logout() {

    localStorage.removeItem(USER_KEY);

    if (typeof showHome === "function") {
        showHome();
    } else {
        location.reload();
    }
}

// ================================
// NAVIGATION
// ================================

function updateNavigation(active) {

    document.querySelectorAll(
        ".bottom-nav button, .nav-item"
    ).forEach(button => {

        button.classList.remove("active");

        const target =
            button.dataset.page ||
            button.dataset.nav;

        if (target === active) {
            button.classList.add("active");
        }
    });
}

// ================================
// HELPERS
// ================================

function formatMoney(value) {

    if (value === undefined || value === null) {
        return "0";
    }

    const number =
        typeof value === "number"
            ? value
            : parseFloat(
                String(value)
                    .replace(/[$,]/g, "")
                    .replace(/B/gi, "")
            );

    if (isNaN(number)) {
        return String(value);
    }

    return number.toFixed(1) + "B";
}

function getFlag(country) {

    const flags = {

        "United States": "🇺🇸",
        "US": "🇺🇸",
        "USA": "🇺🇸",

        "United Kingdom": "🇬🇧",
        "UK": "🇬🇧",

        "France": "🇫🇷",
        "Germany": "🇩🇪",
        "Italy": "🇮🇹",
        "Spain": "🇪🇸",

        "Canada": "🇨🇦",
        "Australia": "🇦🇺",

        "China": "🇨🇳",
        "Hong Kong": "🇭🇰",
        "Japan": "🇯🇵",
        "South Korea": "🇰🇷",
        "India": "🇮🇳",

        "Russia": "🇷🇺",
        "Ukraine": "🇺🇦",

        "Turkey": "🇹🇷",
        "Sweden": "🇸🇪",
        "Switzerland": "🇨🇭",

        "Singapore": "🇸🇬",
        "Brazil": "🇧🇷",
        "Mexico": "🇲🇽",

        "Israel": "🇮🇱",
        "Saudi Arabia": "🇸🇦",
        "United Arab Emirates": "🇦🇪",

        "South Africa": "🇿🇦",
        "Nigeria": "🇳🇬",

        "Indonesia": "🇮🇩",
        "Thailand": "🇹🇭",
        "Malaysia": "🇲🇾",

        "Netherlands": "🇳🇱",
        "Belgium": "🇧🇪",
        "Norway": "🇳🇴",
        "Denmark": "🇩🇰",
        "Finland": "🇫🇮",

        "Ireland": "🇮🇪",
        "Austria": "🇦🇹",

        "Poland": "🇵🇱",
        "Portugal": "🇵🇹",

        "New Zealand": "🇳🇿"
    };

    return flags[country] || "🌍";
}

function escapeQuotes(text) {

    return String(text)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}

// ================================
// INITIAL DARK MODE
// ================================

(function initTheme() {

    const saved =
        localStorage.getItem(
            "worldelite_dark_mode"
        );

    if (saved === "false") {
        document.body.classList.add(
            "light-mode"
        );
    }

})();
