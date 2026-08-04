const app = document.getElementById("app");


/* ==============================
   USER
============================== */

let currentUser =
    localStorage.getItem("worldEliteUser") || "";

let favorites =
    JSON.parse(
        localStorage.getItem("worldEliteFavorites") || "[]"
    );


/* ==============================
   DATA
============================== */

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


/* ==============================
   START
============================== */

showStart();


function showStart() {

    app.innerHTML = `

        <div class="loading-screen">

            <div class="container">

                <div class="logo">
                    WE
                </div>

                <p>
                    THE WORLD'S
                    MOST POWERFUL
                    PEOPLE
                </p>

                <h1>
                    WORLD<br>
                    ELITE
                </h1>

                <p>
                    Wealth • Business • Power
                </p>

                <br>

                <button id="startBtn">
                    ENTER WORLD ELITE
                </button>

            </div>

        </div>

    `;


    document
        .getElementById("startBtn")
        .onclick = showLogin;
}


/* ==============================
   LOGIN
============================== */

function showLogin() {

    app.innerHTML = `

        <div class="loading-screen">

            <div class="container">

                <div class="logo">
                    WE
                </div>

                <h1>
                    Welcome Back
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

                <br><br>

                <button id="loginBtn">
                    LOGIN
                </button>

                <br>

                <button
                    id="signupBtn"
                    class="secondary-btn"
                >
                    CREATE ACCOUNT
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

                alert("Enter your email.");

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


/* ==============================
   SIGN UP
============================== */

function showSignUp() {

    app.innerHTML = `

        <div class="loading-screen">

            <div class="container">

                <div class="logo">
                    WE
                </div>

                <h1>
                    Create Account
                </h1>

                <input
                    id="signupName"
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

                <br>

                <button id="createBtn">
                    CREATE ACCOUNT
                </button>

                <br>

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
                    "Enter your name and email."
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


/* ==============================
   HOME
============================== */

function showHome() {

    const richest =
        [...billionaires]
        .sort(
            (a, b) =>
                b.worth - a.worth
        )[0];


    app.innerHTML = `

        <div class="container">

            <div class="top-section">

                <p>
                    WORLD ELITE
                </p>

                <h1>
                    Global Power
                </h1>

                <p>
                    Discover the world's
                    wealthiest people,
                    companies and leaders.
                </p>

            </div>


            <div class="card clickable"
                 id="richestCard">

                <div class="rank">
                    #1 GLOBAL RANKING
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
                        People
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
                id="rankingCard"
            >

                <div class="card-title">
                    🏆 Rankings
                </div>

                <p>
                    Explore the world's
                    wealthiest people.
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
                    Explore major global
                    businesses.
                </p>

            </div>


            <div
                class="card clickable"
                id="searchCard"
            >

                <div class="card-title">
                    🔎 Search
                </div>

                <p>
                    Find people and companies.
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
                    Business and wealth
                    intelligence.
                </p>

            </div>

        </div>

        ${navigation("home")}

    `;


    document
        .getElementById("richestCard")
        .onclick =
        () =>
            showBillionaireDetails(
                richest
            );


    document
        .getElementById("rankingCard")
        .onclick =
        showBillionaires;


    document
        .getElementById("companyCard")
        .onclick =
        showCompanies;


    document
        .getElementById("searchCard")
        .onclick =
        showGlobalSearch;


    document
        .getElementById("newsCard")
        .onclick =
        showNews;


    setupNavigation();
}


/* ==============================
   RANKINGS
============================== */

function showBillionaires() {

    app.innerHTML = `

        <div class="container">

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
                        Highest
                    </option>

                    <option value="low">
                        Lowest
                    </option>

                    <option value="name">
                        A-Z
                    </option>

                </select>

            </div>


            <div id="billionaireList"></div>

        </div>

        ${navigation("billionaires")}

    `;


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

                const text =
                    (
                        person.name +
                        " " +
                        person.company
                    )
                    .toLowerCase();


                return (

                    text.includes(search)

                    &&

                    (
                        country === "all"
                        ||
                        person.country === country
                    )

                );

            }
        );


    if (sort === "high") {

        list.sort(
            (a,b) =>
                b.worth - a.worth
        );

    }


    if (sort === "low") {

        list.sort(
            (a,b) =>
                a.worth - b.worth
        );

    }


    if (sort === "name") {

        list.sort(
            (a,b) =>
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
        (person,index) => {

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
                        favorites.includes(
                            person.id
                        )
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


            card.querySelector(
                ".favorite"
            ).onclick =
            function(e) {

                e.stopPropagation();

                toggleFavorite(
                    person.id
                );

                renderBillionaires();

            };


            card.onclick =
                () =>
                    showBillionaireDetails(
                        person
                    );


            container.appendChild(card);

        }
    );
}


/* ==============================
   DETAILS
============================== */

function showBillionaireDetails(person) {

    const favorite =
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

                <button id="favoriteBtn">
                    ${
                        favorite
                        ? "⭐ Remove Favorite"
                        : "☆ Add Favorite"
                    }
                </button>

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
        function() {

            toggleFavorite(
                person.id
            );

            showBillionaireDetails(
                person
            );

        };


    setupNavigation();
}


/* ==============================
   COMPANIES
============================== */

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


    document
        .getElementById("companySearch")
        .oninput =
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


    const container =
        document.getElementById(
            "companyList"
        );


    container.innerHTML = "";


    companies
        .filter(company =>

            (
                company.name +
                company.sector +
                company.founder
            )
            .toLowerCase()
            .includes(query)

        )
        .forEach(company => {

            const card =
                document.createElement(
                    "div"
                );


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


/* ==============================
   SEARCH
============================== */

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
                placeholder="🔎 Search people or companies"
            >

            <div id="globalResults"></div>

        </div>

        ${navigation("home")}

    `;


    document
        .getElementById("backHome")
        .onclick =
        showHome;


    document
        .getElementById("globalSearch")
        .oninput =
        renderGlobalResults;


    renderGlobalResults();

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
        document.getElementById(
            "globalResults"
        );


    results.innerHTML = "";


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


    billionaires
        .filter(person =>

            (
                person.name +
                person.company +
                person.country
            )
            .toLowerCase()
            .includes(query)

        )
        .forEach(person => {

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

                <div class="card-subtitle">
                    ${person.company}
                </div>

                <div class="money">
                    ${person.netWorth}
                </div>

            `;


            card.onclick =
                () =>
                    showBillionaireDetails(
                        person
                    );


            results.appendChild(card);

        });


    companies
        .filter(company =>

            (
                company.name +
                company.sector +
                company.founder
            )
            .toLowerCase()
            .includes(query)

        )
        .forEach(company => {

            const card =
                document.createElement(
                    "div"
                );


            card.className = "card";


            card.innerHTML = `

                <div class="card-title">
                    🏢 ${company.name}
                </div>

                <div class="card-subtitle">
                    ${company.sector}
                </div>

                <p>
                    ${company.founder}
                </p>

            `;


            results.appendChild(card);

        });

}


/* ==============================
   NEWS
============================== */

function showNews() {

    app.innerHTML = `

        <div class="container">

            <h1>
                News
            </h1>

            <p>
                Business & wealth intelligence
            </p>

            <div class="card">

                <div class="card-title">
                    📰 WorldElite News
                </div>

                <p>
                    News integration will be
                    connected to live data.
                </p>

            </div>

            <div class="card">

                <div class="card-title">
                    💰 Wealth
                </div>

                <p>
                    Track global wealth
                    and rankings.
                </p>

            </div>

        </div>

        ${navigation("home")}

    `;

    setupNavigation();
}


/* ==============================
   PROFILE
============================== */

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
                        People
                    </div>

                </div>

            </div>

            <br>

            <button id="favoritesBtn">
                ⭐ My Favorites
            </button>

            <br>

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
        function() {

            localStorage.removeItem(
                "worldEliteUser"
            );

            currentUser = "";

            showLogin();

        };


    setupNavigation();
}


/* ==============================
   FAVORITES
============================== */

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


    if (list.length === 0) {

        container.innerHTML = `

            <div class="empty">

                <p>
                    No favorites yet.
                </p>

                <br>

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


    list.forEach(person => {

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
            () =>
                showBillionaireDetails(
                    person
                );


        container.appendChild(card);

    });


    setupNavigation();
}


/* ==============================
   FAVORITE SYSTEM
============================== */

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


/* ==============================
   NAVIGATION
============================== */

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
