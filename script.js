/* =========================================================
   WORLDELITE — SCRIPT.JS
   Flag fix + rankings + filters + refresh
========================================================= */

const app = document.getElementById("app");/* =========================================================
   AUTH / START SCREEN
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

    document
        .getElementById("startBtn")
        .onclick = showLogin;
}


/* =========================================================
   LOGIN
========================================================= */

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
        .onclick = function() {

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
        .onclick =
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
                    BACK TO LOGIN
                </button>

            </div>

        </div>

    `;


    document
        .getElementById("createBtn")
        .onclick = function() {

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

            const password =
                document
                    .getElementById("signupPassword")
                    .value;


            if (
                !name ||
                !email ||
                !password
            ) {

                alert(
                    "Please complete all fields."
                );

                return;
            }


            if (
                password.length < 6
            ) {

                alert(
                    "Password must contain at least 6 characters."
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
        .onclick =
        showLogin;
}

/* =========================================================
   USER
========================================================= */

let currentUser =
    localStorage.getItem("worldEliteUser") || "";

let favorites = JSON.parse(
    localStorage.getItem("worldEliteFavorites") || "[]"
);

/* =========================================================
   DATA
========================================================= */

let billionaires = [];
let companies = [];

let dataSource = "LOADING";
let lastUpdated = "";

/* =========================================================
   COUNTRY FLAGS
========================================================= */

const countryFlags = {

    "Afghanistan": "🇦🇫",
    "Albania": "🇦🇱",
    "Algeria": "🇩🇿",
    "Andorra": "🇦🇩",
    "Angola": "🇦🇴",
    "Argentina": "🇦🇷",
    "Armenia": "🇦🇲",
    "Australia": "🇦🇺",
    "Austria": "🇦🇹",
    "Azerbaijan": "🇦🇿",

    "Bahamas": "🇧🇸",
    "Bahrain": "🇧🇭",
    "Bangladesh": "🇧🇩",
    "Barbados": "🇧🇧",
    "Belarus": "🇧🇾",
    "Belgium": "🇧🇪",
    "Belize": "🇧🇿",
    "Bermuda": "🇧🇲",
    "Bolivia": "🇧🇴",
    "Bosnia and Herzegovina": "🇧🇦",
    "Brazil": "🇧🇷",
    "Bulgaria": "🇧🇬",

    "Canada": "🇨🇦",
    "Chile": "🇨🇱",
    "China": "🇨🇳",
    "Colombia": "🇨🇴",
    "Costa Rica": "🇨🇷",
    "Croatia": "🇭🇷",
    "Cuba": "🇨🇺",
    "Cyprus": "🇨🇾",
    "Czech Republic": "🇨🇿",
    "Czechia": "🇨🇿",

    "Denmark": "🇩🇰",
    "Dominican Republic": "🇩🇴",

    "Ecuador": "🇪🇨",
    "Egypt": "🇪🇬",
    "Estonia": "🇪🇪",
    "Ethiopia": "🇪🇹",

    "Finland": "🇫🇮",
    "France": "🇫🇷",

    "Georgia": "🇬🇪",
    "Germany": "🇩🇪",
    "Ghana": "🇬🇭",
    "Greece": "🇬🇷",
    "Guatemala": "🇬🇹",

    "Hong Kong": "🇭🇰",
    "Hungary": "🇭🇺",

    "Iceland": "🇮🇸",
    "India": "🇮🇳",
    "Indonesia": "🇮🇩",
    "Iran": "🇮🇷",
    "Iraq": "🇮🇶",
    "Ireland": "🇮🇪",
    "Israel": "🇮🇱",
    "Italy": "🇮🇹",

    "Japan": "🇯🇵",
    "Jordan": "🇯🇴",

    "Kazakhstan": "🇰🇿",
    "Kenya": "🇰🇪",
    "Kuwait": "🇰🇼",

    "Latvia": "🇱🇻",
    "Lebanon": "🇱🇧",
    "Liechtenstein": "🇱🇮",
    "Lithuania": "🇱🇹",
    "Luxembourg": "🇱🇺",

    "Malaysia": "🇲🇾",
    "Malta": "🇲🇹",
    "Mexico": "🇲🇽",
    "Monaco": "🇲🇨",
    "Mongolia": "🇲🇳",
    "Morocco": "🇲🇦",

    "Netherlands": "🇳🇱",
    "New Zealand": "🇳🇿",
    "Nigeria": "🇳🇬",
    "Norway": "🇳🇴",

    "Pakistan": "🇵🇰",
    "Panama": "🇵🇦",
    "Peru": "🇵🇪",
    "Philippines": "🇵🇭",
    "Poland": "🇵🇱",
    "Portugal": "🇵🇹",

    "Qatar": "🇶🇦",

    "Romania": "🇷🇴",
    "Russia": "🇷🇺",
    "Rwanda": "🇷🇼",

    "Saudi Arabia": "🇸🇦",
    "Serbia": "🇷🇸",
    "Singapore": "🇸🇬",
    "Slovakia": "🇸🇰",
    "Slovenia": "🇸🇮",
    "South Africa": "🇿🇦",
    "South Korea": "🇰🇷",
    "South Sudan": "🇸🇸",
    "Spain": "🇪🇸",
    "Sri Lanka": "🇱🇰",
    "Sweden": "🇸🇪",
    "Switzerland": "🇨🇭",

    "Taiwan": "🇹🇼",
    "Thailand": "🇹🇭",
    "Tunisia": "🇹🇳",
    "Turkey": "🇹🇷",
    "Türkiye": "🇹🇷",

    "Ukraine": "🇺🇦",
    "United Arab Emirates": "🇦🇪",
    "United Kingdom": "🇬🇧",
    "UK": "🇬🇧",
    "United States": "🇺🇸",
    "United States of America": "🇺🇸",
    "USA": "🇺🇸",
    "Uruguay": "🇺🇾",
    "Uzbekistan": "🇺🇿",

    "Venezuela": "🇻🇪",
    "Vietnam": "🇻🇳",

    "Zimbabwe": "🇿🇼"
};


/* =========================================================
   GET FLAG
========================================================= */

function getFlag(country) {

    if (!country) {
        return "🌍";
    }

    let value =
        String(country)
        .trim();

    if (
        countryFlags[value]
    ) {
        return countryFlags[value];
    }

    const lower =
        value.toLowerCase();

    const found =
        Object.keys(countryFlags)
        .find(
            key =>
                key.toLowerCase() === lower
        );

    if (found) {
        return countryFlags[found];
    }

    return "🌍";
}


/* =========================================================
   CLEAN COUNTRY
========================================================= */

function cleanCountry(country) {

    if (!country) {
        return "Unknown";
    }

    const value =
        String(country)
        .trim();

    if (
        value === "" ||
        value.toLowerCase() === "unknown" ||
        value.toLowerCase() === "null" ||
        value.toLowerCase() === "undefined"
    ) {
        return "Unknown";
    }

    return value;
}


/* =========================================================
   LOAD DATA
========================================================= */

async function loadWorldEliteData() {

    try {

        const response =
            await fetch(
                "data.json?cache=" +
                Date.now()
            );

        if (!response.ok) {
            throw new Error(
                "Could not load data.json"
            );
        }

        const data =
            await response.json();

        const people =
            Array.isArray(data)
                ? data
                : (
                    data.billionaires ||
                    data.people ||
                    data.data ||
                    []
                );

        billionaires =
            people.map(
                (person, index) => {

                    const country =
                        cleanCountry(
                            person.country ||
                            person.Country ||
                            person.location ||
                            person.nationality
                        );

                    const worth =
                        Number(
                            person.worth ||
                            person.netWorth ||
                            person.net_worth ||
                            person.finalWorth ||
                            0
                        );

                    return {

                        id:
                            person.id ||
                            index + 1,

                        name:
                            person.name ||
                            person.personName ||
                            "Unknown",

                        company:
                            person.company ||
                            person.companyName ||
                            person.source ||
                            "Unknown",

                        country,

                        flag:
                            getFlag(country),

                        worth,

                        netWorth:
                            person.netWorthDisplay ||
                            person.netWorthText ||
                            (
                                worth
                                    ? "$" +
                                      worth.toFixed(1) +
                                      "B"
                                    : "N/A"
                            )
                    };
                }
            );


        if (
            Array.isArray(
                data.companies
            )
        ) {

            companies =
                data.companies;

        } else {

            companies = [];

        }


        dataSource =
            "LIVE DATA";


        lastUpdated =
            data.updatedAt ||
            data.lastUpdated ||
            new Date().toISOString();


        console.log(
            "WorldElite loaded:",
            billionaires.length,
            "people"
        );


        showHome();

    }

    catch (error) {

        console.error(
            "WorldElite data error:",
            error
        );


        dataSource =
            "ERROR";


        app.innerHTML = `

            <div class="container">

                <h1>
                    WorldElite
                </h1>

                <div class="card">

                    <div class="card-title">
                        ⚠️ Data loading error
                    </div>

                    <p>
                        Could not load data.json.
                    </p>

                    <button
                        onclick="location.reload()"
                    >
                        🔄 Try Again
                    </button>

                </div>

            </div>

        `;

    }
}


/* =========================================================
   START
========================================================= */

loadWorldEliteData();


/* =========================================================
   HOME
========================================================= */

function showHome() {

    if (
        billionaires.length === 0
    ) {
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


            <div class="card">

                <div class="rank">
                    #1 RICHEST
                </div>

                <div class="card-title">

                    <span>
                        ${richest.flag}
                    </span>

                    ${escapeHTML(
                        richest.name
                    )}

                </div>

                <div class="money">
                    ${escapeHTML(
                        richest.netWorth
                    )}
                </div>

                <p>
                    ${escapeHTML(
                        richest.company
                    )}
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
        .onclick =
        showGlobalSearch;


    document
        .getElementById("rankingCard")
        .onclick =
        showBillionaires;


    document
        .getElementById("companyCard")
        .onclick =
        showCompanies;


    document
        .getElementById("newsCard")
        .onclick =
        showNews;


    setupNavigation();
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

                    ${
                        dataSource === "LIVE DATA"
                            ? "🟢 LIVE DATA"
                            : "🟡 " + dataSource
                    }

                </div>

                <p>
                    Updated:
                    ${formatDate(lastUpdated)}
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
        refreshWorldEliteData;


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


/* =========================================================
   COUNTRY FILTER
========================================================= */

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
                billionaires
                    .map(
                        person =>
                            cleanCountry(
                                person.country
                            )
                    )
                    .filter(
                        country =>
                            country !== "Unknown"
                    )
            )
        ]
        .sort(
            (a, b) =>
                a.localeCompare(b)
        );


    countries.forEach(
        country => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                country;

            option.textContent =
                getFlag(country) +
                " " +
                country;

            select.appendChild(
                option
            );
        }
    );


    const unknownCount =
        billionaires.filter(
            person =>
                cleanCountry(
                    person.country
                ) === "Unknown"
        ).length;


    if (unknownCount > 0) {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            "Unknown";

        option.textContent =
            "🌍 Unknown";

        select.appendChild(
            option
        );
    }
}


/* =========================================================
   RENDER RANKINGS
========================================================= */

function renderBillionaires() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    const countryFilter =
        document.getElementById(
            "countryFilter"
        );

    const sortSelect =
        document.getElementById(
            "sortSelect"
        );

    const container =
        document.getElementById(
            "billionaireList"
        );


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
        billionaires.filter(
            person => {

                const name =
                    String(
                        person.name || ""
                    )
                    .toLowerCase();


                const company =
                    String(
                        person.company || ""
                    )
                    .toLowerCase();


                const matchesSearch =
                    name.includes(search) ||
                    company.includes(search);


                const personCountry =
                    cleanCountry(
                        person.country
                    );


                const matchesCountry =
                    country === "all" ||
                    personCountry === country;


                return (
                    matchesSearch &&
                    matchesCountry
                );
            }
        );


    /* IMPORTANT:
       copy array before sorting */
    list =
        [...list];


    if (
        sort === "high"
    ) {

        list.sort(
            (a, b) =>
                Number(b.worth || 0) -
                Number(a.worth || 0)
        );

    }


    else if (
        sort === "low"
    ) {

        list.sort(
            (a, b) =>
                Number(a.worth || 0) -
                Number(b.worth || 0)
        );

    }


    else if (
        sort === "name"
    ) {

        list.sort(
            (a, b) =>
                String(a.name)
                .localeCompare(
                    String(b.name)
                )
        );

    }


    container.innerHTML = "";


    if (
        list.length === 0
    ) {

        container.innerHTML = `

            <div class="empty">

                <p>
                    No results found.
                </p>

            </div>

        `;

        return;
    }


    list.forEach(
        (person, index) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "card clickable";


            const isFavorite =
                favorites.includes(
                    person.id
                );


            card.innerHTML = `

                <button
                    class="favorite"
                    type="button"
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

                    <span>
                        ${getFlag(
                            person.country
                        )}
                    </span>

                    ${escapeHTML(
                        person.name
                    )}

                </div>


                <div class="card-subtitle">
                    ${escapeHTML(
                        person.company
                    )}
                </div>


                <div class="money">
                    ${escapeHTML(
                        person.netWorth
                    )}
                </div>

            `;


            const favorite =
                card.querySelector(
                    ".favorite"
                );


            favorite.onclick =
                function(event) {

                    event.stopPropagation();

                    toggleFavorite(
                        person.id
                    );

                    renderBillionaires();
                };


            card.onclick =
                function() {

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


/* =========================================================
   PERSON DETAILS
========================================================= */

function showBillionaireDetails(
    person
) {

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
                    ${getFlag(
                        person.country
                    )}
                </div>


                <h1>
                    ${escapeHTML(
                        person.name
                    )}
                </h1>


                <p>
                    ${escapeHTML(
                        cleanCountry(
                            person.country
                        )
                    )}
                </p>


                <div class="big-money">
                    ${escapeHTML(
                        person.netWorth
                    )}
                </div>


                <p>
                    Estimated Net Worth
                </p>


                <p>
                    🏢 ${escapeHTML(
                        person.company
                    )}
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

        </div>

        ${navigation("billionaires")}

    `;


    document
        .getElementById(
            "backBtn"
        )
        .onclick =
        showBillionaires;


    document
        .getElementById(
            "favoriteBtn"
        )
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


/* =========================================================
   SEARCH
========================================================= */

function showGlobalSearch() {

    app.innerHTML = `

        <div class="container">

            <h1>
                Search
            </h1>

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
        .getElementById(
            "globalSearch"
        )
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


    if (
        !input ||
        !results
    ) {
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

                String(person.name)
                    .toLowerCase()
                    .includes(query)

                ||

                String(person.company)
                    .toLowerCase()
                    .includes(query)

                ||

                String(person.country)
                    .toLowerCase()
                    .includes(query)
        );


    let html = "";


    if (
        people.length
    ) {

        html += `
            <h2>
                People
            </h2>
        `;


        people.forEach(
            person => {

                html += `

                    <div
                        class="card clickable"
                        data-person="${person.id}"
                    >

                        <div class="card-title">

                            ${getFlag(
                                person.country
                            )}

                            ${escapeHTML(
                                person.name
                            )}

                        </div>

                        <div class="card-subtitle">
                            ${escapeHTML(
                                person.company
                            )}
                        </div>

                        <div class="money">
                            ${escapeHTML(
                                person.netWorth
                            )}
                        </div>

                    </div>

                `;
            }
        );
    }


    if (
        !people.length
    ) {

        html = `

            <div class="empty">

                <p>
                    No results found.
                </p>

            </div>

        `;
    }


    results.innerHTML =
        html;


    document
        .querySelectorAll(
            "[data-person]"
        )
        .forEach(
            card => {

                card.onclick =
                    function() {

                        const person =
                            billionaires.find(
                                item =>
                                    String(
                                        item.id
                                    ) ===
                                    String(
                                        card.dataset
                                            .person
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


    if (
        !input ||
        !container
    ) {
        return;
    }


    const query =
        input.value
        .toLowerCase()
        .trim();


    const list =
        companies.filter(
            company =>

                String(
                    company.name || ""
                )
                .toLowerCase()
                .includes(query)

                ||

                String(
                    company.sector || ""
                )
                .toLowerCase()
                .includes(query)

                ||

                String(
                    company.founder || ""
                )
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
                    🏢 ${escapeHTML(
                        company.name
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


            container.appendChild(
                card
            );

        }
    );
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

                <div class="card-title">
                    📰 Live News
                </div>

                <p>
                    Business and wealth news
                    integration.
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

            <div id="favoriteList"></div>

        </div>

        ${navigation("profile")}

    `;


    const container =
        document.getElementById(
            "favoriteList"
        );


    if (
        list.length === 0
    ) {

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

                    ${getFlag(
                        person.country
                    )}

                    ${escapeHTML(
                        person.name
                    )}

                </div>

                <div class="money">
                    ${escapeHTML(
                        person.netWorth
                    )}
                </div>

            `;


            card.onclick =
                function() {

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
                            currentUser ||
                            "Guest"
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
        function() {

            localStorage.removeItem(
                "worldEliteUser"
            );

            currentUser = "";

            location.reload();

        };


    setupNavigation();
}


/* =========================================================
   FAVORITES SYSTEM
========================================================= */

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


/* =========================================================
   REFRESH DATA
========================================================= */

async function refreshWorldEliteData() {

    const button =
        document.getElementById(
            "refreshDataBtn"
        );


    if (button) {

        button.disabled =
            true;

        button.innerText =
            "⏳ Refreshing...";

    }


    try {

        const response =
            await fetch(
                "data.json?refresh=" +
                Date.now(),
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {
            throw new Error(
                "Data request failed"
            );
        }


        const data =
            await response.json();


        const people =
            Array.isArray(data)
                ? data
                : (
                    data.billionaires ||
                    data.people ||
                    data.data ||
                    []
                );


        billionaires =
            people.map(
                (person, index) => {

                    const country =
                        cleanCountry(
                            person.country ||
                            person.Country ||
                            person.location ||
                            person.nationality
                        );


                    const worth =
                        Number(
                            person.worth ||
                            person.netWorth ||
                            person.net_worth ||
                            person.finalWorth ||
                            0
                        );


                    return {

                        id:
                            person.id ||
                            index + 1,

                        name:
                            person.name ||
                            "Unknown",

                        company:
                            person.company ||
                            person.companyName ||
                            "Unknown",

                        country,

                        flag:
                            getFlag(country),

                        worth,

                        netWorth:
                            person.netWorthDisplay ||
                            person.netWorthText ||
                            (
                                worth
                                    ? "$" +
                                      worth.toFixed(1) +
                                      "B"
                                    : "N/A"
                            )

                    };

                }
            );


        dataSource =
            "LIVE DATA";


        lastUpdated =
            new Date().toISOString();


        showBillionaires();

    }

    catch (error) {

        console.error(
            error
        );


        alert(
            "Could not refresh data."
        );


        if (button) {

            button.disabled =
                false;

            button.innerText =
                "🔄 Refresh Data";

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


/* =========================================================
   NAV EVENTS
========================================================= */

function setupNavigation() {

    document
        .querySelectorAll(
            "[data-nav]"
        )
        .forEach(
            button => {

                button.onclick =
                    function() {

                        const page =
                            button.dataset.nav;


                        if (
                            page === "home"
                        ) {

                            showHome();

                        }

                        else if (
                            page === "billionaires"
                        ) {

                            showBillionaires();

                        }

                        else if (
                            page === "companies"
                        ) {

                            showCompanies();

                        }

                        else if (
                            page === "profile"
                        ) {

                            showProfile();

                        }

                    };

            }
        );
}


/* =========================================================
   HELPERS
========================================================= */

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


function escapeHTML(value) {

    return String(
        value ?? ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );
}
