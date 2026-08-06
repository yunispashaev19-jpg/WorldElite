/* =========================================================
   WORLD ELITE — MAIN JAVASCRIPT
   Navigation + Rankings + Companies + Profile + Data
   ========================================================= */

(function () {
    "use strict";

    const DATA_URL = "./data.json";

    let DATA = {
        billionaires: [],
        companies: []
    };

    let currentPage = "home";
    let currentSort = "highest";
    let currentCountry = "All";
    let searchText = "";

    /* =========================================================
       HELPERS
       ========================================================= */

    function $(selector) {
        return document.querySelector(selector);
    }

    function $all(selector) {
        return Array.from(document.querySelectorAll(selector));
    }

    function money(value) {
        const n = Number(value) || 0;

        if (n >= 1000) {
            return "$" + (n / 1000).toFixed(1) + "T";
        }

        return "$" + n.toFixed(1) + "B";
    }

    function getName(person) {
        return (
            person.name ||
            person.fullName ||
            person.person ||
            "Unknown"
        );
    }

    function getWealth(person) {
        return Number(
            person.netWorth ??
            person.net_worth ??
            person.wealth ??
            person.estimatedNetWorth ??
            person.value ??
            0
        );
    }

    function getCountry(person) {
        return (
            person.country ||
            person.countryCode ||
            person.nationality ||
            "Unknown"
        );
    }

    function getCompany(person) {
        if (Array.isArray(person.companies)) {
            return person.companies.join(", ");
        }

        return (
            person.company ||
            person.companies ||
            person.business ||
            "—"
        );
    }

    function getFlag(country) {
        const flags = {
            US: "🇺🇸",
            USA: "🇺🇸",
            "United States": "🇺🇸",
            GB: "🇬🇧",
            UK: "🇬🇧",
            "United Kingdom": "🇬🇧",
            FR: "🇫🇷",
            France: "🇫🇷",
            DE: "🇩🇪",
            Germany: "🇩🇪",
            IT: "🇮🇹",
            Italy: "🇮🇹",
            ES: "🇪🇸",
            Spain: "🇪🇸",
            CN: "🇨🇳",
            China: "🇨🇳",
            IN: "🇮🇳",
            India: "🇮🇳",
            RU: "🇷🇺",
            Russia: "🇷🇺",
            UA: "🇺🇦",
            Ukraine: "🇺🇦",
            TR: "🇹🇷",
            Turkey: "🇹🇷",
            AE: "🇦🇪",
            UAE: "🇦🇪",
            JP: "🇯🇵",
            Japan: "🇯🇵",
            KR: "🇰🇷",
            "South Korea": "🇰🇷",
            CA: "🇨🇦",
            Canada: "🇨🇦",
            AU: "🇦🇺",
            Australia: "🇦🇺",
            BR: "🇧🇷",
            Brazil: "🇧🇷",
            MX: "🇲🇽",
            Mexico: "🇲🇽",
            SG: "🇸🇬",
            Singapore: "🇸🇬",
            CH: "🇨🇭",
            Switzerland: "🇨🇭",
            IL: "🇮🇱",
            Israel: "🇮🇱",
            NG: "🇳🇬",
            Nigeria: "🇳🇬",
            ZA: "🇿🇦",
            "South Africa": "🇿🇦"
        };

        return flags[country] || "🌍";
    }

    function normalizeData(raw) {
        let billionaires = [];
        let companies = [];

        if (Array.isArray(raw)) {
            billionaires = raw;
        } else {
            billionaires =
                raw.billionaires ||
                raw.people ||
                raw.richest ||
                raw.richestPeople ||
                [];

            companies =
                raw.companies ||
                raw.businesses ||
                [];
        }

        return {
            billionaires: Array.isArray(billionaires)
                ? billionaires
                : [],
            companies: Array.isArray(companies)
                ? companies
                : []
        };
    }

    /* =========================================================
       LOAD DATA
       ========================================================= */

    async function loadData() {
        try {
            const response = await fetch(
                DATA_URL + "?v=" + Date.now(),
                {
                    cache: "no-store"
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Data request failed: " + response.status
                );
            }

            const raw = await response.json();

            DATA = normalizeData(raw);

            console.log(
                "WorldElite data loaded:",
                DATA.billionaires.length,
                "billionaires;",
                DATA.companies.length,
                "companies"
            );

            renderCurrentPage();

        } catch (error) {
            console.error("WorldElite data error:", error);

            showError(
                "Unable to load live data. Please refresh the page."
            );
        }
    }

    /* =========================================================
       PAGE DETECTION
       ========================================================= */

    function getMainContainer() {
        return (
            document.querySelector("main") ||
            document.querySelector("#app") ||
            document.querySelector(".app") ||
            document.body
        );
    }

    /* =========================================================
       NAVIGATION
       ========================================================= */

    function setPage(page) {
        currentPage = page;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        renderCurrentPage();

        updateNavigation();
    }

    function updateNavigation() {
        const buttons = $all(
            "button, a, [role='button']"
        );

        buttons.forEach(function (element) {
            const text =
                (element.textContent || "")
                    .trim()
                    .toLowerCase();

            element.classList.remove("active");

            if (
                currentPage === "home" &&
                text === "home"
            ) {
                element.classList.add("active");
            }

            if (
                currentPage === "rankings" &&
                text.includes("rankings")
            ) {
                element.classList.add("active");
            }

            if (
                currentPage === "companies" &&
                text.includes("companies")
            ) {
                element.classList.add("active");
            }

            if (
                currentPage === "profile" &&
                text.includes("profile")
            ) {
                element.classList.add("active");
            }
        });
    }

    /* =========================================================
       HOME
       ========================================================= */

    function renderHome() {
        const main = getMainContainer();

        if (!main) return;

        const people = [...DATA.billionaires]
            .sort((a, b) => getWealth(b) - getWealth(a))
            .slice(0, 10);

        const billionairesCount =
            DATA.billionaires.length.toLocaleString();

        const companiesCount =
            DATA.companies.length.toLocaleString();

        main.innerHTML = `
            <section class="worldelite-home">

                <div class="live-badge">
                    <span class="live-dot"></span>
                    LIVE DATA
                </div>

                <h1>
                    The world's wealth,
                    <span>in one place.</span>
                </h1>

                <p class="hero-description">
                    Track billionaires, wealth,
                    countries and companies.
                </p>

                <div class="stats-grid">

                    <div class="stat-card">
                        <div class="stat-icon">👑</div>
                        <strong>
                            ${billionairesCount}
                        </strong>
                        <span>Billionaires</span>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">🏢</div>
                        <strong>
                            ${companiesCount}
                        </strong>
                        <span>Companies</span>
                    </div>

                </div>

                <div class="section-header">
                    <h2>Top Billionaires</h2>

                    <button
                        class="see-all-button"
                        data-action="rankings"
                    >
                        See all →
                    </button>
                </div>

                <div class="top-list">

                    ${people
                        .map((person, index) =>
                            billionaireCard(
                                person,
                                index + 1
                            )
                        )
                        .join("")}

                </div>

            </section>
        `;
    }

    /* =========================================================
       BILLIONAIRE CARD
       ========================================================= */

    function billionaireCard(person, index) {
        const name = getName(person);
        const wealth = getWealth(person);
        const country = getCountry(person);

        return `
            <button
                class="billionaire-card"
                data-person="${escapeHtml(name)}"
                type="button"
            >

                <div class="rank-number">
                    ${index}
                </div>

                <div class="person-avatar">
                    👤
                </div>

                <div class="person-info">

                    <strong>
                        ${escapeHtml(name)}
                    </strong>

                    <span>
                        ${getFlag(country)}
                        ${escapeHtml(country)}
                    </span>

                </div>

                <div class="person-worth">
                    ${money(wealth)}
                </div>

            </button>
        `;
    }

    /* =========================================================
       RANKINGS
       ========================================================= */

    function renderRankings() {
        const main = getMainContainer();

        if (!main) return;

        let people = [...DATA.billionaires];

        if (searchText) {
            const q = searchText.toLowerCase();

            people = people.filter(person => {
                return (
                    getName(person)
                        .toLowerCase()
                        .includes(q) ||
                    getCountry(person)
                        .toLowerCase()
                        .includes(q)
                );
            });
        }

        if (currentCountry !== "All") {
            people = people.filter(
                person =>
                    getCountry(person) ===
                    currentCountry
            );
        }

        people.sort((a, b) => {
            if (currentSort === "lowest") {
                return getWealth(a) - getWealth(b);
            }

            return getWealth(b) - getWealth(a);
        });

        const countries = [
            ...new Set(
                DATA.billionaires
                    .map(getCountry)
                    .filter(
                        country =>
                            country &&
                            country !== "Unknown"
                    )
            )
        ].sort();

        main.innerHTML = `

            <section class="rankings-page">

                <div class="page-heading">
                    <span>WORLD ELITE</span>
                    <h1>Rankings</h1>
                    <p>
                        World's wealthiest people.
                    </p>
                </div>

                <div class="ranking-controls">

                    <input
                        id="searchPeople"
                        type="search"
                        placeholder="Search billionaire..."
                        value="${escapeHtml(searchText)}"
                    />

                    <select id="countryFilter">

                        <option value="All">
                            All countries
                        </option>

                        ${countries
                            .map(
                                country => `
                                    <option
                                        value="${escapeHtml(
                                            country
                                        )}"
                                        ${
                                            currentCountry ===
                                            country
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        ${getFlag(country)}
                                        ${escapeHtml(
                                            country
                                        )}
                                    </option>
                                `
                            )
                            .join("")}

                    </select>

                    <div class="sort-buttons">

                        <button
                            type="button"
                            data-sort="highest"
                            class="${
                                currentSort === "highest"
                                    ? "active"
                                    : ""
                            }"
                        >
                            Highest
                        </button>

                        <button
                            type="button"
                            data-sort="lowest"
                            class="${
                                currentSort === "lowest"
                                    ? "active"
                                    : ""
                            }"
                        >
                            Lowest
                        </button>

                    </div>

                </div>

                <div class="ranking-count">
                    ${people.length.toLocaleString()}
                    billionaires
                </div>

                <div class="rankings-list">

                    ${people
                        .map((person, index) =>
                            billionaireCard(
                                person,
                                index + 1
                            )
                        )
                        .join("")}

                </div>

            </section>
        `;
    }

    /* =========================================================
       COMPANIES
       ========================================================= */

    function renderCompanies() {
        const main = getMainContainer();

        if (!main) return;

        main.innerHTML = `

            <section class="companies-page">

                <div class="page-heading">

                    <span>WORLD ELITE</span>

                    <h1>Companies</h1>

                    <p>
                        Leading companies and
                        global business intelligence.
                    </p>

                </div>

                <div class="company-count">
                    🏢
                    ${DATA.companies.length.toLocaleString()}
                    companies
                </div>

                <div class="companies-list">

                    ${
                        DATA.companies.length
                            ? DATA.companies
                                  .map(
                                      (company, index) =>
                                          companyCard(
                                              company,
                                              index + 1
                                          )
                                  )
                                  .join("")
                            : `
                                <div class="empty-state">
                                    No company data available.
                                </div>
                            `
                    }

                </div>

            </section>
        `;
    }

    function companyCard(company, index) {
        const name =
            typeof company === "string"
                ? company
                : company.name ||
                  company.company ||
                  "Company";

        return `
            <div class="company-card">

                <span class="company-rank">
                    ${index}
                </span>

                <span class="company-icon">
                    🏢
                </span>

                <strong>
                    ${escapeHtml(name)}
                </strong>

            </div>
        `;
    }

    /* =========================================================
       PROFILE
       ========================================================= */

    function renderProfile() {
        const main = getMainContainer();

        if (!main) return;

        main.innerHTML = `

            <section class="profile-page">

                <div class="profile-avatar">
                    👤
                </div>

                <h1>Profile</h1>

                <p>
                    Your WorldElite account.
                </p>

                <div class="profile-actions">

                    <button
                        type="button"
                        data-action="login"
                    >
                        Log in
                    </button>

                    <button
                        type="button"
                        data-action="signup"
                    >
                        Sign up
                    </button>

                </div>

            </section>
        `;
    }

    /* =========================================================
       LOGIN / SIGN UP
       ========================================================= */

    function showLogin() {
        const main = getMainContainer();

        if (!main) return;

        main.innerHTML = `

            <section class="auth-page">

                <button
                    type="button"
                    class="back-button"
                    data-action="profile"
                >
                    ← Back
                </button>

                <h1>Log in</h1>

                <input
                    type="email"
                    placeholder="Email"
                />

                <input
                    type="password"
                    placeholder="Password"
                />

                <button
                    type="button"
                    class="primary-button"
                    data-action="login-submit"
                >
                    Log in
                </button>

            </section>
        `;
    }

    function showSignup() {
        const main = getMainContainer();

        if (!main) return;

        main.innerHTML = `

            <section class="auth-page">

                <button
                    type="button"
                    class="back-button"
                    data-action="profile"
                >
                    ← Back
                </button>

                <h1>Create account</h1>

                <input
                    type="text"
                    placeholder="Full name"
                />

                <input
                    type="email"
                    placeholder="Email"
                />

                <input
                    type="password"
                    placeholder="Password"
                />

                <button
                    type="button"
                    class="primary-button"
                    data-action="signup-submit"
                >
                    Sign up
                </button>

            </section>
        `;
    }

    /* =========================================================
       PERSON DETAIL
       ========================================================= */

    function showPerson(name) {
        const person = DATA.billionaires.find(
            p => getName(p) === name
        );

        if (!person) return;

        const main = getMainContainer();

        if (!main) return;

        const country = getCountry(person);
        const wealth = getWealth(person);
        const company = getCompany(person);

        main.innerHTML = `

            <section class="person-page">

                <button
                    type="button"
                    class="back-button"
                    data-action="rankings"
                >
                    ← Back to rankings
                </button>

                <div class="person-hero">

                    <div class="large-avatar">
                        👤
                    </div>

                    <div class="country-flag">
                        ${getFlag(country)}
                    </div>

                    <h1>
                        ${escapeHtml(name)}
                    </h1>

                    <p>
                        ${escapeHtml(country)}
                    </p>

                    <strong class="big-worth">
                        ${money(wealth)}
                    </strong>

                    <span>
                        Estimated Net Worth
                    </span>

                    <p class="company-line">
                        🏢
                        ${escapeHtml(company)}
                    </p>

                    <button
                        type="button"
                        class="favorite-button"
                        data-action="favorite"
                    >
                        ☆ Add Favorite
                    </button>

                </div>

                <div class="wealth-box">

                    <h2>
                        📊 Wealth
                    </h2>

                    <p>
                        Current estimated net worth:
                        <strong>
                            ${money(wealth)}
                        </strong>
                    </p>

                </div>

            </section>
        `;
    }

    /* =========================================================
       REFRESH
       ========================================================= */

    async function refreshData() {
        const buttons = $all(
            "[data-action='refresh'], #refreshData"
        );

        buttons.forEach(button => {
            button.disabled = true;
            button.classList.add("loading");
        });

        try {
            await loadData();
        } finally {
            buttons.forEach(button => {
                button.disabled = false;
                button.classList.remove("loading");
            });
        }
    }

    /* =========================================================
       RENDER CURRENT PAGE
       ========================================================= */

    function renderCurrentPage() {
        if (currentPage === "home") {
            renderHome();
        } else if (currentPage === "rankings") {
            renderRankings();
        } else if (currentPage === "companies") {
            renderCompanies();
        } else if (currentPage === "profile") {
            renderProfile();
        }
    }

    /* =========================================================
       ERROR
       ========================================================= */

    function showError(message) {
        const main = getMainContainer();

        if (!main) return;

        const existing =
            document.querySelector(
                ".worldelite-error"
            );

        if (existing) {
            existing.remove();
        }

        const error = document.createElement("div");

        error.className = "worldelite-error";

        error.innerHTML = `
            <strong>WorldElite</strong>
            <p>${escapeHtml(message)}</p>
            <button
                type="button"
                data-action="refresh"
            >
                Refresh
            </button>
        `;

        document.body.prepend(error);
    }

    /* =========================================================
       ESCAPE HTML
       ========================================================= */

    function escapeHtml(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    /* =========================================================
       GLOBAL CLICK HANDLER
       ========================================================= */

    document.addEventListener(
        "click",
        function (event) {

            const target =
                event.target.closest(
                    "button, a, [role='button'], [data-action]"
                );

            if (!target) return;

            const action =
                target.dataset.action;

            const text =
                (target.textContent || "")
                    .trim()
                    .toLowerCase();

            /* Navigation */

            if (
                action === "home" ||
                text === "home"
            ) {
                event.preventDefault();
                setPage("home");
                return;
            }

            if (
                action === "rankings" ||
                text.includes("rankings")
            ) {
                event.preventDefault();
                setPage("rankings");
                return;
            }

            if (
                action === "companies" ||
                text.includes("companies")
            ) {
                event.preventDefault();
                setPage("companies");
                return;
            }

            if (
                action === "profile" ||
                text === "profile"
            ) {
                event.preventDefault();
                setPage("profile");
                return;
            }

            /* See all */

            if (
                action === "see-all" ||
                text.includes("see all")
            ) {
                event.preventDefault();
                setPage("rankings");
                return;
            }

            /* Sort */

            if (target.dataset.sort) {
                event.preventDefault();

                currentSort =
                    target.dataset.sort;

                renderRankings();

                return;
            }

            /* Person */

            if (target.dataset.person) {
                event.preventDefault();

                showPerson(
                    target.dataset.person
                );

                return;
            }

            /* Login */

            if (
                action === "login" ||
                text === "log in" ||
                text === "login"
            ) {
                event.preventDefault();
                showLogin();
                return;
            }

            /* Signup */

            if (
                action === "signup" ||
                text === "sign up" ||
                text === "signup"
            ) {
                event.preventDefault();
                showSignup();
                return;
            }

            /* Favorite */

            if (action === "favorite") {
                event.preventDefault();

                const button = target;

                if (
                    button.textContent.includes(
                        "Add Favorite"
                    )
                ) {
                    button.textContent =
                        "★ Added to Favorites";
                } else {
                    button.textContent =
                        "☆ Add Favorite";
                }

                return;
            }

            /* Refresh */

            if (
                action === "refresh" ||
                text.includes("refresh data")
            ) {
                event.preventDefault();
                refreshData();
                return;
            }

        },
        false
    );

    /* =========================================================
       SEARCH + COUNTRY FILTER
       ========================================================= */

    document.addEventListener(
        "input",
        function (event) {

            if (
                event.target.id ===
                "searchPeople"
            ) {
                searchText =
                    event.target.value;

                renderRankings();
            }

        },
        false
    );

    document.addEventListener(
        "change",
        function (event) {

            if (
                event.target.id ===
                "countryFilter"
            ) {
                currentCountry =
                    event.target.value;

                renderRankings();
            }

        },
        false
    );

    /* =========================================================
       INITIALIZE
       ========================================================= */

    function init() {

        /*
         * IMPORTANT:
         * We don't replace the existing page immediately.
         * We first load the real data.
         */

        loadData();

        /*
         * Handle browser back button.
         */

        window.addEventListener(
            "popstate",
            function () {
                renderCurrentPage();
            }
        );

    }

    /* =========================================================
       START
       ========================================================= */

    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            init
        );
    } else {
        init();
    }

})();
