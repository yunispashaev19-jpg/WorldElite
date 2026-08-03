/* =========================================
   WORLDELITE
   DATA VERSION
========================================= */

const app = document.getElementById("app");

let currentUser =
    localStorage.getItem("worldEliteUser") || "";

let favorites =
    JSON.parse(
        localStorage.getItem("worldEliteFavorites") || "[]"
    );

let billionaires = [];
let companies = [];

let dataLastUpdated = "Loading...";
let dataSource = "Loading...";


/* =========================================
   START
========================================= */

loadWorldEliteData();


async function loadWorldEliteData() {

    try {

        const response =
            await fetch("./data.json?time=" + Date.now());

        if (!response.ok) {
            throw new Error("Data file not found");
        }

        const data =
            await response.json();

        billionaires =
            data.billionaires || [];

        dataLastUpdated =
            data.lastUpdated || "Unknown";

        dataSource =
            data.source || "Unknown";


        companies = [

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


        showStart();

    }

    catch (error) {

        console.error(
            "WorldElite Data Error:",
            error
        );


        app.innerHTML = `

            <div class="container">

                <h1>
                    WorldElite
                </h1>

                <p>
                    Could not load data.
                </p>

                <button
                    onclick="location.reload()"
                >
                    TRY AGAIN
                </button>

            </div>

        `;

    }

}


/* =========================================
   START
========================================= */

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
        .onclick = showLogin;

}


/* =========================================
   LOGIN
========================================= */

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

                <h1>Create Account</h1>

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

    if (!billionaires.length) {
        return;
    }


    const richest =
        [...billionaires]
        .sort(
            (a, b) =>
                b.worth - a.worth
        )[0];


    app.innerHTML = `

        <div class="container">

            <div class="top-section">

                <p>WELCOME TO</p>

                <h1>
                    WORLD ELITE
                </h1>

                <p>
                    Global wealth and
                    business intelligence.
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


    const business =
        companies.filter(
            company =>

                company.name
                .toLowerCase()
                .includes(query)

                ||

                company.sector
                .toLowerCase()
                .includes(query)

                ||

                company.founder
                .toLowerCase()
                .includes(query)

        );


    let html = "";


    if (people.length) {

        html += `<h2>People</h2>`;


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


    if (business.length) {

        html += `<h2>Companies</h2>`;


        business.forEach(
            company => {

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

            }
        );

    }


    if (
        people.length === 0 &&
        business.length === 0
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


    document
        .querySelectorAll("[data-person]")
        .forEach(
            card => {

                card.onclick = function () {

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
                    🟢 DATA CONNECTED
                </div>

                <p>
                    Source:
                    ${dataSource}
                </p>

                <p>
                    Last updated:
                    ${dataLastUpdated}
                </p>

                <button
                    id="refreshDataBtn"
                >
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

                    <option value="USA">
                        🇺🇸 USA
                    </option>

                    <option value="France">
                        🇫🇷 France
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


    document
        .getElementById("refreshDataBtn")
        .onclick =
        refreshWorldEliteData;


    document
        .getElementById("searchInput")
        .oninput =
        renderBillionaires;


    document
        .getElementById("countryFilter")
        .onchange =
        renderBillionaires;


    document
        .getElementById("sortSelect")
        .onchange =
        renderBillionaires;


    renderBillionaires();

    setupNavigation();

}


function renderBillionaires() {

    const search =
        document
        .getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();


    const country =
        document
        .getElementById("countryFilter")
        .value;


    const sort =
        document
        .getElementById("sortSelect")
        .value;


    let list =
        billionaires.filter(
            person => {

                const matchesSearch =

                    person.name
                    .toLowerCase()
                    .includes(search)

                    ||

                    person.company
                    .toLowerCase()
                    .includes(search);


                const matchesCountry =

                    country === "all"

                    ||

                    person.country === country;


                return (
                    matchesSearch &&
                    matchesCountry
                );

            }
        );


    if (sort === "high") {

        list.sort(
            (a, b) =>
                b.worth - a.worth
        );

    }


    if (sort === "low") {

        list.sort(
            (a, b) =>
                a.worth - b.worth
        );

    }


    if (sort === "name") {

        list.sort(
            (a, b) =>
                a.name.localeCompare(
                    b.name
                )
        );

    }


    const container =
        document.getElementById(
            "billionaireList"
        );


    container.innerHTML = "";


    list.forEach(
        (person, index) => {

            const isFavorite =
                favorites.includes(
                    person.id
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "card clickable";


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


            card
                .querySelector(".favorite")
                .onclick =
                function (event) {

                    event.stopPropagation();

                    toggleFavorite(
                        person.id
                    );

                    renderBillionaires();

                };


            card.onclick =
                function () {

                    showBillionaireDetails(
                        person
                    );

                };


            container.appendChild(card);

        }
    );

}


/* =========================================
   DETAILS
========================================= */

function showBillionaireDetails(person) {

    const isFavorite =
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

                <p>
                    🏢 ${person.company}
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
                    Current estimated
                    net worth:
                    ${person.netWorth}
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
        .getElementById("companySearch")
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


    const query =
        input.value
        .toLowerCase()
        .trim();


    const list =
        companies.filter(
            company =>

                company.name
                .toLowerCase()
                .includes(query)

                ||

                company.sector
                .toLowerCase()
                .includes(query)

                ||

                company.founder
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
                    📰 News
                </div>

                <p>
                    News integration
                    will be connected
                    in the next stage.
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
        billionaires.filter(
            person =>
                favorites.includes(
                    person.id
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


        document
            .getElementById("exploreBtn")
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


    document
        .getElementById("favoritesBtn")
        .onclick =
        showFavorites;


    document
        .getElementById("logoutBtn")
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

    if (favorites.includes(id)) {

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
        JSON.stringify(favorites)
    );

}


/* =========================================
   REFRESH DATA
========================================= */

async function refreshWorldEliteData() {

    const button =
        document.getElementById(
            "refreshDataBtn"
        );


    if (button) {

        button.innerText =
            "⏳ Updating...";

        button.disabled = true;

    }


    try {

        const response =
            await fetch(
                "./data.json?time=" +
                Date.now()
            );


        if (!response.ok) {

            throw new Error(
                "Could not update data"
            );

        }


        const data =
            await response.json();


        billionaires =
            data.billionaires || [];


        dataLastUpdated =
            data.lastUpdated || "Unknown";


        dataSource =
            data.source || "Unknown";


        alert(
            "WorldElite data updated."
        );


        showBillionaires();

    }

    catch (error) {

        console.error(error);

        alert(
            "Could not update WorldElite data."
        );

        if (button) {

            button.innerText =
                "🔄 Refresh Data";

            button.disabled = false;

        }

    }

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
        .querySelectorAll("[data-nav]")
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
