/* =========================================================
   WORLDELITE — MAIN SCRIPT
   ========================================================= */

let billionaires = [];
let companies = [];

let currentSort = "highest";
let currentCountry = "all";
let currentSearch = "";


/* =========================================================
   DATA
   ========================================================= */

async function loadData() {
    try {
        const response = await fetch("data.json?cache=" + Date.now(), {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Could not load data.json");
        }

        const raw = await response.json();

        /*
         Supports:

         [
           {...},
           {...}
         ]

         OR

         {
           "billionaires": [...],
           "companies": [...]
         }
        */

        if (Array.isArray(raw)) {
            billionaires = raw;
            companies = [];
        } else {
            billionaires =
                raw.billionaires ||
                raw.people ||
                raw.richest ||
                raw.data ||
                [];

            companies =
                raw.companies ||
                raw.businesses ||
                [];
        }

        if (!Array.isArray(billionaires)) {
            billionaires = [];
        }

        if (!Array.isArray(companies)) {
            companies = [];
        }

        normalizeData();

        updateHomeStats();
        populateCountryFilter();
        renderHome();
        renderRankings();
        renderCompanies();

    } catch (error) {
        console.error("WorldElite data error:", error);

        billionaires = [];
        companies = [];

        updateHomeStats();

        const list = document.getElementById("billionaireList");

        if (list) {
            list.innerHTML = `
                <div class="empty">
                    Unable to load data.
                </div>
            `;
        }
    }
}


/* =========================================================
   NORMALIZE DATA
   ========================================================= */

function normalizeData() {

    billionaires = billionaires.map((person, index) => {

        const name =
            person.name ||
            person.fullName ||
            person.personName ||
            person.title ||
            "Unknown";

        const country =
            person.country ||
            person.countryName ||
            person.nationality ||
            person.location ||
            "Unknown";

        let netWorth =
            person.netWorth ??
            person.net_worth ??
            person.worth ??
            person.wealth ??
            person.netWorthBillion ??
            person.net_worth_billions ??
            person.value ??
            0;

        netWorth = parseMoney(netWorth);

        const company =
            person.company ||
            person.companyName ||
            person.companies ||
            person.business ||
            "";

        const flag =
            person.flag ||
            getCountryFlag(country);

        return {
            ...person,

            id:
                person.id ||
                person.slug ||
                slugify(name) ||
                String(index),

            name: name,

            country: country,

            flag: flag,

            netWorth: netWorth,

            company: company
        };
    });


    companies = companies.map((company, index) => {

        return {
            ...company,

            id:
                company.id ||
                company.slug ||
                String(index),

            name:
                company.name ||
                company.companyName ||
                company.title ||
                "Unknown Company",

            country:
                company.country ||
                company.countryName ||
                "Unknown",

            flag:
                company.flag ||
                getCountryFlag(
                    company.country ||
                    company.countryName ||
                    ""
                ),

            value: parseMoney(
                company.value ||
                company.marketCap ||
                company.market_cap ||
                company.valuation ||
                0
            )
        };
    });
}


/* =========================================================
   MONEY PARSER
   ========================================================= */

function parseMoney(value) {

    if (value === null || value === undefined) {
        return 0;
    }

    if (typeof value === "number") {
        return value;
    }

    let text = String(value)
        .trim()
        .replace(/[$,\s]/g, "")
        .toUpperCase();

    if (!text) {
        return 0;
    }

    /*
       $789.9B
       789.9B
       789.9
       789900000000
    */

    let multiplier = 1;

    if (text.endsWith("T")) {
        multiplier = 1000;
        text = text.slice(0, -1);
    } else if (text.endsWith("B")) {
        multiplier = 1;
        text = text.slice(0, -1);
    } else if (text.endsWith("M")) {
        multiplier = 0.001;
        text = text.slice(0, -1);
    }

    const number = parseFloat(text);

    if (isNaN(number)) {
        return 0;
    }

    /*
       If data is raw dollars, convert to billions.
    */

    if (
        multiplier === 1 &&
        number > 100000
    ) {
        return number / 1000000000;
    }

    return number * multiplier;
}


/* =========================================================
   HELPERS
   ========================================================= */

function slugify(text) {
    return String(text)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}


function formatMoney(value) {

    const number = Number(value) || 0;

    if (number >= 1000) {
        return "$" + number.toLocaleString("en-US", {
            maximumFractionDigits: 1
        }) + "B";
    }

    return "$" + number.toLocaleString("en-US", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    }) + "B";
}


/* =========================================================
   COUNTRY FLAGS
   ========================================================= */

const countryCodes = {

    "United States": "US",
    "United States of America": "US",
    "USA": "US",
    "US": "US",

    "United Kingdom": "GB",
    "UK": "GB",
    "Britain": "GB",

    "France": "FR",
    "Germany": "DE",
    "Italy": "IT",
    "Spain": "ES",
    "Portugal": "PT",

    "Canada": "CA",
    "Mexico": "MX",

    "Brazil": "BR",
    "Argentina": "AR",

    "China": "CN",
    "Japan": "JP",
    "South Korea": "KR",
    "Korea": "KR",
    "India": "IN",

    "Australia": "AU",
    "New Zealand": "NZ",

    "Russia": "RU",
    "Ukraine": "UA",

    "Turkey": "TR",
    "Türkiye": "TR",

    "Israel": "IL",
    "Saudi Arabia": "SA",
    "United Arab Emirates": "AE",

    "Switzerland": "CH",
    "Sweden": "SE",
    "Norway": "NO",
    "Denmark": "DK",
    "Netherlands": "NL",
    "Belgium": "BE",
    "Ireland": "IE",

    "Singapore": "SG",
    "Hong Kong": "HK",

    "Indonesia": "ID",
    "Thailand": "TH",
    "Malaysia": "MY",

    "South Africa": "ZA",
    "Nigeria": "NG",
    "Egypt": "EG"
};


function getCountryCode(country) {

    const value = String(country || "").trim();

    if (!value) {
        return "";
    }

    if (/^[A-Za-z]{2}$/.test(value)) {
        return value.toUpperCase();
    }

    return countryCodes[value] || "";
}


function getCountryFlag(country) {

    const code = getCountryCode(country);

    if (!code) {
        return "🌍";
    }

    return code
        .toUpperCase()
        .split("")
        .map(letter =>
            String.fromCodePoint(
                127397 + letter.charCodeAt(0)
            )
        )
        .join("");
}


/* =========================================================
   PAGE NAVIGATION
   ========================================================= */

function openPage(pageId) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {
        page.classList.add("hidden");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.remove("hidden");
    }

    updateNavigation(pageId);

    window.scrollTo({
        top: 0,
        behavior: "instant"
    });

    if (pageId === "homePage") {
        renderHome();
    }

    if (pageId === "rankingsPage") {
        renderRankings();
    }

    if (pageId === "companiesPage") {
        renderCompanies();
    }

    if (pageId === "profilePage") {
        renderProfile();
    }
}


/* =========================================================
   NAVIGATION STATE
   ========================================================= */

function updateNavigation(pageId) {

    const navHome = document.getElementById("navHome");
    const navRankings = document.getElementById("navRankings");
    const navCompanies = document.getElementById("navCompanies");
    const navProfile = document.getElementById("navProfile");

    [
        navHome,
        navRankings,
        navCompanies,
        navProfile
    ].forEach(button => {

        if (button) {
            button.classList.remove("active");
        }

    });

    if (pageId === "homePage" && navHome) {
        navHome.classList.add("active");
    }

    if (
        (pageId === "rankingsPage" ||
        pageId === "personPage") &&
        navRankings
    ) {
        navRankings.classList.add("active");
    }

    if (pageId === "companiesPage" && navCompanies) {
        navCompanies.classList.add("active");
    }

    if (pageId === "profilePage" && navProfile) {
        navProfile.classList.add("active");
    }
}


/* =========================================================
   HOME
   ========================================================= */

function updateHomeStats() {

    const billionaireCount =
        document.getElementById("homeBillionaireCount");

    const companyCount =
        document.getElementById("homeCompanyCount");

    if (billionaireCount) {
        billionaireCount.textContent =
            billionaires.length.toLocaleString("en-US");
    }

    if (companyCount) {
        companyCount.textContent =
            companies.length.toLocaleString("en-US");
    }
}


function renderHome() {

    const container =
        document.getElementById("homeBillionaires");

    if (!container) {
        return;
    }

    const top = [...billionaires]
        .sort((a, b) => b.netWorth - a.netWorth)
        .slice(0, 10);

    container.innerHTML =
        top.map((person, index) =>
            billionaireCard(person, index + 1)
        ).join("");
}


/* =========================================================
   RANKINGS
   ========================================================= */

function renderRankings() {

    const list =
        document.getElementById("billionaireList");

    if (!list) {
        return;
    }

    let result = [...billionaires];

    if (currentSearch) {

        const query =
            currentSearch.toLowerCase();

        result = result.filter(person => {

            return (
                person.name.toLowerCase().includes(query) ||
                person.country.toLowerCase().includes(query) ||
                String(person.company)
                    .toLowerCase()
                    .includes(query)
            );

        });
    }


    if (currentCountry !== "all") {

        result = result.filter(person => {

            return (
                person.country === currentCountry ||
                getCountryCode(person.country) === currentCountry
            );

        });
    }


    if (currentSort === "highest") {

        result.sort(
            (a, b) =>
                b.netWorth - a.netWorth
        );

    } else {

        result.sort(
            (a, b) =>
                a.netWorth - b.netWorth
        );

    }


    const count =
        document.getElementById("rankingCount");

    if (count) {

        count.textContent =
            result.length.toLocaleString("en-US") +
            " billionaires";

    }


    updateSortButtons();


    list.innerHTML =
        result.map((person, index) =>
            billionaireCard(person, index + 1)
        ).join("");
}


/* =========================================================
   BILLIONAIRE CARD
   ========================================================= */

function billionaireCard(person, rank) {

    const safeId =
        String(person.id)
            .replace(/'/g, "\\'")
            .replace(/"/g, "&quot;");

    return `
        <button
            type="button"
            class="billionaire-card"
            onclick="openPerson('${safeId}')"
        >

            <span class="rank">
                ${rank}
            </span>

            <span class="avatar">
                👤
            </span>

            <span class="person-info">

                <strong>
                    ${escapeHTML(person.name)}
                </strong>

                <span class="country-line">

                    ${person.flag || "🌍"}

                    ${escapeHTML(
                        getCountryCode(person.country) ||
                        person.country ||
                        "Unknown"
                    )}

                </span>

            </span>

            <span class="worth">
                ${formatMoney(person.netWorth)}
            </span>

        </button>
    `;
}


/* =========================================================
   OPEN PERSON
   ========================================================= */

function openPerson(id) {

    const person =
        billionaires.find(
            item => String(item.id) === String(id)
        );

    if (!person) {
        return;
    }

    const content =
        document.getElementById("personContent");

    if (!content) {
        return;
    }

    content.innerHTML = `

        <div class="person-card">

            <div class="person-flag">
                ${person.flag || "🌍"}
            </div>

            <h1>
                ${escapeHTML(person.name)}
            </h1>

            <p class="person-country">
                ${escapeHTML(person.country)}
            </p>

            <div class="person-worth">
                ${formatMoney(person.netWorth)}
            </div>

            <p>
                Estimated Net Worth
            </p>

            ${
                person.company
                ? `
                    <div class="person-company">
                        🏢 ${escapeHTML(
                            Array.isArray(person.company)
                                ? person.company.join(", ")
                                : person.company
                        )}
                    </div>
                `
                : ""
            }

            <button
                type="button"
                onclick="addFavorite('${String(person.id).replace(/'/g, "\\'")}')"
            >
                ☆ Add Favorite
            </button>

        </div>

        <div class="wealth-box">

            <h2>📊 Wealth</h2>

            <p>
                Current estimated net worth:
                <strong>
                    ${formatMoney(person.netWorth)}
                </strong>
            </p>

        </div>
    `;

    openPage("personPage");
}


/* =========================================================
   SEARCH
   ========================================================= */

function handleGlobalSearch() {

    const input =
        document.getElementById("globalSearchInput");

    if (!input) {
        return;
    }

    currentSearch =
        input.value.trim();

    renderRankings();
}


/* =========================================================
   SORT
   ========================================================= */

function sortBillionaires(order) {

    currentSort = order;

    renderRankings();
}


function updateSortButtons() {

    const highest =
        document.getElementById("highestButton");

    const lowest =
        document.getElementById("lowestButton");

    if (highest) {
        highest.classList.toggle(
            "active",
            currentSort === "highest"
        );
    }

    if (lowest) {
        lowest.classList.toggle(
            "active",
            currentSort === "lowest"
        );
    }
}


/* =========================================================
   COUNTRY FILTER
   ========================================================= */

function populateCountryFilter() {

    const select =
        document.getElementById("countryFilter");

    if (!select) {
        return;
    }

    const countries = new Map();

    billionaires.forEach(person => {

        const country =
            person.country;

        const code =
            getCountryCode(country);

        if (
            country &&
            country.toLowerCase() !== "unknown" &&
            country.toLowerCase() !== "unknown country"
        ) {

            countries.set(
                code || country,
                {
                    name: country,
                    code: code
                }
            );
        }

    });


    const sorted =
        [...countries.entries()]
            .sort((a, b) =>
                a[1].name.localeCompare(
                    b[1].name
                )
            );


    select.innerHTML =
        `<option value="all">🌍 All Countries</option>`;


    sorted.forEach(([key, country]) => {

        const option =
            document.createElement("option");

        option.value =
            country.code || country.name;

        option.textContent =
            `${getCountryFlag(country.name)} ${country.name}`;

        select.appendChild(option);

    });


    select.value =
        currentCountry === "all"
            ? "all"
            : currentCountry;
}


function filterBillionaires() {

    const select =
        document.getElementById("countryFilter");

    if (!select) {
        return;
    }

    currentCountry =
        select.value;

    renderRankings();
}


/* =========================================================
   REFRESH
   ========================================================= */

async function refreshData() {

    const buttons =
        document.querySelectorAll(
            ".control"
        );

    buttons.forEach(button => {
        button.disabled = true;
    });

    try {

        await loadData();

    } catch (error) {

        console.error(error);

    } finally {

        buttons.forEach(button => {
            button.disabled = false;
        });

    }
}


/* =========================================================
   COMPANIES
   ========================================================= */

function renderCompanies() {

    const list =
        document.getElementById("companyList");

    if (!list) {
        return;
    }

    if (!companies.length) {

        list.innerHTML = `
            <div class="empty">
                No companies available yet.
            </div>
        `;

        return;
    }

    list.innerHTML =
        companies.map((company, index) => `

            <div class="company-card">

                <div class="company-icon">
                    🏢
                </div>

                <div>

                    <strong>
                        ${escapeHTML(company.name)}
                    </strong>

                    <p>
                        ${company.flag || "🌍"}
                        ${escapeHTML(company.country)}
                    </p>

                </div>

                <strong>
                    ${
                        company.value
                            ? formatMoney(company.value)
                            : ""
                    }
                </strong>

            </div>

        `).join("");
}


function searchCompanies() {

    const input =
        document.getElementById(
            "companySearchInput"
        );

    const list =
        document.getElementById(
            "companyList"
        );

    if (!input || !list) {
        return;
    }

    const query =
        input.value
            .trim()
            .toLowerCase();


    const result =
        companies.filter(company => {

            return (
                company.name
                    .toLowerCase()
                    .includes(query) ||

                company.country
                    .toLowerCase()
                    .includes(query)
            );

        });


    if (!result.length) {

        list.innerHTML = `
            <div class="empty">
                No companies found.
            </div>
        `;

        return;
    }


    list.innerHTML =
        result.map(company => `

            <div class="company-card">

                <div class="company-icon">
                    🏢
                </div>

                <div>

                    <strong>
                        ${escapeHTML(company.name)}
                    </strong>

                    <p>
                        ${company.flag || "🌍"}
                        ${escapeHTML(company.country)}
                    </p>

                </div>

            </div>

        `).join("");
}


/* =========================================================
   PROFILE
   ========================================================= */

function renderProfile() {

    const content =
        document.getElementById(
            "profileContent"
        );

    if (!content) {
        return;
    }

    content.innerHTML = `

        <div class="profile-card">

            <div class="profile-avatar">
                👤
            </div>

            <h2>
                WorldElite
            </h2>

            <p>
                Your WorldElite account
            </p>

            <div class="profile-buttons">

                <button
                    type="button"
                    onclick="showLogin()"
                >
                    Login
                </button>

                <button
                    type="button"
                    onclick="showSignup()"
                >
                    Sign up
                </button>

            </div>

        </div>
    `;
}


/* =========================================================
   LOGIN / SIGN UP
   ========================================================= */

function showLogin() {

    const content =
        document.getElementById(
            "profileContent"
        );

    if (!content) {
        return;
    }

    content.innerHTML = `

        <div class="auth-card">

            <h2>
                Login
            </h2>

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

            <button
                type="button"
                onclick="loginUser()"
            >
                Login
            </button>

            <button
                type="button"
                onclick="renderProfile()"
            >
                Back
            </button>

        </div>
    `;
}


function showSignup() {

    const content =
        document.getElementById(
            "profileContent"
        );

    if (!content) {
        return;
    }

    content.innerHTML = `

        <div class="auth-card">

            <h2>
                Create account
            </h2>

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

            <button
                type="button"
                onclick="signupUser()"
            >
                Sign up
            </button>

            <button
                type="button"
                onclick="renderProfile()"
            >
                Back
            </button>

        </div>
    `;
}


function loginUser() {

    alert("Login system is ready for connection to a backend.");
}


function signupUser() {

    alert("Sign up system is ready for connection to a backend.");
}


/* =========================================================
   FAVORITES
   ========================================================= */

function addFavorite(id) {

    try {

        let favorites =
            JSON.parse(
                localStorage.getItem(
                    "worldeliteFavorites"
                ) || "[]"
            );

        if (!favorites.includes(String(id))) {

            favorites.push(String(id));

            localStorage.setItem(
                "worldeliteFavorites",
                JSON.stringify(favorites)
            );

        }

        alert("Added to favorites.");

    } catch (error) {

        console.error(error);

    }
}


/* =========================================================
   HTML SECURITY
   ========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   START APP
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        openPage("homePage");

        loadData();

    }
);
