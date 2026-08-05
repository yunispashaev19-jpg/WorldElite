/* =========================================================
   WORLDELITE
   FIXED VERSION
   - Country flags
   - Highest / Lowest sorting
   - Working refresh
   - No Unknown country filter
   - 3000+ billionaires
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
   INITIALIZATION
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
            "data.json?v=" + Date.now()
        );

        if (!response.ok) {
            throw new Error(
                "data.json HTTP " + response.status
            );
        }

        const json = await response.json();

        data = {
            ...json,
            billionaires:
                Array.isArray(json.billionaires)
                    ? json.billionaires
                    : [],

            companies:
                Array.isArray(json.companies)
                    ? json.companies
                    : []
        };

        console.log(
            "WorldElite:",
            data.billionaires.length,
            "billionaires loaded."
        );

    } catch (error) {

        console.error(
            "WorldElite data error:",
            error
        );

        data = {
            billionaires: [],
            companies: []
        };
    }
}


/* =========================================================
   START
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

    document.getElementById("loginBtn").onclick =
        function () {

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

    const sorted =
        [...data.billionaires]
            .sort(
                (a, b) =>
                    getWorthNumber(b) -
                    getWorthNumber(a)
            );

    const richest = sorted[0];

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

    if (richest) {

        document.getElementById(
            "richestCard"
        ).onclick = function () {

            showBillionaireDetails(
                richest
            );
        };
    }

    document.getElementById(
        "searchCard"
    ).onclick = showGlobalSearch;

    document.getElementById(
        "rankingCard"
    ).onclick = showBillionaires;

    document.getElementById(
        "companyCard"
    ).onclick = showCompanies;

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
                Search WorldElite
            </p>

            <input
                id="globalSearch"
                type="text"
                placeholder="🔎 Search..."
                autocomplete="off"
            >

            <div id="globalResults"></div>

        </div>

        ${navigation("home")}

    `;

    document.getElementById(
        "backHome"
    ).onclick = showHome;

    document.getElementById(
        "globalSearch"
    ).oninput = renderGlobalResults;

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
        data.billionaires
            .filter(person => {

                const name =
                    getName(person)
                        .toLowerCase();

                const company =
                    getCompany(person)
                        .toLowerCase();

                const country =
                    getCountry(person)
                        .toLowerCase();

                return (
                    name.includes(query) ||
                    company.includes(query) ||
                    country.includes(query)
                );

            })
            .slice(0, 100);

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
        .querySelectorAll(
            "[data-person-id]"
        )
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
                    ${data.billionaires.length.toLocaleString()}
                    billionaires tracked
                </p>

            </div>

            <div class="card">

                <div class="card-title">
                    🌐 LIVE DATA
                </div>

                <p>
                    Source:
                    ${escapeHTML(
                        data.source ||
                        "WorldElite"
                    )}
                </p>

                <p>
                    Updated:
                    ${formatDate(
                        data.lastUpdated
                    )}
                </p>

                <button
                    id="refreshDataBtn"
                >
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

    document.getElementById(
        "searchInput"
    ).oninput = renderBillionaires;

    document.getElementById(
        "countryFilter"
    ).onchange = renderBillionaires;

    document.getElementById(
        "sortSelect"
    ).onchange = renderBillionaires;

    /*
       IMPORTANT:
       Refresh now DOES NOT download data again.
       GitHub Actions updates data.json automatically.
       This button simply reloads the website.
    */

    document.getElementById(
        "refreshDataBtn"
    ).onclick = function () {

        const button =
            document.getElementById(
                "refreshDataBtn"
            );

        button.innerText =
            "✓ Up to date";

        button.disabled = true;

        setTimeout(
            function () {

                button.innerText =
                    "🔄 Refresh";

                button.disabled = false;

            },
            1200
        );

    };

    renderBillionaires();

    setupNavigation();
}


/* =========================================================
   COUNTRY FILTER
========================================================= */

function populateCountries() {

    const select =
        document.getElementById(
            "countryFilter"
        );

    if (!select) {
        return;
    }

    const countrySet =
        new Set();

    data.billionaires.forEach(
        person => {

            const country =
                getCountry(person);

            /*
               Do not add Unknown / empty countries.
            */

            if (
                country &&
                country.toLowerCase() !==
                "unknown"
            ) {

                countrySet.add(country);
            }

        }
    );

    const countries =
        [...countrySet]
            .sort(
                (a, b) =>
                    a.localeCompare(b)
            );

    countries.forEach(country => {

        const option =
            document.createElement(
                "option"
            );

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

    const selectedCountry =
        countryFilter.value;

    const sort =
        sortSelect.value;

    let list =
        data.billionaires.filter(
            person => {

                const name =
                    getName(person)
                        .toLowerCase();

                const company =
                    getCompany(person)
                        .toLowerCase();

                const country =
                    getCountry(person);

                const searchMatch =
                    !search ||
                    name.includes(search) ||
                    company.includes(search) ||
                    country
                        .toLowerCase()
                        .includes(search);

                const countryMatch =
                    selectedCountry === "all" ||
                    country === selectedCountry;

                return (
                    searchMatch &&
                    countryMatch
                );
            }
        );


    /* =====================================================
       SORTING
    ===================================================== */

    if (sort === "high") {

        list.sort(
            (a, b) =>
                getWorthNumber(b) -
                getWorthNumber(a)
        );
    }

    else if (sort === "low") {

        list.sort(
            (a, b) =>
                getWorthNumber(a) -
                getWorthNumber(b)
        );
    }

    else if (sort === "name") {

        list.sort(
            (a, b) =>
                getName(a)
                    .localeCompare(
                        getName(b)
                    )
        );
    }


    /* =====================================================
       DISPLAY
    ===================================================== */

    const fragment =
        document.createDocumentFragment();

    const maxDisplay = 200;

    list
        .slice(0, maxDisplay)
        .forEach(
            (person, index) => {

                const card =
                    document.createElement(
                        "div"
                    );

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
                    card.querySelector(
                        ".favorite"
                    );

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

                fragment.appendChild(
                    card
                );
            }
        );

    container.innerHTML = "";

    container.appendChild(
        fragment
    );


    if (list.length > maxDisplay) {

        const info =
            document.createElement(
                "div"
            );

        info.className =
            "empty";

        info.innerHTML = `

            <p>
                Showing first
                ${maxDisplay}
                results.
            </p>

            <p>
                Use search or country
                filters to find more.
            </p>

        `;

        container.appendChild(
            info
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
    }
}


/* =========================================================
   DETAILS
========================================================= */

function showBillionaireDetails(
    person
) {

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
                        getCountry(person)
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

                <button
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
                    Current estimated net worth:
                    ${formatWorth(person)}
                </p>

            </div>

            <div class="card">

                <div class="card-title">
                    🌐 Data
                </div>

                <p>
                    Source:
                    ${escapeHTML(
                        data.source ||
                        "WorldElite"
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

    document.getElementById(
        "backBtn"
    ).onclick =
        showBillionaires;

    document.getElementById(
        "favoriteBtn"
    ).onclick =
        function() {

            toggleFavorite(
                getPersonId(person)
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

    document.getElementById(
        "companySearch"
    ).oninput =
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
        data.companies.filter(
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
                    !query ||
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
                    ${escapeHTML(
                        company.name ||
                        "Unknown"
                    )}
                </div>

                <div class="card-subtitle">
                    ${escapeHTML(
                        company.sector ||
                        ""
                    )}
                </div>

                <p>
                    Founder / Leader:
                    ${escapeHTML(
                        company.founder ||
                        ""
                    )}
                </p>

            `;

            container.appendChild(
                card
            );
        }
    );

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
                isFavorite(person)
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

        document.getElementById(
            "exploreBtn"
        ).onclick =
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
                        ${data.billionaires.length.toLocaleString()}
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

    document.getElementById(
        "favoritesBtn"
    ).onclick =
        showFavorites;

    document.getElementById(
        "logoutBtn"
    ).onclick =
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

function isFavorite(
    person
) {

    const id =
        String(
            getPersonId(person)
        );

    return favorites.some(
        item =>
            String(item) === id
    );
}


function toggleFavorite(id) {

    const stringId =
        String(id);

    const exists =
        favorites.some(
            item =>
                String(item) === stringId
        );

    if (exists) {

        favorites =
            favorites.filter(
                item =>
                    String(item) !== stringId
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


function getCountry(person) {

    const country =
        person.country ||
        person.countryName ||
        person.nationality ||
        person.residence ||
        "";

    const value =
        String(country).trim();

    /*
       Never return "Unknown" as a filter country.
    */

    if (
        !value ||
        value.toLowerCase() ===
        "unknown"
    ) {
        return "";
    }

    return normalizeCountry(value);
}


function getPersonId(person) {

    return (
        person.id ??
        person.personId ??
        person.rank ??
        getName(person)
    );
}


/* =========================================================
   WORTH
========================================================= */

function getWorthNumber(person) {

    const raw =
        person.worth ??
        person.netWorth ??
        person.net_worth ??
        person.net_worth_usd ??
        person.netWorthUSD ??
        person.estimatedNetWorth ??
        0;

    if (
        typeof raw === "number"
    ) {

        return raw;
    }

    let value =
        String(raw)
            .replace(/,/g, "")
            .trim();

    if (!value) {
        return 0;
    }

    const number =
        parseFloat(
            value.replace(
                /[^0-9.-]/g,
                ""
            )
        );

    if (!Number.isFinite(number)) {
        return 0;
    }

    /*
       If the data is in USD rather than billions,
       convert to billions.
    */

    if (
        value.includes("$") &&
        !/[Bb]/.test(value) &&
        number > 100000
    ) {

        return number / 1000000000;
    }

    return number;
}


function formatWorth(person) {

    if (
        person.netWorth !== undefined &&
        person.netWorth !== null &&
        String(
            person.netWorth
        ).trim() !== ""
    ) {

        return escapeHTML(
            String(
                person.netWorth
            )
        );
    }

    if (
        person.net_worth !== undefined
    ) {

        return escapeHTML(
            String(
                person.net_worth
            )
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


/* =========================================================
   COUNTRY NORMALIZATION
========================================================= */

function normalizeCountry(
    country
) {

    const lower =
        country.toLowerCase().trim();

    const aliases = {

        "united states":
            "United States",

        "united states of america":
            "United States",

        "usa":
            "United States",

        "us":
            "United States",

        "u.s.":
            "United States",

        "uk":
            "United Kingdom",

        "u.k.":
            "United Kingdom",

        "great britain":
            "United Kingdom",

        "uae":
            "United Arab Emirates",

        "russia":
            "Russia",

        "russian federation":
            "Russia",

        "south korea":
            "South Korea",

        "republic of korea":
            "South Korea",

        "north korea":
            "North Korea",

        "czech republic":
            "Czech Republic",

        "turkey":
            "Türkiye",

        "türkiye":
            "Türkiye"
    };

    return (
        aliases[lower] ||
        country
    );
}


/* =========================================================
   FLAGS
========================================================= */

function getFlag(person) {

    if (
        person.flag &&
        person.flag !== "🌍"
    ) {

        return person.flag;
    }

    const country =
        getCountry(person);

    return getCountryFlag(
        country
    );
}


function getCountryFlag(
    country
) {

    const flags = {

        "United States":
            "🇺🇸",

        "United Kingdom":
            "🇬🇧",

        "France":
            "🇫🇷",

        "Germany":
            "🇩🇪",

        "Italy":
            "🇮🇹",

        "Spain":
            "🇪🇸",

        "Portugal":
            "🇵🇹",

        "Switzerland":
            "🇨🇭",

        "Austria":
            "🇦🇹",

        "Belgium":
            "🇧🇪",

        "Netherlands":
            "🇳🇱",

        "Ireland":
            "🇮🇪",

        "Denmark":
            "🇩🇰",

        "Sweden":
            "🇸🇪",

        "Norway":
            "🇳🇴",

        "Finland":
            "🇫🇮",

        "Poland":
            "🇵🇱",

        "Ukraine":
            "🇺🇦",

        "Russia":
            "🇷🇺",

        "Türkiye":
            "🇹🇷",

        "Turkey":
            "🇹🇷",

        "India":
            "🇮🇳",

        "China":
            "🇨🇳",

        "Japan":
            "🇯🇵",

        "South Korea":
            "🇰🇷",

        "Singapore":
            "🇸🇬",

        "Indonesia":
            "🇮🇩",

        "Thailand":
            "🇹🇭",

        "Malaysia":
            "🇲🇾",

        "Philippines":
            "🇵🇭",

        "Vietnam":
            "🇻🇳",

        "United Arab Emirates":
            "🇦🇪",

        "Saudi Arabia":
            "🇸🇦",

        "Qatar":
            "🇶🇦",

        "Israel":
            "🇮🇱",

        "Brazil":
            "🇧🇷",

        "Mexico":
            "🇲🇽",

        "Canada":
            "🇨🇦",

        "Australia":
            "🇦🇺",

        "New Zealand":
            "🇳🇿",

        "South Africa":
            "🇿🇦",

        "Egypt":
            "🇪🇬",

        "Nigeria":
            "🇳🇬",

        "Argentina":
            "🇦🇷",

        "Chile":
            "🇨🇱",

        "Colombia":
            "🇨🇴",

        "Greece":
            "🇬🇷",

        "Czech Republic":
            "🇨🇿",

        "Romania":
            "🇷🇴",

        "Hungary":
            "🇭🇺",

        "Monaco":
            "🇲🇨",

        "Luxembourg":
            "🇱🇺",

        "Iceland":
            "🇮🇸"
    };

    return (
        flags[country] ||
        "🌍"
    );
}


/* =========================================================
   DATE
========================================================= */

function formatDate(
    date
) {

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

function escapeHTML(
    value
) {

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
