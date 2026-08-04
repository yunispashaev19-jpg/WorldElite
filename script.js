/* =========================================
   WORLD ELITE — MAIN SCRIPT
========================================= */

const app = document.getElementById("app");

let currentUser =
    localStorage.getItem("worldEliteUser") || "";

let favorites = JSON.parse(
    localStorage.getItem("worldEliteFavorites") || "[]"
);


/* =========================================
   DATA
========================================= */

const billionaires = [
    {
        id: 1,
        name: "Elon Musk",
        company: "Tesla / SpaceX",
        netWorth: "$715.6B",
        worth: 715.6,
        country: "USA",
        flag: "🇺🇸"
    },
    {
        id: 2,
        name: "Larry Page",
        company: "Google",
        netWorth: "$268.8B",
        worth: 268.8,
        country: "USA",
        flag: "🇺🇸"
    },
    {
        id: 3,
        name: "Sergey Brin",
        company: "Google",
        netWorth: "$248.0B",
        worth: 248,
        country: "USA",
        flag: "🇺🇸"
    },
    {
        id: 4,
        name: "Jeff Bezos",
        company: "Amazon",
        netWorth: "$242.6B",
        worth: 242.6,
        country: "USA",
        flag: "🇺🇸"
    },
    {
        id: 5,
        name: "Michael Dell",
        company: "Dell Technologies",
        netWorth: "$234.4B",
        worth: 234.4,
        country: "USA",
        flag: "🇺🇸"
    },
    {
        id: 6,
        name: "Mark Zuckerberg",
        company: "Meta",
        netWorth: "$203.9B",
        worth: 203.9,
        country: "USA",
        flag: "🇺🇸"
    },
    {
        id: 7,
        name: "Jensen Huang",
        company: "NVIDIA",
        netWorth: "$170.0B",
        worth: 170,
        country: "USA",
        flag: "🇺🇸"
    },
    {
        id: 8,
        name: "Larry Ellison",
        company: "Oracle",
        netWorth: "$156.9B",
        worth: 156.9,
        country: "USA",
        flag: "🇺🇸"
    },
    {
        id: 9,
        name: "Bernard Arnault",
        company: "LVMH",
        netWorth: "$142.7B",
        worth: 142.7,
        country: "France",
        flag: "🇫🇷"
    },
    {
        id: 10,
        name: "Warren Buffett",
        company: "Berkshire Hathaway",
        netWorth: "$141.2B",
        worth: 141.2,
        country: "USA",
        flag: "🇺🇸"
    }
];


const companies = [
    {
        name: "Tesla",
        sector: "Automotive / AI",
        founder: "Elon Musk"
    },
    {
        name: "SpaceX",
        sector: "Aerospace",
        founder: "Elon Musk"
    },
    {
        name: "Amazon",
        sector: "Technology / E-commerce",
        founder: "Jeff Bezos"
    },
    {
        name: "Meta",
        sector: "Technology / Social Media",
        founder: "Mark Zuckerberg"
    },
    {
        name: "NVIDIA",
        sector: "Semiconductors / AI",
        founder: "Jensen Huang"
    },
    {
        name: "Oracle",
        sector: "Cloud / Software",
        founder: "Larry Ellison"
    },
    {
        name: "Google",
        sector: "Technology / Internet",
        founder: "Larry Page & Sergey Brin"
    },
    {
        name: "LVMH",
        sector: "Luxury",
        founder: "Bernard Arnault"
    }
];


/* =========================================
   START
========================================= */

showStart();


function showStart() {

    app.innerHTML = `

        <div class="landing">

            <div class="hero">

                <div class="logo">
                    WE
                </div>

                <h1>
                    WORLD<span>ELITE</span>
                </h1>

                <p class="hero-subtitle">
                    Global wealth, business and
                    influence in one place.
                </p>

                <div class="hero-buttons">

                    <button
                        class="primary-btn"
                        id="startBtn"
                    >
                        ENTER WORLD ELITE
                    </button>

                </div>

                <div class="hero-stats">

                    <div class="hero-stat">
                        <strong>10+</strong>
                        <span>BILLIONAIRES</span>
                    </div>

                    <div class="hero-stat">
                        <strong>8+</strong>
                        <span>COMPANIES</span>
                    </div>

                    <div class="hero-stat">
                        <strong>GLOBAL</strong>
                        <span>DATA</span>
                    </div>

                </div>

            </div>

        </div>
    `;

    document
        .getElementById("startBtn")
        .onclick = showHome;
}


/* =========================================
   HOME
========================================= */

function showHome() {

    const richest =
        [...billionaires]
        .sort((a, b) => b.worth - a.worth)[0];

    app.innerHTML = `

        <div class="container">

            <div class="top-section">

                <p>WELCOME TO</p>

                <h1>
                    WORLD ELITE
                </h1>

                <p>
                    Wealth. Business. Power.
                </p>

            </div>


            <div class="card">

                <div class="rank">
                    #1 RICHEST
                </div>

                <div class="card-title">
                    ${richest.flag}
                    ${richest.name}
                </div>

                <div class="money">
                    ${richest.netWorth}
                </div>

                <p>
                    ${richest.company}
                </p>

            </div>


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
                    🔎 Search
                </div>

                <p>
                    Find people and companies
                </p>
            </div>


            <div
                class="card clickable"
                id="rankingCard"
            >
                <div class="card-title">
                    🏆 Rankings
                </div>

                <p>
                    World's wealthiest people
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
                    Explore global businesses
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

    setupNavigation();
}


/* =========================================
   RANKINGS
========================================= */

function showBillionaires() {

    app.innerHTML = `

        <div class="container">

            <button
                class="back-btn"
                id="backHome"
            >
                ← Home
            </button>

            <h1>
                Rankings
            </h1>

            <p>
                World's wealthiest people
            </p>

            <input
                id="searchInput"
                placeholder="🔎 Search billionaire"
            >

            <div id="billionaireList"></div>

        </div>

        ${navigation("billionaires")}
    `;

    document.getElementById("backHome").onclick =
        showHome;

    document.getElementById("searchInput").oninput =
        renderBillionaires;

    renderBillionaires();

    setupNavigation();
}


function renderBillionaires() {

    const query =
        document
        .getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();

    const list =
        billionaires.filter(person =>
            person.name.toLowerCase().includes(query) ||
            person.company.toLowerCase().includes(query)
        );

    const container =
        document.getElementById("billionaireList");

    container.innerHTML = "";

    list
        .sort((a, b) => b.worth - a.worth)
        .forEach((person, index) => {

            const card =
                document.createElement("div");

            card.className =
                "card clickable";

            card.innerHTML = `

                <div class="rank">
                    #${index + 1}
                </div>

                <div class="card-title">
                    ${person.flag}
                    ${person.name}
                </div>

                <div class="card-subtitle">
                    ${person.company}
                </div>

                <div class="money">
                    ${person.netWorth}
                </div>
            `;

            card.onclick = () =>
                showBillionaireDetails(person);

            container.appendChild(card);
        });
}


/* =========================================
   DETAILS
========================================= */

function showBillionaireDetails(person) {

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
                    ${person.flag}
                </div>

                <h1>
                    ${person.name}
                </h1>

                <p>
                    ${person.country}
                </p>

                <div class="big-money">
                    ${person.netWorth}
                </div>

                <p>
                    Estimated Net Worth
                </p>

                <br>

                <p>
                    🏢 ${person.company}
                </p>

                <br>

                <button
                    class="primary-btn"
                    id="favoriteBtn"
                >
                    ${
                        favorites.includes(person.id)
                        ? "⭐ Remove Favorite"
                        : "☆ Add Favorite"
                    }
                </button>

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


/* =========================================
   COMPANIES
========================================= */

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

    const query =
        document
        .getElementById("companySearch")
        .value
        .toLowerCase()
        .trim();

    const list =
        companies.filter(company =>
            company.name.toLowerCase().includes(query) ||
            company.sector.toLowerCase().includes(query) ||
            company.founder.toLowerCase().includes(query)
        );

    const container =
        document.getElementById("companyList");

    container.innerHTML = "";

    list.forEach(company => {

        const card =
            document.createElement("div");

        card.className = "card";

        card.innerHTML = `

            <div class="card-title">
                🏢 ${company.name}
            </div>

            <div class="card-subtitle">
                ${company.sector}
            </div>

            <p>
                Founder / Leader:
                ${company.founder}
            </p>
        `;

        container.appendChild(card);
    });
}


/* =========================================
   SEARCH
========================================= */

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

    setupNavigation();
}


function renderGlobalResults() {

    const query =
        document
        .getElementById("globalSearch")
        .value
        .toLowerCase()
        .trim();

    const results =
        document.getElementById("globalResults");

    let html = "";

    billionaires
        .filter(person =>
            person.name.toLowerCase().includes(query) ||
            person.company.toLowerCase().includes(query)
        )
        .forEach(person => {

            html += `

                <div
                    class="card clickable"
                    data-person="${person.id}"
                >

                    <div class="card-title">
                        ${person.flag}
                        ${person.name}
                    </div>

                    <div class="card-subtitle">
                        ${person.company}
                    </div>

                    <div class="money">
                        ${person.netWorth}
                    </div>

                </div>
            `;
        });


    companies
        .filter(company =>
            company.name.toLowerCase().includes(query) ||
            company.sector.toLowerCase().includes(query)
        )
        .forEach(company => {

            html += `

                <div class="card">

                    <div class="card-title">
                        🏢 ${company.name}
                    </div>

                    <div class="card-subtitle">
                        ${company.sector}
                    </div>

                    <p>
                        ${company.founder}
                    </p>

                </div>
            `;
        });


    if (!html) {

        html = `
            <div class="empty">
                <p>No results found.</p>
            </div>
        `;
    }

    results.innerHTML = html;


    document
        .querySelectorAll("[data-person]")
        .forEach(card => {

            card.onclick = () => {

                const person =
                    billionaires.find(
                        p =>
                            p.id ===
                            Number(card.dataset.person)
                    );

                if (person) {
                    showBillionaireDetails(person);
                }
            };
        });
}


/* =========================================
   FAVORITES
========================================= */

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


function showFavorites() {

    const list =
        billionaires.filter(
            person =>
                favorites.includes(person.id)
        );

    app.innerHTML = `

        <div class="container">

            <h1>
                Favorites
            </h1>

            <p>
                Saved people
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
                <p>No favorites yet.</p>
            </div>
        `;

    } else {

        list.forEach(person => {

            const card =
                document.createElement("div");

            card.className =
                "card clickable";

            card.innerHTML = `

                <div class="card-title">
                    ${person.flag}
                    ${person.name}
                </div>

                <div class="money">
                    ${person.netWorth}
                </div>

                <p>
                    ${person.company}
                </p>
            `;

            card.onclick = () =>
                showBillionaireDetails(person);

            container.appendChild(card);
        });
    }

    setupNavigation();
}


/* =========================================
   PROFILE
========================================= */

function showProfile() {

    app.innerHTML = `

        <div class="container">

            <div class="profile-card">

                <div class="profile-icon">
                    👤
                </div>

                <h1>
                    ${currentUser || "Guest"}
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

            <br>

            <button
                class="primary-btn"
                id="favoritesBtn"
            >
                ⭐ My Favorites
            </button>

            <br>

            <button
                class="secondary-btn"
                id="logoutBtn"
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

            showStart();
        };

    setupNavigation();
}


/* =========================================
   NAVIGATION
========================================= */

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
                <span class="nav-icon">🏠</span>
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
                <span class="nav-icon">🏆</span>
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
                <span class="nav-icon">🏢</span>
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
                <span class="nav-icon">👤</span>
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

                if (page === "home")
                    showHome();

                if (page === "billionaires")
                    showBillionaires();

                if (page === "companies")
                    showCompanies();

                if (page === "profile")
                    showProfile();
            };
        });
}
