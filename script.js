let billionaires = [];
let companies = [];

let currentPage = "homePage";
let currentSort = "highest";
let currentCountry = "all";
let currentSearch = "";


/* =========================
   BASIC HELPERS
========================= */

function $(id) {
    return document.getElementById(id);
}


function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function getName(person) {
    return (
        person.name ||
        person.full_name ||
        person.personName ||
        person.title ||
        "Unknown"
    );
}


function getCountry(person) {
    return (
        person.country ||
        person.country_name ||
        person.countryName ||
        person.nationality ||
        person.location ||
        "Unknown"
    );
}


function getCompany(person) {
    return (
        person.company ||
        person.company_name ||
        person.companyName ||
        person.business ||
        person.source ||
        ""
    );
}


function getWorthNumber(person) {

    const possible =
        person.net_worth ??
        person.netWorth ??
        person.worth ??
        person.wealth ??
        person.estimated_net_worth ??
        person.estimatedNetWorth ??
        person.value ??
        0;

    if (typeof possible === "number") {
        return possible;
    }

    let text = String(possible)
        .replace(/[$,]/g, "")
        .trim()
        .toLowerCase();

    if (!text) {
        return 0;
    }

    const number = parseFloat(text);

    if (!Number.isFinite(number)) {
        return 0;
    }

    if (text.includes("trillion") || text.endsWith("t")) {
        return number * 1000;
    }

    if (text.includes("billion") || text.endsWith("b")) {
        return number;
    }

    if (text.includes("million") || text.endsWith("m")) {
        return number / 1000;
    }

    return number;
}


function formatWorth(person) {

    const value = getWorthNumber(person);

    if (!value || value <= 0) {
        return "$0.0B";
    }

    if (value >= 1000) {
        return "$" + (value / 1000).toFixed(2) + "T";
    }

    return "$" + value.toFixed(1) + "B";
}


function countryCode(country) {

    const map = {
        "United States": "US",
        "United States of America": "US",
        "USA": "US",
        "US": "US",

        "France": "FR",
        "Germany": "DE",
        "United Kingdom": "GB",
        "UK": "GB",
        "Italy": "IT",
        "Spain": "ES",
        "India": "IN",
        "China": "CN",
        "Japan": "JP",
        "South Korea": "KR",
        "Canada": "CA",
        "Mexico": "MX",
        "Brazil": "BR",
        "Australia": "AU",
        "Russia": "RU",
        "Turkey": "TR",
        "Ukraine": "UA",
        "Switzerland": "CH",
        "Singapore": "SG",
        "Indonesia": "ID",
        "Saudi Arabia": "SA",
        "Israel": "IL",
        "Nigeria": "NG",
        "South Africa": "ZA",
        "United Arab Emirates": "AE"
    };

    return map[country] || country;
}


function flagEmoji(country) {

    const code = countryCode(country);

    if (!code || code === "Unknown") {
        return "🌍";
    }

    if (!/^[A-Z]{2}$/.test(code)) {
        return "🌍";
    }

    return [...code]
        .map(letter =>
            String.fromCodePoint(
                127397 + letter.charCodeAt(0)
            )
        )
        .join("");
}


/* =========================
   DATA
========================= */

async function loadData() {

    showLoading();

    try {

        const response = await fetch(
            "data.json?v=" + Date.now(),
            {
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error(
                "Could not load data.json: " + response.status
            );
        }

        const data = await response.json();

        if (Array.isArray(data)) {
            billionaires = data;
            companies = [];
        } else {

            billionaires =
                data.billionaires ||
                data.people ||
                data.persons ||
                data.richest ||
                [];

            companies =
                data.companies ||
                data.businesses ||
                [];
        }

        if (!Array.isArray(billionaires)) {
            billionaires = [];
        }

        if (!Array.isArray(companies)) {
            companies = [];
        }

        renderEverything();

    } catch (error) {

        console.error(error);

        billionaires = [];
        companies = [];

        renderEverything();

        const list = $("billionaireList");

        if (list) {
            list.innerHTML = `
                <div class="empty">
                    Could not load live data.
                    <br><br>
                    Please refresh the page.
                </div>
            `;
        }
    }
}


function showLoading() {

    if ($("billionaireList")) {
        $("billionaireList").innerHTML =
            `<div class="loading">Loading live data...</div>`;
    }

    if ($("homeBillionaires")) {
        $("homeBillionaires").innerHTML =
            `<div class="loading">Loading...</div>`;
    }
}


/* =========================
   PAGE NAVIGATION
========================= */

function openPage(pageId) {

    const pages = [
        "homePage",
        "rankingsPage",
        "personPage",
        "companiesPage",
        "profilePage"
    ];

    pages.forEach(id => {

        const page = $(id);

        if (!page) return;

        page.classList.toggle(
            "hidden",
            id !== pageId
        );
    });

    currentPage = pageId;

    updateNavigation(pageId);

    window.scrollTo({
        top: 0,
        behavior: "instant"
    });

    if (pageId === "rankingsPage") {
        renderRankings();
    }

    if (pageId === "companiesPage") {
        renderCompanies();
    }

    if (pageId === "profilePage") {

        if (typeof renderProfile === "function") {
            renderProfile();
        }
    }
}


function updateNavigation(pageId) {

    const map = {
        homePage: "navHome",
        rankingsPage: "navRankings",
        companiesPage: "navCompanies",
        profilePage: "navProfile"
    };

    [
        "navHome",
        "navRankings",
        "navCompanies",
        "navProfile"
    ].forEach(id => {

        const button = $(id);

        if (button) {
            button.classList.remove("active");
        }
    });

    const active = map[pageId];

    if (active && $(active)) {
        $(active).classList.add("active");
    }
}


/* =========================
   HOME
========================= */

function renderHome() {

    if ($("homeBillionaireCount")) {
        $("homeBillionaireCount").textContent =
            billionaires.length.toLocaleString();
    }

    if ($("homeCompanyCount")) {
        $("homeCompanyCount").textContent =
            companies.length.toLocaleString();
    }

    const list = [...billionaires]
        .sort((a, b) =>
            getWorthNumber(b) - getWorthNumber(a)
        )
        .slice(0, 5);

    const container = $("homeBillionaires");

    if (!container) return;

    if (!list.length) {

        container.innerHTML =
            `<div class="empty">No billionaire data available.</div>`;

        return;
    }

    container.innerHTML = list
        .map((person, index) =>
            billionaireCard(person, index + 1)
        )
        .join("");
}


/* =========================
   BILLIONAIRE CARDS
========================= */

function billionaireCard(person, rank) {

    const name = getName(person);
    const country = getCountry(person);
    const flag = flagEmoji(country);
    const code = countryCode(country);
    const worth = formatWorth(person);

    return `
        <button
            class="person-card"
            type="button"
            data-person-index="${billionaires.indexOf(person)}"
        >

            <span class="rank">${rank}</span>

            <span class="avatar">👤</span>

            <span class="person-main">

                <span class="person-name">
                    ${escapeHTML(name)}
                </span>

                <span class="person-country">
                    ${flag} ${escapeHTML(code)}
                </span>

            </span>

            <span class="person-worth">
                ${escapeHTML(worth)}
            </span>

        </button>
    `;
}


function attachPersonCardEvents() {

    document
        .querySelectorAll("[data-person-index]")
        .forEach(card => {

            card.addEventListener("click", () => {

                const index =
                    Number(card.dataset.personIndex);

                openPerson(index);
            });

        });
}


/* =========================
   RANKINGS
========================= */

function getFilteredBillionaires() {

    let result = [...billionaires];

    if (currentSearch.trim()) {

        const query =
            currentSearch
                .trim()
                .toLowerCase();

        result = result.filter(person => {

            const name = getName(person).toLowerCase();
            const country = getCountry(person).toLowerCase();
            const company = getCompany(person).toLowerCase();

            return (
                name.includes(query) ||
                country.includes(query) ||
                company.includes(query)
            );
        });
    }

    if (currentCountry !== "all") {

        result = result.filter(person =>
            getCountry(person) === currentCountry
        );
    }

    result.sort((a, b) => {

        const aWorth = getWorthNumber(a);
        const bWorth = getWorthNumber(b);

        return currentSort === "highest"
            ? bWorth - aWorth
            : aWorth - bWorth;
    });

    return result;
}


function renderRankings() {

    const list = getFilteredBillionaires();

    const container = $("billionaireList");

    if (!container) return;

    if ($("rankingCount")) {

        $("rankingCount").textContent =
            list.length.toLocaleString() +
            " billionaires";
    }

    if (!list.length) {

        container.innerHTML =
            `<div class="empty">No results found.</div>`;

        return;
    }

    container.innerHTML = list
        .map((person, index) =>
            billionaireCard(person, index + 1)
        )
        .join("");

    attachPersonCardEvents();
}


function sortBillionaires(type) {

    currentSort = type;

    $("highestButton")?.classList.toggle(
        "active",
        type === "highest"
    );

    $("lowestButton")?.classList.toggle(
        "active",
        type === "lowest"
    );

    renderRankings();
}


function handleGlobalSearch() {

    currentSearch =
        $("globalSearchInput")?.value || "";

    renderRankings();
}


function filterBillionaires() {

    currentCountry =
        $("countryFilter")?.value || "all";

    renderRankings();
}


function populateCountries() {

    const select = $("countryFilter");

    if (!select) return;

    const countries = [
        ...new Set(
            billionaires
                .map(person => getCountry(person))
                .filter(country =>
                    country &&
                    country !== "Unknown" &&
                    country !== "unknown" &&
                    country !== "N/A"
                )
        )
    ].sort();

    select.innerHTML = `
        <option value="all">
            🌍 All Countries
        </option>
    `;

    countries.forEach(country => {

        const option =
            document.createElement("option");

        option.value = country;

        option.textContent =
            flagEmoji(country) +
            " " +
            countryCode(country);

        select.appendChild(option);
    });

    select.value = currentCountry;
}


/* =========================
   PERSON
========================= */

function openPerson(index) {

    const person = billionaires[index];

    if (!person) return;

    const name = getName(person);
    const country = getCountry(person);
    const company = getCompany(person);
    const worth = formatWorth(person);

    const content = $("personContent");

    if (!content) return;

    content.innerHTML = `

        <div class="person-profile">

            <div class="profile-avatar">
                👤
            </div>

            <h2>
                ${escapeHTML(name)}
            </h2>

            <div class="profile-country">
                ${flagEmoji(country)}
                ${escapeHTML(countryCode(country))}
            </div>

            <div class="big-worth">
                ${escapeHTML(worth)}
            </div>

            <div class="profile-info">

                <span>Estimated Net Worth</span>

                <strong>
                    ${escapeHTML(worth)}
                </strong>

            </div>

            ${
                company
                    ? `
                    <div class="profile-info">
                        <span>Business</span>
                        <strong>
                            ${escapeHTML(company)}
                        </strong>
                    </div>
                    `
                    : ""
            }

            <button
                class="primary-button"
                type="button"
                onclick="toggleFavoriteFromProfile(${index})"
            >
                ☆ Add Favorite
            </button>

        </div>
    `;

    openPage("personPage");
}


/* =========================
   COMPANIES
========================= */

function renderCompanies() {

    const container = $("companyList");

    if (!container) return;

    if (!companies.length) {

        container.innerHTML = `
            <div class="empty">
                Company data is not available yet.
            </div>
        `;

        return;
    }

    const query =
        ($("companySearchInput")?.value || "")
            .toLowerCase()
            .trim();

    let result = companies;

    if (query) {

        result = companies.filter(company => {

            const name =
                typeof company === "string"
                    ? company
                    : (
                        company.name ||
                        company.company ||
                        ""
                    );

            return name
                .toLowerCase()
                .includes(query);
        });
    }

    container.innerHTML = result
        .slice(0, 500)
        .map(company => {

            const name =
                typeof company === "string"
                    ? company
                    : (
                        company.name ||
                        company.company ||
                        "Unknown company"
                    );

            const country =
                typeof company === "object"
                    ? (
                        company.country ||
                        company.location ||
                        ""
                    )
                    : "";

            return `
                <div class="company-card">

                    <h3>
                        🏢 ${escapeHTML(name)}
                    </h3>

                    ${
                        country
                            ? `<p>${flagEmoji(country)} ${escapeHTML(countryCode(country))}</p>`
                            : ""
                    }

                </div>
            `;
        })
        .join("");
}


function searchCompanies() {
    renderCompanies();
}


/* =========================
   REFRESH
========================= */

async function refreshData() {

    const button = $("refreshButton");

    if (button) {

        button.disabled = true;
        button.textContent = "↻ Loading...";
    }

    try {

        await loadData();

    } finally {

        if (button) {

            button.disabled = false;
            button.textContent = "↻ Refresh";
        }
    }
}


/* =========================
   RENDER ALL
========================= */

function renderEverything() {

    renderHome();

    populateCountries();

    renderRankings();

    renderCompanies();

    attachPersonCardEvents();
}


/* =========================
   EVENTS
========================= */

function setupEvents() {

    $("profileTopButton")
        ?.addEventListener("click", () =>
            openPage("profilePage")
        );

    $("seeAllButton")
        ?.addEventListener("click", () =>
            openPage("rankingsPage")
        );

    $("rankingsBackButton")
        ?.addEventListener("click", () =>
            openPage("homePage")
        );

    $("personBackButton")
        ?.addEventListener("click", () =>
            openPage("rankingsPage")
        );

    $("companiesBackButton")
        ?.addEventListener("click", () =>
            openPage("homePage")
        );

    $("profileBackButton")
        ?.addEventListener("click", () =>
            openPage("homePage")
        );

    $("navHome")
        ?.addEventListener("click", () =>
            openPage("homePage")
        );

    $("navRankings")
        ?.addEventListener("click", () =>
            openPage("rankingsPage")
        );

    $("navCompanies")
        ?.addEventListener("click", () =>
            openPage("companiesPage")
        );

    $("navProfile")
        ?.addEventListener("click", () =>
            openPage("profilePage")
        );

    $("highestButton")
        ?.addEventListener("click", () =>
            sortBillionaires("highest")
        );

    $("lowestButton")
        ?.addEventListener("click", () =>
            sortBillionaires("lowest")
        );

    $("refreshButton")
        ?.addEventListener("click", refreshData);

    $("globalSearchInput")
        ?.addEventListener("input", handleGlobalSearch);

    $("countryFilter")
        ?.addEventListener("change", filterBillionaires);

    $("companySearchInput")
        ?.addEventListener("input", searchCompanies);

}


/* =========================
   START
========================= */

document.addEventListener("DOMContentLoaded", () => {

    setupEvents();

    openPage("homePage");

    loadData();

});
