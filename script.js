/* =========================================================
   WORLDELITE — SCRIPT.JS
   ========================================================= */

const app = document.getElementById("app");

let currentUser = localStorage.getItem("worldEliteUser") || "";

let favorites = JSON.parse(
    localStorage.getItem("worldEliteFavorites") || "[]"
);

let billionaires = [];
let companies = [];

let dataLoaded = false;


/* =========================================================
   START
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    showStart();
});


/* =========================================================
   LOAD DATA
   ========================================================= */

async function loadData() {

    try {

        const response = await fetch(
            "data.json?cache=" + Date.now()
        );

        if (!response.ok) {
            throw new Error("Could not load data.json");
        }

        const data = await response.json();

        billionaires = Array.isArray(data.billionaires)
            ? data.billionaires
            : [];

        companies = Array.isArray(data.companies)
            ? data.companies
            : [];

        dataLoaded = true;

    } catch (error) {

        console.error(error);

        billionaires = [];
        companies = [];

        dataLoaded = false;
    }
}


/* =========================================================
   START PAGE
   ========================================================= */

function showStart() {

    app.innerHTML = `

        <div class="loading-screen">

            <div class="container">

                <div class="logo">
                    WE
                </div>

                <h1>
                    WORLD ELITE
                </h1>

                <p>
                    Wealth. Business. Power.
                </p>

                <button id="startBtn">
                    START
                </button>

            </div>

        </div>

    `;

    document.getElementById("startBtn").onclick = async () => {

        const button = document.getElementById("startBtn");

        button.disabled = true;
        button.textContent = "LOADING...";

        await loadData();

        showLogin();
    };
}


/* =========================================================
   LOGIN
   ========================================================= */

function showLogin() {

    app.innerHTML = `

        <div class="loading-screen">

            <div class="container">

                <div class="logo">
                    WE
                </div>

                <h1>
                    LOGIN
                </h1>

                <p>
                    Enter WorldElite
                </p>

                <input
                    id="loginEmail"
                    type="email"
                    placeholder="Email"
                >

                <input
                    id="loginPassword"
                    type="password"
                    placeholder="Password"
                >

                <button id="loginBtn">
                    LOGIN
                </button>

                <button
                    id="signupBtn"
                    class="secondary-btn"
                >
                    SIGN UP
                </button>

            </div>

        </div>

    `;

    document.getElementById("loginBtn").onclick = () => {

        const email = document
            .getElementById("loginEmail")
            .value
            .trim();

        if (!email) {

            alert("Please enter your email.");

            return;
        }

        currentUser = email;

        localStorage.setItem(
            "worldEliteUser",
            currentUser
        );

        showHome();
    };

    document.getElementById("signupBtn").onclick =
        showSignUp;
}


/* =========================================================
   SIGN UP
   ========================================================= */

function showSignUp() {

    app.innerHTML = `

        <div class="loading-screen">

            <div class="container">

                <div class="logo">
                    WE
                </div>

                <h1>
                    CREATE ACCOUNT
                </h1>

                <input
                    id="signupName"
                    type="text"
                    placeholder="Name"
                >

                <input
                    id="signupEmail"
                    type="email"
                    placeholder="Email"
                >

                <input
                    id="signupPassword"
                    type="password"
                    placeholder="Password"
                >

                <button id="createBtn">
                    CREATE ACCOUNT
                </button>

                <button
                    id="backLogin"
                    class="secondary-btn"
                >
                    BACK TO LOGIN
                </button>

            </div>

        </div>

    `;

    document.getElementById("createBtn").onclick = () => {

        const name = document
            .getElementById("signupName")
            .value
            .trim();

        const email = document
            .getElementById("signupEmail")
            .value
            .trim();

        const password = document
            .getElementById("signupPassword")
            .value;

        if (!name || !email || !password) {

            alert("Please complete all fields.");

            return;
        }

        currentUser = name;

        localStorage.setItem(
            "worldEliteUser",
            currentUser
        );

        showHome();
    };

    document.getElementById("backLogin").onclick =
        showLogin;
}


/* =========================================================
   HOME
   ========================================================= */

function showHome() {

    if (!dataLoaded) {
        loadData().then(showHome);
        return;
    }

    const richest = [...billionaires]
        .sort((a, b) => getWorth(b) - getWorth(a))[0];

    app.innerHTML = `

        <div class="container">

            <div class="top-section">

                <p>
                    WELCOME TO
                </p>

                <h1>
                    WORLD ELITE
                </h1>

                <p>
                    Global wealth and
                    business intelligence.
                </p>

            </div>

            ${
                richest
                ? `
                <div class="card">

                    <div class="rank">
                        #1 RICHEST
                    </div>

                    <div class="card-title">

                        ${getFlag(richest)}

                        ${escapeHTML(
                            richest.name || "Unknown"
                        )}

                    </div>

                    <div class="money">
                        ${formatWorth(richest)}
                    </div>

                    <p>
                        ${escapeHTML(
                            richest.company || "Unknown company"
                        )}
                    </p>

                </div>
                `
                : ""
            }

            <div class="stat-grid">

                <div class="stat">

                    <div class="stat-number">
                        ${billionaires.length}
                    </div>

                    <div class="stat-label">
                        People tracked
                    </div>

                </div>

                <div class="stat">

                    <div class="stat-number">
                        ${companies.length}
                    </div>

                    <div class="stat-label">
                        Companies
                    </div>

                </div>

            </div>

            <div
                class="card clickable"
                id="searchCard"
            >

                <div class="card-title">
                    🔎 Search WorldElite
                </div>

                <p>
                    Search people and companies
                </p>

            </div>

            <div
                class="card clickable"
                id="rankingCard"
            >

                <div class="card-title">
                    🏆 Global Rankings
                </div>

                <p>
                    Explore the world's wealthiest people
                </p>

            </div>

            <div
                class="card clickable"
                id="companyCard"
            >

                <div class="card-title">
                    🏢 Companies
                </div>

                <p>
                    Explore global companies
                </p>

            </div>

            <div
                class="card clickable"
                id="newsCard"
            >

                <div class="card-title">
                    📰 WorldElite News
                </div>

                <p>
                    Business and wealth news
                </p>

            </div>

        </div>

        ${navigation("home")}

    `;

    document.getElementById("searchCard").onclick =
        showGlobalSearch;

    document.getElementById("rankingCard").onclick =
        showBillionaires;

    document.getElementById("companyCard").onclick =
        showCompanies;

    document.getElementById("newsCard").onclick =
        showNews;

    setupNavigation();
}


/* =========================================================
   GLOBAL SEARCH
   ========================================================= */

function showGlobalSearch() {

    app.innerHTML = `

        <div class="container">

            <button
                class="back-btn"
                id="backHome"
            >
                ← Home
            </button>

            <h1>
                Search
            </h1>

            <p>
                Search across WorldElite
            </p>

            <input
                id="globalSearch"
                type="text"
                placeholder="🔎 Search..."
            >

            <div id="globalResults"></div>

        </div>

        ${navigation("home")}

    `;

    document.getElementById("backHome").onclick =
        showHome;

    document.getElementById("globalSearch").oninput =
        renderGlobalResults;

    renderGlobalResults();

    setupNavigation();
}


function renderGlobalResults() {

    const input =
        document.getElementById("globalSearch");

    const results =
        document.getElementById("globalResults");

    if (!input || !results) {
        return;
    }

    const query =
        input.value.toLowerCase().trim();

    if (!query) {

        results.innerHTML = `

            <div class="empty">

                <p>
                    Start typing to search.
                </p>

            </div>

        `;

        return;
    }

    const people = billionaires.filter(person => {

        const name =
            String(person.name || "").toLowerCase();

        const company =
            String(person.company || "").toLowerCase();

        const country =
            String(person.country || "").toLowerCase();

        return (
            name.includes(query) ||
            company.includes(query) ||
            country.includes(query)
        );
    });

    const business = companies.filter(company => {

        const name =
            String(company.name || "").toLowerCase();

        const sector =
            String(company.sector || "").toLowerCase();

        const founder =
            String(company.founder || "").toLowerCase();

        return (
            name.includes(query) ||
            sector.includes(query) ||
            founder.includes(query)
        );
    });

    let html = "";

    if (people.length) {

        html += `<h2>People</h2>`;

        people.forEach(person => {

            html += `

                <div
                    class="card clickable"
                    data-person="${person.id}"
                >

                    <div class="card-title">

                        ${getFlag(person)}

                        ${escapeHTML(
                            person.name || "Unknown"
                        )}

                    </div>

                    <div class="card-subtitle">

                        ${escapeHTML(
                            person.company || "Unknown"
                        )}

                    </div>

                    <div class="money">
                        ${formatWorth(person)}
                    </div>

                </div>

            `;
        });
    }

    if (business.length) {

        html += `<h2>Companies</h2>`;

        business.forEach(company => {

            html += `

                <div class="card clickable">

                    <div class="card-title">
                        🏢
                        ${escapeHTML(
                            company.name || "Unknown"
                        )}
                    </div>

                    <div class="card-subtitle">
                        ${escapeHTML(
                            company.sector || "Unknown sector"
                        )}
                    </div>

                    <p>
                        ${escapeHTML(
                            company.founder || "Unknown"
                        )}
                    </p>

                </div>

            `;
        });
    }

    if (!people.length && !business.length) {

        html = `

            <div class="empty">

                <p>
                    No results found.
                </p>

            </div>

        `;
    }

    results.innerHTML = html;

    document.querySelectorAll("[data-person]")
        .forEach(card => {

            card.onclick = () => {

                const id =
                    String(card.dataset.person);

                const person =
                    billionaires.find(
                        item => String(item.id) === id
                    );

                if (person) {
                    showBillionaireDetails(person);
                }
            };
        });
}


/* =========================================================
   RANKINGS
   ========================================================= */

function showBillionaires() {

    app.innerHTML = `

        <div class="container">

            <div class="top-section">

                <h1>
                    Rankings
                </h1>

                <p>
                    World's wealthiest people
                </p>

            </div>

            <div class="card">

                <div class="card-title">
                    🟢 LIVE DATA
                </div>

                <p>
                    ${billionaires.length}
                    billionaires tracked
                </p>

                <p>
                    Data is loaded automatically
                    from data.json.
                </p>

                <button id="refreshDataBtn">
                    🔄 Refresh Data
                </button>

            </div>

            <input
                id="searchInput"
                type="text"
                placeholder="🔎 Search billionaire"
            >

            <div class="controls">

                <select id="countryFilter">

                    <option value="all">
                        🌍 All Countries
                    </option>

                </select>

                <select id="sortSelect">

                    <option value="high">
                        💰 Highest
                    </option>

                    <option value="low">
                        💰 Lowest
                    </option>

                    <option value="name">
                        🔤 A-Z
                    </option>

                </select>

            </div>

            <div id="billionaireList"></div>

        </div>

        ${navigation("billionaires")}

    `;

    buildCountryFilter();

    document.getElementById("searchInput").oninput =
        renderBillionaires;

    document.getElementById("countryFilter").onchange =
        renderBillionaires;

    document.getElementById("sortSelect").onchange =
        renderBillionaires;

    document.getElementById("refreshDataBtn").onclick =
        refreshWorldEliteData;

    renderBillionaires();

    setupNavigation();
}


/* =========================================================
   COUNTRY FILTER
   ========================================================= */

function buildCountryFilter() {

    const select =
        document.getElementById("countryFilter");

    if (!select) return;

    const countries = [...new Set(

        billionaires

            .map(person =>
                normalizeCountry(person.country)
            )

            .filter(country =>
                country &&
                country.toLowerCase() !== "unknown"
            )

    )].sort((a, b) =>
        a.localeCompare(b)
    );

    countries.forEach(country => {

        const option =
            document.createElement("option");

        option.value = country;

        option.textContent =
            getCountryFlag(country) +
            " " +
            country;

        select.appendChild(option);
    });
}


/* =========================================================
   RENDER RANKINGS
   ========================================================= */

function renderBillionaires() {

    const searchElement =
        document.getElementById("searchInput");

    const countryElement =
        document.getElementById("countryFilter");

    const sortElement =
        document.getElementById("sortSelect");

    const container =
        document.getElementById("billionaireList");

    if (
        !searchElement ||
        !countryElement ||
        !sortElement ||
        !container
    ) {
        return;
    }

    const search =
        searchElement.value
            .toLowerCase()
            .trim();

    const country =
        countryElement.value;

    const sort =
        sortElement.value;

    let list = billionaires.filter(person => {

        const name =
            String(person.name || "")
                .toLowerCase();

        const company =
            String(person.company || "")
                .toLowerCase();

        const personCountry =
            normalizeCountry(person.country);

        const matchesSearch =
            !search ||
            name.includes(search) ||
            company.includes(search);

        const matchesCountry =
            country === "all" ||
            personCountry === country;

        return (
            matchesSearch &&
            matchesCountry
        );
    });

    if (sort === "high") {

        list.sort(
            (a, b) =>
                getWorth(b) - getWorth(a)
        );
    }

    if (sort === "low") {

        list.sort(
            (a, b) =>
                getWorth(a) - getWorth(b)
        );
    }

    if (sort === "name") {

        list.sort(
            (a, b) =>
                String(a.name || "")
                    .localeCompare(
                        String(b.name || "")
                    )
        );
    }

    if (!list.length) {

        container.innerHTML = `

            <div class="empty">

                <p>
                    No billionaires found.
                </p>

            </div>

        `;

        return;
    }

    container.innerHTML = "";

    list.forEach((person, index) => {

        const card =
            document.createElement("div");

        card.className =
            "card clickable";

        const isFavorite =
            favorites.includes(person.id);

        card.innerHTML = `

            <button class="favorite">

                ${
                    isFavorite
                    ? "⭐"
                    : "☆"
                }

            </button>

            <div class="rank">
                #${index + 1}
            </div>

            <div class="card-title">

                ${getFlag(person)}

                ${escapeHTML(
                    person.name || "Unknown"
                )}

            </div>

            <div class="card-subtitle">

                ${escapeHTML(
                    person.company || "Unknown company"
                )}

            </div>

            <div class="money">

                ${formatWorth(person)}

            </div>

        `;

        const favoriteButton =
            card.querySelector(".favorite");

        favoriteButton.onclick = event => {

            event.stopPropagation();

            toggleFavorite(person.id);

            renderBillionaires();
        };

        card.onclick = () => {

            showBillionaireDetails(person);
        };

        container.appendChild(card);
    });
}


/* =========================================================
   PERSON DETAILS
   ========================================================= */

function showBillionaireDetails(person) {

    const isFavorite =
        favorites.includes(person.id);

    app.innerHTML = `

        <div class="container">

            <button
                class="back-btn"
                id="backBtn"
            >
                ← Rankings
            </button>

            <div class="profile-card">

                <div class="profile-icon">
                    ${getFlag(person)}
                </div>

                <h1>
                    ${escapeHTML(
                        person.name || "Unknown"
                    )}
                </h1>

                <p>
                    ${escapeHTML(
                        normalizeCountry(
                            person.country
                        ) || "Unknown country"
                    )}
                </p>

                <div class="big-money">
                    ${formatWorth(person)}
                </div>

                <p>
                    Estimated Net Worth
                </p>

                <p>
                    🏢
                    ${escapeHTML(
                        person.company || "Unknown company"
                    )}
                </p>

                <button id="favoriteBtn">

                    ${
                        isFavorite
                        ? "⭐ Remove Favorite"
                        : "☆ Add Favorite"
                    }

                </button>

            </div>

            <div class="card">

                <div class="card-title">
                    📊 Wealth
                </div>

                <p>
                    Current estimated net worth:
                    ${formatWorth(person)}
                </p>

            </div>

        </div>

        ${navigation("billionaires")}

    `;

    document.getElementById("backBtn").onclick =
        showBillionaires;

    document.getElementById("favoriteBtn").onclick =
        () => {

            toggleFavorite(person.id);

            showBillionaireDetails(person);
        };

    setupNavigation();
}


/* =========================================================
   COMPANIES
   ========================================================= */

function showCompanies() {

    app.innerHTML = `

        <div class="container">

            <h1>
                Companies
            </h1>

            <p>
                Major global businesses
            </p>

            <input
                id="companySearch"
                type="text"
                placeholder="🔎 Search company"
            >

            <div id="companyList"></div>

        </div>

        ${navigation("companies")}

    `;

    document.getElementById("companySearch").oninput =
        renderCompanies;

    renderCompanies();

    setupNavigation();
}


function renderCompanies() {

    const input =
        document.getElementById("companySearch");

    const container =
        document.getElementById("companyList");

    if (!input || !container) return;

    const query =
        input.value
            .toLowerCase()
            .trim();

    const list =
        companies.filter(company => {

            const name =
                String(company.name || "")
                    .toLowerCase();

            const sector =
                String(company.sector || "")
                    .toLowerCase();

            const founder =
                String(company.founder || "")
                    .toLowerCase();

            return (
                !query ||
                name.includes(query) ||
                sector.includes(query) ||
                founder.includes(query)
            );
        });

    if (!list.length) {

        container.innerHTML = `

            <div class="empty">

                <p>
                    No companies found.
                </p>

            </div>

        `;

        return;
    }

    container.innerHTML = "";

    list.forEach(company => {

        const card =
            document.createElement("div");

        card.className =
            "card clickable";

        card.innerHTML = `

            <div class="card-title">

                🏢
                ${escapeHTML(
                    company.name || "Unknown"
                )}

            </div>

            <div class="card-subtitle">

                ${escapeHTML(
                    company.sector || "Unknown sector"
                )}

            </div>

            <p>

                Founder / Leader:
                ${escapeHTML(
                    company.founder || "Unknown"
                )}

            </p>

        `;

        container.appendChild(card);
    });
}


/* =========================================================
   NEWS
   ========================================================= */

function showNews() {

    app.innerHTML = `

        <div class="container">

            <div class="top-section">

                <h1>
                    News
                </h1>

                <p>
                    World business intelligence
                </p>

            </div>

            <div class="card">

                <div class="rank">
                    WORLD ELITE
                </div>

                <div class="card-title">
                    📰 Live News
                </div>

                <p>
                    Business and wealth news
                    integration.
                </p>

            </div>

            <div class="card">

                <div class="card-title">
                    💰 Wealth
                </div>

                <p>
                    Track billionaire wealth
                    and rankings.
                </p>

            </div>

            <div class="card">

                <div class="card-title">
                    🏢 Business
                </div>

                <p>
                    Follow companies,
                    markets and entrepreneurs.
                </p>

            </div>

        </div>

        ${navigation("home")}

    `;

    setupNavigation();
}


/* =========================================================
   FAVORITES
   ========================================================= */

function showFavorites() {

    const list =
        billionaires.filter(person =>
            favorites.includes(person.id)
        );

    app.innerHTML = `

        <div class="container">

            <h1>
                Favorites
            </h1>

            <p>
                Your saved people
            </p>

            <div id="favoriteList"></div>

        </div>

        ${navigation("profile")}

    `;

    const container =
        document.getElementById("favoriteList");

    if (!list.length) {

        container.innerHTML = `

            <div class="empty">

                <p>
                    No favorites yet.
                </p>

                <button id="exploreBtn">
                    Explore Rankings
                </button>

            </div>

        `;

        document.getElementById("exploreBtn").onclick =
            showBillionaires;

        setupNavigation();

        return;
    }

    list.forEach(person => {

        const card =
            document.createElement("div");

        card.className =
            "card clickable";

        card.innerHTML = `

            <div class="card-title">

                ${getFlag(person)}

                ${escapeHTML(
                    person.name || "Unknown"
                )}

            </div>

            <div class="money">
                ${formatWorth(person)}
            </div>

            <p>
                ${escapeHTML(
                    person.company || "Unknown company"
                )}
            </p>

        `;

        card.onclick = () =>
            showBillionaireDetails(person);

        container.appendChild(card);
    });

    setupNavigation();
}


/* =========================================================
   PROFILE
   ========================================================= */

function showProfile() {

    app.innerHTML = `

        <div class="container">

            <div class="profile-card">

                <div class="profile-icon">
                    👤
                </div>

                <h1>
                    ${
                        escapeHTML(
                            currentUser || "Guest"
                        )
                    }
                </h1>

                <p>
                    WorldElite Member
                </p>

            </div>

            <div class="stat-grid">

                <div class="stat">

                    <div class="stat-number">
                        ${favorites.length}
                    </div>

                    <div class="stat-label">
                        Favorites
                    </div>

                </div>

                <div class="stat">

                    <div class="stat-number">
                        ${billionaires.length}
                    </div>

                    <div class="stat-label">
                        People tracked
                    </div>

                </div>

            </div>

            <button id="favoritesBtn">
                ⭐ My Favorites
            </button>

            <button
                id="logoutBtn"
                class="secondary-btn"
            >
                LOG OUT
            </button>

        </div>

        ${navigation("profile")}

    `;

    document.getElementById("favoritesBtn").onclick =
        showFavorites;

    document.getElementById("logoutBtn").onclick =
        () => {

            localStorage.removeItem(
                "worldEliteUser"
            );

            currentUser = "";

            showLogin();
        };

    setupNavigation();
}


/* =========================================================
   FAVORITE SYSTEM
   ========================================================= */

function toggleFavorite(id) {

    if (favorites.includes(id)) {

        favorites =
            favorites.filter(
                item => item !== id
            );

    } else {

        favorites.push(id);
    }

    localStorage.setItem(
        "worldEliteFavorites",
        JSON.stringify(favorites)
    );
}


/* =========================================================
   REFRESH DATA
   ========================================================= */

async function refreshWorldEliteData() {

    const button =
        document.getElementById("refreshDataBtn");

    if (button) {

        button.disabled = true;
        button.textContent = "⏳ Updating...";
    }

    try {

        await loadData();

        showBillionaires();

    } catch (error) {

        console.error(error);

        alert("Could not refresh data.");

        if (button) {

            button.disabled = false;
            button.textContent = "🔄 Refresh Data";
        }
    }
}


/* =========================================================
   NAVIGATION
   ========================================================= */

function navigation(active) {

    return `

        <div class="bottom-nav">

            <button
                class="nav-item ${
                    active === "home"
                    ? "active"
                    : ""
                }"
                data-nav="home"
            >

                <span class="nav-icon">
                    🏠
                </span>

                Home

            </button>

            <button
                class="nav-item ${
                    active === "billionaires"
                    ? "active"
                    : ""
                }"
                data-nav="billionaires"
            >

                <span class="nav-icon">
                    🏆
                </span>

                Rankings

            </button>

            <button
                class="nav-item ${
                    active === "companies"
                    ? "active"
                    : ""
                }"
                data-nav="companies"
            >

                <span class="nav-icon">
                    🏢
                </span>

                Companies

            </button>

            <button
                class="nav-item ${
                    active === "profile"
                    ? "active"
                    : ""
                }"
                data-nav="profile"
            >

                <span class="nav-icon">
                    👤
                </span>

                Profile

            </button>

        </div>

    `;
}


function setupNavigation() {

    document
        .querySelectorAll("[data-nav]")
        .forEach(button => {

            button.onclick = () => {

                const page =
                    button.dataset.nav;

                if (page === "home") {
                    showHome();
                }

                if (page === "billionaires") {
                    showBillionaires();
                }

                if (page === "companies") {
                    showCompanies();
                }

                if (page === "profile") {
                    showProfile();
                }
            };
        });
}


/* =========================================================
   DATA HELPERS
   ========================================================= */

function getWorth(person) {

    if (typeof person.worth === "number") {
        return person.worth;
    }

    const value =
        parseFloat(
            String(
                person.netWorth ||
                person.net_worth ||
                person.estimatedNetWorth ||
                "0"
            )
            .replace(/[^0-9.]/g, "")
        );

    return Number.isFinite(value)
        ? value
        : 0;
}


function formatWorth(person) {

    if (person.netWorth) {

        return escapeHTML(
            String(person.netWorth)
        );
    }

    const worth =
        getWorth(person);

    if (!worth) {
        return "Unknown";
    }

    return "$" +
        worth.toLocaleString(
            "en-US",
            {
                maximumFractionDigits: 1
            }
        ) +
        "B";
}


/* =========================================================
   COUNTRY / FLAG SYSTEM
   ========================================================= */

function normalizeCountry(country) {

    if (!country) {
        return "";
    }

    let value =
        String(country).trim();

    const flag =
        value.match(
            /[\u{1F1E6}-\u{1F1FF}]{2}/u
        );

    if (flag) {

        value =
            value
            .replace(flag[0], "")
            .trim();
    }

    return value;
}


function getFlag(person) {

    if (!person) {
        return "🌍";
    }

    if (person.flag && person.flag !== "🌍") {

        return person.flag;
    }

    const country =
        normalizeCountry(person.country);

    return getCountryFlag(country);
}


function getCountryFlag(country) {

    const codeMap = {

        "United States": "🇺🇸",
        "United States of America": "🇺🇸",
        "USA": "🇺🇸",
        "US": "🇺🇸",

        "United Kingdom": "🇬🇧",
        "UK": "🇬🇧",
        "Great Britain": "🇬🇧",

        "France": "🇫🇷",

        "Germany": "🇩🇪",

        "Italy": "🇮🇹",

        "Spain": "🇪🇸",

        "Portugal": "🇵🇹",

        "Ukraine": "🇺🇦",

        "Russia": "🇷🇺",

        "Turkey": "🇹🇷",

        "Azerbaijan": "🇦🇿",

        "China": "🇨🇳",

        "Hong Kong": "🇭🇰",

        "India": "🇮🇳",

        "Japan": "🇯🇵",

        "South Korea": "🇰🇷",

        "Singapore": "🇸🇬",

        "Canada": "🇨🇦",

        "Australia": "🇦🇺",

        "Brazil": "🇧🇷",

        "Mexico": "🇲🇽",

        "Switzerland": "🇨🇭",

        "Austria": "🇦🇹",

        "Netherlands": "🇳🇱",

        "Belgium": "🇧🇪",

        "Sweden": "🇸🇪",

        "Norway": "🇳🇴",

        "Denmark": "🇩🇰",

        "Finland": "🇫🇮",

        "Poland": "🇵🇱",

        "Czech Republic": "🇨🇿",

        "Czechia": "🇨🇿",

        "Israel": "🇮🇱",

        "Indonesia": "🇮🇩",

        "Thailand": "🇹🇭",

        "Malaysia": "🇲🇾",

        "Philippines": "🇵🇭",

        "South Africa": "🇿🇦",

        "Nigeria": "🇳🇬",

        "Egypt": "🇪🇬",

        "Saudi Arabia": "🇸🇦",

        "United Arab Emirates": "🇦🇪",

        "Qatar": "🇶🇦",

        "Kuwait": "🇰🇼",

        "Ireland": "🇮🇪",

        "New Zealand": "🇳🇿"

    };

    if (codeMap[country]) {
        return codeMap[country];
    }

    return "🌍";
}


/* =========================================================
   SECURITY / HTML
   ========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
