// ==========================================
// WORLDELITE — MAIN SCRIPT
// ==========================================

let worldEliteData = [];
let currentBillionaires = [];
let currentSort = "highest";
let currentCountry = "all";
let currentPerson = null;


// ==========================================
// LOAD DATA
// ==========================================

async function loadData() {

    try {

        const response = await fetch(
            "data.json?t=" + Date.now()
        );

        if (!response.ok) {
            throw new Error("Could not load data.json");
        }

        const data = await response.json();

        // Support different data.json structures
        if (Array.isArray(data)) {
            worldEliteData = data;
        }

        else if (Array.isArray(data.billionaires)) {
            worldEliteData = data.billionaires;
        }

        else if (Array.isArray(data.people)) {
            worldEliteData = data.people;
        }

        else if (Array.isArray(data.data)) {
            worldEliteData = data.data;
        }

        else {
            worldEliteData = [];
        }

        currentBillionaires = [...worldEliteData];

        populateCountries();

        renderHome();

        renderBillionaires();

        updateHomeStats();

    } catch (error) {

        console.error("WorldElite data error:", error);

        const list =
            document.getElementById("billionaireList");

        if (list) {
            list.innerHTML = `
                <div class="empty-state">
                    <h3>Unable to load data</h3>
                    <p>Please refresh the page.</p>
                </div>
            `;
        }
    }
}


// ==========================================
// GET NAME
// ==========================================

function getPersonName(person) {

    return (
        person.name ||
        person.personName ||
        person.full_name ||
        person.fullName ||
        "Unknown"
    );
}


// ==========================================
// GET COUNTRY
// ==========================================

function getPersonCountry(person) {

    return (
        person.country ||
        person.country_name ||
        person.countryName ||
        person.nationality ||
        "Unknown"
    );
}


// ==========================================
// GET NET WORTH
// ==========================================

function getNetWorth(person) {

    let value =
        person.netWorth ??
        person.net_worth ??
        person.networth ??
        person.worth ??
        person.wealth ??
        person.estimated_net_worth ??
        0;

    // Handle strings such as "$245.6B"
    if (typeof value === "string") {

        let cleaned =
            value
                .replace(/\$/g, "")
                .replace(/,/g, "")
                .trim()
                .toUpperCase();

        if (cleaned.endsWith("T")) {

            return (
                parseFloat(cleaned.replace("T", "")) *
                1000
            );
        }

        if (cleaned.endsWith("B")) {

            return parseFloat(
                cleaned.replace("B", "")
            );
        }

        if (cleaned.endsWith("M")) {

            return (
                parseFloat(cleaned.replace("M", "")) /
                1000
            );
        }

        value = parseFloat(cleaned);
    }

    value = Number(value);

    return Number.isFinite(value) ? value : 0;
}


// ==========================================
// FORMAT NET WORTH
// ==========================================

function formatNetWorth(value) {

    value = Number(value);

    if (!Number.isFinite(value)) {
        return "$0.0B";
    }

    if (value >= 1000) {

        return (
            "$" +
            (value / 1000).toFixed(1) +
            "T"
        );
    }

    return "$" + value.toFixed(1) + "B";
}


// ==========================================
// COUNTRY FLAG
// ==========================================

function getFlag(country) {

    if (!country) return "🌍";

    const normalized =
        country
            .toLowerCase()
            .trim();

    const flags = {

        "united states": "🇺🇸",
        "united states of america": "🇺🇸",
        "usa": "🇺🇸",

        "uk": "🇬🇧",
        "united kingdom": "🇬🇧",
        "england": "🇬🇧",

        "france": "🇫🇷",

        "germany": "🇩🇪",

        "italy": "🇮🇹",

        "spain": "🇪🇸",

        "portugal": "🇵🇹",

        "ukraine": "🇺🇦",

        "russia": "🇷🇺",

        "turkey": "🇹🇷",

        "azerbaijan": "🇦🇿",

        "china": "🇨🇳",

        "india": "🇮🇳",

        "japan": "🇯🇵",

        "south korea": "🇰🇷",

        "singapore": "🇸🇬",

        "australia": "🇦🇺",

        "canada": "🇨🇦",

        "brazil": "🇧🇷",

        "mexico": "🇲🇽",

        "saudi arabia": "🇸🇦",

        "united arab emirates": "🇦🇪",

        "israel": "🇮🇱",

        "switzerland": "🇨🇭",

        "sweden": "🇸🇪",

        "norway": "🇳🇴",

        "denmark": "🇩🇰",

        "netherlands": "🇳🇱",

        "belgium": "🇧🇪",

        "ireland": "🇮🇪",

        "poland": "🇵🇱",

        "thailand": "🇹🇭",

        "indonesia": "🇮🇩",

        "philippines": "🇵🇭",

        "south africa": "🇿🇦",

        "egypt": "🇪🇬",

        "monaco": "🇲🇨",

        "czech republic": "🇨🇿",

        "czechia": "🇨🇿",

        "austria": "🇦🇹",

        "finland": "🇫🇮",

        "new zealand": "🇳🇿"

    };

    return flags[normalized] || "🌍";
}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// ==========================================
// RENDER HOME
// ==========================================

function renderHome() {

    const container =
        document.getElementById("homeBillionaires");

    if (!container) return;

    const sorted =
        [...worldEliteData]
            .sort(
                (a, b) =>
                    getNetWorth(b) -
                    getNetWorth(a)
            )
            .slice(0, 10);

    if (!sorted.length) {

        container.innerHTML = `
            <div class="empty-state">
                No billionaire data available.
            </div>
        `;

        return;
    }

    container.innerHTML =
        sorted
            .map(
                (person, index) =>
                    createBillionaireCard(
                        person,
                        index + 1
                    )
            )
            .join("");
}


// ==========================================
// RENDER RANKINGS
// ==========================================

function renderBillionaires(searchQuery = "") {

    const container =
        document.getElementById("billionaireList");

    if (!container) return;

    let list =
        [...worldEliteData];

    // Search

    if (searchQuery) {

        const query =
            searchQuery.toLowerCase();

        list =
            list.filter(person => {

                const name =
                    getPersonName(person)
                        .toLowerCase();

                const country =
                    getPersonCountry(person)
                        .toLowerCase();

                return (
                    name.includes(query) ||
                    country.includes(query)
                );
            });
    }

    // Country

    if (currentCountry !== "all") {

        list =
            list.filter(person =>
                getPersonCountry(person)
                    .toLowerCase() ===
                currentCountry.toLowerCase()
            );
    }

    // Sort

    list.sort((a, b) => {

        const aWorth =
            getNetWorth(a);

        const bWorth =
            getNetWorth(b);

        if (currentSort === "lowest") {
            return aWorth - bWorth;
        }

        return bWorth - aWorth;
    });

    currentBillionaires = list;

    const count =
        document.getElementById("rankingCount");

    if (count) {

        count.textContent =
            list.length +
            (
                list.length === 1
                    ? " billionaire"
                    : " billionaires"
            );
    }

    if (!list.length) {

        container.innerHTML = `
            <div class="empty-state">
                <h3>No results</h3>
                <p>Try another search or country.</p>
            </div>
        `;

        return;
    }

    container.innerHTML =
        list
            .map(
                (person, index) =>
                    createBillionaireCard(
                        person,
                        index + 1
                    )
            )
            .join("");
}


// ==========================================
// CREATE BILLIONAIRE CARD
// ==========================================

function createBillionaireCard(person, rank) {

    const name =
        getPersonName(person);

    const country =
        getPersonCountry(person);

    const worth =
        getNetWorth(person);

    const flag =
        getFlag(country);

    const photo =
        person.image ||
        person.photo ||
        person.image_url ||
        person.imageUrl ||
        "";

    const photoHTML =
        photo
            ? `
                <img
                    src="${escapeHTML(photo)}"
                    alt="${escapeHTML(name)}"
                    class="person-image"
                    onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
                >

                <div
                    class="person-placeholder"
                    style="display:none;"
                >
                    👤
                </div>
            `
            : `
                <div class="person-placeholder">
                    👤
                </div>
            `;

    return `
        <div
            class="billionaire-card"
            onclick='openPerson(${JSON.stringify(
                person
            ).replace(/</g, "\\u003c")})'
        >

            <div class="rank-number">
                ${rank}
            </div>

            <div class="person-photo">
                ${photoHTML}
            </div>

            <div class="person-info">

                <h3>
                    ${escapeHTML(name)}
                </h3>

                <p>
                    ${flag}
                    ${escapeHTML(country)}
                </p>

            </div>

            <div class="person-worth">

                <strong>
                    ${formatNetWorth(worth)}
                </strong>

                <small>
                    Net Worth
                </small>

            </div>

        </div>
    `;
}


// ==========================================
// OPEN PERSON
// ==========================================

function openPerson(person) {

    currentPerson = person;

    const container =
        document.getElementById("personContent");

    if (!container) return;

    const name =
        getPersonName(person);

    const country =
        getPersonCountry(person);

    const worth =
        getNetWorth(person);

    const flag =
        getFlag(country);

    const favorite =
        typeof isFavorite === "function"
            ? isFavorite(name)
            : false;

    const company =
        person.company ||
        person.companyName ||
        person.company_name ||
        "—";

    const photo =
        person.image ||
        person.photo ||
        person.image_url ||
        person.imageUrl ||
        "";

    container.innerHTML = `

        <div class="person-profile">

            <div class="large-person-photo">

                ${
                    photo
                        ? `
                            <img
                                src="${escapeHTML(photo)}"
                                alt="${escapeHTML(name)}"
                            >
                        `
                        : "👤"
                }

            </div>

            <h1>
                ${escapeHTML(name)}
            </h1>

            <p class="person-country">
                ${flag}
                ${escapeHTML(country)}
            </p>

            <div class="net-worth-large">

                <small>Estimated Net Worth</small>

                <strong>
                    ${formatNetWorth(worth)}
                </strong>

            </div>

            <button
                id="favoriteButton"
                class="favorite-button"
                onclick="togglePersonFavorite()"
            >
                ${
                    favorite
                        ? "★ Remove Favorite"
                        : "☆ Add Favorite"
                }
            </button>

            <div class="person-details">

                <div>
                    <small>Country</small>
                    <strong>
                        ${flag}
                        ${escapeHTML(country)}
                    </strong>
                </div>

                <div>
                    <small>Company</small>
                    <strong>
                        ${escapeHTML(company)}
                    </strong>
                </div>

            </div>

        </div>
    `;

    openPage("personPage");
}


// ==========================================
// FAVORITE
// ==========================================

function togglePersonFavorite() {

    if (!currentPerson) return;

    if (typeof toggleFavorite === "function") {

        toggleFavorite({
            name: getPersonName(currentPerson),
            country: getPersonCountry(currentPerson),
            netWorth: getNetWorth(currentPerson),
            company:
                currentPerson.company ||
                currentPerson.companyName ||
                ""
        });

        const button =
            document.getElementById(
                "favoriteButton"
            );

        if (button) {

            const favorite =
                isFavorite(
                    getPersonName(currentPerson)
                );

            button.innerHTML =
                favorite
                    ? "★ Remove Favorite"
                    : "☆ Add Favorite";
        }
    }
}


// ==========================================
// SEARCH
// ==========================================

function searchBillionaires(query) {

    renderBillionaires(query);
}


// ==========================================
// COUNTRY FILTER
// ==========================================

function populateCountries() {

    const select =
        document.getElementById("countryFilter");

    if (!select) return;

    const countries =
        [
            ...new Set(
                worldEliteData
                    .map(person =>
                        getPersonCountry(person)
                    )
                    .filter(
                        country =>
                            country &&
                            country.toLowerCase() !==
                            "unknown"
                    )
            )
        ]
        .sort(
            (a, b) =>
                a.localeCompare(b)
        );

    select.innerHTML = `
        <option value="all">
            All Countries
        </option>
    `;

    countries.forEach(country => {

        const option =
            document.createElement("option");

        option.value = country;

        option.textContent =
            getFlag(country) +
            " " +
            country;

        select.appendChild(option);
    });
}


function filterBillionaires() {

    const select =
        document.getElementById(
            "countryFilter"
        );

    currentCountry =
        select
            ? select.value
            : "all";

    renderBillionaires();
}


// ==========================================
// SORT
// ==========================================

function sortBillionaires(type) {

    currentSort = type;

    const highest =
        document.getElementById(
            "highestButton"
        );

    const lowest =
        document.getElementById(
            "lowestButton"
        );

    if (highest) {
        highest.classList.toggle(
            "active",
            type === "highest"
        );
    }

    if (lowest) {
        lowest.classList.toggle(
            "active",
            type === "lowest"
        );
    }

    renderBillionaires();
}


// ==========================================
// GLOBAL SEARCH INPUT
// ==========================================

function handleGlobalSearch() {

    const input =
        document.getElementById(
            "globalSearchInput"
        );

    renderBillionaires(
        input
            ? input.value.trim()
            : ""
    );
}


// ==========================================
// HOME STATS
// ==========================================

function updateHomeStats() {

    const billionaireCount =
        document.getElementById(
            "homeBillionaireCount"
        );

    if (billionaireCount) {

        billionaireCount.textContent =
            worldEliteData.length
                .toLocaleString();
    }

    const companyCount =
        document.getElementById(
            "homeCompanyCount"
        );

    if (companyCount) {

        const companies =
            new Set(
                worldEliteData
                    .map(
                        person =>
                            person.company ||
                            person.companyName
                    )
                    .filter(Boolean)
            );

        companyCount.textContent =
            companies.size.toLocaleString();
    }
}


// ==========================================
// COMPANIES
// ==========================================

function renderCompanies() {

    const container =
        document.getElementById(
            "companyList"
        );

    if (!container) return;

    const companies = {};

    worldEliteData.forEach(person => {

        const company =
            person.company ||
            person.companyName ||
            person.company_name;

        if (!company) return;

        if (!companies[company]) {
            companies[company] = [];
        }

        companies[company].push(person);
    });

    const entries =
        Object.entries(companies)
            .sort(
                (a, b) =>
                    b[1].length -
                    a[1].length
            );

    if (!entries.length) {

        container.innerHTML = `
            <div class="empty-state">
                <h3>No company data</h3>
                <p>Company information is not available yet.</p>
            </div>
        `;

        return;
    }

    container.innerHTML =
        entries
            .map(
                ([company, people]) => `

                    <div class="company-card">

                        <h3>
                            ${escapeHTML(company)}
                        </h3>

                        <p>
                            ${people.length}
                            billionaire
                            ${
                                people.length === 1
                                    ? ""
                                    : "s"
                            }
                        </p>

                    </div>
                `
            )
            .join("");
}


function searchCompanies() {

    const input =
        document.getElementById(
            "companySearchInput"
        );

    const query =
        input
            ? input.value.toLowerCase().trim()
            : "";

    const cards =
        document.querySelectorAll(
            ".company-card"
        );

    cards.forEach(card => {

        const text =
            card.textContent.toLowerCase();

        card.style.display =
            text.includes(query)
                ? ""
                : "none";
    });
}


// ==========================================
// REFRESH
// ==========================================

async function refreshData() {

    await loadData();
}


// ==========================================
// START
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadData();

    }
);
