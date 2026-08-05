/* =========================================================
   WORLDELITE
   3000+ BILLIONAIRES
   SEARCH / RANKINGS / COUNTRIES / FAVORITES / PROFILE
========================================================= */

const app = document.getElementById("app");

let data = {
    billionaires: [],
    companies: []
};

let currentUser =
    localStorage.getItem("worldEliteUser") || "";

let favorites = JSON.parse(
    localStorage.getItem("worldEliteFavorites") || "[]"
);


/* =========================================================
   START
========================================================= */

init();

async function init() {

    await loadData();

    if (currentUser) {
        showHome();
    } else {
        showStart();
    }
}


/* =========================================================
   LOAD DATA
========================================================= */

async function loadData() {

    try {

        const response = await fetch(
            "data.json?t=" + Date.now()
        );

        if (!response.ok) {
            throw new Error("Could not load data.json");
        }

        data = await response.json();

        if (!Array.isArray(data.billionaires)) {
            data.billionaires = [];
        }

        if (!Array.isArray(data.companies)) {
            data.companies = [];
        }

        console.log(
            "WorldElite loaded:",
            data.billionaires.length,
            "billionaires"
        );

    } catch (error) {

        console.error(error);

        data = {
            billionaires: [],
            companies: []
        };

        alert(
            "WorldElite data could not be loaded."
        );
    }
}


/* =========================================================
   START SCREEN
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

    document.getElementById("startBtn").onclick =
        showLogin;
}


/* =========================================================
   LOGIN
========================================================= */

function showLogin() {

    app.innerHTML = `

        <div class="loading-screen">

            <div class="container">

                <h1>Login</h1>

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

    document.getElementById("loginBtn").onclick =
        function () {

            const email =
                document
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

                <h1>
                    Create Account
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
                    BACK
                </button>

            </div>

        </div>

    `;

    document.getElementById("createBtn").onclick =
        function () {

            const name =
                document
                    .getElementById("signupName")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("signupEmail")
                    .value
                    .trim();

            if (!name || !email) {

                alert(
                    "Please enter your name and email."
                );

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

    const richest =
        [...data.billionaires]
            .sort(
                (a, b) =>
                    Number(b.worth || 0) -
                    Number(a.worth || 0)
            )[0];

    app.innerHTML = `

        <div class="container">

            <div class="top-section">

                <div class="logo">
                    WE
                </div>

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

                <div
                    class="card clickable"
                    id="richestCard"
                >

                    <div class="rank">
                        #1 RICHEST
                    </div>

                    <div class="card-title">
                        ${getFlag(richest)}
                        ${escapeHTML(
                            getName(richest)
                        )}
                    </div>

                    <div class="money">
                        ${formatWorth(richest)}
                    </div>

                    <p>
                        ${escapeHTML(
                            getCompany(richest)
                        )}
                    </p>

                </div>

                `
                : ""
            }

            <div class="stat-grid">

                <div class="stat">

                    <div class="stat-number">
                        ${data.billionaires.length.toLocaleString()}
                    </div>

                    <div class="stat-label">
                        People tracked
                    </div>

                </div>

                <div class="stat">

                    <div class="stat-number">
                        ${data.companies.length.toLocaleString()}
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
                    Search 3,000+ billionaires
                    and companies
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
                    Explore the world's
                    wealthiest people
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

        </div>

        ${navigation("home")}

    `;

    const richestCard =
        document.getElementById("richestCard");

    if (richestCard) {

        richestCard.onclick =
            () => showBillionaireDetails(
                richest
            );
    }

    document.getElementById("searchCard").onclick =
        showGlobalSearch;

    document.getElementById("rankingCard").onclick =
        showBillionaires;

    document.getElementById("companyCard").onclick =
        showCompanies;

    setupNavigation();
}


/* =========================================================
   SEARCH
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
                Search WorldElite
            </p>

            <input
                id="globalSearch"
                type="text"
                placeholder="🔎 Search billionaire..."
                autocomplete="off"
            >

            <div
                id="globalResults"
            ></div>

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
        input.value
            .toLowerCase()
            .trim();

    if (!query) {

        results.innerHTML = `

            <div class="empty">

                <p>
                    Search by name, company
                    or country.
                </p>

            </div>

        `;

        return;
    }

    const people =
        data.billionaires
            .filter(person => {

                const name =
                    getName(person)
                        .toLowerCase();

                const company =
                    getCompany(person)
                        .toLowerCase();

                const country =
                    String(
                        person.country || ""
                    )
                    .toLowerCase();

                return (
                    name.includes(query) ||
                    company.includes(query) ||
                    country.includes(query)
                );

            })
            .slice(0, 100);

    const companies =
        data.companies
            .filter(company => {

                const name =
                    String(
                        company.name || ""
                    )
                    .toLowerCase();

                const sector =
                    String(
                        company.sector || ""
                    )
                    .toLowerCase();

                const founder =
                    String(
                        company.founder || ""
                    )
                    .toLowerCase();

                return (
                    name.includes(query) ||
                    sector.includes(query) ||
                    founder.includes(query)
                );

            })
            .slice(0, 50);

    let html = "";

    if (people.length) {

        html += `
            <h2>
                People
            </h2>
        `;

        people.forEach(person => {

            html += `

                <div
                    class="card clickable"
                    data-person-id="${getPersonId(person)}"
                >

                    <div class="card-title">
                        ${getFlag(person)}
                        ${escapeHTML(
                            getName(person)
                        )}
                    </div>

                    <div class="card-subtitle">
                        ${escapeHTML(
                            getCompany(person)
                        )}
                    </div>

                    <div class="money">
                        ${formatWorth(person)}
                    </div>

                </div>

            `;

        });
    }

    if (companies.length) {

        html += `
            <h2>
                Companies
            </h2>
        `;

        companies.forEach(company => {

            html += `

                <div class="card">

                    <div class="card-title">
                        🏢
                        ${escapeHTML(
                            company.name || "Unknown"
                        )}
                    </div>

                    <div class="card-subtitle">
                        ${escapeHTML(
                            company.sector || ""
                        )}
                    </div>

                    <p>
                        ${escapeHTML(
                            company.founder || ""
                        )}
                    </p>

                </div>

            `;

        });
    }

    if (!html) {

        html = `

            <div class="empty">

                <p>
                    No results found.
                </p>

            </div>

        `;
    }

    results.innerHTML = html;

    document
        .querySelectorAll("[data-person-id]")
        .forEach(card => {

            card.onclick = function () {

                const id =
                    card.dataset.personId;

                const person =
                    data.billionaires.find(
                        item =>
                            String(
                                getPersonId(item)
                            ) === String(id)
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
                    ${data.billionaires.length.toLocaleString()}
                    billionaires tracked
                </p>

            </div>

            <div class="card">

                <div class="card-title">
                    🌐 LIVE DATA
                </div>

                <p>
                    Data source:
                    ${escapeHTML(
                        data.source || "WorldElite"
                    )}
                </p>

                <p>
                    Updated:
                    ${formatDate(
                        data.lastUpdated
                    )}
                </p>

                <button id="refreshDataBtn">
                    🔄 Refresh
                </button>

            </div>

            <input
                id="searchInput"
                type="text"
                placeholder="🔎 Search billionaire"
                autocomplete="off"
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

    populateCountries();

    document.getElementById("refreshDataBtn").onclick =
        refreshWorldEliteData;

    document.getElementById("searchInput").oninput =
        renderBillionaires;

    document.getElementById("countryFilter").onchange =
        renderBillionaires;

    document.getElementById("sortSelect").onchange =
        renderBillionaires;

    renderBillionaires();

    setupNavigation();
}


/* =========================================================
   COUNTRIES
========================================================= */

function populateCountries() {

    const select =
        document.getElementById("countryFilter");

    if (!select) return;

    const countries =
        [...new Set(
            data.billionaires
                .map(person =>
                    String(
                        person.country || ""
                    ).trim()
                )
                .filter(Boolean)
        )]
        .sort((a, b) =>
            a.localeCompare(b)
        );

    countries.forEach(country => {

        const option =
            document.createElement("option");

        option.value = country;

        option.textContent =
            "🌍 " + country;

        select.appendChild(option);

    });
}


/* =========================================================
   RENDER RANKINGS
========================================================= */

function renderBillionaires() {

    const searchInput =
        document.getElementById("searchInput");

    const countryFilter =
        document.getElementById("countryFilter");

    const sortSelect =
        document.getElementById("sortSelect");

    const container =
        document.getElementById("billionaireList");

    if (
        !searchInput ||
        !countryFilter ||
        !sortSelect ||
        !container
    ) {
        return;
    }

    const search =
        searchInput.value
            .toLowerCase()
            .trim();

    const country =
        countryFilter.value;

    const sort =
        sortSelect.value;

    let list =
        data.billionaires.filter(person => {

            const name =
                getName(person)
                    .toLowerCase();

            const company =
                getCompany(person)
                    .toLowerCase();

            const personCountry =
                String(
                    person.country || ""
                );

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
                getWorthNumber(b) -
                getWorthNumber(a)
        );

    }

    if (sort === "low") {

        list.sort(
            (a, b) =>
                getWorthNumber(a) -
                getWorthNumber(b)
        );

    }

    if (sort === "name") {

        list.sort(
            (a, b) =>
                getName(a)
                    .localeCompare(
                        getName(b)
                    )
        );

    }

    const fragment =
        document.createDocumentFragment();

    const maxToDisplay = 200;

    list.slice(0, maxToDisplay)
        .forEach((person, index) => {

            const card =
                document.createElement("div");

            card.className =
                "card clickable";

            const favorite =
                isFavorite(person);

            card.innerHTML = `

                <button
                    class="favorite"
                    type="button"
                >
                    ${
                        favorite
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
                        getName(person)
                    )}
                </div>

                <div class="card-subtitle">
                    ${escapeHTML(
                        getCompany(person)
                    )}
                </div>

                <div class="money">
                    ${formatWorth(person)}
                </div>

            `;

            const favoriteButton =
                card.querySelector(".favorite");

            favoriteButton.onclick =
                function(event) {

                    event.stopPropagation();

                    toggleFavorite(
                        getPersonId(person)
                    );

                    renderBillionaires();
                };

            card.onclick =
                function() {

                    showBillionaireDetails(
                        person
                    );

                };

            fragment.appendChild(card);

        });

    container.innerHTML = "";

    container.appendChild(fragment);

    if (list.length > maxToDisplay) {

        const info =
            document.createElement("div");

        info.className = "empty";

        info.innerHTML = `

            <p>
                Showing first ${maxToDisplay}
                results.
            </p>

            <p>
                Use search or country filters
                to find more.
            </p>

        `;

        container.appendChild(info);
    }

    if (!list.length) {

        container.innerHTML = `

            <div class="empty">

                <p>
                    No billionaires found.
                </p>

            </div>

        `;
    }
}


/* =========================================================
   BILLIONAIRE DETAILS
========================================================= */

function showBillionaireDetails(person) {

    const favorite =
        isFavorite(person);

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
                        getName(person)
                    )}
                </h1>

                <p>
                    ${escapeHTML(
                        person.country || ""
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
                        getCompany(person)
                    )}
                </p>

                <button id="favoriteBtn">

                    ${
                        favorite
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

            <div class="card">

                <div class="card-title">
                    🌐 WorldElite Data
                </div>

                <p>
                    Source:
                    ${escapeHTML(
                        data.source || "WorldElite"
                    )}
                </p>

                <p>
                    Updated:
                    ${formatDate(
                        data.lastUpdated
                    )}
                </p>

            </div>

        </div>

        ${navigation("billionaires")}

    `;

    document.getElementById("backBtn").onclick =
        showBillionaires;

    document.getElementById("favoriteBtn").onclick =
        function() {

            toggleFavorite(
                getPersonId(person)
            );

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
                Global businesses
            </p>

            <input
                id="companySearch"
                type="text"
                placeholder="🔎 Search company"
                autocomplete="off"
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

    if (!input || !container) {
        return;
    }

    const query =
        input.value
            .toLowerCase()
            .trim();

    const list =
        data.companies.filter(company => {

            const name =
                String(
                    company.name || ""
                )
                .toLowerCase();

            const sector =
                String(
                    company.sector || ""
                )
                .toLowerCase();

            const founder =
                String(
                    company.founder || ""
                )
                .toLowerCase();

            return (
                !query ||
                name.includes(query) ||
                sector.includes(query) ||
                founder.includes(query)
            );

        });

    container.innerHTML = "";

    list.forEach(company => {

        const card =
            document.createElement("div");

        card.className = "card";

        card.innerHTML = `

            <div class="card-title">
                🏢
                ${escapeHTML(
                    company.name || "Unknown"
                )}
            </div>

            <div class="card-subtitle">
                ${escapeHTML(
                    company.sector || ""
                )}
            </div>

            <p>
                Founder / Leader:
                ${escapeHTML(
                    company.founder || ""
                )}
            </p>

        `;

        container.appendChild(card);

    });

    if (!list.length) {

        container.innerHTML = `

            <div class="empty">

                <p>
                    No companies found.
                </p>

            </div>

        `;
    }
}


/* =========================================================
   FAVORITES
========================================================= */

function showFavorites() {

    const list =
        data.billionaires.filter(
            person =>
                favorites.includes(
                    getPersonId(person)
                )
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
        document.getElementById(
            "favoriteList"
        );

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
                    getName(person)
                )}
            </div>

            <div class="money">
                ${formatWorth(person)}
            </div>

            <p>
                ${escapeHTML(
                    getCompany(person)
                )}
            </p>

        `;

        card.onclick =
            () =>
                showBillionaireDetails(
                    person
                );

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
                    ${escapeHTML(
                        currentUser || "Guest"
                    )}
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
                        ${data.billionaires.length.toLocaleString()}
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
        function() {

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

function isFavorite(person) {

    return favorites.includes(
        getPersonId(person)
    );
}


function toggleFavorite(id) {

    const numericId =
        String(id);

    const exists =
        favorites.some(
            item =>
                String(item) === numericId
        );

    if (exists) {

        favorites =
            favorites.filter(
                item =>
                    String(item) !== numericId
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
   REFRESH
========================================================= */

async function refreshWorldEliteData() {

    const button =
        document.getElementById(
            "refreshDataBtn"
        );

    if (button) {

        button.innerText =
            "⏳ Loading...";

        button.disabled = true;
    }

    await loadData();

    showBillionaires();
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

            button.onclick =
                function() {

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

function getName(person) {

    return String(
        person.name ||
        person.fullName ||
        person.personName ||
        person.person ||
        "Unknown"
    );
}


function getCompany(person) {

    return String(
        person.company ||
        person.sourceOfWealth ||
        person.source ||
        "Business"
    );
}


function getPersonId(person) {

    return (
        person.id ??
        person.personId ??
        person.rank ??
        getName(person)
    );
}


function getWorthNumber(person) {

    const value =
        person.worth ??
        person.netWorth ??
        person.net_worth ??
        0;

    if (typeof value === "number") {
        return value;
    }

    const cleaned =
        String(value)
            .replace(/[$,]/g, "")
            .replace(/B/gi, "")
            .trim();

    const number =
        parseFloat(cleaned);

    return Number.isFinite(number)
        ? number
        : 0;
}


function formatWorth(person) {

    if (
        person.netWorth !== undefined &&
        person.netWorth !== null &&
        String(person.netWorth).trim() !== ""
    ) {

        return escapeHTML(
            String(person.netWorth)
        );
    }

    const worth =
        getWorthNumber(person);

    return "$" +
        worth.toLocaleString(
            undefined,
            {
                maximumFractionDigits: 1
            }
        ) +
        "B";
}


function getFlag(person) {

    if (person.flag) {
        return person.flag;
    }

    const country =
        String(
            person.country || ""
        ).toLowerCase();

    if (
        country.includes("united states") ||
        country === "usa" ||
        country === "us"
    ) {
        return "🇺🇸";
    }

    if (
        country.includes("france")
    ) {
        return "🇫🇷";
    }

    if (
        country.includes("united kingdom") ||
        country === "uk"
    ) {
        return "🇬🇧";
    }

    if (
        country.includes("germany")
    ) {
        return "🇩🇪";
    }

    if (
        country.includes("india")
    ) {
        return "🇮🇳";
    }

    if (
        country.includes("china")
    ) {
        return "🇨🇳";
    }

    if (
        country.includes("ukraine")
    ) {
        return "🇺🇦";
    }

    return "🌍";
}


function formatDate(date) {

    if (!date) {
        return "Unknown";
    }

    const parsed =
        new Date(date);

    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {
        return String(date);
    }

    return parsed.toLocaleString();
}


/* =========================================================
   SECURITY
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
