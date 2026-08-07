/* =========================================================
   WORLDELITE — MAIN SCRIPT
   Billionaires / Companies / Rankings / Profiles
   ========================================================= */

let billionaires = [];
let companies = [];

let currentSort = "highest";
let currentCountry = "all";
let currentSearch = "";
let currentPage = "homePage";
let currentPerson = null;


/* =========================================================
   HELPERS
   ========================================================= */

function $(id) {
    return document.getElementById(id);
}

function safe(value, fallback = "Not publicly available") {
    if (
        value === undefined ||
        value === null ||
        value === "" ||
        value === "Unknown" ||
        value === "unknown"
    ) {
        return fallback;
    }

    return value;
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function numberValue(value) {
    if (typeof value === "number") return value;

    if (!value) return 0;

    const cleaned = String(value)
        .replace(/[$,£€]/g, "")
        .replace(/\s/g, "")
        .replace(/B$/i, "")
        .replace(/bn$/i, "");

    const result = parseFloat(cleaned);

    return Number.isFinite(result) ? result : 0;
}

function money(value) {
    if (value === undefined || value === null || value === "") {
        return "Not publicly available";
    }

    if (typeof value === "number") {
        return "$" + value.toLocaleString();
    }

    return String(value);
}

function getName(person) {
    return safe(
        person.name ||
        person.fullName ||
        person.personName ||
        person.title,
        "Unknown billionaire"
    );
}

function getCountry(person) {
    return safe(
        person.country ||
        person.countryName ||
        person.nationality ||
        person.location,
        "Unknown"
    );
}

function getNetWorth(person) {
    return (
        person.netWorth ??
        person.net_worth ??
        person.estimatedNetWorth ??
        person.wealth ??
        person.netWorthBillions ??
        0
    );
}

function getCompanyName(company) {
    return safe(
        company.name ||
        company.company ||
        company.companyName ||
        company.title,
        "Unknown company"
    );
}

function getFlag(country) {
    const flags = {
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
        "Portugal": "🇵🇹",

        "Ukraine": "🇺🇦",
        "Russia": "🇷🇺",
        "Türkiye": "🇹🇷",
        "Turkey": "🇹🇷",

        "India": "🇮🇳",
        "China": "🇨🇳",
        "Japan": "🇯🇵",
        "South Korea": "🇰🇷",

        "Canada": "🇨🇦",
        "Mexico": "🇲🇽",
        "Brazil": "🇧🇷",
        "Argentina": "🇦🇷",

        "Australia": "🇦🇺",
        "Singapore": "🇸🇬",
        "Switzerland": "🇨🇭",
        "Israel": "🇮🇱",
        "United Arab Emirates": "🇦🇪",
        "Saudi Arabia": "🇸🇦",

        "Indonesia": "🇮🇩",
        "Thailand": "🇹🇭",
        "Vietnam": "🇻🇳",

        "Netherlands": "🇳🇱",
        "Belgium": "🇧🇪",
        "Sweden": "🇸🇪",
        "Norway": "🇳🇴",
        "Denmark": "🇩🇰",
        "Finland": "🇫🇮",

        "Austria": "🇦🇹",
        "Ireland": "🇮🇪",
        "Greece": "🇬🇷",
        "Poland": "🇵🇱",

        "South Africa": "🇿🇦",
        "Nigeria": "🇳🇬",
        "Egypt": "🇪🇬"
    };

    return flags[country] || "🌍";
}


/* =========================================================
   LOAD DATA
   ========================================================= */

async function loadData() {

    try {

        const response = await fetch(
            "data.json?v=" + Date.now(),
            {
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error("Could not load data.json");
        }

        const raw = await response.json();

        /*
         Supports multiple possible data.json structures:
         [
           {...}
         ]

         OR

         {
           billionaires: [...],
           companies: [...]
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

        renderEverything();

    } catch (error) {

        console.error(error);

        billionaires = [];
        companies = [];

        renderEverything();

        showToast(
            "Could not load data. Check data.json.",
            true
        );
    }
}


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadData();

    setupNavigation();

    setupKeyboard();

});


/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {

    const buttons = document.querySelectorAll(
        "[onclick*=\"openPage\"]"
    );

    buttons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

        });

    });

}

function openPage(pageId) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {
        page.classList.add("hidden");
    });

    const target = $(pageId);

    if (!target) {
        console.warn("Page not found:", pageId);
        return;
    }

    target.classList.remove("hidden");

    currentPage = pageId;

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
        renderProfilePage();
    }

}

function updateNavigation(pageId) {

    const navMap = {
        homePage: "navHome",
        rankingsPage: "navRankings",
        companiesPage: "navCompanies",
        profilePage: "navProfile"
    };

    document.querySelectorAll(".nav").forEach(nav => {
        nav.classList.remove("active");
    });

    const id = navMap[pageId];

    if ($(id)) {
        $(id).classList.add("active");
    }

}


/* =========================================================
   RENDER EVERYTHING
   ========================================================= */

function renderEverything() {

    updateHomeStats();

    renderHomeBillionaires();

    populateCountries();

    renderRankings();

    renderCompanies();

    renderProfilePage();

}


/* =========================================================
   HOME
   ========================================================= */

function updateHomeStats() {

    const billionaireCount = $("homeBillionaireCount");
    const companyCount = $("homeCompanyCount");

    if (billionaireCount) {

        billionaireCount.textContent =
            billionaires.length.toLocaleString();

    }

    if (companyCount) {

        companyCount.textContent =
            companies.length.toLocaleString();

    }

}

function renderHomeBillionaires() {

    const container = $("homeBillionaires");

    if (!container) return;

    const sorted = [...billionaires]
        .sort(
            (a, b) =>
                numberValue(getNetWorth(b)) -
                numberValue(getNetWorth(a))
        )
        .slice(0, 5);

    container.innerHTML = "";

    sorted.forEach((person, index) => {

        container.insertAdjacentHTML(
            "beforeend",
            billionaireCard(person, index + 1)
        );

    });

}


/* =========================================================
   BILLIONAIRE CARD
   ========================================================= */

function billionaireCard(person, rank = "") {

    const name = getName(person);
    const country = getCountry(person);
    const netWorth = getNetWorth(person);

    return `
        <article
            class="billionaire-card"
            onclick="openPersonProfile(${getPersonIndex(person)})"
            role="button"
            tabindex="0"
        >

            <div class="rank">
                ${escapeHTML(rank)}
            </div>

            <div class="avatar">
                👤
            </div>

            <div class="card-main">

                <strong>
                    ${escapeHTML(name)}
                </strong>

                <div class="country-line">
                    ${getFlag(country)}
                    ${escapeHTML(country)}
                </div>

            </div>

            <div class="card-worth">
                ${escapeHTML(money(netWorth))}
            </div>

        </article>
    `;
}

function getPersonIndex(person) {

    return billionaires.indexOf(person);

}


/* =========================================================
   RANKINGS
   ========================================================= */

function renderRankings() {

    const container = $("billionaireList");

    if (!container) return;

    let list = [...billionaires];

    if (currentSearch) {

        const query =
            currentSearch.toLowerCase().trim();

        list = list.filter(person => {

            const name =
                getName(person).toLowerCase();

            const country =
                getCountry(person).toLowerCase();

            return (
                name.includes(query) ||
                country.includes(query)
            );

        });

    }

    if (currentCountry !== "all") {

        list = list.filter(person => {

            return (
                getCountry(person) ===
                currentCountry
            );

        });

    }

    list.sort((a, b) => {

        const aWorth =
            numberValue(getNetWorth(a));

        const bWorth =
            numberValue(getNetWorth(b));

        if (currentSort === "lowest") {
            return aWorth - bWorth;
        }

        return bWorth - aWorth;

    });

    container.innerHTML = "";

    list.forEach((person, index) => {

        container.insertAdjacentHTML(
            "beforeend",
            billionaireCard(person, index + 1)
        );

    });

    const count = $("rankingCount");

    if (count) {

        count.textContent =
            `${list.length.toLocaleString()} billionaire${
                list.length === 1 ? "" : "s"
            }`;

    }

    updateSortButtons();

}

function sortBillionaires(type) {

    currentSort = type;

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


/* =========================================================
   SEARCH
   ========================================================= */

function handleGlobalSearch() {

    const input =
        $("globalSearchInput");

    currentSearch =
        input ? input.value : "";

    renderRankings();

}


/* =========================================================
   COUNTRY FILTER
   ========================================================= */

function populateCountries() {

    const select =
        $("countryFilter");

    if (!select) return;

    const countries =
        [...new Set(
            billionaires
                .map(getCountry)
                .filter(country =>
                    country &&
                    country !== "Unknown"
                )
        )]
        .sort((a, b) =>
            a.localeCompare(b)
        );

    select.innerHTML = `
        <option value="all">
            🌍 All Countries
        </option>
    `;

    countries.forEach(country => {

        select.insertAdjacentHTML(
            "beforeend",
            `
                <option value="${escapeHTML(country)}">
                    ${getFlag(country)}
                    ${escapeHTML(country)}
                </option>
            `
        );

    });

    select.value = currentCountry;

}

function filterBillionaires() {

    const select =
        $("countryFilter");

    currentCountry =
        select ? select.value : "all";

    renderRankings();

}


/* =========================================================
   REFRESH
   ========================================================= */

async function refreshData() {

    showToast("Refreshing data...");

    const buttons =
        document.querySelectorAll(
            "button"
        );

    buttons.forEach(button => {

        if (
            button.textContent
                .toLowerCase()
                .includes("refresh")
        ) {

            button.disabled = true;

        }

    });

    try {

        await loadData();

        showToast(
            `Updated: ${billionaires.length.toLocaleString()} billionaires`
        );

    } catch (error) {

        showToast(
            "Refresh failed.",
            true
        );

    } finally {

        buttons.forEach(button => {

            button.disabled = false;

        });

    }

}


/* =========================================================
   PERSON PROFILE
   ========================================================= */

function openPersonProfile(index) {

    const person =
        billionaires[index];

    if (!person) return;

    currentPerson = person;

    openPage("personPage");

    renderPersonProfile(person);

}

function renderPersonProfile(person) {

    const container =
        $("personContent");

    if (!container) return;

    const name =
        getName(person);

    const country =
        getCountry(person);

    const netWorth =
        getNetWorth(person);

    const biography =
        getBiography(person);

    const investments =
        getArray(
            person.investments ||
            person.investmentAreas ||
            person.investment_areas
        );

    const assets =
        getArray(
            person.assets ||
            person.holdings
        );

    const stakes =
        getArray(
            person.stakes ||
            person.ownership
        );

    const companies =
        getArray(
            person.companies ||
            person.businesses
        );

    const investmentReasons =
        getArray(
            person.investmentReasons ||
            person.whyInvest ||
            person.why_invest
        );

    const salary =
        person.annualSalary ||
        person.annual_salary ||
        person.salary;

    const source =
        person.source ||
        person.dataSource ||
        person.sourceUrl;

    container.innerHTML = `

        <div class="person-profile">

            <div class="profile-hero">

                <div class="large-avatar">
                    👤
                </div>

                <div class="profile-country">
                    ${getFlag(country)}
                    ${escapeHTML(country)}
                </div>

                <h1>
                    ${escapeHTML(name)}
                </h1>

                <div class="profile-worth">
                    ${escapeHTML(money(netWorth))}
                </div>

                <div class="profile-label">
                    Estimated Net Worth
                </div>

                <button
                    class="favorite-button"
                    onclick="toggleFavoritePerson(${getPersonIndex(person)})"
                >
                    ☆ Add Favorite
                </button>

            </div>


            ${profileSection(
                "Biography",
                "👤",
                `<p>${escapeHTML(biography)}</p>`
            )}


            ${profileSection(
                "Business & Companies",
                "🏢",
                renderList(companies)
            )}


            ${profileSection(
                "Investments",
                "📈",
                renderList(investments)
            )}


            ${profileSection(
                "Assets & Holdings",
                "💼",
                renderList(assets)
            )}


            ${profileSection(
                "Ownership & Stakes",
                "📊",
                renderList(stakes)
            )}


            ${profileSection(
                "Annual Salary",
                "💵",
                `<p>${escapeHTML(
                    money(salary)
                )}</p>`
            )}


            ${profileSection(
                "Where They Invest Most",
                "🎯",
                renderInvestmentAreas(person)
            )}


            ${profileSection(
                "Why They Invest There",
                "💡",
                renderInvestmentReasons(
                    person,
                    investmentReasons
                )
            )}


            ${source ? `
                <div class="profile-source">
                    Source:
                    ${escapeHTML(source)}
                </div>
            ` : ""}

        </div>
    `;

}


/* =========================================================
   PROFILE DATA
   ========================================================= */

function getBiography(person) {

    return safe(
        person.biography ||
        person.bio ||
        person.description ||
        person.about,
        "A detailed biography is not currently available in the dataset."
    );

}

function getArray(value) {

    if (!value) return [];

    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value === "string") {

        return value
            .split(",")
            .map(item => item.trim())
            .filter(Boolean);

    }

    return [];

}

function profileSection(title, icon, content) {

    return `
        <section class="profile-section">

            <div class="profile-section-title">

                <span>
                    ${icon}
                </span>

                <h2>
                    ${escapeHTML(title)}
                </h2>

            </div>

            <div class="profile-section-content">
                ${content}
            </div>

        </section>
    `;

}

function renderList(items) {

    if (!items.length) {

        return `
            <p class="not-available">
                Information is not publicly available
                in the current dataset.
            </p>
        `;

    }

    return `
        <ul class="profile-list">

            ${items.map(item => `
                <li>
                    ${escapeHTML(
                        typeof item === "object"
                            ? JSON.stringify(item)
                            : item
                    )}
                </li>
            `).join("")}

        </ul>
    `;

}

function renderInvestmentAreas(person) {

    const areas =
        getArray(
            person.investmentAreas ||
            person.investment_areas ||
            person.sectors ||
            person.industries
        );

    if (areas.length) {
        return renderList(areas);
    }

    return `
        <p class="not-available">
            Investment concentration is not available
            in the current dataset.
        </p>
    `;

}

function renderInvestmentReasons(
    person,
    existingReasons
) {

    if (existingReasons.length) {

        return renderList(existingReasons);

    }

    const reason =
        person.investmentReason ||
        person.investment_reason ||
        person.whyInvest ||
        person.why_invest;

    if (reason) {

        return `<p>${escapeHTML(reason)}</p>`;

    }

    return `
        <p class="not-available">
            A verified reason for these investment
            decisions is not available in the current
            dataset.
        </p>

        <p class="profile-note">
            WorldElite should not invent an investor's
            motives. This section will display a reason
            when it is supported by the data source.
        </p>
    `;

}


/* =========================================================
   PROFILE PAGE
   ========================================================= */

function renderProfilePage() {

    const container =
        $("profileContent");

    if (!container) return;

    container.innerHTML = `

        <div class="account-card">

            <div class="account-icon">
                👤
            </div>

            <h2>
                WorldElite Account
            </h2>

            <p>
                Sign in to save favorites,
                follow billionaires and companies,
                and personalize your dashboard.
            </p>

            <div class="account-buttons">

                <button
                    onclick="showLogin()"
                    class="primary-button"
                >
                    Login
                </button>

                <button
                    onclick="showSignup()"
                    class="secondary-button"
                >
                    Sign Up
                </button>

            </div>

        </div>

    `;

}


/* =========================================================
   LOGIN / SIGN UP
   ========================================================= */

function showLogin() {

    showAuthModal("Login");

}

function showSignup() {

    showAuthModal("Sign Up");

}

function showAuthModal(mode) {

    removeAuthModal();

    const isLogin =
        mode === "Login";

    const modal =
        document.createElement("div");

    modal.id = "authModal";

    modal.className = "auth-modal";

    modal.innerHTML = `

        <div
            class="auth-overlay"
            onclick="removeAuthModal()"
        ></div>

        <div class="auth-box">

            <button
                class="auth-close"
                onclick="removeAuthModal()"
            >
                ×
            </button>

            <div class="auth-logo">
                WORLD ELITE
            </div>

            <h2>
                ${isLogin
                    ? "Welcome back"
                    : "Create your account"}
            </h2>

            <p>
                ${isLogin
                    ? "Login to your WorldElite account."
                    : "Join WorldElite and personalize your experience."}
            </p>

            ${!isLogin ? `
                <input
                    id="authName"
                    type="text"
                    placeholder="Full name"
                >
            ` : ""}

            <input
                id="authEmail"
                type="email"
                placeholder="Email"
            >

            <input
                id="authPassword"
                type="password"
                placeholder="Password"
            >

            <button
                class="auth-submit"
                onclick="submitAuth('${isLogin ? "login" : "signup"}')"
            >
                ${isLogin ? "Login" : "Create account"}
            </button>

            <button
                class="auth-switch"
                onclick="${isLogin
                    ? "showSignup()"
                    : "showLogin()"}"
            >
                ${isLogin
                    ? "Create an account"
                    : "Already have an account? Login"}
            </button>

        </div>
    `;

    document.body.appendChild(modal);

}

function removeAuthModal() {

    const modal =
        $("authModal");

    if (modal) {
        modal.remove();
    }

}

function submitAuth(type) {

    const email =
        $("authEmail")?.value.trim();

    const password =
        $("authPassword")?.value.trim();

    if (!email || !password) {

        showToast(
            "Please enter your email and password.",
            true
        );

        return;

    }

    if (type === "signup") {

        const name =
            $("authName")?.value.trim();

        localStorage.setItem(
            "worldelite_user",
            JSON.stringify({
                name: name || "WorldElite User",
                email: email
            })
        );

        showToast(
            "Account created on this device."
        );

    } else {

        showToast(
            "Login saved on this device."
        );

    }

    removeAuthModal();

}


/* =========================================================
   COMPANIES
   ========================================================= */

function renderCompanies() {

    const container =
        $("companyList");

    if (!container) return;

    const searchInput =
        $("companySearchInput");

    const query =
        searchInput?.value
            ?.toLowerCase()
            ?.trim() || "";

    let list =
        [...companies];

    if (query) {

        list = list.filter(company => {

            const name =
                getCompanyName(company)
                    .toLowerCase();

            const industry =
                safe(
                    company.industry ||
                    company.sector,
                    ""
                ).toLowerCase();

            return (
                name.includes(query) ||
                industry.includes(query)
            );

        });

    }

    container.innerHTML = "";

    list.forEach((company, index) => {

        container.insertAdjacentHTML(
            "beforeend",
            companyCard(company, index)
        );

    });

}

function searchCompanies() {

    renderCompanies();

}

function companyCard(company, index) {

    const name =
        getCompanyName(company);

    const revenue =
        company.revenue ??
        company.annualRevenue ??
        company.annual_revenue;

    return `
        <article
            class="company-card"
            onclick="openCompanyProfile(${index})"
        >

            <div class="company-icon">
                🏢
            </div>

            <div class="company-main">

                <strong>
                    ${escapeHTML(name)}
                </strong>

                <span>
                    ${escapeHTML(
                        safe(
                            company.industry ||
                            company.sector,
                            "Global business"
                        )
                    )}
                </span>

            </div>

            <div class="company-revenue">
                ${revenue
                    ? escapeHTML(money(revenue))
                    : "—"}
            </div>

        </article>
    `;

}

function openCompanyProfile(index) {

    const company =
        companies[index];

    if (!company) return;

    const personPage =
        $("personPage");

    const content =
        $("personContent");

    if (!personPage || !content) return;

    document.querySelectorAll(".page")
        .forEach(page =>
            page.classList.add("hidden")
        );

    personPage.classList.remove("hidden");

    content.innerHTML = `

        <div class="person-profile">

            <div class="profile-hero">

                <div class="large-avatar">
                    🏢
                </div>

                <h1>
                    ${escapeHTML(
                        getCompanyName(company)
                    )}
                </h1>

                <div class="profile-country">
                    ${escapeHTML(
                        safe(
                            company.country ||
                            company.headquarters,
                            "Global"
                        )
                    )}
                </div>

            </div>

            ${profileSection(
                "Company Biography",
                "🏢",
                `<p>${escapeHTML(
                    safe(
                        company.biography ||
                        company.bio ||
                        company.description ||
                        company.about
                    )
                )}</p>`
            )}

            ${profileSection(
                "Revenue",
                "💰",
                `<p>${escapeHTML(
                    money(
                        company.revenue ||
                        company.annualRevenue
                    )
                )}</p>`
            )}

            ${profileSection(
                "Gross Profit",
                "📊",
                `<p>${escapeHTML(
                    money(company.grossProfit)
                )}</p>`
            )}

            ${profileSection(
                "Net Profit",
                "💵",
                `<p>${escapeHTML(
                    money(
                        company.netProfit ||
                        company.netIncome
                    )
                )}</p>`
            )}

            ${profileSection(
                "Investments",
                "📈",
                renderList(
                    getArray(
                        company.investments ||
                        company.investmentAreas
                    )
                )
            )}

            ${profileSection(
                "Stakes & Ownership",
                "📊",
                renderList(
                    getArray(
                        company.stakes ||
                        company.ownership
                    )
                )
            )}

            ${profileSection(
                "Why The Company Invests There",
                "💡",
                `<p>${escapeHTML(
                    safe(
                        company.investmentReason ||
                        company.whyInvest ||
                        company.why_invest,
                        "A verified explanation is not currently available."
                    )
                )}</p>`
            )}

        </div>

    `;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   FAVORITES
   ========================================================= */

function toggleFavoritePerson(index) {

    const person =
        billionaires[index];

    if (!person) return;

    const name =
        getName(person);

    let favorites =
        JSON.parse(
            localStorage.getItem(
                "worldelite_favorites"
            ) || "[]"
        );

    const exists =
        favorites.includes(name);

    if (exists) {

        favorites =
            favorites.filter(
                item => item !== name
            );

        showToast(
            `${name} removed from favorites.`
        );

    } else {

        favorites.push(name);

        showToast(
            `${name} added to favorites.`
        );

    }

    localStorage.setItem(
        "worldelite_favorites",
        JSON.stringify(favorites)
    );

}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message, error = false) {

    const old =
        document.querySelector(".worldelite-toast");

    if (old) old.remove();

    const toast =
        document.createElement("div");

    toast.className =
        "worldelite-toast" +
        (error ? " error" : "");

    toast.textContent =
        message;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("show");

    }, 20);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 3000);

}


/* =========================================================
   KEYBOARD
   ========================================================= */

function setupKeyboard() {

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                removeAuthModal();

            }

        }
    );

}


/* =========================================================
   GLOBAL FALLBACKS
   ========================================================= */

window.openPage = openPage;

window.sortBillionaires =
    sortBillionaires;

window.handleGlobalSearch =
    handleGlobalSearch;

window.filterBillionaires =
    filterBillionaires;

window.refreshData =
    refreshData;

window.openPersonProfile =
    openPersonProfile;

window.searchCompanies =
    searchCompanies;

window.openCompanyProfile =
    openCompanyProfile;

window.showLogin =
    showLogin;

window.showSignup =
    showSignup;

window.submitAuth =
    submitAuth;

window.removeAuthModal =
    removeAuthModal;

window.toggleFavoritePerson =
    toggleFavoritePerson;
