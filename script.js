let billionaires = [];
let currentSort = "highest";
let previousPage = "rankingsPage";

let favorites =
    JSON.parse(localStorage.getItem("worldelite_favorites") || "[]");


/* =========================
   LOAD DATA
========================= */

async function loadData() {

    try {

        const response = await fetch("data.json", {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Could not load data.json");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
            billionaires = data;
        } else if (Array.isArray(data.billionaires)) {
            billionaires = data.billionaires;
        } else if (Array.isArray(data.data)) {
            billionaires = data.data;
        } else {
            billionaires = [];
        }

        normalizeData();

        updateStats();
        populateCountries();
        renderHome();
        renderRankings();
        renderCompanies();
        renderFavorites();

    } catch (error) {

        console.error(error);

        document.getElementById("homeList").innerHTML =
            `<div class="empty">
                Could not load billionaire data.
             </div>`;

    }
}


/* =========================
   NORMALIZE DATA
========================= */

function normalizeData() {

    billionaires = billionaires.map((person, index) => {

        const name =
            person.name ||
            person.fullName ||
            person.personName ||
            "Unknown";

        let worth =
            person.netWorth ??
            person.net_worth ??
            person.estimatedNetWorth ??
            person.wealth ??
            0;

        if (typeof worth === "string") {

            worth = worth
                .replace(/[$,]/g, "")
                .replace(/B/gi, "")
                .trim();

            worth = parseFloat(worth) || 0;

        }

        let country =
            person.country ||
            person.countryCode ||
            person.nationality ||
            "Unknown";

        let company =
            person.company ||
            person.companyName ||
            person.source ||
            "Private / Various";

        return {
            ...person,
            id: person.id || index + "-" + name,
            name,
            netWorth: Number(worth),
            country,
            company
        };

    });

}


/* =========================
   PAGE NAVIGATION
========================= */

function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active");
    }

    updateNavigation(pageId);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (pageId === "rankingsPage") {
        renderRankings();
    }

    if (pageId === "profilePage") {
        renderFavorites();
    }
}


function updateNavigation(pageId) {

    document.querySelectorAll(".bottom-nav button")
        .forEach(button => button.classList.remove("active"));

    if (pageId === "homePage") {
        document.getElementById("navHome").classList.add("active");
    }

    if (pageId === "rankingsPage") {
        document.getElementById("navRankings").classList.add("active");
    }

    if (pageId === "companiesPage") {
        document.getElementById("navCompanies").classList.add("active");
    }

    if (pageId === "profilePage") {
        document.getElementById("navProfile").classList.add("active");
    }

}


/* =========================
   STATS
========================= */

function updateStats() {

    document.getElementById("totalBillionaires").textContent =
        billionaires.length.toLocaleString();

    const countries = new Set(
        billionaires
            .map(x => x.country)
            .filter(x =>
                x &&
                x.toLowerCase() !== "unknown"
            )
    );

    document.getElementById("totalCountries").textContent =
        countries.size.toLocaleString();
}


/* =========================
   HOME
========================= */

function renderHome() {

    const container = document.getElementById("homeList");

    const list = [...billionaires]
        .sort((a, b) => b.netWorth - a.netWorth)
        .slice(0, 5);

    container.innerHTML = list
        .map((person, index) =>
            createBillionaireCard(person, index + 1)
        )
        .join("");
}


/* =========================
   RANKINGS
========================= */

function setSort(type) {

    currentSort = type;

    document.getElementById("highestBtn")
        .classList.toggle("active", type === "highest");

    document.getElementById("lowestBtn")
        .classList.toggle("active", type === "lowest");

    renderRankings();
}


function renderRankings() {

    const container =
        document.getElementById("rankingsList");

    if (!container) return;

    const search =
        (document.getElementById("searchInput")?.value || "")
            .toLowerCase()
            .trim();

    const country =
        document.getElementById("countryFilter")?.value || "all";

    let list = [...billionaires];

    if (search) {

        list = list.filter(person =>
            person.name.toLowerCase().includes(search) ||
            String(person.company).toLowerCase().includes(search) ||
            String(person.country).toLowerCase().includes(search)
        );

    }

    if (country !== "all") {

        list = list.filter(person =>
            person.country === country
        );

    }

    list.sort((a, b) => {

        if (currentSort === "lowest") {
            return a.netWorth - b.netWorth;
        }

        return b.netWorth - a.netWorth;

    });

    if (!list.length) {

        container.innerHTML =
            `<div class="empty">
                No billionaires found.
             </div>`;

        return;
    }

    container.innerHTML = list
        .map((person, index) =>
            createBillionaireCard(person, index + 1)
        )
        .join("");
}


/* =========================
   BILLIONAIRE CARD
========================= */

function createBillionaireCard(person, rank) {

    const isFavorite =
        favorites.includes(String(person.id));

    return `
        <div class="billionaire-card">

            <div class="rank">
                #${rank}
            </div>

            <div
                class="avatar"
                onclick="openBillionaire('${escapeAttribute(person.id)}')"
            >
                👤
            </div>

            <div
                class="card-info"
                onclick="openBillionaire('${escapeAttribute(person.id)}')"
            >

                <h3>${escapeHTML(person.name)}</h3>

                <p>
                    ${countryFlag(person.country)}
                    ${escapeHTML(person.country)}
                </p>

            </div>

            <div class="card-worth">

                <strong>
                    ${formatMoney(person.netWorth)}
                </strong>

                <small>
                    ${escapeHTML(person.company)}
                </small>

            </div>

            <button
                class="favorite"
                onclick="toggleFavorite('${escapeAttribute(person.id)}')"
            >
                ${isFavorite ? "★" : "☆"}
            </button>

        </div>
    `;
}


/* =========================
   DETAIL
========================= */

function openBillionaire(id) {

    const person = billionaires.find(
        x => String(x.id) === String(id)
    );

    if (!person) return;

    previousPage =
        document.querySelector(".page.active")?.id ||
        "rankingsPage";

    const isFavorite =
        favorites.includes(String(person.id));

    document.getElementById("detailContent").innerHTML = `

        <div class="detail-card">

            <div class="detail-avatar">
                👤
            </div>

            <h1>
                ${escapeHTML(person.name)}
            </h1>

            <div class="detail-country">
                ${countryFlag(person.country)}
                ${escapeHTML(person.country)}
            </div>

            <div class="detail-worth">
                ${formatMoney(person.netWorth)}
            </div>

            <div class="detail-label">
                Estimated Net Worth
            </div>

            <div class="detail-company">
                🏢 ${escapeHTML(person.company)}
            </div>

            <button
                class="favorite-big"
                onclick="toggleFavorite('${escapeAttribute(person.id)}'); openBillionaire('${escapeAttribute(person.id)}')"
            >
                ${isFavorite ? "★ Remove Favorite" : "☆ Add Favorite"}
            </button>

        </div>

        <div class="hero" style="margin-top:20px;text-align:left">

            <h2>📊 Wealth</h2>

            <p>
                Current estimated net worth:
                <strong>${formatMoney(person.netWorth)}</strong>
            </p>

        </div>
    `;

    showPage("detailPage");
}


function goBack() {
    showPage(previousPage);
}


/* =========================
   FAVORITES
========================= */

function toggleFavorite(id) {

    id = String(id);

    if (favorites.includes(id)) {

        favorites =
            favorites.filter(item => item !== id);

    } else {

        favorites.push(id);

    }

    localStorage.setItem(
        "worldelite_favorites",
        JSON.stringify(favorites)
    );

    renderHome();
    renderRankings();
    renderFavorites();
}


function renderFavorites() {

    const container =
        document.getElementById("favoritesList");

    if (!container) return;

    const list = billionaires.filter(person =>
        favorites.includes(String(person.id))
    );

    if (!list.length) {

        container.innerHTML =
            `<div class="empty">
                You haven't added any favorites yet.
             </div>`;

        return;
    }

    container.innerHTML = list
        .map((person, index) =>
            createBillionaireCard(person, index + 1)
        )
        .join("");
}


/* =========================
   COUNTRIES
========================= */

function populateCountries() {

    const select =
        document.getElementById("countryFilter");

    if (!select) return;

    const countries = [...new Set(
        billionaires
            .map(person => person.country)
            .filter(country =>
                country &&
                country.toLowerCase() !== "unknown"
            )
    )].sort();

    select.innerHTML =
        `<option value="all">All countries</option>`;

    countries.forEach(country => {

        const option =
            document.createElement("option");

        option.value = country;
        option.textContent =
            countryFlag(country) + " " + country;

        select.appendChild(option);

    });

}


/* =========================
   COMPANIES
========================= */

function renderCompanies() {

    const container =
        document.getElementById("companiesList");

    if (!container) return;

    const companies = {};

    billionaires.forEach(person => {

        const company = person.company;

        if (
            !company ||
            company === "Private / Various" ||
            company === "Unknown"
        ) {
            return;
        }

        if (!companies[company]) {
            companies[company] = [];
        }

        companies[company].push(person.name);

    });

    const names =
        Object.keys(companies).sort();

    if (!names.length) {

        container.innerHTML =
            `<div class="empty">
                Company information is currently unavailable.
             </div>`;

        return;
    }

    container.innerHTML =
        names.map(company => `

            <div class="company-card">

                <h3>🏢 ${escapeHTML(company)}</h3>

                <p>
                    ${companies[company].length}
                    billionaire connection(s)
                </p>

            </div>

        `).join("");
}


/* =========================
   LOGIN / SIGNUP
========================= */

function login() {

    const name =
        prompt("Enter your name:");

    if (!name) return;

    const email =
        prompt("Enter your email:");

    if (!email) return;

    localStorage.setItem(
        "worldelite_user",
        JSON.stringify({
            name,
            email
        })
    );

    updateProfile();

}


function signup() {
    login();
}


function updateProfile() {

    const user =
        JSON.parse(
            localStorage.getItem("worldelite_user")
            || "null"
        );

    if (!user) return;

    document.getElementById("profileName")
        .textContent = user.name;

    document.getElementById("profileEmail")
        .textContent = user.email;

}


/* =========================
   FORMAT MONEY
========================= */

function formatMoney(value) {

    const number = Number(value) || 0;

    if (number >= 1000) {

        return "$" +
            (number / 1000)
                .toFixed(1)
                .replace(".0", "") +
            "T";

    }

    return "$" +
        number
            .toFixed(1)
            .replace(".0", "") +
        "B";
}


/* =========================
   COUNTRY FLAGS
========================= */

function countryFlag(country) {

    const map = {

        "United States": "🇺🇸",
        "United States of America": "🇺🇸",
        "US": "🇺🇸",

        "United Kingdom": "🇬🇧",
        "UK": "🇬🇧",

        "France": "🇫🇷",
        "Germany": "🇩🇪",
        "Italy": "🇮🇹",
        "Spain": "🇪🇸",

        "India": "🇮🇳",
        "China": "🇨🇳",
        "Japan": "🇯🇵",
        "South Korea": "🇰🇷",

        "Canada": "🇨🇦",
        "Australia": "🇦🇺",
        "Brazil": "🇧🇷",
        "Mexico": "🇲🇽",

        "Russia": "🇷🇺",
        "Ukraine": "🇺🇦",
        "Turkey": "🇹🇷",

        "Switzerland": "🇨🇭",
        "Singapore": "🇸🇬",
        "Israel": "🇮🇱",

        "Indonesia": "🇮🇩",
        "Thailand": "🇹🇭",

        "United Arab Emirates": "🇦🇪",
        "Saudi Arabia": "🇸🇦",

        "Nigeria": "🇳🇬",
        "South Africa": "🇿🇦",

        "Norway": "🇳🇴",
        "Sweden": "🇸🇪",
        "Denmark": "🇩🇰",
        "Netherlands": "🇳🇱",

        "Taiwan": "🇹🇼"

    };

    return map[country] || "🌍";
}


/* =========================
   SECURITY / HTML
========================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function escapeAttribute(value) {

    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}


/* =========================
   START
========================= */

document.addEventListener("DOMContentLoaded", () => {

    updateProfile();

    loadData();

    showPage("homePage");

});
