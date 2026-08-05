/* =========================================================
   WORLDELITE
   Main application
   ========================================================= */

let billionaires = [];
let companies = [];

let currentSort = "highest";
let currentPerson = null;
let currentCompany = null;


/* =========================================================
   STORAGE
   ========================================================= */

const USERS_KEY = "worldelite_users";
const CURRENT_USER_KEY = "worldelite_current_user";
const FAVORITES_KEY = "worldelite_favorites";


function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch {
        return [];
    }
}


function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}


function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    } catch {
        return null;
    }
}


function saveCurrentUser(user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}


function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    openHome();
    updateProfile();
}


function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || {};
    } catch {
        return {};
    }
}


function saveFavorites(data) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(data));
}


/* =========================================================
   DATA
   ========================================================= */

async function loadData() {

    try {

        const response = await fetch("data.json", {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Data loading failed");
        }

        const data = await response.json();

        /*
          Supports multiple possible data.json structures.
        */

        if (Array.isArray(data)) {
            billionaires = data;
        }

        else if (Array.isArray(data.billionaires)) {
            billionaires = data.billionaires;
        }

        else if (Array.isArray(data.people)) {
            billionaires = data.people;
        }

        else {
            billionaires = [];
        }

        if (Array.isArray(data.companies)) {
            companies = data.companies;
        }

        else {
            companies = createCompaniesFromPeople();
        }

        normalizePeople();

        populateCountries();

        updateHomeStats();

        renderHomeTop();

        renderRankings();

        renderCompanies();

        updateProfile();

    } catch (error) {

        console.error(error);

        billionaires = [];
        companies = [];

        document.getElementById("rankingsList").innerHTML = `
            <div class="empty-state">
                <h3>Unable to load data</h3>
                <p>Please try again later.</p>
            </div>
        `;

    }

}


/* =========================================================
   NORMALIZE DATA
   ========================================================= */

function normalizePeople() {

    billionaires = billionaires.map((person, index) => {

        const name =
            person.name ||
            person.personName ||
            person.fullName ||
            "Unknown";

        const country =
            person.country ||
            person.countryCode ||
            person.nationality ||
            "";

        let netWorth =
            person.netWorth ??
            person.net_worth ??
            person.wealth ??
            person.value ??
            0;

        if (typeof netWorth === "string") {

            netWorth = netWorth
                .replace(/\$/g, "")
                .replace(/,/g, "")
                .replace(/B/gi, "")
                .trim();

        }

        netWorth = Number(netWorth) || 0;

        return {
            ...person,
            id: String(
                person.id ||
                person.slug ||
                name.toLowerCase().replace(/[^a-z0-9]+/g, "-") ||
                index
            ),
            name,
            country,
            netWorth,
            company:
                person.company ||
                person.companies ||
                person.source ||
                "Private investments",
            image:
                person.image ||
                person.photo ||
                person.avatar ||
                "",
            change:
                person.change ??
                person.dailyChange ??
                person.changePercent ??
                0
        };

    });

}


/* =========================================================
   COMPANIES
   ========================================================= */

function createCompaniesFromPeople() {

    const map = {};

    billionaires.forEach(person => {

        let company = person.company;

        if (!company || typeof company !== "string") {
            return;
        }

        company = company.split(",")[0].trim();

        if (!company) return;

        if (!map[company]) {

            map[company] = {
                id: company.toLowerCase().replace(/\s+/g, "-"),
                name: company,
                value: 0,
                ceo: person.name
            };

        }

        map[company].value += person.netWorth;

    });

    return Object.values(map);
}


/* =========================================================
   NAVIGATION
   ========================================================= */

function hidePages() {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

}


function showPage(id) {

    hidePages();

    const page = document.getElementById(id);

    if (page) {
        page.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "instant"
    });

    updateNavigation(id);

}


function updateNavigation(pageId) {

    document.querySelectorAll(".bottom-nav button")
        .forEach(button => button.classList.remove("active"));

    if (pageId === "homePage") {
        document.getElementById("navHome").classList.add("active");
    }

    if (pageId === "rankingsPage" || pageId === "personPage") {
        document.getElementById("navRankings").classList.add("active");
    }

    if (
        pageId === "companiesPage" ||
        pageId === "companyDetailPage"
    ) {
        document.getElementById("navCompanies").classList.add("active");
    }

    if (
        pageId === "profilePage" ||
        pageId === "loginPage" ||
        pageId === "signupPage"
    ) {
        document.getElementById("navProfile").classList.add("active");
    }

}


function openHome() {
    showPage("homePage");
}


function openRankings() {
    showPage("rankingsPage");
    renderRankings();
}


function openCompanies() {
    showPage("companiesPage");
    renderCompanies();
}


function openProfile() {

    const user = getCurrentUser();

    if (user) {
        showPage("profilePage");
        updateProfile();
    } else {
        showPage("loginPage");
    }

}


function openLogin() {
    showPage("loginPage");
}


function openSignup() {
    showPage("signupPage");
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
            formatCount(billionaires.length);
    }

    if (companyCount) {
        companyCount.textContent =
            formatCount(companies.length);
    }

}


function formatCount(number) {

    if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + "M";
    }

    if (number >= 1000) {
        return (number / 1000).toFixed(1) + "K";
    }

    return number.toString();
}


function renderHomeTop() {

    const container =
        document.getElementById("homeTopList");

    if (!container) return;

    const top = [...billionaires]
        .sort((a, b) => b.netWorth - a.netWorth)
        .slice(0, 5);

    if (!top.length) {

        container.innerHTML = `
            <div class="empty-state">
                No data available.
            </div>
        `;

        return;
    }

    container.innerHTML = top.map((person, index) => `

        <div
            class="mini-card"
            onclick="openPerson('${escapeAttribute(person.id)}')"
        >

            ${avatarHTML(person, 42)}

            <div style="flex:1">

                <h3>
                    ${escapeHTML(person.name)}
                </h3>

                <p>
                    ${escapeHTML(displayCountry(person.country))}
                </p>

            </div>

            <strong>
                ${formatMoney(person.netWorth)}
            </strong>

        </div>

    `).join("");

}


/* =========================================================
   RANKINGS
   ========================================================= */

function setSort(type) {

    currentSort = type;

    document
        .getElementById("highestBtn")
        .classList.toggle("active", type === "highest");

    document
        .getElementById("lowestBtn")
        .classList.toggle("active", type === "lowest");

    renderRankings();

}


function renderRankings() {

    const container =
        document.getElementById("rankingsList");

    if (!container) return;

    const search =
        (
            document.getElementById("searchInput")?.value ||
            ""
        ).toLowerCase().trim();

    const country =
        document.getElementById("countryFilter")?.value ||
        "all";

    let list = [...billionaires];

    if (search) {

        list = list.filter(person =>
            person.name.toLowerCase().includes(search) ||
            String(person.company)
                .toLowerCase()
                .includes(search)
        );

    }

    if (country !== "all") {

        list = list.filter(person =>
            normalizeCountry(person.country) === country
        );

    }

    list.sort((a, b) => {

        if (currentSort === "lowest") {
            return a.netWorth - b.netWorth;
        }

        return b.netWorth - a.netWorth;

    });

    const status =
        document.getElementById("rankingStatus");

    if (status) {
        status.textContent =
            `${list.length.toLocaleString()} results`;
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

    container.innerHTML = list
        .slice(0, 300)
        .map((person, index) => `

        <div
            class="rank-card"
            onclick="openPerson('${escapeAttribute(person.id)}')"
        >

            <div class="rank-number">
                #${index + 1}
            </div>

            ${avatarHTML(person)}

            <div class="rank-info">

                <h3>
                    ${escapeHTML(person.name)}
                </h3>

                <p>
                    ${flagForCountry(person.country)}
                    ${escapeHTML(displayCountry(person.country))}
                </p>

            </div>

            <div class="rank-money">

                <strong>
                    ${formatMoney(person.netWorth)}
                </strong>

                <small>
                    ${formatChange(person.change)}
                </small>

            </div>

        </div>

    `).join("");

}


/* =========================================================
   COUNTRIES
   ========================================================= */

function populateCountries() {

    const select =
        document.getElementById("countryFilter");

    if (!select) return;

    const countries = [
        ...new Set(
            billionaires
                .map(person => normalizeCountry(person.country))
                .filter(Boolean)
        )
    ].sort();

    select.innerHTML =
        `<option value="all">All countries</option>`;

    countries.forEach(country => {

        const option =
            document.createElement("option");

        option.value = country;

        option.textContent =
            flagForCountry(country) + " " + country;

        select.appendChild(option);

    });

}


function normalizeCountry(value) {

    if (!value) {
        return "";
    }

    let country = String(value).trim();

    if (!country) return "";

    const lower = country.toLowerCase();

    const map = {

        "us": "United States",
        "usa": "United States",
        "united states of america": "United States",

        "uk": "United Kingdom",
        "gb": "United Kingdom",
        "great britain": "United Kingdom",

        "uae": "United Arab Emirates",

        "korea": "South Korea",
        "south korea": "South Korea",

        "russia": "Russia",
        "ru": "Russia",

        "ukraine": "Ukraine",
        "ua": "Ukraine",

        "germany": "Germany",
        "de": "Germany",

        "france": "France",
        "fr": "France",

        "india": "India",
        "in": "India",

        "china": "China",
        "cn": "China",

        "japan": "Japan",
        "jp": "Japan",

        "canada": "Canada",
        "ca": "Canada",

        "australia": "Australia",
        "au": "Australia",

        "switzerland": "Switzerland",
        "ch": "Switzerland",

        "italy": "Italy",
        "it": "Italy",

        "spain": "Spain",
        "es": "Spain",

        "brazil": "Brazil",
        "br": "Brazil"

    };

    if (map[lower]) {
        return map[lower];
    }

    if (
        lower === "unknown" ||
        lower === "n/a" ||
        lower === "na" ||
        lower === "null" ||
        lower === "undefined"
    ) {
        return "";
    }

    return country;
}


function displayCountry(value) {

    const country = normalizeCountry(value);

    return country || "International";

}


function flagForCountry(value) {

    const country = normalizeCountry(value);

    const flags = {

        "United States": "🇺🇸",
        "United Kingdom": "🇬🇧",
        "Ukraine": "🇺🇦",
        "Russia": "🇷🇺",
        "Germany": "🇩🇪",
        "France": "🇫🇷",
        "India": "🇮🇳",
        "China": "🇨🇳",
        "Japan": "🇯🇵",
        "Canada": "🇨🇦",
        "Australia": "🇦🇺",
        "Switzerland": "🇨🇭",
        "Italy": "🇮🇹",
        "Spain": "🇪🇸",
        "Brazil": "🇧🇷",
        "South Korea": "🇰🇷",
        "United Arab Emirates": "🇦🇪",
        "Singapore": "🇸🇬",
        "Mexico": "🇲🇽",
        "Turkey": "🇹🇷",
        "Israel": "🇮🇱",
        "Indonesia": "🇮🇩",
        "Thailand": "🇹🇭",
        "Sweden": "🇸🇪",
        "Netherlands": "🇳🇱",
        "Norway": "🇳🇴",
        "Denmark": "🇩🇰",
        "Finland": "🇫🇮",
        "Ireland": "🇮🇪",
        "Belgium": "🇧🇪",
        "Austria": "🇦🇹",
        "Portugal": "🇵🇹",
        "New Zealand": "🇳🇿"

    };

    return flags[country] || "🌍";
}


/* =========================================================
   PERSON DETAIL
   ========================================================= */

function openPerson(id) {

    const person =
        billionaires.find(
            p => String(p.id) === String(id)
        );

    if (!person) return;

    currentPerson = person;

    const container =
        document.getElementById("personContent");

    const favorite =
        isFavorite(person.id);

    container.innerHTML = `

        <div class="detail-card">

            ${detailAvatarHTML(person)}

            <h1>
                ${escapeHTML(person.name)}
            </h1>

            <div class="detail-country">
                ${flagForCountry(person.country)}
                ${escapeHTML(displayCountry(person.country))}
            </div>

            <div class="detail-money">
                ${formatMoney(person.netWorth)}
            </div>

            <div class="detail-label">
                Estimated Net Worth
            </div>

            <div class="detail-company">
                🏢 ${escapeHTML(
                    formatCompany(person.company)
                )}
            </div>

            <button
                class="favorite-button"
                onclick="toggleFavorite('${escapeAttribute(person.id)}')"
            >
                ${favorite ? "★ Remove Favorite" : "☆ Add Favorite"}
            </button>

        </div>

        <div class="info-box">

            <h2>📊 Wealth</h2>

            <p>
                Current estimated net worth:
                <strong>
                    ${formatMoney(person.netWorth)}
                </strong>
            </p>

        </div>

        <br>

        <div class="info-box">

            <h2>🌍 Country</h2>

            <p>
                ${flagForCountry(person.country)}
                ${escapeHTML(displayCountry(person.country))}
            </p>

        </div>

    `;

    showPage("personPage");

}


/* =========================================================
   FAVORITES
   ========================================================= */

function isFavorite(personId) {

    const user = getCurrentUser();

    if (!user) return false;

    const favorites = getFavorites();

    const userFavorites =
        favorites[user.email] || [];

    return userFavorites
        .map(String)
        .includes(String(personId));

}


function toggleFavorite(personId) {

    const user = getCurrentUser();

    if (!user) {

        openLogin();

        return;

    }

    const favorites = getFavorites();

    if (!favorites[user.email]) {
        favorites[user.email] = [];
    }

    const list = favorites[user.email];

    const index =
        list.map(String).indexOf(String(personId));

    if (index >= 0) {
        list.splice(index, 1);
    } else {
        list.push(personId);
    }

    favorites[user.email] = list;

    saveFavorites(favorites);

    if (currentPerson) {
        openPerson(currentPerson.id);
    }

    updateProfile();

}


/* =========================================================
   COMPANIES
   ========================================================= */

function renderCompanies() {

    const container =
        document.getElementById("companiesList");

    if (!container) return;

    const search =
        (
            document.getElementById("companySearch")?.value ||
            ""
        ).toLowerCase().trim();

    let list = [...companies];

    if (search) {

        list = list.filter(company =>
            String(company.name)
                .toLowerCase()
                .includes(search)
        );

    }

    list.sort((a, b) =>
        Number(b.value || 0) -
        Number(a.value || 0)
    );

    if (!list.length) {

        container.innerHTML = `
            <div class="empty-state">
                <h3>No companies found</h3>
            </div>
        `;

        return;

    }

    container.innerHTML = list
        .slice(0, 300)
        .map(company => `

        <div
            class="company-card"
            onclick="openCompany('${escapeAttribute(company.id || company.name)}')"
        >

            <div class="company-logo">
                🏢
            </div>

            <div class="company-info">

                <h3>
                    ${escapeHTML(company.name || "Company")}
                </h3>

                <p>
                    ${escapeHTML(
                        company.ceo ||
                        company.owner ||
                        "Global company"
                    )}
                </p>

            </div>

            <div class="company-value">
                ${company.value
                    ? formatMoney(company.value)
                    : "—"}
            </div>

        </div>

    `).join("");

}


function openCompany(id) {

    const company =
        companies.find(c =>
            String(c.id || c.name) === String(id)
        );

    if (!company) return;

    currentCompany = company;

    const container =
        document.getElementById("companyDetailContent");

    container.innerHTML = `

        <div class="detail-card">

            <div class="detail-avatar-fallback">
                🏢
            </div>

            <h1>
                ${escapeHTML(company.name)}
            </h1>

            <div class="detail-country">
                Global company
            </div>

            ${
                company.value
                    ? `
                        <div class="detail-money">
                            ${formatMoney(company.value)}
                        </div>

                        <div class="detail-label">
                            Estimated Value
                        </div>
                    `
                    : ""
            }

            ${
                company.ceo
                    ? `
                        <div class="detail-company">
                            👤 ${escapeHTML(company.ceo)}
                        </div>
                    `
                    : ""
            }

        </div>

        <div class="info-box">

            <h2>🏢 Company</h2>

            <p>
                ${escapeHTML(company.name)}
            </p>

        </div>

    `;

    showPage("companyDetailPage");

}


/* =========================================================
   PROFILE
   ========================================================= */

function updateProfile() {

    const container =
        document.getElementById("profileContent");

    if (!container) return;

    const user = getCurrentUser();

    if (!user) {

        container.innerHTML = `

            <div class="profile-card">

                <div class="profile-avatar">
                    👤
                </div>

                <h2>Welcome to WorldElite</h2>

                <p>
                    Create an account to save
                    your favorite billionaires.
                </p>

                <button
                    class="primary-button"
                    onclick="openLogin()"
                >
                    Login
                </button>

                <br><br>

                <button
                    class="text-button"
                    onclick="openSignup()"
                >
                    Create account
                </button>

            </div>

        `;

        return;

    }

    const favorites = getFavorites();

    const favoriteIds =
        favorites[user.email] || [];

    const favoritePeople =
        favoriteIds
            .map(id =>
                billionaires.find(
                    p => String(p.id) === String(id)
                )
            )
            .filter(Boolean);

    container.innerHTML = `

        <div class="profile-card">

            <div class="profile-avatar">
                👤
            </div>

            <h2>
                ${escapeHTML(user.name)}
            </h2>

            <div class="profile-email">
                ${escapeHTML(user.email)}
            </div>

        </div>


        <div class="profile-section">

            <h3>
                ⭐ Favorites
            </h3>

            ${
                favoritePeople.length
                    ? favoritePeople.map(person => `

                        <div
                            class="favorite-row"
                            onclick="openPerson('${escapeAttribute(person.id)}')"
                        >

                            ${avatarHTML(person, 42)}

                            <div style="flex:1">

                                <strong>
                                    ${escapeHTML(person.name)}
                                </strong>

                                <div
                                    style="color:#737d90;font-size:12px;margin-top:4px"
                                >
                                    ${formatMoney(person.netWorth)}
                                </div>

                            </div>

                            <span>›</span>

                        </div>

                    `).join("")
                    : `
                        <p>
                            You have no favorites yet.
                        </p>
                    `
            }

        </div>


        <button
            class="logout-button"
            onclick="logout()"
        >
            Log Out
        </button>

    `;

}


/* =========================================================
   LOGIN
   ========================================================= */

function login() {

    const email =
        document
            .getElementById("loginEmail")
            .value
            .trim()
            .toLowerCase();

    const password =
        document
            .getElementById("loginPassword")
            .value;

    const message =
        document.getElementById("loginMessage");

    if (!email || !password) {

        message.textContent =
            "Please enter your email and password.";

        return;

    }

    const users = getUsers();

    const user =
        users.find(
            u =>
                u.email === email &&
                u.password === password
        );

    if (!user) {

        message.textContent =
            "Incorrect email or password.";

        return;

    }

    saveCurrentUser({
        name: user.name,
        email: user.email
    });

    message.textContent = "";

    updateProfile();

    openProfile();

}


/* =========================================================
   SIGN UP
   ========================================================= */

function signup() {

    const name =
        document
            .getElementById("signupName")
            .value
            .trim();

    const email =
        document
            .getElementById("signupEmail")
            .value
            .trim()
            .toLowerCase();

    const password =
        document
            .getElementById("signupPassword")
            .value;

    const message =
        document.getElementById("signupMessage");

    if (!name || !email || !password) {

        message.textContent =
            "Please complete all fields.";

        return;

    }

    if (password.length < 6) {

        message.textContent =
            "Password must contain at least 6 characters.";

        return;

    }

    const users = getUsers();

    if (
        users.some(
            user => user.email === email
        )
    ) {

        message.textContent =
            "An account with this email already exists.";

        return;

    }

    const newUser = {
        name,
        email,
        password
    };

    users.push(newUser);

    saveUsers(users);

    saveCurrentUser({
        name,
        email
    });

    message.textContent = "";

    updateProfile();

    openProfile();

}


/* =========================================================
   REFRESH
   ========================================================= */

async function refreshData() {

    const button =
        document.querySelector(
            '#rankingsPage .icon-button'
        );

    if (button) {
        button.textContent = "⟳";
    }

    await loadData();

    if (button) {
        button.textContent = "↻";
    }

}


/* =========================================================
   FORMATTING
   ========================================================= */

function formatMoney(value) {

    const number = Number(value) || 0;

    if (number >= 1000) {
        return "$" +
            (number / 1000).toFixed(1) +
            "T";
    }

    return "$" +
        number.toFixed(1) +
        "B";

}


function formatChange(value) {

    const number = Number(value) || 0;

    if (number > 0) {
        return "+" + number.toFixed(1) + "%";
    }

    if (number < 0) {
        return number.toFixed(1) + "%";
    }

    return "—";

}


function formatCompany(company) {

    if (Array.isArray(company)) {
        return company.join(", ");
    }

    return String(company || "Private investments");

}


/* =========================================================
   AVATARS
   ========================================================= */

function avatarHTML(person, size = 50) {

    if (person.image) {

        return `
            <img
                class="person-avatar"
                style="width:${size}px;height:${size}px"
                src="${escapeAttribute(person.image)}"
                alt=""
                onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
            >

            <div
                class="person-avatar-fallback"
                style="
                    width:${size}px;
                    height:${size}px;
                    display:none;
                "
            >
                👤
            </div>
        `;

    }

    return `
        <div
            class="person-avatar-fallback"
            style="width:${size}px;height:${size}px"
        >
            👤
        </div>
    `;

}


function detailAvatarHTML(person) {

    if (person.image) {

        return `
            <img
                class="detail-avatar"
                src="${escapeAttribute(person.image)}"
                alt=""
                onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
            >

            <div
                class="detail-avatar-fallback"
                style="display:none"
            >
                👤
            </div>
        `;

    }

    return `
        <div class="detail-avatar-fallback">
            👤
        </div>
    `;

}


/* =========================================================
   SECURITY / HTML ESCAPING
   ========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function escapeAttribute(value) {
    return escapeHTML(value);
}


/* =========================================================
   START
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    showPage("homePage");

    loadData();

});
