/* =========================================
   WORLD ELITE — SCRIPT
========================================= */

const app = document.getElementById("app");

let currentUser =
    localStorage.getItem("worldEliteUser") || "";

let favorites = JSON.parse(
    localStorage.getItem("worldEliteFavorites") || "[]"
);

let billionaires = [];
let companies = [];

let lastUpdated = "";


/* =========================================
   LOAD DATA
========================================= */

async function loadLiveData() {

    try {

        const response = await fetch(
            "data.json?v=" + Date.now()
        );

        if (!response.ok) {
            throw new Error("Could not load data.json");
        }

        const data = await response.json();

        lastUpdated =
            data.lastUpdated || "";

        billionaires =
            Array.isArray(data.billionaires)
                ? data.billionaires.map(
                    (person, index) => ({

                        id: index + 1,

                        name:
                            person.name ||
                            "Unknown",

                        company:
                            person.company ||
                            "Unknown",

                        worth:
                            Number(
                                person.netWorth || 0
                            ),

                        netWorth:
                            "$" +
                            Number(
                                person.netWorth || 0
                            ).toLocaleString(
                                "en-US"
                            ) +
                            "B",

                        country:
                            person.country ||
                            "Unknown",

                        flag:
                            person.flag ||
                            "🌍"

                    })
                )
                : [];


        companies =
            Array.isArray(data.companies)
                ? data.companies
                : [];


        console.log(
            "WorldElite data loaded"
        );

        console.log(
            "Last updated:",
            lastUpdated
        );

    } catch (error) {

        console.error(
            "Data loading error:",
            error
        );

        billionaires = [];
        companies = [];

        alert(
            "WorldElite could not load its data."
        );
    }
}


/* =========================================
   START APP
========================================= */

startWorldElite();


async function startWorldElite() {

    await loadLiveData();

    showStart();
}


/* =========================================
   START SCREEN
========================================= */

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
                    Global wealth, business
                    and influence.
                </p>

                <button
                    class="primary-btn"
                    id="startBtn"
                >
                    ENTER WORLD ELITE
                </button>


                <div class="hero-stats">

                    <div class="hero-stat">

                        <strong>
                            ${billionaires.length}
                        </strong>

                        <span>
                            BILLIONAIRES
                        </span>

                    </div>


                    <div class="hero-stat">

                        <strong>
                            ${companies.length}
                        </strong>

                        <span>
                            COMPANIES
                        </span>

                    </div>


                    <div class="hero-stat">

                        <strong>
                            LIVE
                        </strong>

                        <span>
                            DATA
                        </span>

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

    let richest = null;

    if (billionaires.length > 0) {

        richest =
            [...billionaires]
            .sort(
                (a, b) =>
                    b.worth - a.worth
            )[0];
    }


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
                    Wealth. Business. Power.
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

                `
                : `
                <div class="card">
                    <p>
                        No billionaire data available.
                    </p>
                </div>
                `
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
                    🔎 Search
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
                    🏆 Rankings
                </div>

                <p>
                    Explore global wealth
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
                    📰 News
                </div>

                <p>
                    Business and wealth news
                </p>

            </div>


            <div class="update-info">

                Data updated:
                ${lastUpdated || "Unknown"}

            </div>

        </div>


        ${navigation("home")}

    `;


    document
        .getElementById("searchCard")
        .onclick = showGlobalSearch;


    document
        .getElementById("rankingCard")
        .onclick = showBillionaires;


    document
        .getElementById("companyCard")
        .onclick = showCompanies;


    document
        .getElementById("newsCard")
        .onclick = showNews;


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


            <div class="card">

                <div class="card-title">
                    🌐 WorldElite Data
                </div>

                <p>
                    Last update:
                    ${lastUpdated || "Unknown"}
                </p>

            </div>


            <input
                id="searchInput"
                type="text"
                placeholder="🔎 Search billionaire"
            >


            <div id="billionaireList"></div>

        </div>


        ${navigation("billionaires")}

    `;


    document
        .getElementById("backHome")
        .onclick = showHome;


    document
        .getElementById("searchInput")
        .oninput = renderBillionaires;


    renderBillionaires();

    setupNavigation();
}


function renderBillionaires() {

    const input =
        document.getElementById(
            "searchInput"
        );

    const container =
        document.getElementById(
            "billionaireList"
        );


    if (!input || !container) {
        return;
    }


    const query =
        input.value
        .toLowerCase()
        .trim();


    let list =
        billionaires.filter(
            person =>

                person.name
                .toLowerCase()
                .includes(query)

                ||

                person.company
                .toLowerCase()
                .includes(query)

                ||

                person.country
                .toLowerCase()
                .includes(query)
        );


    list.sort(
        (a, b) =>
            b.worth - a.worth
    );


    container.innerHTML = "";


    list.forEach(
        (person, index) => {

            const card =
                document.createElement(
                    "div"
                );


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


            card.onclick = () => {

                showBillionaireDetails(
                    person
                );

            };


            container.appendChild(card);

        }
    );


    if (list.length === 0) {

        container.innerHTML = `

            <div class="empty">

                <p>
                    No results found.
                </p>

            </div>

        `;
    }
}


/* =========================================
   BILLIONAIRE DETAILS
========================================= */

function showBillionaireDetails(person) {

    const favorite =
        favorites.includes(
            person.id
        );


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
                    Estimated net worth:
                    ${person.netWorth}
                </p>

            </div>

        </div>


        ${navigation("billionaires")}

    `;


    document
        .getElementById("backBtn")
        .onclick = showBillionaires;


    document
        .getElementById("favoriteBtn")
        .onclick = () => {

            toggleFavorite(
                person.id
            );

            showBillionaireDetails(
                person
            );

        };


    setupNavigation();
}


/* =========================================
   COMPANIES
========================================= */

function showCompanies() {

    app.innerHTML = `

        <div class="container">

            <button
                class="back-btn"
                id="backHome"
            >
                ← Home
            </button>


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
            >


            <div id="companyList"></div>

        </div>


        ${navigation("companies")}

    `;


    document
        .getElementById("backHome")
        .onclick = showHome;


    document
        .getElementById("companySearch")
        .oninput = renderCompanies;


    renderCompanies();

    setupNavigation();
}


function renderCompanies() {

    const input =
        document.getElementById(
            "companySearch"
        );

    const container =
        document.getElementById(
            "companyList"
        );


    if (!input || !container) {
        return;
    }


    const query =
        input.value
        .toLowerCase()
        .trim();


    const list =
        companies.filter(
            company =>

                (company.name || "")
                .toLowerCase()
                .includes(query)

                ||

                (company.sector || "")
                .toLowerCase()
                .includes(query)

                ||

                (company.founder || "")
                .toLowerCase()
                .includes(query)
        );


    container.innerHTML = "";


    list.forEach(
        company => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "card";


            card.innerHTML = `

                <div class="card-title">
                    🏢
                    ${company.name || "Unknown"}
                </div>

                <div class="card-subtitle">
                    ${company.sector || ""}
                </div>

                <p>
                    ${company.founder || ""}
                </p>

            `;


            container.appendChild(
                card
            );

        }
    );


    if (list.length === 0) {

        container.innerHTML = `

            <div class="empty">

                <p>
                    No companies found.
                </p>

            </div>

        `;
    }
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
                type="text"
                placeholder="🔎 Search..."
            >


            <div id="globalResults"></div>

        </div>


        ${navigation("home")}

    `;


    document
        .getElementById("backHome")
        .onclick = showHome;


    document
        .getElementById("globalSearch")
        .oninput =
        renderGlobalResults;


    renderGlobalResults();

    setupNavigation();
}


function renderGlobalResults() {

    const input =
        document.getElementById(
            "globalSearch"
        );

    const results =
        document.getElementById(
            "globalResults"
        );


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
                    Start typing to search.
                </p>

            </div>

        `;

        return;
    }


    let html = "";


    const people =
        billionaires.filter(
            person =>

                person.name
                .toLowerCase()
                .includes(query)

                ||

                person.company
                .toLowerCase()
                .includes(query)

                ||

                person.country
                .toLowerCase()
                .includes(query)
        );


    if (people.length) {

        html += `
            <h2>People</h2>
        `;


        people.forEach(
            person => {

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
            }
        );
    }


    const business =
        companies.filter(
            company =>

                (company.name || "")
                .toLowerCase()
                .includes(query)

                ||

                (company.sector || "")
                .toLowerCase()
                .includes(query)

                ||

                (company.founder || "")
                .toLowerCase()
                .includes(query)
        );


    if (business.length) {

        html += `
            <h2>Companies</h2>
        `;


        business.forEach(
            company => {

                html += `

                    <div class="card">

                        <div class="card-title">
                            🏢
                            ${company.name}
                        </div>

                        <div class="card-subtitle">
                            ${company.sector || ""}
                        </div>

                        <p>
                            ${company.founder || ""}
                        </p>

                    </div>

                `;
            }
        );
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
        .querySelectorAll("[data-person]")
        .forEach(card => {

            card.onclick = () => {

                const person =
                    billionaires.find(
                        item =>
                            item.id ===
                            Number(
                                card.dataset.person
                            )
                    );


                if (person) {

                    showBillionaireDetails(
                        person
                    );

                }

            };

        });
}


/* =========================================
   NEWS
========================================= */

function showNews() {

    app.innerHTML = `

        <div class="container">

            <button
                class="back-btn"
                id="backHome"
            >
                ← Home
            </button>


            <h1>
                News
            </h1>


            <p>
                World business intelligence
            </p>


            <div class="card">

                <div class="card-title">
                    📰 WorldElite News
                </div>

                <p>
                    News integration will
                    be connected next.
                </p>

            </div>

        </div>


        ${navigation("home")}

    `;


    document
        .getElementById("backHome")
        .onclick = showHome;


    setupNavigation();
}


/* =========================================
   FAVORITES
========================================= */

function showFavorites() {

    const list =
        billionaires.filter(
            person =>
                favorites.includes(
                    person.id
                )
        );


    app.innerHTML = `

        <div class="container">

            <button
                class="back-btn"
                id="backProfile"
            >
                ← Profile
            </button>


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


    document
        .getElementById("backProfile")
        .onclick = showProfile;


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

            </div>

        `;

        setupNavigation();

        return;
    }


    list.forEach(
        person => {

            const card =
                document.createElement(
                    "div"
                );


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


            card.onclick = () => {

                showBillionaireDetails(
                    person
                );

            };


            container.appendChild(
                card
            );

        }
    );


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


            <button
                class="primary-btn"
                id="favoritesBtn"
            >
                ⭐ My Favorites
            </button>


            <button
                class="secondary-btn"
                id="logoutBtn"
            >
                LOG OUT
            </button>

        </div>


        ${navigation("profile")}

    `;


    document
        .getElementById("favoritesBtn")
        .onclick = showFavorites;


    document
        .getElementById("logoutBtn")
        .onclick = () => {

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


/* =========================================
   NAVIGATION EVENTS
========================================= */

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


                if (
                    page === "billionaires"
                ) {
                    showBillionaires();
                }


                if (
                    page === "companies"
                ) {
                    showCompanies();
                }


                if (
                    page === "profile"
                ) {
                    showProfile();
                }

            };

        });
}
