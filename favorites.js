// ===============================
// WORLDELITE — FAVORITES SYSTEM
// ===============================

const FAVORITES_KEY = "worldelite_favorites";

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

function isFavorite(name) {
    return getFavorites().some(person => person.name === name);
}

function toggleFavorite(person) {
    let favorites = getFavorites();

    const exists = favorites.some(item => item.name === person.name);

    if (exists) {
        favorites = favorites.filter(item => item.name !== person.name);
    } else {
        favorites.push({
            name: person.name,
            country: person.country || "Unknown",
            netWorth: person.netWorth || person.net_worth || 0,
            company: person.company || ""
        });
    }

    saveFavorites(favorites);

    updateFavoriteButton(person);
    renderFavorites();
}

function updateFavoriteButton(person) {
    const button = document.getElementById("favoriteButton");

    if (!button) return;

    if (isFavorite(person.name)) {
        button.innerHTML = "★ Remove Favorite";
        button.classList.add("favorited");
    } else {
        button.innerHTML = "☆ Add Favorite";
        button.classList.remove("favorited");
    }
}

function renderFavorites() {
    const container = document.getElementById("favoritesList");

    if (!container) return;

    const favorites = getFavorites();

    if (favorites.length === 0) {
        container.innerHTML = `
            <div class="empty-favorites">
                <div style="font-size:40px;">☆</div>
                <h3>No favorites yet</h3>
                <p>Add billionaires to your favorites to track them here.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = favorites.map(person => `
        <div class="favorite-card">
            <div>
                <h3>${escapeHTML(person.name)}</h3>
                <p>${escapeHTML(person.country)}</p>
            </div>

            <div class="favorite-worth">
                $${formatWorth(person.netWorth)}
            </div>

            <button
                class="remove-favorite"
                onclick='removeFavorite(${JSON.stringify(person.name)})'
            >
                Remove
            </button>
        </div>
    `).join("");
}

function removeFavorite(name) {
    let favorites = getFavorites();

    favorites = favorites.filter(person => person.name !== name);

    saveFavorites(favorites);

    renderFavorites();

    if (typeof currentPerson !== "undefined" && currentPerson) {
        updateFavoriteButton(currentPerson);
    }
}

function formatWorth(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "—";
    }

    if (number >= 1000) {
        return (number / 1000).toFixed(1) + "T";
    }

    return number.toFixed(1) + "B";
}

function escapeHTML(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

document.addEventListener("DOMContentLoaded", () => {
    renderFavorites();
});
