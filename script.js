/* =========================================
   WORLDELITE
   DATA-DRIVEN VERSION
========================================= */

const app = document.getElementById("app");

let currentUser =
    localStorage.getItem("worldEliteUser") || "";

let favorites =
    JSON.parse(
        localStorage.getItem("worldEliteFavorites") || "[]"
    );

let worldEliteData = {
    source: "WorldElite",
    lastUpdated: null,
    billionaires: [],
    companies: []
};


/* =========================================
   LOAD DATA
========================================= */

async function loadWorldEliteData() {

    try {

        const response = await fetch(
            "data.json?cache=" + Date.now()
        );

        if (!response.ok) {
            throw new Error("Could not load data.json");
        }

        worldEliteData = await response.json();

        if (
            !Array.isArray(worldEliteData.billionaires)
        ) {
            worldEliteData.billionaires = [];
        }

        if (
            !Array.isArray(worldEliteData.companies)
        ) {
            worldEliteData.companies = [];
        }

        return true;

    } catch (error) {

        console.error(
            "WorldElite data error:",
            error
        );

        return false;
    }
}


/* =========================================
   HELPERS
========================================= */

function billionaires() {

    return worldEliteData.billionaires || [];
}


function companies() {

    return worldEliteData.companies || [];
}


function formatMoney(value) {

    if (
        typeof value === "string" &&
        value.includes("$")
    ) {
        return value;
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "$0B";
    }

    return "$" + number.toLocaleString(
        "en-US",
        {
            maximumFractionDigits: 1
        }
    ) + "B";
}


function getPersonId(person, index) {

    return (
        person.id ||
        person.personId ||
        person.name ||
        index
    );
}


function getPersonName(person) {

    return (
        person.name ||
        person.fullName ||
        "Unknown"
    );
}


function getPersonCompany(person) {

    return (
        person.company ||
        person.source ||
        person.sourceOfWealth ||
        "Unknown"
    );
}


function getPersonCountry(person) {

    return (
        person.country ||
        person.citizenship ||
        "Unknown"
    );
}


function getPersonFlag(person) {

    return (
        person.flag ||
        "🌍"
    );
}


/* =========================================
   START
========================================= */

showStart();


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

    document
        .getElementById("startBtn")
        .onclick = async function () {

            const button =
                document.getElementById("startBtn");

            button.innerText =
                "LOADING...";

            button.disabled = true;

            await loadWorldEliteData();

            showLogin();
        };
}


/* =========================================
   LOGIN
========================================= */

function showLogin() {

    app.innerHTML = `

        <div class="loading-screen">

            <div class="container">

                <h1>
                    Login
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


    document
        .getElementById("loginBtn")
        .onclick = function () {

            const email =
                document
                .getElementById("loginEmail")
                .value
                .trim();

            if (!email) {

                alert(
                    "Please enter your email."
                );

                return;
            }

            currentUser = email;

            localStorage.setItem(
                "worldEliteUser",
                currentUser
            );

            showHome();
        };


    document
        .getElementById("signupBtn")
        .onclick = showSignUp;
}


/* =========================================
   SIGN UP
========================================= */

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


    document
        .getElementById("createBtn")
        .onclick = function () {

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


    document
        .getElementById("backLogin")
        .onclick = showLogin;
}


/* =========================================
   HOME
========================================= */

function showHome() {

    const list = billionaires();

    const richest =
        [...list].sort(
            (a, b) =>
                Number(b.netWorth || b.worth || 0) -
                Number(a.netWorth || a.worth || 0)
        )[0];


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

                <div
                    class="card clickable"
                    id="richestCard"
                >

                    <div class="rank">
                        #1 RICHEST
                    </div>

                    <div class="card-title">

                        ${getPersonFlag(richest)}
                        ${getPersonName(richest)}

                    </div>

                    <div class="money">

                        ${formatMoney(
                            richest.netWorth ||
                            richest.worth
                        )}

                    </div>

                    <p>
                        ${getPersonCompany(richest)}
                    </p>

                </div>

                `
                :
                `

                <div class="card">

                    <div class="card-title">
                        Data unavailable
                    </div>

                    <p>
                        Billionaire data
                        has not loaded yet.
                    </p>

                </div>

                `
            }


            <div class="stat-grid">

                <div class="stat">

                    <div class="stat-number">
                        ${list.length}
                    </div>

                    <div class="stat-label">
                        People tracked
                    </div>

                </div>


                <div class="stat">

                    <div class="stat-number">
                        ${companies().length}
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
                    Explore the world's wealthiest
                    people
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


    const richestCard =
        document.getElementById(
            "richestCard"
        );

    if (richestCard && richest) {

        richestCard.onclick =
            function () {

                showBillionaireDetails(
                    richest
                );
            };
    }


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


    const people =
        billionaires().filter(
            person => {

                const name =
                    getPersonName(person)
                    .toLowerCase();

                const company =
                    getPersonCompany(person)
                    .toLowerCase();

                const country =
                    getPersonCountry(person)
                    .toLowerCase();

                return (
                    name.includes(query) ||
                    company.includes(query) ||
                    country.includes(query)
                );
            }
        );


    const business =
        companies().filter(
            company => {

                const name =
                    String(
                        company.name || ""
                    ).toLowerCase();

                const sector =
                    String(
                        company.sector || ""
                    ).toLowerCase();

                const founder =
                    String(
                        company.founder || ""
                    ).toLowerCase();

                return (
                    name.includes(query) ||
                    sector.includes(query) ||
                    founder.includes(query)
                );
            }
        );


    let html = "";


    if (people.length) {

        html += `
            <h2>
                People
            </h2>
        `;


        people.forEach(
            (person, index) => {

                html += `

                    <div
                        class="card clickable"
                        data-person-index="${index}"
                    >

                        <div class="card-title">

                            ${getPersonFlag(person)}
                            ${getPersonName(person)}

                        </div>

                        <div class="card-subtitle">

                            ${getPersonCompany(person)}

                        </div>

                        <div class="money">

                            ${formatMoney(
                                person.netWorth ||
                                person.worth
                            )}

                        </div>

                    </div>

                `;
            }
        );
    }


    if (business.length) {

        html += `
            <h2>
                Companies
            </h2>
        `;


        business.forEach(
            company => {

                html += `

                    <div class="card">

                        <div class="card-title">

                            🏢
                            ${company.name || "Unknown"}

                        </div>

                        <div class="card-subtitle">

                            ${company.sector || "Unknown"}

                        </div>

                        <p>

                            ${
                                company.founder ||
                                "Unknown"
                            }

                        </p>

                    </div>

                `;
            }
        );
    }


    if (
        !people.length &&
        !business.length
    ) {

        html = `

            <div class="empty">

                <p>
                    No results found.
                </p>

            </div>

        `;
    }


    results.innerHTML = html;


    results
        .querySelectorAll(
            "[data-person-index]"
        )
        .forEach(
            card => {

                card.onclick =
                    function () {

                        const person =
                            people[
                                Number(
                                    card.dataset
                                    .personIndex
                                )
                            ];

                        if (person) {

                            showBillionaireDetails(
                                person
                            );
                        }
                    };
            }
        );
}


/* =========================================
   RANKINGS
========================================= */

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
                    ${getDataStatus()}
                </div>

                <p>
                    Updated:
                    ${getLastUpdated()}
                </p>

                <button
                    id="refreshDataBtn"
                >
                    🔄 Reload Data
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


    document
        .getElementById(
            "refreshDataBtn"
        )
        .onclick =
        async function () {

            await loadWorldEliteData();

            renderBillionaires();
        };


    document
        .getElementById(
            "searchInput"
        )
        .oninput =
        renderBillionaires;


    document
        .getElementById(
            "countryFilter"
        )
        .onchange =
        renderBillionaires;


    document
        .getElementById(
            "sortSelect"
        )
        .onchange =
        renderBillionaires;


    renderBillionaires();

    setupNavigation();
}


function buildCountryFilter() {

    const select =
        document.getElementById(
            "countryFilter"
        );

    if (!select) {
        return;
    }


    const countries =
        [
            ...new Set(
                billionaires()
                    .map(
                        person =>
                            getPersonCountry(person)
                    )
                    .filter(Boolean)
            )
        ]
        .sort();


    countries.forEach(
        country => {

            const option =
                document.createElement(
                    "option"
                );

            option.value = country;

            option.textContent =
                "🌍 " + country;

            select.appendChild(
                option
            );
        }
    );
}


function renderBillionaires() {

    const searchElement =
        document.getElementById(
            "searchInput"
        );

    const countryElement =
        document.getElementById(
            "countryFilter"
        );

    const sortElement =
        document.getElementById(
            "sortSelect"
        );

    const container =
        document.getElementById(
            "billionaireList"
        );


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


    let list =
        billionaires().filter(
            person => {

                const name =
                    getPersonName(person)
                    .toLowerCase();

                const company =
                    getPersonCompany(person)
                    .toLowerCase();

                const matchesSearch =
                    name.includes(search) ||
                    company.includes(search);


                const matchesCountry =
                    country === "all" ||
                    getPersonCountry(person) === country;


                return (
                    matchesSearch &&
                    matchesCountry
                );
            }
        );


    if (sort === "high") {

        list.sort(
            (a, b) =>
                Number(
                    b.netWorth ||
                    b.worth ||
                    0
                ) -
                Number(
                    a.netWorth ||
                    a.worth ||
                    0
                )
        );
    }


    if (sort === "low") {

        list.sort(
            (a, b) =>
                Number(
                    a.netWorth ||
                    a.worth ||
                    0
                ) -
                Number(
                    b.netWorth ||
                    b.worth ||
                    0
                )
        );
    }


    if (sort === "name") {

        list.sort(
            (a, b) =>
                getPersonName(a)
                .localeCompare(
                    getPersonName(b)
                )
        );
    }


    container.innerHTML = "";


    list.forEach(
        (person, index) => {

            const id =
                getPersonId(
                    person,
                    index
                );


            const isFavorite =
                favorites.includes(id);


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "card clickable";


            card.innerHTML = `

                <button
                    class="favorite"
                >

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

                    ${getPersonFlag(person)}
                    ${getPersonName(person)}

                </div>


                <div class="card-subtitle">

                    ${getPersonCompany(person)}

                </div>


                <div class="money">

                    ${formatMoney(
                        person.netWorth ||
                        person.worth
                    )}

                </div>

            `;


            const favoriteButton =
                card.querySelector(
                    ".favorite"
                );


            favoriteButton.onclick =
                function (event) {

                    event.stopPropagation();

                    toggleFavorite(id);

                    renderBillionaires();
                };


            card.onclick =
                function () {

                    showBillionaireDetails(
                        person
                    );
                };


            container.appendChild(
                card
            );
        }
    );
}


/* =========================================
   PERSON DETAILS
========================================= */

function showBillionaireDetails(
    person
) {

    const id =
        getPersonId(
            person
        );


    const isFavorite =
        favorites.includes(id);


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

                    ${getPersonFlag(person)}

                </div>


                <h1>

                    ${getPersonName(person)}

                </h1>


                <p>

                    ${getPersonCountry(person)}

                </p>


                <div class="big-money">

                    ${formatMoney(
                        person.netWorth ||
                        person.worth
                    )}

                </div>


                <p>
                    Estimated Net Worth
                </p>


                <p>

                    🏢
                    ${getPersonCompany(person)}

                </p>


                <button
                    id="favoriteBtn"
                >

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

                    Current estimated
                    net worth:
                    ${formatMoney(
                        person.netWorth ||
                        person.worth
                    )}

                </p>

            </div>

        </div>

        ${navigation("billionaires")}

    `;


    document
        .getElementById("backBtn")
        .onclick =
        showBillionaires;


    document
        .getElementById("favoriteBtn")
        .onclick =
        function () {

            toggleFavorite(id);

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


    document
        .getElementById(
            "companySearch"
        )
        .oninput =
        renderCompanies;


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
        companies().filter(
            company => {

                const name =
                    String(
                        company.name || ""
                    ).toLowerCase();

                const sector =
                    String(
                        company.sector || ""
                    ).toLowerCase();

                const founder =
                    String(
                        company.founder || ""
                    ).toLowerCase();

                return (
                    name.includes(query) ||
                    sector.includes(query) ||
                    founder.includes(query)
                );
            }
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

                    ${company.sector || "Unknown"}

                </div>

                <p>

                    Founder / Leader:
                    ${company.founder || "Unknown"}

                </p>

            `;


            container.appendChild(
                card
            );
        }
    );
}


/* =========================================
   NEWS
========================================= */

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
                    Real-time business
                    news integration
                    will be added.
                </p>

            </div>

        </div>

        ${navigation("home")}

    `;


    setupNavigation();
}


/* =========================================
   FAVORITES
========================================= */

function showFavorites() {

    const list =
        billionaires().filter(
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

                <button
                    id="exploreBtn"
                >
                    Explore Rankings
                </button>

            </div>

        `;


        document
            .getElementById(
                "exploreBtn"
            )
            .onclick =
            showBillionaires;


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

                    ${getPersonFlag(person)}
                    ${getPersonName(person)}

                </div>


                <div class="money">

                    ${formatMoney(
                        person.netWorth ||
                        person.worth
                    )}

                </div>


                <p>

                    ${getPersonCompany(person)}

                </p>

            `;


            card.onclick =
                function () {

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

                    ${
                        currentUser ||
                        "Guest"
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

                        ${billionaires().length}

                    </div>

                    <div class="stat-label">
                        People tracked
                    </div>

                </div>

            </div>


            <button
                id="favoritesBtn"
            >
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


    document
        .getElementById(
            "favoritesBtn"
        )
        .onclick =
        showFavorites;


    document
        .getElementById(
            "logoutBtn"
        )
        .onclick =
        function () {

            localStorage.removeItem(
                "worldEliteUser"
            );

            currentUser = "";

            showLogin();
        };


    setupNavigation();
}


/* =========================================
   FAVORITES SYSTEM
========================================= */

function toggleFavorite(id) {

    if (
        favorites.includes(id)
    ) {

        favorites =
            favorites.filter(
                item =>
                    item !== id
            );

    } else {

        favorites.push(id);
    }


    localStorage.setItem(
        "worldEliteFavorites",
        JSON.stringify(
            favorites
        )
    );
}


/* =========================================
   DATA STATUS
========================================= */

function getDataStatus() {

    if (
        worldEliteData.lastUpdated
    ) {

        return "🟢 LIVE DATA";
    }

    return "🟡 WAITING FOR DATA";
}


function getLastUpdated() {

    if (
        worldEliteData.lastUpdated
    ) {

        return worldEliteData.lastUpdated;
    }

    return "Not updated yet";
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


function setupNavigation() {

    document
        .querySelectorAll(
            "[data-nav]"
        )
        .forEach(
            button => {

                button.onclick =
                    function () {

                        const page =
                            button.dataset.nav;


                        if (
                            page === "home"
                        ) {

                            showHome();

                        }


                        else if (
                            page ===
                            "billionaires"
                        ) {

                            showBillionaires();

                        }


                        else if (
                            page ===
                            "companies"
                        ) {

                            showCompanies();

                        }


                        else if (
                            page ===
                            "profile"
                        ) {

                            showProfile();

                        }

                    };
            }
        );
}
