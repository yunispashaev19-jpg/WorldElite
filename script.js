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

    openPage(
        "profilePage"
    );
}


function renderProfile() {

    const container =
        document.getElementById(
            "profileContent"
        );

    if (!container) {
        return;
    }


    const stored =
        localStorage.getItem(
            "worldelite_user"
        );


    if (!stored) {

        container.innerHTML = `

            <div class="info-card">

                <h3>Welcome to WorldElite</h3>

                <p>
                    Login or create an account to
                    personalize your experience.
                </p>

                <div class="hero-actions">

                    <button
                        class="primary-button"
                        onclick="showLogin()"
                    >
                        Login
                    </button>

                    <button
                        class="secondary-button"
                        onclick="showSignup()"
                    >
                        Sign Up
                    </button>

                </div>

            </div>
        `;

        return;
    }


    let user;

    try {
        user = JSON.parse(stored);
    } catch {
        user = {};
    }


    container.innerHTML = `

        <div class="profile-hero">

            <div class="large-avatar">
                ◉
            </div>

            <h2>
                ${escapeHTML(
                    user.name ||
                    user.email ||
                    "WorldElite User"
                )}
            </h2>

            ${
                user.email
                    ? `
                        <p>
                            ${escapeHTML(user.email)}
                        </p>
                    `
                    : ""
            }

        </div>


        <div class="info-card">

            <h3>Your WorldElite account</h3>

            <p>
                Your account is currently stored
                locally on this device.
            </p>

            <div class="hero-actions">

                <button
                    class="secondary-button"
                    onclick="logoutUser()"
                >
                    Logout
                </button>

            </div>

        </div>
    `;
}


function logoutUser() {

    localStorage.removeItem(
        "worldelite_user"
    );

    renderProfile();

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


/* =========================================================
   EMPTY / ERROR
========================================================= */

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

document.addEventListener(
    "DOMContentLoaded",
    () => {

        openPage(
            "homePage"
        );

        loadData();

    }
);