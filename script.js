/* =========================================================
   WORLD ELITE — SCRIPT
========================================================= */

const app = document.getElementById("app");

let currentUser =
    localStorage.getItem("worldEliteUser") || "";

let favorites = JSON.parse(
    localStorage.getItem("worldEliteFavorites") || "[]"
);


/* =========================================================
   DATA
========================================================= */

const billionaires = [

    {
        id: 1,
        name: "Elon Musk",
        company: "Tesla / SpaceX",
        netWorth: "$715.6B",
        worth: 715.6,
        country: "USA",
        flag: "🇺🇸",
        age: 54
    },

    {
        id: 2,
        name: "Larry Page",
        company: "Google",
        netWorth: "$268.8B",
        worth: 268.8,
        country: "USA",
        flag: "🇺🇸",
        age: 53
    },

    {
        id: 3,
        name: "Sergey Brin",
        company: "Google",
        netWorth: "$248.0B",
        worth: 248,
        country: "USA",
        flag: "🇺🇸",
        age: 53
    },

    {
        id: 4,
        name: "Jeff Bezos",
        company: "Amazon",
        netWorth: "$242.6B",
        worth: 242.6,
        country: "USA",
        flag: "🇺🇸",
        age: 62
    },

    {
        id: 5,
        name: "Michael Dell",
        company: "Dell Technologies",
        netWorth: "$234.4B",
        worth: 234.4,
        country: "USA",
        flag: "🇺🇸",
        age: 61
    },

    {
        id: 6,
        name: "Mark Zuckerberg",
        company: "Meta",
        netWorth: "$203.9B",
        worth: 203.9,
        country: "USA",
        flag: "🇺🇸",
        age: 42
    },

    {
        id: 7,
        name: "Jensen Huang",
        company: "NVIDIA",
        netWorth: "$170.0B",
        worth: 170,
        country: "USA",
        flag: "🇺🇸",
        age: 63
    },

    {
        id: 8,
        name: "Larry Ellison",
        company: "Oracle",
        netWorth: "$156.9B",
        worth: 156.9,
        country: "USA",
        flag: "🇺🇸",
        age: 81
    },

    {
        id: 9,
        name: "Bernard Arnault",
        company: "LVMH",
        netWorth: "$142.7B",
        worth: 142.7,
        country: "France",
        flag: "🇫🇷",
        age: 77
    },

    {
        id: 10,
        name: "Warren Buffett",
        company: "Berkshire Hathaway",
        netWorth: "$141.2B",
        worth: 141.2,
        country: "USA",
        flag: "🇺🇸",
        age: 95
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


/* =========================================================
   HELPERS
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function getWorth(person) {

    if (typeof person.worth === "number") {
        return person.worth;
    }

    const value = String(
        person.netWorth || ""
    )
        .replace(/[$€£,]/g, "")
        .replace(/[A-Za-z]/g, "");

    return parseFloat(value) || 0;

}


function formatWorth(person) {

    if (person.netWorth) {
        return person.netWorth;
    }

    if (person.worth) {
        return "$" + person.worth + "B";
    }

    return "N/A";

}


function normalizeCountry(country) {

    if (!country) return "";

    const value =
        String(country)
            .trim()
            .toLowerCase();

    const countries = {

        usa: "USA",
        "united states": "USA",
        "united states of america": "USA",
        us: "USA",

        france: "France",

        uk: "United Kingdom",
        "united kingdom": "United Kingdom",

        germany: "Germany",

        china: "China",

        india: "India",

        russia: "Russia",

        canada: "Canada",

        italy: "Italy",

        spain: "Spain",

        australia: "Australia",

        switzerland: "Switzerland",

        "south korea": "South Korea",

        japan: "Japan"

    };

    return countries[value] || country;

}


function getFlag(person) {

    if (person.flag && person.flag !== "🌍") {
        return person.flag;
    }

    const country =
        normalizeCountry(person.country)
            .toLowerCase();

    const flags = {

        usa: "🇺🇸",
        france: "🇫🇷",
        "united kingdom": "🇬🇧",
        germany: "🇩🇪",
        china: "🇨🇳",
        india: "🇮🇳",
        russia: "🇷🇺",
        canada: "🇨🇦",
        italy: "🇮🇹",
        spain: "🇪🇸",
        australia: "🇦🇺",
        switzerland: "🇨🇭",
        "south korea": "🇰🇷",
        japan: "🇯🇵"

    };

    return flags[country] || "🌍";

}


/* =========================================================
   START
========================================================= */

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
        .onclick = function () {

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


    document
        .getElementById("signupBtn")
        .onclick = showSignUp;

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


/* =========================================================
   HOME
========================================================= */

function showHome() {

    const richest =
        [...billionaires]
            .sort(
                (a, b) =>
                    getWorth(b) -
                    getWorth(a)
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

                    ${getFlag(richest)}
                    ${escapeHTML(richest.name)}

                </div>

                <div class="money">

                    ${formatWorth(richest)}

                </div>

                <p>

                    ${escapeHTML(richest.company)}

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

    if (!input || !results) return;


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
        billionaires.filter(person => {

            return (

                String(person.name || "")
                    .toLowerCase()
                    .includes(query)

                ||

                String(person.company || "")
                    .toLowerCase()
                    .includes(query)

                ||

                String(person.country || "")
                    .toLowerCase()
                    .includes(query)

            );

        });


    const business =
        companies.filter(company => {

            return (

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
                        ${escapeHTML(person.name)}

                    </div>

                    <div class="card-subtitle">

                        ${escapeHTML(
                            person.company || ""
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

                <div class="card">

                    <div class="card-title">

                        🏢
                        ${escapeHTML(company.name)}

                    </div>

                    <div class="card-subtitle">

                        ${escapeHTML(
                            company.sector
                        )}

                    </div>

                    <p>

                        ${escapeHTML(
                            company.founder
                        )}

                    </p>

                </div>

            `;

        });

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


    document
        .querySelectorAll("[data-person]")
        .forEach(card => {

            card.onclick = function () {

                const person =
                    billionaires.find(
                        item =>
                            String(item.id) ===
                            String(
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
                    Updated automatically
                    when new data is available.
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

                    ${getCountries()
                        .map(country => `

                            <option
                                value="${escapeHTML(country)}"
                            >
                                ${getCountryFlag(country)}
                                ${escapeHTML(country)}
                            </option>

                        `)
                        .join("")}

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


function getCountries() {

    return [
        ...new Set(
            billionaires
                .map(
                    person =>
                        normalizeCountry(
                            person.country
                        )
                )
                .filter(Boolean)
                .filter(
                    country =>
                        country
                            .toLowerCase() !==
                        "unknown"
                )
        )
    ].sort();

}


function getCountryFlag(country) {

    const fakePerson = {
        country: country
    };

    return getFlag(fakePerson);

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
        billionaires.filter(person => {

            const name =
                String(
                    person.name || ""
                ).toLowerCase();

            const company =
                String(
                    person.company || ""
                ).toLowerCase();

            const matchesSearch =
                name.includes(search) ||
                company.includes(search);


            const normalized =
                normalizeCountry(
                    person.country
                );


            const matchesCountry =
                country === "all" ||
                normalized === country;


            return (
                matchesSearch &&
                matchesCountry
            );

        });


    if (sort === "high") {

        list.sort(
            (a, b) =>
                getWorth(b) -
                getWorth(a)
        );

    }


    if (sort === "low") {

        list.sort(
            (a, b) =>
                getWorth(a) -
                getWorth(b)
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


    const container =
        document.getElementById(
            "billionaireList"
        );


    container.innerHTML = "";


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


    list.forEach(
        (person, index) => {

            const card =
                document.createElement("div");


            card.className =
                "card clickable";


            const favorite =
                favorites.includes(
                    person.id
                );


            card.innerHTML = `

                <button
                    class="favorite"
                    aria-label="Favorite"
                >
                    ${favorite ? "⭐" : "☆"}
                </button>


                <div class="rank">

                    #${index + 1}

                </div>


                <div class="card-title">

                    ${getFlag(person)}
                    ${escapeHTML(person.name)}

                </div>


                <div class="card-subtitle">

                    ${escapeHTML(
                        person.company || ""
                    )}

                </div>


                <div class="money">

                    ${formatWorth(person)}

                </div>

            `;


            card
                .querySelector(".favorite")
                .onclick =
                function(event) {

                    event.stopPropagation();

                    toggleFavorite(
                        person.id
                    );

                    renderBillionaires();

                };


            card.onclick = function() {

                showBillionaireDetails(
                    person
                );

            };


            container.appendChild(card);

        }
    );

}


/* =========================================================
   BILLIONAIRE DETAILS
========================================================= */

function showBillionaireDetails(person) {

    const isFavorite =
        favorites.includes(person.id);


    const sortedPeople =
        [...billionaires].sort(
            (a, b) =>
                getWorth(b) -
                getWorth(a)
        );


    const ranking =
        sortedPeople.findIndex(
            item =>
                String(item.id) ===
                String(person.id)
        ) + 1;


    const country =
        normalizeCountry(person.country) ||
        "Unknown";


    const company =
        person.company ||
        "Unknown";


    const netWorth =
        formatWorth(person);


    const change =
        person.change ||
        person.change24h ||
        person.changePercent ||
        null;


    const age =
        person.age || "—";


    const source =
        person.source ||
        "WorldElite Data";


    const updated =
        person.updated ||
        person.lastUpdated ||
        new Date().toLocaleDateString();


    const photo =
        person.photo ||
        person.image ||
        "";


    const investments =
        Array.isArray(person.investments)
            ? person.investments
            : [];


    const history =
        Array.isArray(person.history)
            ? person.history
            : [];


    app.innerHTML = `

        <div class="container">

            <button
                class="back-btn"
                id="backBtn"
            >
                ← Rankings
            </button>


            <div class="profile-card">

                ${
                    photo
                    ?
                    `
                    <img
                        src="${escapeHTML(photo)}"
                        alt="${escapeHTML(
                            person.name ||
                            "Billionaire"
                        )}"
                        class="profile-photo"
                    >
                    `
                    :
                    `
                    <div class="profile-icon">

                        ${getFlag(person)}

                    </div>
                    `
                }


                <div class="country-flag-large">

                    ${getFlag(person)}

                </div>


                <h1>

                    ${escapeHTML(
                        person.name ||
                        "Unknown"
                    )}

                </h1>


                <p>

                    ${escapeHTML(country)}

                </p>


                <div class="big-money">

                    ${netWorth}

                </div>


                <p>
                    Estimated Net Worth
                </p>


                ${
                    change
                    ?
                    `
                    <div class="wealth-change">

                        ${escapeHTML(
                            String(change)
                        )}

                    </div>
                    `
                    :
                    ""
                }


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

                    👤 Personal Information

                </div>


                <div class="info-row">

                    <span>
                        Country
                    </span>

                    <strong>

                        ${getFlag(person)}
                        ${escapeHTML(country)}

                    </strong>

                </div>


                <div class="info-row">

                    <span>
                        Age
                    </span>

                    <strong>

                        ${escapeHTML(
                            String(age)
                        )}

                    </strong>

                </div>


                <div class="info-row">

                    <span>
                        Ranking
                    </span>

                    <strong>

                        #${ranking || "—"}

                    </strong>

                </div>

            </div>



            <div class="card">

                <div class="card-title">

                    🏢 Companies

                </div>

                <p>

                    ${escapeHTML(
                        String(company)
                    )}

                </p>

            </div>



            <div class="card">

                <div class="card-title">

                    📈 Wealth History

                </div>


                ${
                    history.length
                    ?
                    history
                        .map(item => `

                            <div class="info-row">

                                <span>

                                    ${escapeHTML(
                                        item.year ||
                                        item.date ||
                                        "Unknown"
                                    )}

                                </span>

                                <strong>

                                    ${escapeHTML(
                                        item.value ||
                                        item.netWorth ||
                                        "Unknown"
                                    )}

                                </strong>

                            </div>

                        `)
                        .join("")
                    :
                    `
                    <p>

                        Historical wealth data
                        will appear here when
                        available.

                    </p>
                    `
                }

            </div>



            <div class="card">

                <div class="card-title">

                    💼 Investments

                </div>


                ${
                    investments.length
                    ?
                    `
                    <ul>

                        ${investments
                            .map(item => `

                                <li>

                                    ${escapeHTML(
                                        typeof item ===
                                        "string"
                                            ? item
                                            : item.name ||
                                              item.company ||
                                              "Unknown"
                                    )}

                                </li>

                            `)
                            .join("")}

                    </ul>
                    `
                    :
                    `
                    <p>

                        Investment information
                        will appear here when
                        available.

                    </p>
                    `
                }

            </div>



            <div class="card">

                <div class="card-title">

                    📰 Latest Information

                </div>

                <p>

                    WorldElite tracks the
                    latest available information
                    about this individual.

                </p>

            </div>



            <div class="card">

                <div class="card-title">

                    🔗 Data Source

                </div>

                <p>

                    Source:
                    ${escapeHTML(
                        String(source)
                    )}

                </p>

                <p>

                    Last updated:
                    ${escapeHTML(
                        String(updated)
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
        companies.filter(company => {

            return (

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

        });


    container.innerHTML = "";


    list.forEach(company => {

        const card =
            document.createElement("div");


        card.className = "card";


        card.innerHTML = `

            <div class="card-title">

                🏢
                ${escapeHTML(company.name)}

            </div>

            <div class="card-subtitle">

                ${escapeHTML(
                    company.sector
                )}

            </div>

            <p>

                Founder / Leader:
                ${escapeHTML(
                    company.founder
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

                    Real-time business
                    news integration.

                </p>

            </div>


            <div class="card">

                <div class="card-title">
                    💰 Wealth
                </div>

                <p>

                    Track changes in
                    billionaire wealth
                    and rankings.

                </p>

            </div>


            <div class="card">

                <div class="card-title">
                    🏢 Business
                </div>

                <p>

                    Follow companies,
                    markets and
                    entrepreneurs.

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
            .getElementById("exploreBtn")
            .onclick =
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
                ${escapeHTML(person.name)}

            </div>

            <div class="money">

                ${formatWorth(person)}

            </div>

            <p>

                ${escapeHTML(
                    person.company || ""
                )}

            </p>

        `;


        card.onclick = function() {

            showBillionaireDetails(
                person
            );

        };


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
                        currentUser ||
                        "Guest"
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
   FAVORITES SYSTEM
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
   REFRESH
========================================================= */

function refreshWorldEliteData() {

    const button =
        document.getElementById(
            "refreshDataBtn"
        );


    if (button) {

        button.disabled = true;

        button.innerText =
            "⏳ Updating...";

    }


    setTimeout(() => {

        if (button) {

            button.disabled = false;

            button.innerText =
                "🔄 Refresh Data";

        }

        alert(
            "WorldElite data refreshed."
        );

    }, 700);

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

            button.onclick = function() {

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
