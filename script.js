/* =========================================================
   WORLDELITE
   Global wealth intelligence
========================================================= */

const state = {
    billionaires: [],
    companies: [],

    filteredBillionaires: [],
    filteredCompanies: [],

    billionaireSort: "highest",
    companySort: "revenue",

    currentPage: "homePage",
    lastUpdated: null
};


/* =========================================================
   HELPERS
========================================================= */

function firstValue(obj, keys, fallback = "") {

    if (!obj || typeof obj !== "object") {
        return fallback;
    }

    for (const key of keys) {

        if (
            obj[key] !== undefined &&
            obj[key] !== null &&
            obj[key] !== ""
        ) {
            return obj[key];
        }
    }

    return fallback;
}


function numberValue(value) {

    if (typeof value === "number") {
        return Number.isFinite(value) ? value : 0;
    }

    if (!value) {
        return 0;
    }

    let text = String(value)
        .trim()
        .replace(/[$£€,\s]/g, "");

    let multiplier = 1;

    if (/T$/i.test(text)) {
        multiplier = 1e12;
        text = text.replace(/T$/i, "");
    }
    else if (/B$/i.test(text)) {
        multiplier = 1e9;
        text = text.replace(/B$/i, "");
    }
    else if (/M$/i.test(text)) {
        multiplier = 1e6;
        text = text.replace(/M$/i, "");
    }
    else if (/K$/i.test(text)) {
        multiplier = 1e3;
        text = text.replace(/K$/i, "");
    }

    const parsed = parseFloat(text);

    return Number.isFinite(parsed)
        ? parsed * multiplier
        : 0;
}


/* FIXED MONEY FORMAT */

function money(value) {

    const n = numberValue(value);

    if (!n) {
        return "$0";
    }

    if (Math.abs(n) >= 1e12) {
        return "$" + (n / 1e12).toFixed(2) + "T";
    }

    if (Math.abs(n) >= 1e9) {
        return "$" + (n / 1e9).toFixed(2) + "B";
    }

    if (Math.abs(n) >= 1e6) {
        return "$" + (n / 1e6).toFixed(2) + "M";
    }

    if (Math.abs(n) >= 1e3) {
        return "$" + (n / 1e3).toFixed(1) + "K";
    }

    return "$" + Math.round(n).toLocaleString();
}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function arrayValue(value) {

    if (Array.isArray(value)) {
        return value;
    }

    if (!value) {
        return [];
    }

    return [value];
}


function personName(person) {

    return firstValue(
        person,
        [
            "name",
            "fullName",
            "full_name",
            "personName",
            "person",
            "title"
        ],
        "Unknown Billionaire"
    );
}


function companyName(company) {

    return firstValue(
        company,
        [
            "name",
            "companyName",
            "company_name",
            "title"
        ],
        "Unknown Company"
    );
}


/* =========================================================
   FLAGS
========================================================= */

const FLAGS = {
    US:"🇺🇸", USA:"🇺🇸", UnitedStates:"🇺🇸",
    GB:"🇬🇧", UK:"🇬🇧", UnitedKingdom:"🇬🇧",
    FR:"🇫🇷", France:"🇫🇷",
    DE:"🇩🇪", Germany:"🇩🇪",
    IT:"🇮🇹", Italy:"🇮🇹",
    ES:"🇪🇸", Spain:"🇪🇸",
    IN:"🇮🇳", India:"🇮🇳",
    CN:"🇨🇳", China:"🇨🇳",
    JP:"🇯🇵", Japan:"🇯🇵",
    KR:"🇰🇷", Korea:"🇰🇷",
    CA:"🇨🇦", Canada:"🇨🇦",
    AU:"🇦🇺", Australia:"🇦🇺",
    MX:"🇲🇽", Mexico:"🇲🇽",
    BR:"🇧🇷", Brazil:"🇧🇷",
    RU:"🇷🇺", Russia:"🇷🇺",
    UA:"🇺🇦", Ukraine:"🇺🇦",
    TR:"🇹🇷", Turkey:"🇹🇷",
    AE:"🇦🇪", UAE:"🇦🇪",
    CH:"🇨🇭", Switzerland:"🇨🇭",
    SG:"🇸🇬", Singapore:"🇸🇬",
    ID:"🇮🇩", Indonesia:"🇮🇩",
    TH:"🇹🇭", Thailand:"🇹🇭",
    SE:"🇸🇪", Sweden:"🇸🇪",
    NO:"🇳🇴", Norway:"🇳🇴",
    NL:"🇳🇱", Netherlands:"🇳🇱"
};


function flag(country) {

    return FLAGS[String(country)] || "🌍";
}


/* =========================================================
   NORMALIZE PEOPLE
========================================================= */

function normalizeBillionaire(item) {

    if (!item || typeof item !== "object") {
        return null;
    }

    const biography = firstValue(
        item,
        [
            "biography",
            "bio",
            "description",
            "about",
            "summary"
        ],
        ""
    );

    const investments = firstValue(
        item,
        [
            "investments",
            "investment",
            "portfolio",
            "investmentPortfolio",
            "investment_portfolio"
        ],
        []
    );

    const stakes = firstValue(
        item,
        [
            "stakes",
            "ownership",
            "holdings",
            "ownerships"
        ],
        []
    );

    return {
        ...item,

        name: personName(item),

        country: firstValue(
            item,
            [
                "country",
                "countryCode",
                "country_code",
                "citizenship",
                "location"
            ],
            "Unknown"
        ),

        netWorth: numberValue(
            firstValue(
                item,
                [
                    "netWorth",
                    "net_worth",
                    "worth",
                    "wealth",
                    "fortune",
                    "estimatedNetWorth"
                ],
                0
            )
        ),

        biography,

        investments: arrayValue(investments),

        stakes: arrayValue(stakes)
    };
}


/* =========================================================
   NORMALIZE COMPANIES
========================================================= */

function normalizeCompany(item) {

    if (!item || typeof item !== "object") {
        return null;
    }

    return {
        ...item,

        name: companyName(item),

        country: firstValue(
            item,
            [
                "country",
                "countryCode",
                "country_code",
                "headquartersCountry",
                "location"
            ],
            "Unknown"
        ),

        revenue: numberValue(
            firstValue(
                item,
                [
                    "revenue",
                    "annualRevenue",
                    "annual_revenue",
                    "sales"
                ],
                0
            )
        ),

        profit: numberValue(
            firstValue(
                item,
                [
                    "netProfit",
                    "net_profit",
                    "profit",
                    "netIncome",
                    "net_income"
                ],
                0
            )
        ),

        grossProfit: numberValue(
            firstValue(
                item,
                [
                    "grossProfit",
                    "gross_profit"
                ],
                0
            )
        ),

        biography: firstValue(
            item,
            [
                "biography",
                "bio",
                "description",
                "about",
                "summary"
            ],
            ""
        ),

        investments: arrayValue(
            firstValue(
                item,
                [
                    "investments",
                    "investment",
                    "portfolio"
                ],
                []
            )
        ),

        stakes: arrayValue(
            firstValue(
                item,
                [
                    "stakes",
                    "ownership",
                    "shareholders",
                    "holdings"
                ],
                []
            )
        )
    };
}


/* =========================================================
   LOAD DATA
========================================================= */

async function loadData() {

    try {

        const response = await fetch(
            "data.json?cache=" + Date.now(),
            {
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error(
                "data.json could not be loaded."
            );
        }

        const raw = await response.json();

        let people = [];
        let companies = [];

        if (Array.isArray(raw)) {

            people = raw;

        } else if (
            raw &&
            typeof raw === "object"
        ) {

            people =
                raw.billionaires ||
                raw.Billionaires ||
                raw.people ||
                raw.richestPeople ||
                raw.richest_people ||
                [];

            companies =
                raw.companies ||
                raw.Companies ||
                raw.businesses ||
                raw.business ||
                [];
        }


        if (!Array.isArray(people)) {
            people = [];
        }

        if (!Array.isArray(companies)) {
            companies = [];
        }


        state.billionaires =
            people
                .map(normalizeBillionaire)
                .filter(Boolean);


        state.companies =
            companies
                .map(normalizeCompany)
                .filter(Boolean);


        state.filteredBillionaires =
            [...state.billionaires];

        state.filteredCompanies =
            [...state.companies];


        state.lastUpdated = new Date();


        buildCountryFilter();

        renderEverything();


        console.log(
            `WorldElite: ${state.billionaires.length} billionaires, ${state.companies.length} companies`
        );


    } catch (error) {

        console.error(
            "WorldElite data error:",
            error
        );

        showDataError(
            error.message
        );
    }
}


/* =========================================================
   RENDER EVERYTHING
========================================================= */

function renderEverything() {

    renderHome();
    renderRankings();
    renderCompanies();
    renderWorldBests();
    renderInvestments();
    renderProfile();
}


/* =========================================================
   HOME
========================================================= */

function renderHome() {

    const peopleCount =
        document.getElementById(
            "homeBillionaireCount"
        );

    const companyCount =
        document.getElementById(
            "homeCompanyCount"
        );

    if (peopleCount) {

        peopleCount.textContent =
            state.billionaires.length
                .toLocaleString();
    }

    if (companyCount) {

        companyCount.textContent =
            state.companies.length
                .toLocaleString();
    }


    const people =
        [...state.billionaires]
            .sort(
                (a,b) =>
                    b.netWorth - a.netWorth
            )
            .slice(0, 5);


    const peopleContainer =
        document.getElementById(
            "homeBillionaires"
        );

    if (peopleContainer) {

        peopleContainer.innerHTML =
            people
                .map(
                    (person,index) =>
                        billionaireCard(
                            person,
                            index + 1
                        )
                )
                .join("");
    }


    const companies =
        [...state.companies]
            .sort(
                (a,b) =>
                    b.revenue - a.revenue
            )
            .slice(0,5);


    const companyContainer =
        document.getElementById(
            "homeCompanies"
        );

    if (companyContainer) {

        companyContainer.innerHTML =
            companies.length
                ? companies
                    .map(
                        (company,index) =>
                            companyCard(
                                company,
                                index + 1
                            )
                    )
                    .join("")
                : emptyCard(
                    "No company records",
                    "Run the automatic data update workflow."
                );
    }
}


/* =========================================================
   BILLIONAIRE CARD
========================================================= */

function billionaireCard(
    person,
    rank
) {

    const index =
        state.billionaires.indexOf(
            person
        );

    return `
        <button
            class="person-card"
            onclick="openPerson(${index})"
        >

            <div class="rank">
                ${rank}
            </div>

            <div class="avatar">
                ♛
            </div>

            <div class="person-info">

                <strong>
                    ${escapeHTML(person.name)}
                </strong>

                <span>
                    ${flag(person.country)}
                    ${escapeHTML(person.country)}
                </span>

            </div>

            <div class="wealth">
                ${money(person.netWorth)}
            </div>

        </button>
    `;
}


/* =========================================================
   COMPANY CARD
========================================================= */

function companyCard(
    company,
    rank
) {

    const index =
        state.companies.indexOf(
            company
        );

    return `
        <button
            class="company-card"
            onclick="openCompany(${index})"
        >

            <div class="company-rank">
                ${rank}
            </div>

            <div class="company-logo">
                ▣
            </div>

            <div class="company-info">

                <strong>
                    ${escapeHTML(company.name)}
                </strong>

                <span>
                    ${flag(company.country)}
                    ${escapeHTML(company.country)}
                </span>

            </div>

            <div class="company-revenue">

                <small>Revenue</small>

                <strong>
                    ${
                        company.revenue
                            ? money(company.revenue)
                            : "N/A"
                    }
                </strong>

            </div>

        </button>
    `;
}


/* =========================================================
   RANKINGS
========================================================= */

function renderRankings() {

    let list =
        [...state.billionaires];


    const search =
        document
            .getElementById(
                "globalSearchInput"
            )
            ?.value
            .trim()
            .toLowerCase() || "";


    const country =
        document
            .getElementById(
                "countryFilter"
            )
            ?.value || "all";


    if (search) {

        list =
            list.filter(
                person =>
                    person.name
                        .toLowerCase()
                        .includes(search)
            );
    }


    if (country !== "all") {

        list =
            list.filter(
                person =>
                    String(person.country)
                        .toLowerCase() ===
                    String(country)
                        .toLowerCase()
            );
    }


    list.sort(
        (a,b) =>
            state.billionaireSort === "lowest"
                ? a.netWorth - b.netWorth
                : b.netWorth - a.netWorth
    );


    state.filteredBillionaires =
        list;


    const count =
        document.getElementById(
            "rankingCount"
        );

    if (count) {

        count.textContent =
            `${list.length.toLocaleString()} billionaires`;
    }


    const container =
        document.getElementById(
            "billionaireList"
        );

    if (!container) {
        return;
    }


    container.innerHTML =
        list.length
            ? list
                .map(
                    (person,index) =>
                        billionaireCard(
                            person,
                            index + 1
                        )
                )
                .join("")
            : emptyCard(
                "No billionaires found",
                "Try another name or country."
            );
}


function handleGlobalSearch() {
    renderRankings();
}


function sortBillionaires(order) {

    state.billionaireSort =
        order;


    document
        .getElementById("highestButton")
        ?.classList.toggle(
            "active",
            order === "highest"
        );


    document
        .getElementById("lowestButton")
        ?.classList.toggle(
            "active",
            order === "lowest"
        );


    renderRankings();
}


/* =========================================================
   COUNTRY
========================================================= */

function buildCountryFilter() {

    const select =
        document.getElementById(
            "countryFilter"
        );

    if (!select) {
        return;
    }


    const oldValue =
        select.value;


    const countries =
        [...new Set(
            state.billionaires
                .map(
                    person =>
                        person.country
                )
                .filter(Boolean)
        )]
        .sort(
            (a,b) =>
                String(a)
                    .localeCompare(
                        String(b)
                    )
        );


    select.innerHTML = `
        <option value="all">
            🌍 All Countries
        </option>
    `;


    countries.forEach(
        country => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                country;

            option.textContent =
                `${flag(country)} ${country}`;

            select.appendChild(
                option
            );
        }
    );


    if (
        countries.includes(
            oldValue
        )
    ) {
        select.value =
            oldValue;
    }
}


function filterBillionaires() {
    renderRankings();
}


/* =========================================================
   PERSON PROFILE
========================================================= */

function openPerson(index) {

    const person =
        state.billionaires[index];

    if (!person) {
        return;
    }


    const content =
        document.getElementById(
            "personContent"
        );

    if (!content) {
        return;
    }


    content.innerHTML = `

        <div class="profile-hero">

            <div class="large-avatar">
                ♛
            </div>

            <div class="profile-country">
                ${flag(person.country)}
                ${escapeHTML(person.country)}
            </div>

            <h2>
                ${escapeHTML(person.name)}
            </h2>

            <div class="profile-worth">
                ${money(person.netWorth)}
            </div>

            <span>
                Estimated Net Worth
            </span>

        </div>


        <div class="info-card">

            <h3>Biography</h3>

            <p>
                ${
                    escapeHTML(
                        person.biography ||
                        "A verified biography is not available in the current dataset."
                    )
                }
            </p>

        </div>


        <div class="info-card">

            <h3>↗ Investments</h3>

            ${
                renderInvestmentList(
                    person.investments
                ) ||
                `<p class="muted">
                    No investment portfolio is currently available.
                </p>`
            }

        </div>


        <div class="info-card">

            <h3>📊 Stakes & Ownership</h3>

            ${
                renderInvestmentList(
                    person.stakes
                ) ||
                `<p class="muted">
                    No ownership information is currently available.
                </p>`
            }

        </div>


        <div class="info-card">

            <h3>Why invest?</h3>

            <p>
                WorldElite only displays an investment
                rationale when it is supported by the
                underlying source data. It does not invent
                motives for individual investors.
            </p>

        </div>

    `;


    openPage(
        "personPage"
    );
}


/* =========================================================
   INVESTMENT LIST
========================================================= */

function renderInvestmentList(list) {

    if (
        !Array.isArray(list) ||
        !list.length
    ) {
        return "";
    }


    return `
        <div class="detail-list">

            ${
                list
                    .map(item => {

                        if (
                            typeof item === "string"
                        ) {

                            return `
                                <div class="detail-row">
                                    <strong>
                                        ${escapeHTML(item)}
                                    </strong>
                                </div>
                            `;
                        }


                        const name =
                            firstValue(
                                item,
                                [
                                    "name",
                                    "company",
                                    "asset",
                                    "sector",
                                    "title"
                                ],
                                "Investment"
                            );


                        const amount =
                            firstValue(
                                item,
                                [
                                    "amount",
                                    "value",
                                    "percentage",
                                    "stake"
                                ],
                                ""
                            );


                        const reason =
                            firstValue(
                                item,
                                [
                                    "reason",
                                    "why",
                                    "thesis",
                                    "strategy",
                                    "description"
                                ],
                                ""
                            );


                        return `
                            <div class="detail-row">

                                <strong>
                                    ${escapeHTML(name)}
                                </strong>

                                ${
                                    amount
                                        ? `<span>${escapeHTML(amount)}</span>`
                                        : ""
                                }

                                ${
                                    reason
                                        ? `<p>${escapeHTML(reason)}</p>`
                                        : ""
                                }

                            </div>
                        `;

                    })
                    .join("")
            }

        </div>
    `;
}


/* =========================================================
   COMPANIES
========================================================= */

function renderCompanies() {

    let list =
        [...state.companies];


    const search =
        document
            .getElementById(
                "companySearchInput"
            )
            ?.value
            .trim()
            .toLowerCase() || "";


    if (search) {

        list =
            list.filter(
                company =>
                    company.name
                        .toLowerCase()
                        .includes(search)
            );
    }


    if (
        state.companySort ===
        "profit"
    ) {

        list.sort(
            (a,b) =>
                b.profit - a.profit
        );

    } else if (
        state.companySort ===
        "name"
    ) {

        list.sort(
            (a,b) =>
                a.name.localeCompare(
                    b.name
                )
        );

    } else {

        list.sort(
            (a,b) =>
                b.revenue - a.revenue
        );
    }


    state.filteredCompanies =
        list;


    const count =
        document.getElementById(
            "companyCount"
        );

    if (count) {

        count.textContent =
            `${list.length.toLocaleString()} companies`;
    }


    const container =
        document.getElementById(
            "companyList"
        );

    if (!container) {
        return;
    }


    container.innerHTML =
        list.length
            ? list
                .map(
                    (company,index) =>
                        companyCard(
                            company,
                            index + 1
                        )
                )
                .join("")
            : emptyCard(
                "No companies found",
                "No company records are available."
            );
}


function searchCompanies() {
    renderCompanies();
}


function sortCompanies(type) {

    state.companySort =
        type;


    document
        .getElementById(
            "companyRevenueButton"
        )
        ?.classList.toggle(
            "active",
            type === "revenue"
        );


    document
        .getElementById(
            "companyProfitButton"
        )
        ?.classList.toggle(
            "active",
            type === "profit"
        );


    document
        .getElementById(
            "companyNameButton"
        )
        ?.classList.toggle(
            "active",
            type === "name"
        );


    renderCompanies();
}


/* =========================================================
   COMPANY PROFILE
========================================================= */

function openCompany(index) {

    const company =
        state.companies[index];

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

            <div class="large-avatar">
                ▣
            </div>

            <div class="profile-country">
                ${flag(company.country)}
                ${escapeHTML(company.country)}
            </div>

            <h2>
                ${escapeHTML(company.name)}
            </h2>

            <div class="profile-worth">
                ${
                    company.revenue
                        ? money(company.revenue)
                        : "N/A"
                }
            </div>

            <span>
                Annual Revenue
            </span>

        </div>


        <div class="financial-grid">

            <div class="financial-card">
                <small>Revenue</small>
                <strong>
                    ${
                        company.revenue
                            ? money(company.revenue)
                            : "N/A"
                    }
                </strong>
            </div>

            <div class="financial-card">
                <small>Net Profit</small>
                <strong>
                    ${
                        company.profit
                            ? money(company.profit)
                            : "N/A"
                    }
                </strong>
            </div>

            <div class="financial-card">
                <small>Gross Profit</small>
                <strong>
                    ${
                        company.grossProfit
                            ? money(company.grossProfit)
                            : "N/A"
                    }
                </strong>
            </div>

        </div>


        <div class="info-card">

            <h3>Company Biography</h3>

            <p>
                ${
                    escapeHTML(
                        company.biography ||
                        "A verified company biography is not available in the current dataset."
                    )
                }
            </p>

        </div>


        <div class="info-card">

            <h3>↗ Investments</h3>

            ${
                renderInvestmentList(
                    company.investments
                ) ||
                `<p class="muted">
                    No investment information is available.
                </p>`
            }

        </div>


        <div class="info-card">

            <h3>📊 Stakes & Ownership</h3>

            ${
                renderInvestmentList(
                    company.stakes
                ) ||
                `<p class="muted">
                    No ownership information is available.
                </p>`
            }

        </div>


        <div class="info-card">

            <h3>Why does the company invest?</h3>

            <p>
                WorldElite shows an investment thesis only
                when it is supported by the underlying data.
                No investment motive is fabricated.
            </p>

        </div>

    `;


    openPage(
        "companyProfilePage"
    );
}


/* =========================================================
   WORLD BESTS
========================================================= */

function renderWorldBests() {

    const container =
        document.getElementById(
            "worldBestsContent"
        );

    if (!container) {
        return;
    }


    const richest =
        [...state.billionaires]
            .sort(
                (a,b) =>
                    b.netWorth - a.netWorth
            )
            .slice(0,10);


    const companies =
        [...state.companies]
            .sort(
                (a,b) =>
                    b.revenue - a.revenue
            )
            .slice(0,10);


    container.innerHTML = `

        <div class="info-card">

            <h3>♛ World's Richest</h3>

            ${
                richest
                    .map(
                        (person,index) => `

                            <button
                                class="mini-row"
                                onclick="openPerson(${state.billionaires.indexOf(person)})"
                            >

                                <span>
                                    ${index + 1}
                                </span>

                                <strong>
                                    ${escapeHTML(person.name)}
                                </strong>

                                <b>
                                    ${money(person.netWorth)}
                                </b>

                            </button>
                        `
                    )
                    .join("")
            }

        </div>


        <div class="info-card">

            <h3>▣ Leading Companies</h3>

            ${
                companies.length
                    ? companies
                        .map(
                            (company,index) => `

                                <button
                                    class="mini-row"
                                    onclick="openCompany(${state.companies.indexOf(company)})"
                                >

                                    <span>
                                        ${index + 1}
                                    </span>

                                    <strong>
                                        ${escapeHTML(company.name)}
                                    </strong>

                                    <b>
                                        ${
                                            company.revenue
                                                ? money(company.revenue)
                                                : "N/A"
                                        }
                                    </b>

                                </button>
                            `
                        )
                        .join("")
                    : `
                        <p class="muted">
                            Company data is not available yet.
                        </p>
                    `
            }

        </div>
    `;
}


/* =========================================================
   INVESTMENTS PAGE
========================================================= */

function renderInvestments() {

    const container =
        document.getElementById(
            "investmentsContent"
        );

    if (!container) {
        return;
    }


    const people =
        state.billionaires
            .filter(
                person =>
                    person.investments.length
            )
            .slice(0,30);


    container.innerHTML = `

        ${
            people.length
                ? people
                    .map(
                        person => `

                            <div class="info-card">

                                <h3>
                                    ${escapeHTML(person.name)}
                                </h3>

                                ${renderInvestmentList(
                                    person.investments
                                )}

                            </div>
                        `
                    )
                    .join("")
                : `
                    <div class="empty-card">
                        <strong>
                            Investment data unavailable
                        </strong>

                        <p>
                            The current billionaire dataset
                            does not contain portfolio records.
                        </p>
                    </div>
                `
        }
    `;
}


function showInvestmentTab(
    type,
    button
) {

    document
        .querySelectorAll(
            ".investment-tabs .tab"
        )
        .forEach(
            tab =>
                tab.classList.remove(
                    "active"
                )
        );


    if (button) {
        button.classList.add(
            "active"
        );
    }


    const container =
        document.getElementById(
            "investmentsContent"
        );

    if (!container) {
        return;
    }


    if (type === "companies") {

        const companies =
            state.companies
                .filter(
                    company =>
                        company.investments.length
                )
                .slice(0,30);


        container.innerHTML =
            companies.length
                ? companies
                    .map(
                        company => `

                            <div class="info-card">

                                <h3>
                                    ▣
                                    ${escapeHTML(company.name)}
                                </h3>

                                ${renderInvestmentList(
                                    company.investments
                                )}

                            </div>
                        `
                    )
                    .join("")
                : `
                    <div class="empty-card">

                        <strong>
                            Company investment data unavailable
                        </strong>

                        <p>
                            No portfolio records are currently
                            contained in the company dataset.
                        </p>

                    </div>
                `;

    } else {

        renderInvestments();
    }
}


/* =========================================================
   REFRESH
========================================================= */

async function refreshData() {

    const buttons =
        document.querySelectorAll(
            ".refresh-button"
        );


    buttons.forEach(
        button => {

            button.disabled = true;
            button.dataset.original =
                button.textContent;

            button.textContent =
                "↻ Updating...";
        }
    );


    try {

        await loadData();

    } finally {

        buttons.forEach(
            button => {

                button.disabled = false;

                button.textContent =
                    button.dataset.original ||
                    "↻ Refresh Data";
            }
        );
    }
}


/* =========================================================
   AUTH
========================================================= */

function showLogin() {
    openPage("loginPage");
}


function showSignup() {
    openPage("signupPage");
}


function loginUser(event) {

    event.preventDefault();

    const email =
        document
            .getElementById(
                "loginEmail"
            )
            .value
            .trim();


    const password =
        document
            .getElementById(
                "loginPassword"
            )
            .value;


    if (!email || !password) {
        return;
    }


    localStorage.setItem(
        "worldelite_user",
        JSON.stringify({
            email
        })
    );


    renderProfile();

    openPage(
        "profilePage"
    );
}


function signupUser(event) {

    event.preventDefault();


    const name =
        document
            .getElementById(
                "signupName"
            )
            .value
            .trim();


    const email =
        document
            .getElementById(
                "signupEmail"
            )
            .value
            .trim();


    const password =
        document
            .getElementById(
                "signupPassword"
            )
            .value;


    if (
        !name ||
        !email ||
        !password
    ) {
        return;
    }


    localStorage.setItem(
        "worldelite_user",
        JSON.stringify({
            name,
            email
        })
    );


    renderProfile();

    if (
        pageId ===
        "learnPage"
    ) {
        renderLearn();
    }

    openPage(
        "profilePage"
    );
}


/* =========================================================
   PREMIUM
========================================================= */

function getPremiumState() {
    try {
        const raw = localStorage.getItem("worldelite_premium");
        if (!raw) return { isPremium: false, removeAds: false, plan: null };
        return JSON.parse(raw);
    } catch {
        return { isPremium: false, removeAds: false, plan: null };
    }
}

function setPremiumState(next) {
    localStorage.setItem("worldelite_premium", JSON.stringify(next));
}

function isPremiumUser() {
    const s = getPremiumState();
    return !!(s.isPremium || s.removeAds);
}

function canAccessPremiumContent() {
    return !!getPremiumState().isPremium;
}

function activatePremium(plan) {
    setPremiumState({ isPremium: true, removeAds: true, plan: plan || "premium" });
    renderProfile();
    alert("Premium activated (demo). Real Google Play Billing comes later.");
}

function activateRemoveAds() {
    const s = getPremiumState();
    setPremiumState({ isPremium: s.isPremium, removeAds: true, plan: s.plan || "remove_ads" });
    renderProfile();
    alert("Ads removed (demo). Real IAP comes later.");
}

function deactivatePremiumDemo() {
    setPremiumState({ isPremium: false, removeAds: false, plan: null });
    renderProfile();
}

function renderProfile() {
    const container = document.getElementById("profileContent");
    if (!container) return;

    const premium = getPremiumState();
    const stored = localStorage.getItem("worldelite_user");
    let user = null;
    if (stored) {
        try { user = JSON.parse(stored); } catch { user = {}; }
    }

    const premiumCard = `
        <div class="info-card premium-card">
            <h3>${premium.isPremium ? "✦ WorldElite Premium" : "Upgrade to Premium"}</h3>
            <p>${premium.isPremium
                ? "Full access is on. Ads are off. All Learn topics are unlocked."
                : "Unlock full data, all lessons, calculators, and remove ads."}</p>
            <ul class="premium-list">
                <li>No ads</li>
                <li>Full billionaire & company lists</li>
                <li>All Learn topics</li>
                <li>All calculators</li>
            </ul>
            ${premium.isPremium ? `
                <div class="hero-actions">
                    <button class="secondary-button" onclick="deactivatePremiumDemo()">Reset demo Premium</button>
                </div>
            ` : `
                <div class="hero-actions">
                    <button class="primary-button" onclick="activatePremium('monthly')">Premium — $3.99/mo</button>
                    <button class="secondary-button" onclick="activatePremium('yearly')">Premium — $29.99/yr</button>
                </div>
                <div class="hero-actions" style="margin-top:10px;">
                    <button class="secondary-button" onclick="activateRemoveAds()">Remove Ads — $6.99</button>
                </div>
                <p class="calc-note">Demo mode. Google Play Billing will be connected later.</p>
            `}
        </div>
    `;

    if (!user) {
        container.innerHTML = `
            <div class="info-card">
                <h3>Welcome to WorldElite</h3>
                <p>Login or create an account to personalize your experience.</p>
                <div class="hero-actions">
                    <button class="primary-button" onclick="showLogin()">Login</button>
                    <button class="secondary-button" onclick="showSignup()">Sign Up</button>
                </div>
            </div>
            ${premiumCard}
        `;
        return;
    }

    container.innerHTML = `
        <div class="profile-hero">
            <div class="large-avatar">◉</div>
            <h2>${escapeHTML(user.name || user.email || "WorldElite User")}</h2>
            ${user.email ? `<p>${escapeHTML(user.email)}</p>` : ""}
            ${premium.isPremium ? `<div class="premium-badge">PREMIUM</div>` : premium.removeAds ? `<div class="premium-badge">ADS OFF</div>` : ""}
        </div>
        ${premiumCard}
        <div class="info-card">
            <h3>Your WorldElite account</h3>
            <p>Your account is currently stored locally on this device.</p>
            <div class="hero-actions">
                <button class="secondary-button" onclick="logoutUser()">Logout</button>
            </div>
        </div>
    `;
}

function logoutUser() {

    localStorage.removeItem(
        "worldelite_user"
    );

    renderProfile();

    if (
        pageId ===
        "learnPage"
    ) {
        renderLearn();
    }

    openPage(
        "profilePage"
    );
}


/* =========================================================
   NAVIGATION
========================================================= */

function openPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(
            page =>
                page.classList.add(
                    "hidden"
                )
        );


    const page =
        document.getElementById(
            pageId
        );


    if (!page) {
        return;
    }


    page.classList.remove(
        "hidden"
    );


    state.currentPage =
        pageId;


    updateNavigation(
        pageId
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    if (
        pageId ===
        "rankingsPage"
    ) {
        renderRankings();
    }

    if (
        pageId ===
        "companiesPage"
    ) {
        renderCompanies();
    }

    if (
        pageId ===
        "bestsPage"
    ) {
        renderWorldBests();
    }

    if (
        pageId ===
        "investmentsPage"
    ) {
        renderInvestments();
    }

    if (
        pageId ===
        "profilePage"
    ) {
        renderProfile();
    }

    if (
        pageId ===
        "learnPage"
    ) {
        renderLearn();
    }
}


function updateNavigation(
    pageId
) {

    document
        .querySelectorAll(".nav")
        .forEach(
            nav =>
                nav.classList.remove(
                    "active"
                )
        );


    const map = {

        homePage: "navHome",
        rankingsPage: "navRankings",
        companiesPage: "navCompanies",
        bestsPage: "navBests",
        investmentsPage: "navInvestments",
        learnPage: "navLearn",
        profilePage: "navProfile"
    };


    const id =
        map[pageId];


    if (id) {

        document
            .getElementById(id)
            ?.classList.add(
                "active"
            );
    }
}


function emptyCard(
    title,
    text
) {

    return `

        <div class="empty-card">

            <strong>
                ${escapeHTML(title)}
            </strong>

            <p>
                ${escapeHTML(text)}
            </p>

        </div>
    `;
}


function showDataError(
    message
) {

    const home =
        document.getElementById(
            "homeBillionaires"
        );


    if (!home) {
        return;
    }


    home.innerHTML =
        emptyCard(
            "Data could not be loaded",
            message
        );
}


/* =========================================================
   START
========================================================= */


/* =========================================================
   FINANCIAL LITERACY
========================================================= */

const LEARN_TOPICS = [
    {
        id: "stock-market",
        icon: "📈",
        title: "What is the Stock Market?",
        label: "MARKETS",
        summary: "Where companies and investors meet to buy and sell ownership."
    },
    {
        id: "stocks",
        icon: "📊",
        title: "Stocks",
        label: "ASSETS",
        summary: "Owning a piece of a company and sharing in its success or failure."
    },
    {
        id: "bonds",
        icon: "🧾",
        title: "Bonds",
        label: "ASSETS",
        summary: "Lending money to governments or companies in exchange for interest."
    },
    {
        id: "etfs",
        icon: "📦",
        title: "ETFs",
        label: "ASSETS",
        summary: "A basket of many stocks or bonds in one simple product."
    },
    {
        id: "dividends",
        icon: "💰",
        title: "Dividends",
        label: "INCOME",
        summary: "Cash that some companies pay to their shareholders."
    },
    {
        id: "inflation",
        icon: "📉",
        title: "Inflation",
        label: "ECONOMY",
        summary: "Why money loses purchasing power over time."
    },
    {
        id: "interest-rates",
        icon: "🏦",
        title: "Interest Rates",
        label: "ECONOMY",
        summary: "The price of borrowing money and the reward for saving it."
    },
    {
        id: "compound-interest",
        icon: "📈",
        title: "Compound Interest",
        label: "GROWTH",
        summary: "How returns generate more returns over long periods."
    },
    {
        id: "risk",
        icon: "⚠️",
        title: "Investment Risks",
        label: "RISK",
        summary: "What can go wrong and how professionals think about uncertainty."
    },
    {
        id: "diversification",
        icon: "🌐",
        title: "Diversification",
        label: "STRATEGY",
        summary: "Why spreading money across many assets reduces damage."
    },
    {
        id: "credit-debt",
        icon: "💳",
        title: "Credit & Debt",
        label: "PERSONAL FINANCE",
        summary: "How borrowing works, when it helps, and when it destroys wealth."
    },
    {
        id: "mortgages",
        icon: "🏠",
        title: "Mortgages",
        label: "PERSONAL FINANCE",
        summary: "Long-term loans used to buy property and the real costs involved."
    },
    {
        id: "crypto",
        icon: "🪙",
        title: "Crypto",
        label: "ASSETS",
        summary: "Digital assets, speculation, and the difference between technology and investment."
    },
    {
        id: "billionaire-wealth",
        icon: "👨‍💼",
        title: "How Billionaires Build Wealth",
        label: "WEALTH",
        summary: "Ownership, leverage, businesses and long time horizons."
    },
    {
        id: "psychology",
        icon: "🧠",
        title: "Psychology of Investing",
        label: "BEHAVIOR",
        summary: "Fear, greed, FOMO and the emotional mistakes that cost the most money."
    }
];


const LEARN_CONTENT = {
    "stock-market": {
        what: "The stock market is a system where people and institutions buy and sell shares of publicly listed companies. It is not a physical place for most trading today — it is a network of exchanges, brokers and electronic systems.",
        how: "Companies list their shares on an exchange (IPO). After that, investors trade those shares with each other. Prices move based on supply and demand, expectations about the company’s future profits, interest rates, and overall economic conditions.",
        who: "Used by individual investors, pension funds, insurance companies, hedge funds, mutual funds, and the companies themselves when they raise capital.",
        why: "It allows companies to raise money for growth without taking bank loans, and allows investors to own pieces of businesses and potentially earn returns.",
        example: "When you buy 10 shares of a company at $50 each, you pay $500 and own a tiny fraction of that business. If the share price rises to $70, your stake is worth $700. If it falls to $30, it is worth $300.",
        advantages: [
            "High liquidity — you can usually sell quickly",
            "Potential for long-term growth",
            "Transparency through public reporting",
            "Access to ownership of major companies"
        ],
        risks: [
            "Prices can fall sharply in short periods",
            "Individual companies can fail",
            "Emotional trading often leads to losses",
            "Short-term noise can distract from long-term value"
        ],
        mistakes: [
            "Treating the market like a casino",
            "Buying only because the price is rising (FOMO)",
            "Selling everything in panic during a crash",
            "Ignoring fees and taxes"
        ],
        consequences: "Poor understanding of the stock market often leads to buying high, selling low, chasing tips, and losing capital that took years to save.",
        keyTerms: [
            { term: "Exchange", def: "A marketplace where stocks are listed and traded (e.g. NYSE, Nasdaq)." },
            { term: "Broker", def: "An intermediary that executes buy and sell orders for investors." },
            { term: "Bid / Ask", def: "The price buyers are willing to pay and sellers are willing to accept." },
            { term: "Liquidity", def: "How easily an asset can be bought or sold without large price impact." }
        ]
    },

    "stocks": {
        what: "A stock (share) represents partial ownership of a company. When you own shares, you own a claim on the company’s assets and future profits.",
        how: "Companies issue shares to raise capital. Shareholders may receive dividends and benefit if the company grows and the share price rises. Voting rights usually come with common shares.",
        who: "Used by retail investors, institutional investors, founders, employees (via stock options), and activists.",
        why: "Stocks historically offered higher long-term returns than cash or bonds because they represent ownership of productive businesses.",
        example: "If a company has 1 million shares and earns $10 million profit, earnings per share are $10. If you own 100 shares, your proportional claim is $1,000 of those earnings (whether paid out or reinvested).",
        advantages: [
            "Unlimited upside if the business succeeds",
            "Potential dividend income",
            "Ownership of real economic activity",
            "Easy to buy and sell on public markets"
        ],
        risks: [
            "You can lose most or all of your investment",
            "Share price can be volatile",
            "Management can make poor decisions",
            "Dilution if the company issues more shares"
        ],
        mistakes: [
            "Putting too much money into one stock",
            "Confusing a good product with a good investment",
            "Ignoring valuation",
            "Holding forever without reviewing the business"
        ],
        consequences: "Concentrated stock bets without understanding can wipe out years of savings. Many people underestimate how often individual companies underperform or fail.",
        keyTerms: [
            { term: "Common stock", def: "Standard ownership share, usually with voting rights." },
            { term: "Preferred stock", def: "Shares that typically have priority for dividends but limited voting rights." },
            { term: "Market cap", def: "Share price × number of shares — the market’s valuation of the company." },
            { term: "EPS", def: "Earnings Per Share — company profit divided by number of shares." }
        ]
    },

    "bonds": {
        what: "A bond is a loan you make to a government or company. In return, they promise to pay you interest and return the principal on a set date.",
        how: "You buy a bond for a certain price. The issuer pays periodic interest (coupon) and repays the face value at maturity. Bond prices move inversely to interest rates.",
        who: "Used by governments to fund spending, companies to finance operations, pension funds, insurers, and conservative investors.",
        why: "Bonds provide more predictable income and are generally less volatile than stocks. They are a core tool for capital preservation and income.",
        example: "You buy a 10-year government bond with a 4% coupon for $1,000. Each year you receive $40. After 10 years you get your $1,000 back (assuming no default).",
        advantages: [
            "More predictable cash flow than stocks",
            "Higher priority than shareholders in bankruptcy",
            "Useful for diversification",
            "Can reduce overall portfolio volatility"
        ],
        risks: [
            "Interest rate risk — bond prices fall when rates rise",
            "Credit / default risk",
            "Inflation can erode real returns",
            "Lower long-term growth potential than stocks"
        ],
        mistakes: [
            "Assuming all bonds are ‘safe’",
            "Ignoring duration and interest rate sensitivity",
            "Chasing high yields without understanding credit risk",
            "Holding long-term bonds when rates are rising"
        ],
        consequences: "Investors who treat high-yield bonds as ‘safe income’ can suffer large losses when credit conditions deteriorate or rates rise sharply.",
        keyTerms: [
            { term: "Coupon", def: "The interest payment the bond pays, usually annually or semi-annually." },
            { term: "Maturity", def: "The date when the principal is repaid." },
            { term: "Yield", def: "The effective return based on the bond’s current price and payments." },
            { term: "Duration", def: "A measure of how sensitive a bond’s price is to interest rate changes." }
        ]
    },

    "etfs": {
        what: "An ETF (Exchange-Traded Fund) is a fund that holds a basket of assets (stocks, bonds, commodities) and trades on an exchange like a single stock.",
        how: "You buy shares of the ETF. The ETF holds many underlying securities according to its rules (for example, tracking the S&P 500). You get diversified exposure in one trade.",
        who: "Used by beginners, long-term investors, institutions, and advisors because of low cost and simplicity.",
        why: "ETFs make diversification cheap and easy. They are one of the most important tools for ordinary investors.",
        example: "Instead of buying 500 individual US stocks, you buy one S&P 500 ETF. Your money is spread across the largest US companies automatically.",
        advantages: [
            "Instant diversification",
            "Usually low fees",
            "Transparent holdings",
            "Easy to buy and sell"
        ],
        risks: [
            "Market risk — the whole basket can fall",
            "Some ETFs are complex or leveraged",
            "Tracking error",
            "Liquidity risk in niche ETFs"
        ],
        mistakes: [
            "Buying leveraged or inverse ETFs for long-term holding",
            "Owning dozens of overlapping ETFs",
            "Ignoring the expense ratio",
            "Assuming every ETF is ‘safe’"
        ],
        consequences: "Using complex or sector-concentrated ETFs without understanding can create hidden risk and underperformance.",
        keyTerms: [
            { term: "Expense ratio", def: "The annual fee charged by the ETF as a percentage of assets." },
            { term: "Tracking error", def: "How closely the ETF follows its index." },
            { term: "AUM", def: "Assets Under Management — total money in the fund." },
            { term: "Index", def: "A benchmark the ETF aims to follow (e.g. S&P 500)." }
        ]
    },

    "dividends": {
        what: "Dividends are cash payments that some companies distribute to shareholders from their profits.",
        how: "The board decides to pay a dividend. Shareholders on the record date receive the payment. Not all companies pay dividends — many prefer to reinvest profits.",
        who: "Used by income-focused investors, retirees, and companies that want to return capital to owners.",
        why: "Dividends provide real cash flow without selling shares and can signal financial strength.",
        example: "A stock priced at $100 pays a $3 annual dividend. Your dividend yield is 3%. If you own 200 shares, you receive $600 per year.",
        advantages: [
            "Cash income while still owning the asset",
            "Can be reinvested (DRIP)",
            "Historically contributes a large part of total returns",
            "Psychological benefit of receiving payments"
        ],
        risks: [
            "Dividends can be cut or cancelled",
            "High yield can signal a company in trouble",
            "Focusing only on yield can lead to poor total returns",
            "Tax treatment varies by country"
        ],
        mistakes: [
            "Chasing the highest yield without checking sustainability",
            "Ignoring dividend growth",
            "Forgetting that total return = price change + dividends",
            "Over-concentrating in a few high-yield names"
        ],
        consequences: "Dividend traps (high yield before a cut) can cause both income loss and capital loss at the same time.",
        keyTerms: [
            { term: "Dividend yield", def: "Annual dividend ÷ share price." },
            { term: "Payout ratio", def: "Percentage of earnings paid out as dividends." },
            { term: "Ex-dividend date", def: "The date after which new buyers no longer receive the next dividend." },
            { term: "DRIP", def: "Dividend Reinvestment Plan — automatically buys more shares with dividends." }
        ]
    },

    "inflation": {
        what: "Inflation is the general rise in prices over time, which reduces the purchasing power of money.",
        how: "When the money supply grows faster than the production of goods and services, or when demand outstrips supply, prices tend to rise. Central banks try to manage inflation mainly through interest rates.",
        who: "Affects everyone — consumers, workers, savers, investors, governments and businesses.",
        why: "Understanding inflation is essential because cash under the mattress loses value, and investment returns must be measured in real (after-inflation) terms.",
        example: "If inflation is 5% per year, something that costs $100 today will cost about $163 in 10 years. $10,000 left in a 0% account will buy much less.",
        advantages: [
            "Mild inflation can encourage spending and investment",
            "Helps debtors if their income rises with prices",
            "Signals a growing economy in moderate amounts"
        ],
        risks: [
            "High inflation destroys savings",
            "Unpredictable inflation makes planning difficult",
            "Hyperinflation can collapse an economy",
            "Wages often lag behind price increases"
        ],
        mistakes: [
            "Keeping large amounts in cash for many years",
            "Ignoring inflation when calculating investment returns",
            "Assuming official inflation matches your personal inflation",
            "Taking on debt that becomes harder to service if rates rise"
        ],
        consequences: "People who ignore inflation often discover too late that their ‘safe’ cash savings cannot maintain their lifestyle.",
        keyTerms: [
            { term: "CPI", def: "Consumer Price Index — a common measure of inflation." },
            { term: "Real return", def: "Return after subtracting inflation." },
            { term: "Purchasing power", def: "What a unit of money can actually buy." },
            { term: "Stagflation", def: "High inflation combined with low growth." }
        ]
    },

    "interest-rates": {
        what: "Interest rates are the cost of borrowing money and the reward for lending or saving it.",
        how: "Central banks set policy rates. These influence mortgage rates, business loans, bond yields and savings rates. Higher rates cool the economy; lower rates stimulate it.",
        who: "Affects borrowers, savers, companies, governments, and every asset price in the financial system.",
        why: "Interest rates are one of the most powerful forces in finance. They change the value of almost every asset.",
        example: "A $300,000 mortgage at 3% costs much less per month than the same mortgage at 7%. Higher rates also make stocks and existing bonds less attractive.",
        advantages: [
            "Higher rates reward savers",
            "Can help control inflation",
            "Create opportunities in bonds and cash",
            "Discipline excessive borrowing"
        ],
        risks: [
            "Rising rates increase debt costs",
            "Can trigger recessions if raised too far",
            "Falling rates can inflate asset bubbles",
            "Variable-rate debt becomes dangerous when rates rise"
        ],
        mistakes: [
            "Taking large variable-rate debt at low rates without a plan",
            "Assuming rates will stay low forever",
            "Ignoring the effect of rates on asset valuations",
            "Refinancing without understanding the new terms"
        ],
        consequences: "Many households and companies that borrowed heavily at low rates face stress or default when rates rise.",
        keyTerms: [
            { term: "Policy rate", def: "The rate set by the central bank." },
            { term: "Nominal rate", def: "The stated interest rate before inflation." },
            { term: "Real rate", def: "Interest rate minus inflation." },
            { term: "Yield curve", def: "The relationship between interest rates and different maturities." }
        ]
    },

    "compound-interest": {
        what: "Compound interest means you earn returns not only on your original money, but also on the returns that money has already generated.",
        how: "Each period the balance grows. The next period’s return is calculated on the new larger balance. Over long periods this creates exponential growth.",
        who: "Used by long-term investors, savers, and also by lenders (compound interest works against you when you have debt).",
        why: "It is the most important mathematical concept in personal finance and investing. Time is the critical ingredient.",
        example: "Invest $10,000 at 8% annual return. After 10 years ≈ $21,600. After 20 years ≈ $46,600. After 30 years ≈ $100,600. Most of the final amount comes from compounding, not the original capital.",
        advantages: [
            "Turns time into an ally",
            "Works automatically once invested",
            "Rewards consistency and patience",
            "Can create substantial wealth from modest starting amounts"
        ],
        risks: [
            "Works against you with high-interest debt",
            "Requires long time horizons",
            "Interrupted by frequent withdrawals",
            "Assumes a positive rate of return"
        ],
        mistakes: [
            "Starting too late",
            "Withdrawing investment gains early",
            "Underestimating the damage of high-interest debt",
            "Chasing high returns and abandoning the plan"
        ],
        consequences: "People who delay investing by 10–15 years often need to save dramatically more later to reach the same goal. High-interest debt compounds against them just as powerfully.",
        keyTerms: [
            { term: "Principal", def: "The original amount invested or borrowed." },
            { term: "Compounding frequency", def: "How often interest is added (daily, monthly, annually)." },
            { term: "Time horizon", def: "How long the money is left to grow." },
            { term: "Rule of 72", def: "Approximate years to double money ≈ 72 ÷ annual return %." }
        ]
    },

    "risk": {
        what: "Investment risk is the possibility that the actual outcome will be worse than expected — including permanent loss of capital.",
        how: "Risk comes from many sources: market declines, individual company failure, inflation, currency moves, interest rates, liquidity, and human behavior.",
        who: "Every investor faces risk. Professionals manage it; amateurs often ignore it until it is too late.",
        why: "Higher expected returns usually require accepting higher risk. Understanding risk is more important than chasing returns.",
        example: "A single stock can fall 50–80%. A broad stock index can fall 30–50% in a bad year. Cash has low short-term risk but high inflation risk over decades.",
        advantages: [
            "Risk is the reason higher returns exist",
            "Understanding risk allows better decisions",
            "Diversification can reduce some types of risk",
            "Time reduces the impact of short-term volatility for long-term investors"
        ],
        risks: [
            "Permanent loss of capital",
            "Sequence of returns risk (especially in retirement)",
            "Behavioral risk — panic selling",
            "Hidden risks in complex products"
        ],
        mistakes: [
            "Confusing volatility with permanent loss",
            "Assuming past returns guarantee future results",
            "Taking risk without a margin of safety",
            "Concentrating everything in one idea"
        ],
        consequences: "Investors who do not understand risk often abandon their strategy at the worst moment and lock in losses.",
        keyTerms: [
            { term: "Volatility", def: "How much prices swing up and down." },
            { term: "Drawdown", def: "The peak-to-trough decline of an investment." },
            { term: "Permanent capital loss", def: "When an investment does not recover." },
            { term: "Risk tolerance", def: "How much decline you can psychologically and financially handle." }
        ]
    },

    "diversification": {
        what: "Diversification means spreading investments across different assets, sectors, geographies and risk types so that one failure does not destroy the whole portfolio.",
        how: "Instead of owning one stock or one country, you own many. When some parts decline, others may hold up or rise.",
        who: "Used by almost all professional investors, pension funds, and sensible long-term individual investors.",
        why: "It is the closest thing to a ‘free lunch’ in investing — reducing risk without necessarily reducing expected return in the same proportion.",
        example: "Owning only one tech stock is dangerous. Owning a global stock ETF + some bonds is far more resilient to a single company or sector collapse.",
        advantages: [
            "Reduces the damage from any single failure",
            "Makes outcomes more predictable over time",
            "Helps investors stay invested during crashes",
            "Can improve risk-adjusted returns"
        ],
        risks: [
            "Over-diversification can dilute returns",
            "Everything can still fall in a systemic crisis",
            "False diversification (many funds that own the same things)",
            "Can hide underperforming holdings"
        ],
        mistakes: [
            "Owning 20 funds that all track similar markets",
            "Diversifying only within one country or sector",
            "Adding complex products just for the sake of it",
            "Abandoning diversification after a hot streak in one asset"
        ],
        consequences: "Concentrated portfolios can produce spectacular gains — and spectacular, life-changing losses. Most people are not prepared for the latter.",
        keyTerms: [
            { term: "Asset allocation", def: "How money is split between stocks, bonds, cash, etc." },
            { term: "Correlation", def: "How similarly two assets move together." },
            { term: "Rebalancing", def: "Periodically returning the portfolio to target weights." },
            { term: "Home bias", def: "The tendency to invest mostly in one’s own country." }
        ]
    },

    "credit-debt": {
        what: "Credit is the ability to borrow money. Debt is the obligation to repay what was borrowed, usually with interest.",
        how: "Lenders assess your ability to repay (income, credit history, collateral). They charge interest for the risk and the time value of money. Debt can be used productively or destructively.",
        who: "Used by individuals (mortgages, cars, credit cards), companies (loans, bonds), and governments.",
        why: "Debt can accelerate progress when used to buy productive assets. It becomes dangerous when used for consumption or when the cost exceeds the benefit.",
        example: "A mortgage at a reasonable rate used to buy a home you can afford can be useful. Credit-card debt at 20%+ used for lifestyle spending usually destroys wealth.",
        advantages: [
            "Allows large purchases without waiting decades",
            "Can finance education or business growth",
            "Mortgage interest may have tax advantages in some countries",
            "Builds credit history when managed well"
        ],
        risks: [
            "High interest compounds against you",
            "Variable rates can rise",
            "Over-indebtedness leads to stress and default",
            "Easy credit encourages overspending"
        ],
        mistakes: [
            "Using high-interest consumer debt for lifestyle",
            "Only paying minimum payments on credit cards",
            "Ignoring the total cost of the loan",
            "Taking debt without an emergency fund"
        ],
        consequences: "Chronic high-interest debt is one of the fastest ways ordinary people stay poor. It transfers wealth from the borrower to the lender every month.",
        keyTerms: [
            { term: "APR", def: "Annual Percentage Rate — the true yearly cost of borrowing." },
            { term: "Principal", def: "The original amount borrowed." },
            { term: "Collateral", def: "An asset pledged to secure a loan." },
            { term: "Default", def: "Failure to meet the repayment terms." }
        ]
    },

    "mortgages": {
        what: "A mortgage is a long-term loan used to buy property, where the property itself serves as collateral.",
        how: "You borrow a large sum, make monthly payments of principal + interest over many years (often 15–30). If you stop paying, the lender can take the property.",
        who: "Used by home buyers, real-estate investors, and banks as one of their core products.",
        why: "Most people cannot buy a home with cash. Mortgages make home ownership accessible, but they also create long-term obligations.",
        example: "A $250,000 mortgage at 5% over 30 years has much higher total interest cost than the same loan over 15 years. The monthly payment is lower on 30 years, but the total cost is higher.",
        advantages: [
            "Enables home ownership",
            "Fixed-rate mortgages provide payment certainty",
            "Can build equity over time",
            "Inflation can reduce the real value of fixed debt"
        ],
        risks: [
            "Large long-term commitment",
            "Variable rates can increase payments",
            "Negative equity if house prices fall",
            "Foreclosure risk if you cannot pay"
        ],
        mistakes: [
            "Buying the maximum the bank will lend",
            "Ignoring total interest cost",
            "Choosing variable rates without a buffer",
            "Underestimating maintenance, taxes and insurance"
        ],
        consequences: "Overstretching on a mortgage is a common cause of financial stress. A house is both a place to live and a large leveraged financial position.",
        keyTerms: [
            { term: "LTV", def: "Loan-to-Value — loan amount divided by property value." },
            { term: "Amortization", def: "The schedule of principal repayment over time." },
            { term: "Fixed vs variable", def: "Whether the interest rate stays the same or can change." },
            { term: "Equity", def: "The portion of the property you own (value minus mortgage)." }
        ]
    },

    "crypto": {
        what: "Cryptocurrencies are digital assets that use cryptography and distributed ledgers (blockchains). Bitcoin is the largest and best-known example.",
        how: "Transactions are recorded on a public ledger maintained by a network. Some crypto assets aim to be money, others are tied to applications or speculation.",
        who: "Used by traders, technologists, some companies, and speculative investors. Adoption as everyday money remains limited in most countries.",
        why: "Crypto offers a new technological approach to money and ownership records, but most activity is still driven by speculation rather than fundamental cash flows.",
        example: "Bitcoin has no company earnings or dividends. Its price is driven by supply, demand, narratives, and liquidity. Many tokens have fallen 80–90% from peaks.",
        advantages: [
            "Global, 24/7 transferability",
            "Some censorship resistance",
            "Programmable money and new application designs",
            "Potential diversification for a small portfolio slice"
        ],
        risks: [
            "Extreme volatility",
            "Many projects fail or are scams",
            "Regulatory uncertainty",
            "No intrinsic cash-flow in most cases",
            "Custody and hacking risks"
        ],
        mistakes: [
            "Investing money you cannot afford to lose",
            "Believing every new token will ‘go to the moon’",
            "Ignoring security (exchanges, seed phrases)",
            "Confusing technology potential with guaranteed investment returns"
        ],
        consequences: "Many retail participants enter near the top of cycles and experience large permanent losses. Speculation without position sizing is dangerous.",
        keyTerms: [
            { term: "Blockchain", def: "A distributed ledger of transactions." },
            { term: "Wallet", def: "Software or device that holds the keys to your crypto." },
            { term: "Stablecoin", def: "A crypto token designed to maintain a stable value, usually pegged to a currency." },
            { term: "Volatility", def: "Crypto prices can move dramatically in short periods." }
        ]
    },

    "billionaire-wealth": {
        what: "Most large fortunes are built through ownership of valuable businesses or assets that grow for decades, often combined with leverage and retained ownership.",
        how: "Founders keep significant equity. Businesses scale. Public markets or private valuations rise. Wealth compounds through ownership rather than salary.",
        who: "Entrepreneurs, early employees with equity, investors in high-growth companies, and operators who build cash-flowing businesses.",
        why: "Understanding this shows why ‘getting a higher salary’ is rarely the path to extreme wealth — ownership is.",
        example: "A founder who owns 20% of a company that becomes worth $10 billion has $2 billion. An employee with a high salary but no equity rarely reaches the same outcome.",
        advantages: [
            "Ownership scales better than time-for-money work",
            "Businesses can compound for decades",
            "Public markets provide liquidity events",
            "Equity aligns incentives with growth"
        ],
        risks: [
            "Most startups fail",
            "Concentration risk is extreme",
            "Illiquidity for long periods",
            "Regulatory, competitive and execution risks"
        ],
        mistakes: [
            "Assuming salary alone creates generational wealth",
            "Selling equity too early without a plan",
            "Ignoring dilution and governance",
            "Copying lifestyle without copying ownership"
        ],
        consequences: "People who focus only on income and consumption rarely accumulate the kind of capital that appears on billionaire lists. Ownership and time are the core ingredients.",
        keyTerms: [
            { term: "Equity", def: "Ownership stake in a business." },
            { term: "Dilution", def: "Reduction in ownership percentage when new shares are issued." },
            { term: "Liquidity event", def: "IPO, acquisition or secondary sale that turns equity into cash." },
            { term: "Retained ownership", def: "Keeping a meaningful stake as the company grows." }
        ]
    },

    "psychology": {
        what: "Investing is not only about numbers. Human psychology — fear, greed, overconfidence, herd behavior — often determines results more than spreadsheets.",
        how: "Markets are made of people. When prices rise, FOMO increases buying. When prices crash, panic increases selling. These patterns repeat across decades.",
        who: "Affects every investor, from beginners to professionals. The difference is how well the behavior is controlled.",
        why: "Most large investment mistakes are emotional, not mathematical. Understanding your own reactions is a competitive advantage.",
        example: "Many investors buy aggressively after big gains and sell after big losses — the opposite of a rational long-term approach. This behavior reliably destroys returns.",
        advantages: [
            "Self-awareness improves decision quality",
            "Rules and systems reduce emotional errors",
            "Understanding cycles prevents panic",
            "Patience becomes easier when you expect volatility"
        ],
        risks: [
            "FOMO and greed at market tops",
            "Panic selling at bottoms",
            "Overconfidence after a winning streak",
            "Confirmation bias — only seeing information that supports your view"
        ],
        mistakes: [
            "Checking prices constantly",
            "Changing strategy after every market move",
            "Following social media tips without process",
            "Believing ‘this time is different’ without evidence"
        ],
        consequences: "Behavioral mistakes are one of the main reasons average investors underperform the very funds and indexes they invest in.",
        keyTerms: [
            { term: "FOMO", def: "Fear Of Missing Out — buying because others are getting rich." },
            { term: "Loss aversion", def: "Losses feel more painful than equivalent gains feel good." },
            { term: "Herding", def: "Following the crowd instead of independent analysis." },
            { term: "Recency bias", def: "Overweighting recent events when making decisions." }
        ]
    }
};


const FREE_LEARN_IDS = ["stock-market", "stocks", "inflation", "compound-interest", "risk"];
function isLearnTopicFree(id) { return FREE_LEARN_IDS.includes(id); }

function renderLearn() {

    const container =
        document.getElementById(
            "learnTopics"
        );

    if (!container) {
        return;
    }

    container.innerHTML =
        LEARN_TOPICS
            .map(
                topic => `
            <button class="learn-card" onclick="openLearnTopic('${topic.id}')">
                <div class="learn-card-icon">${topic.icon}</div>
                <div class="learn-card-body">
                    <span class="learn-card-label">${escapeHTML(topic.label)}</span>
                    <strong>${escapeHTML(topic.title)}</strong>
                    <p>${escapeHTML(topic.summary)}</p>
                </div>
                <div class="learn-card-arrow">→</div>
            </button>
        `
            )
            .join("");


    const calcBox =
        document.getElementById(
            "learnCalculators"
        );

    if (calcBox) {

        calcBox.innerHTML = `
            <div class="calc-grid">
                <button class="calc-card" onclick="openCalculator('compound')">
                    <strong>Compound Interest</strong>
                    <span>See how money grows over time</span>
                </button>
                <button class="calc-card" onclick="openCalculator('inflation')">
                    <strong>Inflation</strong>
                    <span>What your money will be worth later</span>
                </button>
                <button class="calc-card" onclick="openCalculator('loan')">
                    <strong>Loan / Debt</strong>
                    <span>Estimate monthly payments</span>
                </button>
            </div>
            <p class="calc-note">More calculators coming soon.</p>
        `;
    }
}


function openLearnTopic(id) {

    const topic =
        LEARN_TOPICS.find(
            t => t.id === id
        );

    const content =
        LEARN_CONTENT[id];

    if (!topic || !content) {
        return;
    }

    if (!canAccessPremiumContent() && !isLearnTopicFree(id)) {
        const labelEl = document.getElementById("learnTopicLabel");
        const titleEl = document.getElementById("learnTopicTitle");
        const body = document.getElementById("learnTopicContent");
        if (labelEl) labelEl.textContent = topic.label;
        if (titleEl) titleEl.textContent = topic.title;
        if (body) {
            body.innerHTML = '<div class="paywall-box"><h3>Premium topic</h3><p>This lesson is available with WorldElite Premium.</p><div class="hero-actions"><button class="primary-button" onclick="openPage(\'profilePage\')">View Premium</button><button class="secondary-button" onclick="openPage(\'learnPage\')">Back</button></div></div>';
        }
        openPage("learnTopicPage");
        return;
    }

    const labelEl =
        document.getElementById(
            "learnTopicLabel"
        );

    const titleEl =
        document.getElementById(
            "learnTopicTitle"
        );

    const body =
        document.getElementById(
            "learnTopicContent"
        );

    if (labelEl) {
        labelEl.textContent =
            topic.label;
    }

    if (titleEl) {
        titleEl.textContent =
            topic.title;
    }

    if (!body) {
        return;
    }

    body.innerHTML = `
        <div class="learn-section">
            <h3>What is it?</h3>
            <p>${escapeHTML(content.what)}</p>
        </div>

        <div class="learn-section">
            <h3>How does it work?</h3>
            <p>${escapeHTML(content.how)}</p>
        </div>

        <div class="learn-section">
            <h3>Who uses it and why?</h3>
            <p><strong>Who:</strong> ${escapeHTML(content.who)}</p>
            <p><strong>Why:</strong> ${escapeHTML(content.why)}</p>
        </div>

        <div class="learn-section">
            <h3>Example</h3>
            <p>${escapeHTML(content.example)}</p>
        </div>

        <div class="learn-section">
            <h3>Advantages</h3>
            <ul>
                ${content.advantages.map(a => `<li>${escapeHTML(a)}</li>`).join("")}
            </ul>
        </div>

        <div class="learn-section">
            <h3>Risks</h3>
            <ul>
                ${content.risks.map(r => `<li>${escapeHTML(r)}</li>`).join("")}
            </ul>
        </div>

        <div class="learn-section">
            <h3>Common mistakes</h3>
            <ul>
                ${content.mistakes.map(m => `<li>${escapeHTML(m)}</li>`).join("")}
            </ul>
        </div>

        <div class="learn-section warning">
            <h3>What happens if used incorrectly?</h3>
            <p>${escapeHTML(content.consequences)}</p>
        </div>

        <div class="learn-section">
            <h3>Key terms</h3>
            <div class="key-terms">
                ${content.keyTerms.map(k => `
                    <div class="key-term">
                        <strong>${escapeHTML(k.term)}</strong>
                        <span>${escapeHTML(k.def)}</span>
                    </div>
                `).join("")}
            </div>
        </div>
    `;

    openPage("learnTopicPage");
}


function openCalculator(type) {
    alert("Calculator \"" + type + "\" will be added in the next step.");
}

/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        openPage(
            "homePage"
        );

        loadData();

    }
);
