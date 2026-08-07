"use strict";

/*
    WORLD ELITE
    Single application controller.

    Only this file is required.
    favorites.js and profile.js are NOT required.
*/


/* =========================
   STATE
========================= */

let billionaires = [];
let companies = [];

let filteredBillionaires = [];

let currentSort = "highest";

let previousPage = "rankingsPage";

let dataLoaded = false;


/* =========================
   HELPERS
========================= */

function $(id) {
    return document.getElementById(id);
}


function text(value, fallback = "—") {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return fallback;
    }

    return String(value);
}


function numberValue(value) {

    if (typeof value === "number") {
        return value;
    }

    if (!value) {
        return 0;
    }

    const cleaned = String(value)
        .replace(/[$€£¥,\s]/g, "")
        .replace(/Billion/gi, "")
        .replace(/Million/gi, "");

    const number = parseFloat(cleaned);

    if (!Number.isFinite(number)) {
        return 0;
    }

    return number;
}


function formatMoney(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "—";
    }

    const raw = String(value);

    if (
        /[$€£¥]/.test(raw) &&
        /(B|M|K|billion|million|thousand)/i.test(raw)
    ) {
        return raw;
    }

    const n = numberValue(value);

    if (!n) {
        return raw;
    }

    if (Math.abs(n) >= 1e12) {
        return "$" + (n / 1e12).toFixed(1) + "T";
    }

    if (Math.abs(n) >= 1e9) {
        return "$" + (n / 1e9).toFixed(1) + "B";
    }

    if (Math.abs(n) >= 1e6) {
        return "$" + (n / 1e6).toFixed(1) + "M";
    }

    if (Math.abs(n) >= 1e3) {
        return "$" + (n / 1e3).toFixed(1) + "K";
    }

    return "$" + n.toLocaleString();
}


function getName(person) {

    return text(
        person.name ||
        person.fullName ||
        person.personName ||
        person.title,
        "Unknown"
    );
}


function getCountry(person) {

    return text(
        person.country ||
        person.countryName ||
        person.nationality ||
        person.location,
        "Unknown"
    );
}


function getFlag(country) {

    const map = {
        "United States": "🇺🇸",
        "United States of America": "🇺🇸",
        "US": "🇺🇸",
        "USA": "🇺🇸",

        "United Kingdom": "🇬🇧",
        "UK": "🇬🇧",

        "France": "🇫🇷",
        "Germany": "🇩🇪",
        "Italy": "🇮🇹",
        "Spain": "🇪🇸",

        "India": "🇮🇳",
        "China": "🇨🇳",
        "Japan": "🇯🇵",
        "South Korea": "🇰🇷",

        "Canada": "🇨🇦",
        "Australia": "🇦🇺",
        "Brazil": "🇧🇷",
        "Mexico": "🇲🇽",

        "Russia": "🇷🇺",
        "Ukraine": "🇺🇦",
        "Turkey": "🇹🇷",

        "Switzerland": "🇨🇭",
        "Singapore": "🇸🇬",
        "Israel": "🇮🇱",
        "Indonesia": "🇮🇩",

        "Nigeria": "🇳🇬",
        "South Africa": "🇿🇦",

        "Saudi Arabia": "🇸🇦",
        "United Arab Emirates": "🇦🇪",

        "Thailand": "🇹🇭",
        "Malaysia": "🇲🇾",

        "Austria": "🇦🇹",
        "Belgium": "🇧🇪",
        "Netherlands": "🇳🇱",
        "Sweden": "🇸🇪",
        "Norway": "🇳🇴",
        "Denmark": "🇩🇰",
        "Finland": "🇫🇮",

        "Ireland": "🇮🇪",
        "Poland": "🇵🇱",
        "Portugal": "🇵🇹",

        "Greece": "🇬🇷",
        "Egypt": "🇪🇬",

        "Philippines": "🇵🇭",
        "Vietnam": "🇻🇳",

        "Hong Kong": "🇭🇰",
        "Taiwan": "🇹🇼"
    };

    if (map[country]) {
        return map[country];
    }

    const upper = String(country).toUpperCase();

    const codeMap = {
        US: "🇺🇸",
        UK: "🇬🇧",
        FR: "🇫🇷",
        DE: "🇩🇪",
        IT: "🇮🇹",
        ES: "🇪🇸",
        IN: "🇮🇳",
        CN: "🇨🇳",
        JP: "🇯🇵",
        CA: "🇨🇦",
        AU: "🇦🇺",
        BR: "🇧🇷",
        MX: "🇲🇽",
        UA: "🇺🇦",
        RU: "🇷🇺",
        TR: "🇹🇷"
    };

    return codeMap[upper] || "🌍";
}


function getWealth(person) {

    return (
        person.netWorth ??
        person.net_worth ??
        person.netWorthInBillions ??
        person.wealth ??
        person.estimatedNetWorth ??
        person.estimated_net_worth ??
        person.totalWorth ??
        0
    );
}


function getCompany(person) {

    return text(
        person.company ||
        person.companies ||
        person.business ||
        person.sourceOfWealth ||
        person.primaryCompany,
        "—"
    );
}


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================
   DATA NORMALIZATION
========================= */

function normalizeData(raw) {

    let people = [];
    let business = [];

    if (Array.isArray(raw)) {
        people = raw;
    }

    else if (raw && typeof raw === "object") {

        people =
            raw.billionaires ||
            raw.people ||
            raw.persons ||
            raw.richestPeople ||
            raw.data ||
            [];

        business =
            raw.companies ||
            raw.businesses ||
            [];

    }

    if (!Array.isArray(people)) {
        people = [];
    }

    if (!Array.isArray(business)) {
        business = [];
    }

    /*
       If companies are not separately provided,
       build a company list from billionaire data.
    */

    if (business.length === 0) {

        const map = new Map();

        people.forEach(person => {

            const company = getCompany(person);

            if (
                company !== "—" &&
                company.length > 1
            ) {

                const key = company.toLowerCase();

                if (!map.has(key)) {

                    map.set(
                        key,
                        {
                            name: company,
                            billionaire: getName(person),
                            country: getCountry(person)
                        }
                    );

                }

            }

        });

        business = Array.from(map.values());
    }

    return {
        people,
        business
    };
}


/* =========================
   LOAD DATA
========================= */

async function loadData(showMessage = false) {

    try {

        if (showMessage) {
            showToast("Loading latest data...");
        }

        const cacheBuster = Date.now();

        const response = await fetch(
            "data.json?v=" + cacheBuster,
            {
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error(
                "data.json HTTP " + response.status
            );
        }

        const raw = await response.json();

        const normalized = normalizeData(raw);

        billionaires = normalized.people;

        companies = normalized.business;

        filteredBillionaires = [...billionaires];

        dataLoaded = true;

        populateCountryFilter();

        updateHome();

        renderRankings();

        renderCompanies();

        renderProfile();

        renderWorldBests();

        updateTimestamp();

        if (showMessage) {
            showToast(
                "Data refreshed successfully"
            );
        }

    } catch (error) {

        console.error(error);

        dataLoaded = false;

        const list = $("billionaireList");

        if (list) {

            list.innerHTML = `
                <div class="empty-state">
                    <h3>Data could not be loaded</h3>
                    <p>
                        Make sure <b>data.json</b>
                        exists in the repository.
                    </p>
                </div>
            `;

        }

        showToast("Could not load data.json");
    }
}


async function refreshData() {

    const button = document.querySelector(
        ".refresh-button"
    );

    if (button) {

        button.disabled = true;

        button.textContent = "↻ Updating...";
    }

    await loadData(true);

    if (button) {

        button.disabled = false;

        button.textContent = "↻ Refresh Data";
    }
}


/* =========================
   NAVIGATION
========================= */

function openPage(pageId) {

    const current = document.querySelector(
        ".page:not(.hidden)"
    );

    if (
        current &&
        current.id === "personPage" &&
        pageId !== "personPage"
    ) {
        previousPage = pageId;
    }

    document.querySelectorAll(".page").forEach(page => {
        page.classList.add("hidden");
    });

    const target = $(pageId);

    if (!target) {
        return;
    }

    target.classList.remove("hidden");

    updateNavigation(pageId);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (pageId === "rankingsPage") {
        renderRankings();
    }

    if (pageId === "companiesPage") {
        renderCompanies();
    }

    if (pageId === "profilePage") {
        renderProfile();
    }

    if (pageId === "worldBestsPage") {
        renderWorldBests();
    }
}


function updateNavigation(pageId) {

    const map = {
        homePage: "navHome",
        rankingsPage: "navRankings",
        companiesPage: "navCompanies",
        profilePage: "navProfile"
    };

    document.querySelectorAll(".bottom-nav button")
        .forEach(button => {
            button.classList.remove("active");
        });

    const id = map[pageId];

    if (id && $(id)) {
        $(id).classList.add("active");
    }
}


function goBackFromPerson() {

    openPage(
        previousPage || "rankingsPage"
    );
}


/* =========================
   HOME
========================= */

function updateHome() {

    const count = $("homeBillionaireCount");
    const companyCount = $("homeCompanyCount");

    if (count) {
        count.textContent =
            billionaires.length.toLocaleString();
    }

    if (companyCount) {
        companyCount.textContent =
            companies.length.toLocaleString();
    }

    const home = $("homeBillionaires");

    if (!home) {
        return;
    }

    const top = [...billionaires]
        .sort(
            (a, b) =>
                numberValue(getWealth(b)) -
                numberValue(getWealth(a))
        )
        .slice(0, 5);

    home.innerHTML = top
        .map((person, index) =>
            personCard(person, index + 1)
        )
        .join("");

    if (top.length === 0) {

        home.innerHTML = `
            <div class="empty-state">
                No billionaire data available.
            </div>
        `;

    }
}


/* =========================
   PERSON CARD
========================= */

function personCard(person, rank = "") {

    const name = getName(person);

    const country = getCountry(person);

    const flag = getFlag(country);

    const worth = formatMoney(
        getWealth(person)
    );

    const company = getCompany(person);

    return `
        <button
            class="person-card"
            onclick="openPerson(${JSON.stringify(name)})"
        >

            <span class="rank">
                ${escapeHTML(rank)}
            </span>

            <span class="avatar">
                👤
            </span>

            <span class="card-main">

                <span class="card-name">
                    ${escapeHTML(name)}
                </span>

                <span class="card-meta">

                    <span class="country-flag">
                        ${flag}
                    </span>

                    ${escapeHTML(country)}

                    ${
                        company !== "—"
                            ? " · " + escapeHTML(company)
                            : ""
                    }

                </span>

            </span>

            <span class="card-worth">
                ${escapeHTML(worth)}
            </span>

        </button>
    `;
}


/* =========================
   RANKINGS
========================= */

function renderRankings() {

    const list = $("billionaireList");

    if (!list) {
        return;
    }

    if (!dataLoaded) {
        list.innerHTML = `
            <div class="loading">
                Loading billionaire data...
            </div>
        `;

        return;
    }

    const searchInput = $("globalSearchInput");

    const query = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    const countrySelect = $("countryFilter");

    const country = countrySelect
        ? countrySelect.value
        : "all";


    let result = [...billionaires];


    if (query) {

        result = result.filter(person => {

            const name =
                getName(person).toLowerCase();

            const countryName =
                getCountry(person).toLowerCase();

            const company =
                getCompany(person).toLowerCase();

            return (
                name.includes(query) ||
                countryName.includes(query) ||
                company.includes(query)
            );

        });

    }


    if (country !== "all") {

        result = result.filter(person => {

            return getCountry(person)
                .toLowerCase() ===
                country.toLowerCase();

        });

    }


    result.sort((a, b) => {

        const A =
            numberValue(getWealth(a));

        const B =
            numberValue(getWealth(b));

        return currentSort === "highest"
            ? B - A
            : A - B;

    });


    filteredBillionaires = result;


    const count = $("rankingCount");

    if (count) {

        count.textContent =
            result.length.toLocaleString() +
            " billionaires";

    }


    list.innerHTML = result
        .map((person, index) =>
            personCard(person, index + 1)
        )
        .join("");


    if (result.length === 0) {

        list.innerHTML = `
            <div class="empty-state">
                <h3>No results</h3>
                <p>
                    Try another name or country.
                </p>
            </div>
        `;

    }


    updateSortButtons();
}


function handleGlobalSearch() {
    renderRankings();
}


function sortBillionaires(direction) {

    currentSort = direction;

    renderRankings();
}


function filterBillionaires() {

    renderRankings();
}


function updateSortButtons() {

    const highest = $("highestButton");
    const lowest = $("lowestButton");

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


function populateCountryFilter() {

    const select = $("countryFilter");

    if (!select) {
        return;
    }

    const countries = [
        ...new Set(
            billionaires
                .map(getCountry)
                .filter(country =>
                    country &&
                    country !== "Unknown"
                )
        )
    ].sort(
        (a, b) =>
            a.localeCompare(b)
    );


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
            getFlag(country) +
            " " +
            country;

        select.appendChild(option);

    });
}


/* =========================
   PERSON PROFILE
========================= */

function openPerson(name) {

    previousPage = "rankingsPage";

    const person = billionaires.find(
        item =>
            getName(item).toLowerCase() ===
            String(name).toLowerCase()
    );

    if (!person) {
        showToast("Profile not found");
        return;
    }

    renderPerson(person);

    openPage("personPage");
}


function getField(object, keys) {

    for (const key of keys) {

        if (
            object &&
            object[key] !== undefined &&
            object[key] !== null &&
            object[key] !== ""
        ) {
            return object[key];
        }

    }

    return "Information unavailable.";
}


function arrayOrText(value) {

    if (Array.isArray(value)) {
        return value.join(", ");
    }

    return text(value, "Information unavailable.");
}


function renderPerson(person) {

    const content = $("personContent");

    const name = getName(person);

    const country = getCountry(person);

    const worth = formatMoney(
        getWealth(person)
    );

    const company = getCompany(person);

    const biography = getField(
        person,
        [
            "biography",
            "bio",
            "description",
            "about"
        ]
    );

    const investments = getField(
        person,
        [
            "investments",
            "investment",
            "investmentsDescription"
        ]
    );

    const stakes = getField(
        person,
        [
            "stakes",
            "ownership",
            "holdings"
        ]
    );

    const salary = getField(
        person,
        [
            "annualSalary",
            "annual_salary",
            "salary"
        ]
    );

    const age = getField(
        person,
        [
            "age"
        ]
    );

    const source = getField(
        person,
        [
            "sourceOfWealth",
            "source_of_wealth"
        ]
    );


    $("personPageTitle").textContent = name;


    const saved =
        isFavorite(name);


    content.innerHTML = `

        <section class="profile-hero">

            <div class="profile-top">

                <div class="profile-avatar">
                    👤
                </div>


                <div>

                    <h2 class="profile-name">
                        ${escapeHTML(name)}
                    </h2>

                    <div class="profile-country">

                        ${getFlag(country)}

                        ${escapeHTML(country)}

                    </div>

                </div>


                <div class="profile-worth">

                    <strong>
                        ${escapeHTML(worth)}
                    </strong>

                    <span>
                        Estimated Net Worth
                    </span>

                </div>

            </div>


            <button
                class="favorite-button ${saved ? "saved" : ""}"
                onclick="toggleFavorite(${JSON.stringify(name)})"
            >
                ${saved ? "★ Saved" : "☆ Add Favorite"}
            </button>


            <div class="profile-grid">

                <div class="info-box">

                    <small>Primary Company</small>

                    <strong>
                        ${escapeHTML(company)}
                    </strong>

                </div>


                <div class="info-box">

                    <small>Age</small>

                    <strong>
                        ${escapeHTML(age)}
                    </strong>

                </div>


                <div class="info-box">

                    <small>Source of Wealth</small>

                    <strong>
                        ${escapeHTML(source)}
                    </strong>

                </div>

            </div>

        </section>


        <section class="detail-grid">

            <article class="detail-card">

                <h3>Biography</h3>

                <p>
                    ${escapeHTML(biography)}
                </p>

            </article>


            <article class="detail-card">

                <h3>Investments</h3>

                <p>
                    ${escapeHTML(
                        arrayOrText(investments)
                    )}
                </p>

            </article>


            <article class="detail-card">

                <h3>Stakes & Ownership</h3>

                <p>
                    ${escapeHTML(
                        arrayOrText(stakes)
                    )}
                </p>

            </article>


            <article class="detail-card">

                <h3>Annual Salary</h3>

                <p>
                    ${escapeHTML(
                        formatMoney(salary)
                    )}
                </p>

            </article>

        </section>

    `;
}


/* =========================
   FAVORITES
========================= */

function getFavorites() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "worldelite_favorites"
            ) || "[]"
        );

    } catch {

        return [];

    }
}


function saveFavorites(list) {

    localStorage.setItem(
        "worldelite_favorites",
        JSON.stringify(list)
    );

}


function isFavorite(name) {

    return getFavorites()
        .includes(name);

}


function toggleFavorite(name) {

    const list = getFavorites();

    const index =
        list.indexOf(name);


    if (index >= 0) {

        list.splice(index, 1);

        showToast("Removed from favorites");

    } else {

        list.push(name);

        showToast("Added to favorites");

    }


    saveFavorites(list);


    const person =
        billionaires.find(
            p => getName(p) === name
        );


    if (person) {
        renderPerson(person);
    }

}


/* =========================
   COMPANIES
========================= */

function getCompanyName(company) {

    return text(
        company.name ||
        company.companyName ||
        company.title,
        "Unknown Company"
    );

}


function renderCompanies() {

    const list = $("companyList");

    if (!list) {
        return;
    }

    const search =
        $("companySearchInput")
            ?.value
            ?.trim()
            .toLowerCase() || "";


    let result = [...companies];


    if (search) {

        result = result.filter(company => {

            const name =
                getCompanyName(company)
                    .toLowerCase();

            const country =
                text(
                    company.country,
                    ""
                ).toLowerCase();

            return (
                name.includes(search) ||
                country.includes(search)
            );

        });

    }


    const count = $("companyCount");

    if (count) {

        count.innerHTML =
            `<strong>${result.length.toLocaleString()}</strong> companies`;

    }


    list.innerHTML = result
        .map((company, index) =>
            companyCard(company, index + 1)
        )
        .join("");


    if (!result.length) {

        list.innerHTML = `
            <div class="empty-state">
                No companies found.
            </div>
        `;

    }

}


function companyCard(company, rank) {

    const name =
        getCompanyName(company);

    const country =
        text(company.country, "Global");

    const revenue =
        company.revenue ??
        company.annualRevenue ??
        company.annual_revenue;

    return `
        <button
            class="company-card"
            onclick="openCompany(${JSON.stringify(name)})"
        >

            <span class="rank">
                ${rank}
            </span>

            <span class="avatar">
                ▣
            </span>

            <span class="card-main">

                <span class="card-name">
                    ${escapeHTML(name)}
                </span>

                <span class="card-meta">

                    ${getFlag(country)}

                    ${escapeHTML(country)}

                </span>

            </span>

            <span class="card-worth">

                ${
                    revenue
                        ? formatMoney(revenue)
                        : "View →"
                }

            </span>

        </button>
    `;

}


function searchCompanies() {

    renderCompanies();

}


function openCompany(name) {

    const company =
        companies.find(
            item =>
                getCompanyName(item)
                    .toLowerCase() ===
                String(name).toLowerCase()
        );


    if (!company) {

        /*
            If company came from
            billionaire data, create a
            basic profile.
        */

        const person =
            billionaires.find(
                item =>
                    getCompany(item)
                        .toLowerCase() ===
                    String(name).toLowerCase()
            );

        if (!person) {

            showToast(
                "Company profile not found"
            );

            return;

        }

        renderCompanyFromPerson(
            name,
            person
        );

    } else {

        renderCompany(company);

    }

    openPage("companyPage");

}


function renderCompany(company) {

    const name =
        getCompanyName(company);

    $("companyPageTitle")
        .textContent = name;


    const biography = getField(
        company,
        [
            "biography",
            "bio",
            "description",
            "about"
        ]
    );

    const investments = getField(
        company,
        [
            "investments",
            "investment"
        ]
    );

    const revenue = getField(
        company,
        [
            "revenue",
            "annualRevenue",
            "annual_revenue"
        ]
    );

    const netProfit = getField(
        company,
        [
            "netProfit",
            "net_profit",
            "profit"
        ]
    );

    const grossProfit = getField(
        company,
        [
            "grossProfit",
            "gross_profit"
        ]
    );

    const stakes = getField(
        company,
        [
            "stakes",
            "ownership",
            "owners"
        ]
    );


    $("companyContent").innerHTML = `

        <section class="profile-hero">

            <div class="profile-top">

                <div class="profile-avatar">
                    ▣
                </div>

                <div>

                    <h2 class="profile-name">
                        ${escapeHTML(name)}
                    </h2>

                    <div class="profile-country">
                        ${getFlag(
                            text(company.country, "Global")
                        )}
                        ${escapeHTML(
                            text(company.country, "Global")
                        )}
                    </div>

                </div>

            </div>

        </section>


        <section class="detail-grid">

            <article class="detail-card">

                <h3>Company Biography</h3>

                <p>
                    ${escapeHTML(biography)}
                </p>

            </article>


            <article class="detail-card">

                <h3>Investments</h3>

                <p>
                    ${escapeHTML(
                        arrayOrText(investments)
                    )}
                </p>

            </article>


            <article class="detail-card">

                <h3>Revenue</h3>

                <p>
                    ${escapeHTML(
                        formatMoney(revenue)
                    )}
                </p>

            </article>


            <article class="detail-card">

                <h3>Net Profit</h3>

                <p>
                    ${escapeHTML(
                        formatMoney(netProfit)
                    )}
                </p>

            </article>


            <article class="detail-card">

                <h3>Gross Profit</h3>

                <p>
                    ${escapeHTML(
                        formatMoney(grossProfit)
                    )}
                </p>

            </article>


            <article class="detail-card">

                <h3>Stakes & Ownership</h3>

                <p>
                    ${escapeHTML(
                        arrayOrText(stakes)
                    )}
                </p>

            </article>

        </section>

    `;
}


function renderCompanyFromPerson(
    companyName,
    person
) {

    $("companyPageTitle")
        .textContent = companyName;


    $("companyContent").innerHTML = `

        <section class="profile-hero">

            <div class="profile-top">

                <div class="profile-avatar">
                    ▣
                </div>

                <div>

                    <h2 class="profile-name">
                        ${escapeHTML(companyName)}
                    </h2>

                    <div class="profile-country">
                        ${getFlag(getCountry(person))}
                        ${escapeHTML(getCountry(person))}
                    </div>

                </div>

            </div>

        </section>


        <section class="detail-grid">

            <article class="detail-card">

                <h3>Associated Billionaire</h3>

                <p>
                    ${escapeHTML(getName(person))}
                </p>

            </article>


            <article class="detail-card">

                <h3>Ownership / Stake</h3>

                <p>
                    ${escapeHTML(
                        arrayOrText(
                            person.stakes ||
                            person.ownership
                        )
                    )}
                </p>

            </article>


            <article class="detail-card">

                <h3>Company Biography</h3>

                <p>
                    ${escapeHTML(
                        getField(
                            person,
                            [
                                "companyBiography",
                                "companyDescription"
                            ]
                        )
                    )}
                </p>

            </article>

        </section>

    `;

}


/* =========================
   WORLD BESTS
========================= */

function worldTab(type, button) {

    document
        .querySelectorAll(".world-tabs button")
        .forEach(item =>
            item.classList.remove("active")
        );

    button.classList.add("active");

    renderWorldBestType(type);
}


function renderWorldBests() {

    renderWorldBestType("people");

}


function renderWorldBestType(type) {

    const container =
        $("worldBestContent");

    if (!container) {
        return;
    }


    if (type === "people") {

        const top =
            [...billionaires]
                .sort(
                    (a,b) =>
                        numberValue(getWealth(b)) -
                        numberValue(getWealth(a))
                )
                .slice(0, 20);


        container.innerHTML = `

            <div class="section">

                <div class="section-heading">

                    <div>
                        <small>TOP 20</small>
                        <h2>Richest People</h2>
                    </div>

                </div>

                <div class="cards">
                    ${top
                        .map((p,i) =>
                            personCard(p,i+1)
                        )
                        .join("")}
                </div>

            </div>

        `;

        return;
    }


    if (type === "companies") {

        const top =
            [...companies]
                .slice(0, 50);


        container.innerHTML = `

            <div class="section">

                <div class="section-heading">

                    <div>
                        <small>GLOBAL BUSINESS</small>
                        <h2>Leading Companies</h2>
                    </div>

                </div>

                <div class="cards">

                    ${
                        top.length
                            ? top.map(
                                (c,i) =>
                                    companyCard(c,i+1)
                              ).join("")
                            : `
                                <div class="empty-state">
                                    Company data is not available
                                    in the current data source.
                                </div>
                            `
                    }

                </div>

            </div>

        `;

        return;
    }


    if (type === "countries") {

        const map = new Map();


        billionaires.forEach(person => {

            const country =
                getCountry(person);

            if (country === "Unknown") {
                return;
            }

            const old =
                map.get(country) || 0;

            map.set(
                country,
                old + 1
            );

        });


        const countries =
            Array.from(map.entries())
                .sort((a,b) => b[1] - a[1])
                .slice(0, 50);


        container.innerHTML = `

            <div class="section">

                <div class="section-heading">

                    <div>
                        <small>GLOBAL WEALTH</small>
                        <h2>Top Countries</h2>
                    </div>

                </div>


                <div class="cards">

                    ${
                        countries
                            .map(
                                ([country,count],index) => `
                                    <div class="person-card">

                                        <span class="rank">
                                            ${index + 1}
                                        </span>

                                        <span class="avatar">
                                            ${getFlag(country)}
                                        </span>

                                        <span class="card-main">

                                            <span class="card-name">
                                                ${escapeHTML(country)}
                                            </span>

                                            <span class="card-meta">
                                                Billionaires
                                            </span>

                                        </span>

                                        <span class="card-worth">
                                            ${count.toLocaleString()}
                                        </span>

                                    </div>
                                `
                            )
                            .join("")
                    }

                </div>

            </div>

        `;

    }

}


/* =========================
   LOGIN / SIGN UP
========================= */

function getUsers() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "worldelite_users"
            ) || "[]"
        );

    } catch {

        return [];

    }

}


function saveUsers(users) {

    localStorage.setItem(
        "worldelite_users",
        JSON.stringify(users)
    );

}


function signupUser(event) {

    event.preventDefault();


    const name =
        $("signupName").value.trim();

    const email =
        $("signupEmail").value.trim().toLowerCase();

    const password =
        $("signupPassword").value;


    const users = getUsers();


    if (
        users.some(
            user =>
                user.email === email
        )
    ) {

        showToast(
            "An account with this email already exists."
        );

        return;

    }


    users.push({
        name,
        email,
        password
    });


    saveUsers(users);


    localStorage.setItem(
        "worldelite_current_user",
        JSON.stringify({
            name,
            email
        })
    );


    showToast(
        "Account created successfully"
    );


    setTimeout(
        () => openPage("profilePage"),
        500
    );

}


function loginUser(event) {

    event.preventDefault();


    const email =
        $("loginEmail").value.trim().toLowerCase();

    const password =
        $("loginPassword").value;


    const user =
        getUsers().find(
            item =>
                item.email === email &&
                item.password === password
        );


    if (!user) {

        showToast(
            "Incorrect email or password."
        );

        return;

    }


    localStorage.setItem(
        "worldelite_current_user",
        JSON.stringify({
            name: user.name,
            email: user.email
        })
    );


    showToast(
        "Welcome back, " + user.name
    );


    setTimeout(
        () => openPage("profilePage"),
        500
    );

}


function logoutUser() {

    localStorage.removeItem(
        "worldelite_current_user"
    );

    renderProfile();

    showToast("Logged out");

}


function renderProfile() {

    const container =
        $("profileContent");

    if (!container) {
        return;
    }


    let user = null;


    try {

        user = JSON.parse(
            localStorage.getItem(
                "worldelite_current_user"
            )
        );

    } catch {

        user = null;

    }


    if (!user) {

        container.innerHTML = `

            <section class="profile-hero">

                <div class="profile-top">

                    <div class="profile-avatar">
                        ○
                    </div>

                    <div>

                        <h2 class="profile-name">
                            Guest
                        </h2>

                        <div class="profile-country">
                            You are not signed in.
                        </div>

                    </div>

                </div>


                <div class="hero-actions">

                    <button
                        class="gold-button"
                        onclick="openPage('loginPage')"
                    >
                        Login
                    </button>

                    <button
                        class="dark-button"
                        onclick="openPage('signupPage')"
                    >
                        Sign Up
                    </button>

                </div>

            </section>

        `;

        return;

    }


    const favorites =
        getFavorites();


    container.innerHTML = `

        <section class="profile-hero">

            <div class="profile-top">

                <div class="profile-avatar">
                    👤
                </div>

                <div>

                    <h2 class="profile-name">
                        ${escapeHTML(user.name)}
                    </h2>

                    <div class="profile-country">
                        ${escapeHTML(user.email)}
                    </div>

                </div>

            </div>


            <div class="profile-grid">

                <div class="info-box">

                    <small>Favorites</small>

                    <strong>
                        ${favorites.length}
                    </strong>

                </div>


                <div class="info-box">

                    <small>Billionaires</small>

                    <strong>
                        ${billionaires.length.toLocaleString()}
                    </strong>

                </div>


                <div class="info-box">

                    <small>Companies</small>

                    <strong>
                        ${companies.length.toLocaleString()}
                    </strong>

                </div>

            </div>


            <button
                class="favorite-button"
                onclick="logoutUser()"
            >
                Log Out
            </button>

        </section>

    `;

}


/* =========================
   TIME / TOAST
========================= */

function updateTimestamp() {

    const element =
        $("lastUpdated");

    if (!element) {
        return;
    }

    const now =
        new Date();

    element.textContent =
        "Updated " +
        now.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

}


let toastTimer = null;


function showToast(message) {

    const toast =
        $("toast");

    if (!toast) {
        return;
    }

    toast.textContent = message;

    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(
            () => {
                toast.classList.remove("show");
            },
            2500
        );

}


/* =========================
   START
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadData(false);

        renderProfile();

        renderWorldBests();

    }
);
