/* =========================================================
   WORLDELITE — FINAL FRONTEND
   ========================================================= */

"use strict";

/* =========================================================
   STATE
========================================================= */

let billionaires = [];
let companies = [];

let currentSort = "highest";
let currentPage = "homePage";
let previousProfilePage = "billionairesPage";

let dataLoaded = false;


/* =========================================================
   DATA NORMALIZATION
========================================================= */

function numberValue(value) {

    if (typeof value === "number") {
        return value;
    }

    if (value === null || value === undefined) {
        return 0;
    }

    let text = String(value)
        .replace(/,/g, "")
        .replace(/\$/g, "")
        .replace(/£/g, "")
        .replace(/€ /g, "")
        .trim();

    let multiplier = 1;

    if (/trillion/i.test(text)) {
        multiplier = 1e12;
    } else if (/billion/i.test(text)) {
        multiplier = 1e9;
    } else if (/million/i.test(text)) {
        multiplier = 1e6;
    } else if (/thousand/i.test(text)) {
        multiplier = 1e3;
    }

    const match = text.match(/-?[\d.]+/);

    if (!match) {
        return 0;
    }

    return parseFloat(match[0]) * multiplier;
}


function textValue(...values) {

    for (const value of values) {

        if (
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ""
        ) {
            return String(value).trim();
        }

    }

    return "";
}


function normalizePerson(item, index) {

    if (!item || typeof item !== "object") {
        return null;
    }

    const name = textValue(
        item.name,
        item.full_name,
        item.personName,
        item.title,
        item.person
    );

    if (!name) {
        return null;
    }

    const netWorth = numberValue(
        item.netWorth,
        item.net_worth,
        item.networth,
        item.wealth,
        item.fortune,
        item.billionaireNetWorth,
        item.estimated_net_worth
    );

    const country = textValue(
        item.country,
        item.countryName,
        item.nationality,
        item.citizenship,
        item.location
    ) || "Unknown";

    return {

        id:
            item.id ||
            item.slug ||
            `${name}-${index}`,

        rank:
            numberValue(
                item.rank,
                item.ranking,
                item.position
            ) || index + 1,

        name,

        country,

        nationality:
            textValue(
                item.nationality,
                item.citizenship
            ),

        age:
            textValue(
                item.age,
                item.birthAge
            ),

        birthDate:
            textValue(
                item.birthDate,
                item.dateOfBirth,
                item.dob
            ),

        netWorth,

        netWorthRaw:
            textValue(
                item.netWorth,
                item.net_worth,
                item.wealth
            ),

        source:
            textValue(
                item.source,
                item.sourceOfWealth,
                item.industry,
                item.business
            ),

        company:
            textValue(
                item.company,
                item.companies,
                item.companyName
            ),

        image:
            textValue(
                item.image,
                item.photo,
                item.photoUrl,
                item.avatar,
                item.imageUrl
            ),

        biography:
            textValue(
                item.biography,
                item.bio,
                item.description,
                item.summary
            ),

        career:
            textValue(
                item.career,
                item.careerHistory
            ),

        investments:
            textValue(
                item.investments,
                item.investment
            ),

        stakes:
            textValue(
                item.stakes,
                item.ownership,
                item.ownershipStakes
            ),

        annualSalary:
            textValue(
                item.annualSalary,
                item.salary,
                item.compensation
            ),

        raw: item
    };
}


function normalizeCompany(item, index) {

    if (!item || typeof item !== "object") {
        return null;
    }

    const name = textValue(
        item.name,
        item.company,
        item.companyName,
        item.title
    );

    if (!name) {
        return null;
    }

    return {

        id:
            item.id ||
            item.slug ||
            `${name}-${index}`,

        name,

        country:
            textValue(
                item.country,
                item.countryName,
                item.location
            ) || "Unknown",

        industry:
            textValue(
                item.industry,
                item.sector,
                item.category
            ) || "Unknown",

        founder:
            textValue(
                item.founder,
                item.founders
            ),

        ceo:
            textValue(
                item.ceo,
                item.CEO,
                item.chiefExecutive
            ),

        valuation:
            numberValue(
                item.valuation,
                item.marketCap,
                item.market_cap
            ),

        revenue:
            numberValue(
                item.revenue,
                item.annualRevenue
            ),

        grossProfit:
            numberValue(
                item.grossProfit,
                item.gross_profit
            ),

        netProfit:
            numberValue(
                item.netProfit,
                item.net_profit,
                item.profit
            ),

        investments:
            textValue(
                item.investments,
                item.investment
            ),

        stakes:
            textValue(
                item.stakes,
                item.ownership,
                item.ownershipStakes
            ),

        biography:
            textValue(
                item.biography,
                item.bio,
                item.description,
                item.history
            ),

        founded:
            textValue(
                item.founded,
                item.foundedYear,
                item.yearFounded
            ),

        logo:
            textValue(
                item.logo,
                item.logoUrl,
                item.image
            ),

        raw: item
    };
}


/* =========================================================
   LOAD DATA
========================================================= */

async function loadData(forceRefresh = false) {

    const timestamp = forceRefresh
        ? `?refresh=${Date.now()}`
        : "";

    try {

        const response = await fetch(
            `data.json${timestamp}`,
            {
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error(
                `data.json returned ${response.status}`
            );
        }

        const json = await response.json();

        let peopleSource = [];
        let companiesSource = [];

        if (Array.isArray(json)) {

            peopleSource = json;

        } else {

            peopleSource =
                json.billionaires ||
                json.people ||
                json.persons ||
                json.data ||
                [];

            companiesSource =
                json.companies ||
                json.businesses ||
                [];

        }

        billionaires = peopleSource
            .map(normalizePerson)
            .filter(Boolean);

        companies = companiesSource
            .map(normalizeCompany)
            .filter(Boolean);

        dataLoaded = true;

        updateAll();

        localStorage.setItem(
            "worldelite_last_update",
            new Date().toISOString()
        );

        return true;

    } catch (error) {

        console.error("WorldElite data error:", error);

        const saved =
            localStorage.getItem("worldelite_data_backup");

        if (saved) {

            try {

                const backup = JSON.parse(saved);

                billionaires =
                    (backup.billionaires || [])
                        .map(normalizePerson)
                        .filter(Boolean);

                companies =
                    (backup.companies || [])
                        .map(normalizeCompany)
                        .filter(Boolean);

                dataLoaded = true;

                updateAll();

                showToast(
                    "Using saved data. Refresh failed."
                );

                return false;

            } catch (_) {}
        }

        showDataError();

        return false;
    }
}


/* =========================================================
   BACKUP
========================================================= */

function saveBackup() {

    try {

        localStorage.setItem(
            "worldelite_data_backup",
            JSON.stringify({
                billionaires,
                companies
            })
        );

    } catch (_) {}
}


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function openPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(page => {
            page.classList.add("hidden");
        });

    const page =
        document.getElementById(pageId);

    if (!page) {
        return;
    }

    page.classList.remove("hidden");

    currentPage = pageId;

    updateNavigation(pageId);

    window.scrollTo({
        top: 0,
        behavior: "instant"
    });

    if (pageId === "rankingsPage") {
        showRanking("wealth");
    }

    if (pageId === "worldBestsPage") {
        renderWorldBests();
    }

    if (pageId === "billionairesPage") {
        renderBillionaires();
    }

    if (pageId === "companiesPage") {
        renderCompanies();
    }
}


function updateNavigation(pageId) {

    document
        .querySelectorAll(".nav-item")
        .forEach(button => {
            button.classList.remove("active");
        });

    const map = {

        homePage: "navHome",

        billionairesPage:
            "navBillionaires",

        rankingsPage:
            "navRankings",

        companiesPage:
            "navCompanies",

        worldBestsPage:
            "navBests"

    };

    const id = map[pageId];

    if (id) {

        const button =
            document.getElementById(id);

        if (button) {
            button.classList.add("active");
        }
    }
}


/* =========================================================
   HOME
========================================================= */

function renderHome() {

    const count =
        document.getElementById(
            "homeBillionaireCount"
        );

    if (count) {
        count.textContent =
            formatNumber(billionaires.length);
    }

    const companyCount =
        document.getElementById(
            "homeCompanyCount"
        );

    if (companyCount) {

        companyCount.textContent =
            companies.length
                ? formatNumber(companies.length)
                : "1000+";
    }

    const container =
        document.getElementById(
            "homeBillionaires"
        );

    if (!container) {
        return;
    }

    const top =
        [...billionaires]
            .sort(
                (a, b) =>
                    b.netWorth - a.netWorth
            )
            .slice(0, 10);

    container.innerHTML =
        top.map(
            (person, index) =>
                billionaireCard(
                    person,
                    index + 1
                )
        ).join("");
}


/* =========================================================
   BILLIONAIRES
========================================================= */

function setSort(type) {

    currentSort = type;

    document
        .getElementById("highestButton")
        ?.classList.toggle(
            "active",
            type === "highest"
        );

    document
        .getElementById("lowestButton")
        ?.classList.toggle(
            "active",
            type === "lowest"
        );

    renderBillionaires();
}


function renderBillionaires() {

    const list =
        document.getElementById(
            "billionaireList"
        );

    if (!list) {
        return;
    }

    let result =
        [...billionaires];

    const search =
        document
            .getElementById(
                "billionaireSearch"
            )
            ?.value
            .toLowerCase()
            .trim() || "";

    const country =
        document
            .getElementById(
                "countryFilter"
            )
            ?.value || "all";

    if (search) {

        result =
            result.filter(person => {

                const text = [

                    person.name,
                    person.country,
                    person.nationality,
                    person.company,
                    person.source

                ].join(" ").toLowerCase();

                return text.includes(search);
            });
    }

    if (country !== "all") {

        result =
            result.filter(
                person =>
                    person.country === country
            );
    }

    result.sort((a, b) => {

        if (currentSort === "lowest") {
            return a.netWorth - b.netWorth;
        }

        return b.netWorth - a.netWorth;
    });

    const count =
        document.getElementById(
            "billionaireCount"
        );

    if (count) {

        count.textContent =
            `${formatNumber(result.length)} billionaires`;
    }

    if (!result.length) {

        list.innerHTML = `
            <div class="card empty-state">
                No billionaires found.
            </div>
        `;

        return;
    }

    list.innerHTML =
        result
            .map(
                (person, index) =>
                    billionaireCard(
                        person,
                        index + 1
                    )
            )
            .join("");
}


/* =========================================================
   BILLIONAIRE CARD
========================================================= */

function billionaireCard(person, position) {

    const image =
        person.image
            ? `<img
                    src="${escapeAttribute(person.image)}"
                    alt=""
                    style="
                        width:100%;
                        height:100%;
                        object-fit:cover;
                        border-radius:50%;
                    "
               >`
            : "👤";

    return `

        <article
            class="card billionaire-card"
            onclick="openPerson('${escapeAttribute(person.id)}')">

            <div class="rank-number">
                ${position}
            </div>

            <div class="avatar">
                ${image}
            </div>

            <div class="card-info">

                <div class="card-name">
                    ${escapeHTML(person.name)}
                </div>

                <div class="card-country">
                    ${countryFlag(person.country)}
                    ${escapeHTML(person.country)}
                </div>

            </div>

            <div class="card-worth">
                ${formatMoney(person.netWorth)}
            </div>

        </article>
    `;
}


/* =========================================================
   COUNTRIES
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
        [...new Set(
            billionaires
                .map(
                    person =>
                        person.country
                )
                .filter(
                    country =>
                        country &&
                        country !== "Unknown"
                )
        )]
        .sort(
            (a, b) =>
                a.localeCompare(b)
        );

    select.innerHTML = `
        <option value="all">
            🌍 All Countries
        </option>

        ${countries.map(country => `
            <option value="${escapeAttribute(country)}">
                ${countryFlag(country)}
                ${escapeHTML(country)}
            </option>
        `).join("")}
    `;
}


function buildCompanyFilters() {

    const industry =
        document.getElementById(
            "industryFilter"
        );

    const country =
        document.getElementById(
            "companyCountryFilter"
        );

    if (!industry || !country) {
        return;
    }

    const industries =
        [...new Set(
            companies
                .map(company => company.industry)
                .filter(Boolean)
        )]
        .sort();

    const countries =
        [...new Set(
            companies
                .map(company => company.country)
                .filter(Boolean)
        )]
        .sort();

    industry.innerHTML = `
        <option value="all">
            All Industries
        </option>

        ${industries.map(item => `
            <option value="${escapeAttribute(item)}">
                ${escapeHTML(item)}
            </option>
        `).join("")}
    `;

    country.innerHTML = `
        <option value="all">
            🌍 All Countries
        </option>

        ${countries.map(item => `
            <option value="${escapeAttribute(item)}">
                ${countryFlag(item)}
                ${escapeHTML(item)}
            </option>
        `).join("")}
    `;
}


/* =========================================================
   PERSON PROFILE
========================================================= */

function openPerson(id) {

    const person =
        billionaires.find(
            item =>
                String(item.id) === String(id)
        );

    if (!person) {
        return;
    }

    previousProfilePage =
        currentPage === "homePage"
            ? "homePage"
            : "billionairesPage";

    const content =
        document.getElementById(
            "personContent"
        );

    if (!content) {
        return;
    }

    document.getElementById(
        "personPageSubtitle"
    ).textContent =
        `${countryFlag(person.country)} ${person.country}`;

    const image =
        person.image
            ? `
                <img
                    src="${escapeAttribute(person.image)}"
                    alt=""
                    style="
                        width:100%;
                        height:100%;
                        object-fit:cover;
                        border-radius:50%;
                    "
                >
              `
            : "👤";

    content.innerHTML = `

        <div class="profile-hero">

            <div class="profile-avatar">
                ${image}
            </div>

            <h2>
                ${escapeHTML(person.name)}
            </h2>

            <div class="profile-location">
                ${countryFlag(person.country)}
                ${escapeHTML(person.country)}
            </div>

            <div class="profile-networth">
                ${formatMoney(person.netWorth)}
            </div>

        </div>

        <div class="profile-sections">

            <div class="profile-section">

                <h3>Biography</h3>

                <p>
                    ${
                        person.biography
                            ? escapeHTML(person.biography)
                            : "Biography information is not currently available in the dataset."
                    }
                </p>

            </div>

            <div class="profile-section">

                <h3>Personal Information</h3>

                <div class="profile-metrics">

                    <div class="metric">
                        <small>Age</small>
                        <strong>
                            ${escapeHTML(person.age || "—")}
                        </strong>
                    </div>

                    <div class="metric">
                        <small>Birth Date</small>
                        <strong>
                            ${escapeHTML(person.birthDate || "—")}
                        </strong>
                    </div>

                    <div class="metric">
                        <small>Nationality</small>
                        <strong>
                            ${escapeHTML(person.nationality || person.country || "—")}
                        </strong>
                    </div>

                    <div class="metric">
                        <small>Source of Wealth</small>
                        <strong>
                            ${escapeHTML(person.source || "—")}
                        </strong>
                    </div>

                </div>

            </div>

            <div class="profile-section">

                <h3>Companies</h3>

                <p>
                    ${escapeHTML(person.company || "No company information available.")}
                </p>

            </div>

            <div class="profile-section">

                <h3>Career</h3>

                <p>
                    ${
                        escapeHTML(
                            person.career ||
                            "Career information is not currently available in the dataset."
                        )
                    }
                </p>

            </div>

            <div class="profile-section">

                <h3>Investments</h3>

                <p>
                    ${
                        escapeHTML(
                            person.investments ||
                            "Investment information is not currently available."
                        )
                    }
                </p>

            </div>

            <div class="profile-section">

                <h3>Ownership & Stakes</h3>

                <p>
                    ${
                        escapeHTML(
                            person.stakes ||
                            "Ownership stake information is not currently available."
                        )
                    }
                </p>

            </div>

            <div class="profile-section">

                <h3>Annual Salary</h3>

                <p>
                    ${
                        escapeHTML(
                            person.annualSalary ||
                            "Reliable annual salary information is not currently available."
                        )
                    }
                </p>

            </div>

        </div>
    `;

    openPage("personPage");
}


function goBackFromProfile() {
    openPage(previousProfilePage);
}


/* =========================================================
   COMPANIES
========================================================= */

function renderCompanies() {

    const container =
        document.getElementById(
            "companyList"
        );

    if (!container) {
        return;
    }

    let result =
        [...companies];

    const search =
        document.getElementById(
            "companySearch"
        )?.value
        ?.toLowerCase()
        ?.trim() || "";

    const industry =
        document.getElementById(
            "industryFilter"
        )?.value || "all";

    const country =
        document.getElementById(
            "companyCountryFilter"
        )?.value || "all";

    if (search) {

        result =
            result.filter(company => {

                const text = [

                    company.name,
                    company.country,
                    company.industry,
                    company.ceo,
                    company.founder

                ].join(" ").toLowerCase();

                return text.includes(search);
            });
    }

    if (industry !== "all") {

        result =
            result.filter(
                company =>
                    company.industry === industry
            );
    }

    if (country !== "all") {

        result =
            result.filter(
                company =>
                    company.country === country
            );
    }

    const count =
        document.getElementById(
            "companyCount"
        );

    if (count) {

        count.textContent =
            `${formatNumber(result.length)} companies`;
    }

    if (!result.length) {

        container.innerHTML = `
            <div class="card empty-state">
                Company data is not available yet.
            </div>
        `;

        return;
    }

    container.innerHTML =
        result
            .map(companyCard)
            .join("");
}


function companyCard(company) {

    return `

        <article
            class="card company-card"
            onclick="openCompany('${escapeAttribute(company.id)}')">

            <div class="company-top">

                <div class="company-logo">
                    ${
                        company.logo
                            ? `<img
                                src="${escapeAttribute(company.logo)}"
                                alt=""
                                style="
                                    width:100%;
                                    height:100%;
                                    object-fit:contain;
                                    border-radius:12px;
                                "
                               >`
                            : "🏢"
                    }
                </div>

                <div>

                    <h3>
                        ${escapeHTML(company.name)}
                    </h3>

                    <p>
                        ${countryFlag(company.country)}
                        ${escapeHTML(company.country)}
                        ·
                        ${escapeHTML(company.industry)}
                    </p>

                </div>

            </div>

            <div class="company-finance">

                <div class="finance-item">
                    <small>Revenue</small>
                    <strong>
                        ${formatMoney(company.revenue)}
                    </strong>
                </div>

                <div class="finance-item">
                    <small>Gross Profit</small>
                    <strong>
                        ${formatMoney(company.grossProfit)}
                    </strong>
                </div>

                <div class="finance-item">
                    <small>Net Profit</small>
                    <strong>
                        ${formatMoney(company.netProfit)}
                    </strong>
                </div>

            </div>

        </article>
    `;
}


/* =========================================================
   COMPANY PROFILE
========================================================= */

function openCompany(id) {

    const company =
        companies.find(
            item =>
                String(item.id) === String(id)
        );

    if (!company) {
        return;
    }

    const content =
        document.getElementById(
            "companyProfileContent"
        );

    if (!content) {
        return;
    }

    content.innerHTML = `

        <div class="profile-hero">

            <div class="profile-avatar">
                ${
                    company.logo
                        ? `<img
                            src="${escapeAttribute(company.logo)}"
                            alt=""
                            style="
                                width:100%;
                                height:100%;
                                object-fit:contain;
                                border-radius:50%;
                            "
                           >`
                        : "🏢"
                }
            </div>

            <h2>
                ${escapeHTML(company.name)}
            </h2>

            <div class="profile-location">
                ${countryFlag(company.country)}
                ${escapeHTML(company.country)}
                ·
                ${escapeHTML(company.industry)}
            </div>

        </div>

        <div class="profile-sections">

            <div class="profile-section">

                <h3>Company Biography</h3>

                <p>
                    ${
                        escapeHTML(
                            company.biography ||
                            "Company history and biography are not currently available in the dataset."
                        )
                    }
                </p>

            </div>

            <div class="profile-section">

                <h3>Company Information</h3>

                <div class="profile-metrics">

                    <div class="metric">
                        <small>Founded</small>
                        <strong>
                            ${escapeHTML(company.founded || "—")}
                        </strong>
                    </div>

                    <div class="metric">
                        <small>Founder</small>
                        <strong>
                            ${escapeHTML(company.founder || "—")}
                        </strong>
                    </div>

                    <div class="metric">
                        <small>CEO</small>
                        <strong>
                            ${escapeHTML(company.ceo || "—")}
                        </strong>
                    </div>

                    <div class="metric">
                        <small>Industry</small>
                        <strong>
                            ${escapeHTML(company.industry || "—")}
                        </strong>
                    </div>

                </div>

            </div>

            <div class="profile-section">

                <h3>Financials</h3>

                <div class="profile-metrics">

                    <div class="metric">
                        <small>Valuation</small>
                        <strong>
                            ${formatMoney(company.valuation)}
                        </strong>
                    </div>

                    <div class="metric">
                        <small>Revenue</small>
                        <strong>
                            ${formatMoney(company.revenue)}
                        </strong>
                    </div>

                    <div class="metric">
                        <small>Gross Profit</small>
                        <strong>
                            ${formatMoney(company.grossProfit)}
                        </strong>
                    </div>

                    <div class="metric">
                        <small>Net Profit</small>
                        <strong>
                            ${formatMoney(company.netProfit)}
                        </strong>
                    </div>

                </div>

            </div>

            <div class="profile-section">

                <h3>Investments</h3>

                <p>
                    ${escapeHTML(
                        company.investments ||
                        "Investment information is not currently available."
                    )}
                </p>

            </div>

            <div class="profile-section">

                <h3>Ownership & Stakes</h3>

                <p>
                    ${escapeHTML(
                        company.stakes ||
                        "Ownership information is not currently available."
                    )}
                </p>

            </div>

        </div>
    `;

    openPage("companyProfilePage");
}


/* =========================================================
   RANKINGS
========================================================= */

function showRanking(type) {

    const content =
        document.getElementById(
            "rankingContent"
        );

    if (!content) {
        return;
    }

    document
        .querySelectorAll(".ranking-tab")
        .forEach(tab => {
            tab.classList.remove("active");
        });

    const tabs =
        document.querySelectorAll(
            ".ranking-tab"
        );

    if (type === "wealth") {
        tabs[0]?.classList.add("active");
    }

    if (type === "companies") {
        tabs[1]?.classList.add("active");
    }

    if (type === "countries") {
        tabs[2]?.classList.add("active");
    }

    if (type === "wealth") {

        const top =
            [...billionaires]
                .sort(
                    (a,b) =>
                        b.netWorth - a.netWorth
                )
                .slice(0, 50);

        content.innerHTML = `
            <div class="cards">
                ${top.map(
                    (person, index) =>
                        billionaireCard(
                            person,
                            index + 1
                        )
                ).join("")}
            </div>
        `;

        return;
    }

    if (type === "companies") {

        const top =
            [...companies]
                .sort(
                    (a,b) =>
                        (b.revenue || 0) -
                        (a.revenue || 0)
                )
                .slice(0, 50);

        content.innerHTML = `
            <div class="cards">
                ${top.map(companyCard).join("")}
            </div>
        `;

        return;
    }

    if (type === "countries") {

        const map = {};

        billionaires.forEach(person => {

            const country =
                person.country || "Unknown";

            if (!map[country]) {
                map[country] = {
                    country,
                    people: 0,
                    wealth: 0
                };
            }

            map[country].people++;
            map[country].wealth +=
                person.netWorth || 0;
        });

        const rows =
            Object.values(map)
                .sort(
                    (a,b) =>
                        b.wealth - a.wealth
                );

        content.innerHTML = `
            <div class="cards">

                ${rows.map((row,index) => `

                    <div class="card company-card">

                        <div class="company-top">

                            <div class="company-logo">
                                ${countryFlag(row.country)}
                            </div>

                            <div>

                                <h3>
                                    #${index + 1}
                                    ${escapeHTML(row.country)}
                                </h3>

                                <p>
                                    ${row.people}
                                    billionaires
                                </p>

                            </div>

                        </div>

                        <div class="profile-networth">
                            ${formatMoney(row.wealth)}
                        </div>

                    </div>

                `).join("")}

            </div>
        `;
    }
}


/* =========================================================
   WORLD BESTS
========================================================= */

function renderWorldBests() {

    const richest =
        [...billionaires]
            .sort(
                (a,b) =>
                    b.netWorth - a.netWorth
            )[0];

    const bestCompany =
        [...companies]
            .sort(
                (a,b) =>
                    (b.revenue || 0) -
                    (a.revenue || 0)
            )[0];

    setText(
        "bestRichest",
        richest
            ? richest.name
            : "—"
    );

    setText(
        "bestCompany",
        bestCompany
            ? bestCompany.name
            : "—"
    );

    setText(
        "bestRevenue",
        bestCompany
            ? formatMoney(bestCompany.revenue)
            : "—"
    );

    setText(
        "bestProfit",
        bestCompany
            ? formatMoney(bestCompany.netProfit)
            : "—"
    );

    setText(
        "bestInvestment",
        "See investments"
    );

    if (richest) {

        const countryCount = {};

        billionaires.forEach(person => {

            const country =
                person.country || "Unknown";

            countryCount[country] =
                (countryCount[country] || 0) + 1;
        });

        const topCountry =
            Object.entries(countryCount)
                .sort((a,b) => b[1] - a[1])[0];

        setText(
            "bestCountry",
            topCountry
                ? `${topCountry[0]} (${topCountry[1]})`
                : "—"
        );
    }
}


/* =========================================================
   REFRESH DATA
========================================================= */

async function refreshData() {

    showToast("Refreshing data...");

    const success =
        await loadData(true);

    if (success) {

        showToast(
            `Updated ${formatNumber(billionaires.length)} billionaires`
        );

    } else {

        showToast(
            "Could not refresh. Saved data remains available."
        );
    }
}


/* =========================================================
   UPDATE EVERYTHING
========================================================= */

function updateAll() {

    saveBackup();

    buildCountryFilter();

    buildCompanyFilters();

    renderHome();

    renderBillionaires();

    renderCompanies();

    renderWorldBests();

    const timestamp =
        localStorage.getItem(
            "worldelite_last_update"
        );

    console.log(
        "WorldElite updated:",
        timestamp
    );
}


/* =========================================================
   AUTH
========================================================= */

let authMode = "login";


function showLogin() {

    authMode = "login";

    document
        .getElementById("loginTab")
        ?.classList.add("active");

    document
        .getElementById("signupTab")
        ?.classList.remove("active");

    document.getElementById(
        "authTitle"
    ).textContent =
        "Welcome back";

    document.getElementById(
        "authSubtitle"
    ).textContent =
        "Sign in to your WorldElite account.";

    document.getElementById(
        "nameField"
    ).classList.add("hidden");

    document.getElementById(
        "authButtonText"
    ).textContent =
        "Login";

    clearAuthMessage();
}


function showSignup() {

    authMode = "signup";

    document
        .getElementById("signupTab")
        ?.classList.add("active");

    document
        .getElementById("loginTab")
        ?.classList.remove("active");

    document.getElementById(
        "authTitle"
    ).textContent =
        "Create account";

    document.getElementById(
        "authSubtitle"
    ).textContent =
        "Join WorldElite.";

    document.getElementById(
        "nameField"
    ).classList.remove("hidden");

    document.getElementById(
        "authButtonText"
    ).textContent =
        "Sign Up";

    clearAuthMessage();
}


function handleAuth(event) {

    event.preventDefault();

    const email =
        document.getElementById(
            "authEmail"
        ).value.trim();

    const password =
        document.getElementById(
            "authPassword"
        ).value;

    const name =
        document.getElementById(
            "authName"
        ).value.trim();

    if (authMode === "signup") {

        if (!name) {

            showAuthMessage(
                "Please enter your name.",
                false
            );

            return;
        }

        const account = {
            name,
            email,
            password
        };

        localStorage.setItem(
            "worldelite_account",
            JSON.stringify(account)
        );

        showAuthMessage(
            "Account created successfully.",
            true
        );

        setTimeout(
            () => openPage("homePage"),
            800
        );

        return;
    }

    const saved =
        localStorage.getItem(
            "worldelite_account"
        );

    if (!saved) {

        showAuthMessage(
            "No account found. Please Sign Up first.",
            false
        );

        return;
    }

    try {

        const account =
            JSON.parse(saved);

        if (
            account.email === email &&
            account.password === password
        ) {

            showAuthMessage(
                `Welcome back, ${account.name}.`,
                true
            );

            setTimeout(
                () => openPage("homePage"),
                800
            );

        } else {

            showAuthMessage(
                "Incorrect email or password.",
                false
            );
        }

    } catch (_) {

        showAuthMessage(
            "Could not read account.",
            false
        );
    }
}


function showAuthMessage(message, success) {

    const element =
        document.getElementById(
            "authMessage"
        );

    if (!element) {
        return;
    }

    element.className =
        success
            ? "auth-success"
            : "auth-error";

    element.textContent = message;
}


function clearAuthMessage() {

    const element =
        document.getElementById(
            "authMessage"
        );

    if (!element) {
        return;
    }

    element.className = "";
    element.textContent = "";
}


/* =========================================================
   HELPERS
========================================================= */

function formatMoney(value) {

    const number =
        Number(value) || 0;

    if (!number) {
        return "—";
    }

    if (number >= 1e12) {
        return `$${(number / 1e12).toFixed(2)}T`;
    }

    if (number >= 1e9) {
        return `$${(number / 1e9).toFixed(2)}B`;
    }

    if (number >= 1e6) {
        return `$${(number / 1e6).toFixed(1)}M`;
    }

    return `$${number.toLocaleString()}`;
}


function formatNumber(number) {

    return Number(number || 0)
        .toLocaleString("en-US");
}


function setText(id, text) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = text;
    }
}


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


function countryFlag(country) {

    const map = {

        "United States": "🇺🇸",
        "USA": "🇺🇸",
        "United Kingdom": "🇬🇧",
        "UK": "🇬🇧",
        "France": "🇫🇷",
        "Germany": "🇩🇪",
        "Italy": "🇮🇹",
        "Spain": "🇪🇸",
        "Russia": "🇷🇺",
        "Ukraine": "🇺🇦",
        "Turkey": "🇹🇷",
        "Azerbaijan": "🇦🇿",
        "China": "🇨🇳",
        "India": "🇮🇳",
        "Japan": "🇯🇵",
        "South Korea": "🇰🇷",
        "Singapore": "🇸🇬",
        "Canada": "🇨🇦",
        "Australia": "🇦🇺",
        "Brazil": "🇧🇷",
        "Mexico": "🇲🇽",
        "Switzerland": "🇨🇭",
        "Sweden": "🇸🇪",
        "Norway": "🇳🇴",
        "Denmark": "🇩🇰",
        "Netherlands": "🇳🇱",
        "Belgium": "🇧🇪",
        "Ireland": "🇮🇪",
        "Israel": "🇮🇱",
        "Saudi Arabia": "🇸🇦",
        "United Arab Emirates": "🇦🇪",
        "Hong Kong": "🇭🇰",
        "Indonesia": "🇮🇩",
        "Thailand": "🇹🇭",
        "Malaysia": "🇲🇾",
        "Philippines": "🇵🇭",
        "South Africa": "🇿🇦",
        "Nigeria": "🇳🇬",
        "Egypt": "🇪🇬",
        "Pakistan": "🇵🇰",
        "Taiwan": "🇹🇼",
        "Austria": "🇦🇹",
        "Portugal": "🇵🇹",
        "Greece": "🇬🇷",
        "Finland": "🇫🇮",
        "Poland": "🇵🇱",
        "Czech Republic": "🇨🇿",
        "Czechia": "🇨🇿",
        "New Zealand": "🇳🇿",
        "Monaco": "🇲🇨",
        "Unknown": "🌍"

    };

    return map[country] || "🌍";
}


function showToast(message) {

    let toast =
        document.getElementById(
            "worldeliteToast"
        );

    if (!toast) {

        toast =
            document.createElement("div");

        toast.id =
            "worldeliteToast";

        toast.style.position =
            "fixed";

        toast.style.left =
            "50%";

        toast.style.bottom =
            "135px";

        toast.style.transform =
            "translateX(-50%)";

        toast.style.zIndex =
            "9999";

        toast.style.padding =
            "13px 18px";

        toast.style.borderRadius =
            "14px";

        toast.style.background =
            "#252e3c";

        toast.style.border =
            "1px solid rgba(255,255,255,.1)";

        toast.style.color =
            "white";

        toast.style.fontSize =
            "14px";

        toast.style.boxShadow =
            "0 15px 40px rgba(0,0,0,.35)";

        document.body.appendChild(toast);
    }

    toast.textContent = message;

    clearTimeout(
        window.worldEliteToastTimer
    );

    window.worldEliteToastTimer =
        setTimeout(() => {

            toast.remove();

        }, 3000);
}


function showDataError() {

    const list =
        document.getElementById(
            "billionaireList"
        );

    if (list) {

        list.innerHTML = `
            <div class="card profile-section">

                <h3>
                    Data unavailable
                </h3>

                <p>
                    WorldElite could not load
                    data.json. Please check
                    the data source or use
                    Refresh Data later.
                </p>

            </div>
        `;
    }
}


/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadData(false);

        showLogin();

        openPage("homePage");

    }
);
