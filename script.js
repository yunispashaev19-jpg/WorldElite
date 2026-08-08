/* =========================================================
   WORLDELITE
   Main application
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

function firstValue(object, keys, fallback = "") {

    if (!object || typeof object !== "object") {
        return fallback;
    }

    for (const key of keys) {

        if (
            object[key] !== undefined &&
            object[key] !== null &&
            object[key] !== ""
        ) {

            return object[key];

        }

    }

    return fallback;
}


function numberValue(value) {

    if (typeof value === "number") {
        return value;
    }

    if (!value) {
        return 0;
    }

    const cleaned = String(value)
        .replace(/[$£€,\s]/g, "")
        .replace(/B$/i, "")
        .replace(/M$/i, "");

    const number = parseFloat(cleaned);

    return Number.isFinite(number)
        ? number
        : 0;
}


function money(value) {

    const n = numberValue(value);

    if (!n) {
        return "—";
    }

    if (n >= 1_000_000_000_000) {

        return (
            "$" +
            (n / 1_000_000_000_000)
                .toFixed(2) +
            "T"
        );

    }

    if (n >= 1_000_000_000) {

        return (
            "$" +
            (n / 1_000_000_000)
                .toFixed(1) +
            "B"
        );

    }

    if (n >= 1_000_000) {

        return (
            "$" +
            (n / 1_000_000)
                .toFixed(1) +
            "M"
        );

    }

    return "$" + n.toLocaleString();
}


function flag(country) {

    const map = {

        US: "🇺🇸",
        USA: "🇺🇸",
        UnitedStates: "🇺🇸",

        GB: "🇬🇧",
        UK: "🇬🇧",
        UnitedKingdom: "🇬🇧",

        FR: "🇫🇷",
        France: "🇫🇷",

        DE: "🇩🇪",
        Germany: "🇩🇪",

        IT: "🇮🇹",
        Italy: "🇮🇹",

        ES: "🇪🇸",
        Spain: "🇪🇸",

        IN: "🇮🇳",
        India: "🇮🇳",

        CN: "🇨🇳",
        China: "🇨🇳",

        JP: "🇯🇵",
        Japan: "🇯🇵",

        KR: "🇰🇷",
        Korea: "🇰🇷",

        CA: "🇨🇦",
        Canada: "🇨🇦",

        AU: "🇦🇺",
        Australia: "🇦🇺",

        MX: "🇲🇽",
        Mexico: "🇲🇽",

        BR: "🇧🇷",
        Brazil: "🇧🇷",

        RU: "🇷🇺",
        Russia: "🇷🇺",

        UA: "🇺🇦",
        Ukraine: "🇺🇦",

        TR: "🇹🇷",
        Turkey: "🇹🇷",

        AE: "🇦🇪",
        UAE: "🇦🇪",

        CH: "🇨🇭",
        Switzerland: "🇨🇭",

        SG: "🇸🇬",
        Singapore: "🇸🇬",

        ID: "🇮🇩",
        Indonesia: "🇮🇩",

        TH: "🇹🇭",
        Thailand: "🇹🇭",

        SE: "🇸🇪",
        Sweden: "🇸🇪",

        NO: "🇳🇴",
        Norway: "🇳🇴",

        NL: "🇳🇱",
        Netherlands: "🇳🇱"

    };

    return map[country] || "🌍";
}


function escapeHTML(value) {

    return String(value ?? "")

        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function getPersonName(person) {

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


function getCompanyName(company) {

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
   NORMALIZE BILLIONAIRE
========================================================= */

function normalizeBillionaire(item) {

    if (
        !item ||
        typeof item !== "object"
    ) {

        return null;

    }


    const name =
        getPersonName(item);


    const country =
        firstValue(

            item,

            [
                "country",
                "countryCode",
                "country_code",
                "citizenship",
                "location"
            ],

            "Unknown"

        );


    const wealth =
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

        );


    const biography =
        firstValue(

            item,

            [
                "biography",
                "bio",
                "description",
                "about"
            ],

            ""

        );


    const companies =
        firstValue(

            item,

            [
                "companies",
                "company",
                "businesses"
            ],

            []

        );


    const investments =
        firstValue(

            item,

            [
                "investments",
                "investment",
                "portfolio"
            ],

            []

        );


    const stakes =
        firstValue(

            item,

            [
                "stakes",
                "ownership",
                "holdings"
            ],

            []

        );


    const investmentFocus =
        firstValue(

            item,

            [
                "investmentFocus",
                "investment_focus",
                "focus",
                "sectors"
            ],

            []

        );


    const investmentWhy =
        firstValue(

            item,

            [
                "investmentWhy",
                "investment_why",
                "whyInvest",
                "investmentReason",
                "thesis"
            ],

            ""

        );


    return {

        ...item,

        name,

        country,

        netWorth:
            numberValue(wealth),

        biography,

        companies:
            Array.isArray(companies)
                ? companies
                : companies
                    ? [companies]
                    : [],

        investments:
            Array.isArray(investments)
                ? investments
                : investments
                    ? [investments]
                    : [],

        stakes:
            Array.isArray(stakes)
                ? stakes
                : stakes
                    ? [stakes]
                    : [],

        investmentFocus:
            Array.isArray(
                investmentFocus
            )
                ? investmentFocus
                : investmentFocus
                    ? [investmentFocus]
                    : [],

        investmentWhy

    };

}


/* =========================================================
   NORMALIZE COMPANY
========================================================= */

function normalizeCompany(item) {

    if (
        !item ||
        typeof item !== "object"
    ) {

        return null;

    }


    const name =
        getCompanyName(item);


    const country =
        firstValue(

            item,

            [
                "country",
                "countryCode",
                "country_code",
                "headquartersCountry",
                "location"
            ],

            "Unknown"

        );


    const revenue =
        firstValue(

            item,

            [
                "revenue",
                "annualRevenue",
                "annual_revenue",
                "sales"
            ],

            0

        );


    const profit =
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

        );


    const grossProfit =
        firstValue(

            item,

            [
                "grossProfit",
                "gross_profit"
            ],

            0

        );


    return {

        ...item,

        name,

        country,

        revenue:
            numberValue(revenue),

        profit:
            numberValue(profit),

        grossProfit:
            numberValue(grossProfit),

        biography:
            firstValue(
                item,
                [
                    "biography",
                    "bio",
                    "description",
                    "about"
                ],
                ""
            ),

        investments:
            Array.isArray(
                item.investments
            )
                ? item.investments
                : [],

        stakes:
            Array.isArray(
                item.stakes
            )
                ? item.stakes
                : []

    };

}


/* =========================================================
   LOAD DATA
========================================================= */

async function loadData() {

    try {

        const response =
            await fetch(
                "data.json?cache=" +
                Date.now(),
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Could not load data.json"
            );

        }


        const raw =
            await response.json();


        let billionaires = [];
        let companies = [];


        if (Array.isArray(raw)) {

            billionaires = raw;

        } else {

            billionaires =
                raw.billionaires ||
                raw.Billionaires ||
                raw.people ||
                [];

            companies =
                raw.companies ||
                raw.Companies ||
                raw.businesses ||
                [];

        }


        if (
            !Array.isArray(
                billionaires
            )
        ) {

            billionaires = [];

        }


        if (
            !Array.isArray(
                companies
            )
        ) {

            companies = [];

        }


        state.billionaires =
            billionaires

                .map(
                    normalizeBillionaire
                )

                .filter(Boolean);


        state.companies =
            companies

                .map(
                    normalizeCompany
                )

                .filter(Boolean);


        state.lastUpdated =
            new Date();


        state.filteredBillionaires =
            [...state.billionaires];


        state.filteredCompanies =
            [...state.companies];


        buildCountryFilter();

        renderHome();

        renderRankings();

        renderCompanies();

        renderWorldBests();

        renderInvestments();


        console.log(
            "WorldElite loaded:",
            state.billionaires.length,
            "billionaires;",
            state.companies.length,
            "companies"
        );


    } catch (error) {

        console.error(error);

        showDataError(
            error.message
        );

    }

}


/* =========================================================
   ERROR
========================================================= */

function showDataError(message) {

    const home =
        document.getElementById(
            "homeBillionaires"
        );


    if (!home) {
        return;
    }


    home.innerHTML = `

        <div class="error-card">

            <strong>
                Data could not be loaded.
            </strong>

            <p>
                ${escapeHTML(message)}
            </p>

            <button
                class="primary-button"
                onclick="refreshData()"
            >
                Try again
            </button>

        </div>

    `;

}


/* =========================================================
   NAVIGATION
========================================================= */

function openPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.add(
                "hidden"
            );

        });


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
        "companiesPage"
    ) {

        renderCompanies();

    }


    if (
        pageId ===
        "rankingsPage"
    ) {

        renderRankings();

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

}


/* =========================================================
   NAVIGATION
========================================================= */

function updateNavigation(pageId) {

    document
        .querySelectorAll(".nav")
        .forEach(button => {

            button.classList.remove(
                "active"
            );

        });


    const map = {

        homePage:
            "navHome",

        rankingsPage:
            "navRankings",

        companiesPage:
            "navCompanies",

        bestsPage:
            "navBests",

        investmentsPage:
            "navInvestments",

        profilePage:
            "navProfile"

    };


    const navId =
        map[pageId];


    if (!navId) {
        return;
    }


    document
        .getElementById(navId)
        ?.classList.add(
            "active"
        );

}


/* =========================================================
   HOME
========================================================= */

function renderHome() {

    document
        .getElementById(
            "homeBillionaireCount"
        )
        ?.replaceChildren(
            document.createTextNode(
                state.billionaires.length
                    .toLocaleString()
            )
        );


    document
        .getElementById(
            "homeCompanyCount"
        )
        ?.replaceChildren(
            document.createTextNode(
                state.companies.length
                    .toLocaleString()
            )
        );


    renderHomeBillionaires();

    renderHomeCompanies();

}


/* =========================================================
   HOME BILLIONAIRES
========================================================= */

function renderHomeBillionaires() {

    const container =
        document.getElementById(
            "homeBillionaires"
        );


    if (!container) {
        return;
    }


    const people =
        [...state.billionaires]

            .sort(
                (a, b) =>
                    b.netWorth -
                    a.netWorth
            )

            .slice(0, 5);


    container.innerHTML =
        people

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
   HOME COMPANIES
========================================================= */

function renderHomeCompanies() {

    const container =
        document.getElementById(
            "homeCompanies"
        );


    if (!container) {
        return;
    }


    const companies =
        [...state.companies]

            .sort(
                (a, b) =>
                    b.revenue -
                    a.revenue
            )

            .slice(0, 5);


    if (!companies.length) {

        container.innerHTML = `

            <div class="empty-card">

                <strong>
                    Company data unavailable
                </strong>

            </div>

        `;

        return;
    }


    container.innerHTML =
        companies

            .map(
                (company, index) =>
                    companyCard(
                        company,
                        index + 1
                    )
            )

            .join("");

}


/* =========================================================
   BILLIONAIRE CARD
========================================================= */

function billionaireCard(
    person,
    rank
) {

    const index =
        state.billionaires
            .indexOf(person);


    return `

        <button
            class="person-card"
            onclick="openPerson(${index})"
        >

            <div class="rank">
                ${rank}
            </div>

            <div class="avatar">
                👤
            </div>

            <div class="person-info">

                <strong>
                    ${escapeHTML(
                        person.name
                    )}
                </strong>

                <span>
                    ${flag(
                        person.country
                    )}

                    ${escapeHTML(
                        person.country
                    )}
                </span>

            </div>

            <div class="wealth">

                ${money(
                    person.netWorth
                )}

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
        state.companies
            .indexOf(company);


    return `

        <button
            class="company-card"
            onclick="openCompany(${index})"
        >

            <div class="company-rank">
                ${rank}
            </div>

            <div class="company-logo">
                🏢
            </div>

            <div class="company-info">

                <strong>
                    ${escapeHTML(
                        company.name
                    )}
                </strong>

                <span>

                    ${flag(
                        company.country
                    )}

                    ${escapeHTML(
                        company.country
                    )}

                </span>

            </div>

            <div class="company-revenue">

                <small>
                    Revenue
                </small>

                <strong>
                    ${
                        company.revenue
                            ? money(
                                company.revenue
                            )
                            : "—"
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


    const searchInput =
        document.getElementById(
            "globalSearchInput"
        );


    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const country =
        document.getElementById(
            "countryFilter"
        )?.value ||
        "all";


    if (search) {

        list =
            list.filter(
                person =>
                    person.name
                        .toLowerCase()
                        .includes(
                            search
                        )
            );

    }


    if (country !== "all") {

        list =
            list.filter(
                person =>
                    String(
                        person.country
                    ).toLowerCase() ===
                    String(
                        country
                    ).toLowerCase()
            );

    }


    list.sort(
        (a, b) => {

            if (
                state.billionaireSort ===
                "lowest"
            ) {

                return (
                    a.netWorth -
                    b.netWorth
                );

            }

            return (
                b.netWorth -
                a.netWorth
            );

        }
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


    if (!list.length) {

        container.innerHTML = `

            <div class="empty-card">

                <strong>
                    No billionaires found
                </strong>

            </div>

        `;

        return;
    }


    container.innerHTML =
        list

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
   SEARCH
========================================================= */

function handleGlobalSearch() {

    renderRankings();

}


/* =========================================================
   SORT BILLIONAIRES
========================================================= */

function sortBillionaires(order) {

    state.billionaireSort =
        order;


    document
        .getElementById(
            "highestButton"
        )
        ?.classList.toggle(
            "active",
            order === "highest"
        );


    document
        .getElementById(
            "lowestButton"
        )
        ?.classList.toggle(
            "active",
            order === "lowest"
        );


    renderRankings();

}


/* =========================================================
   COUNTRY FILTER
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
        [
            ...new Set(

                state.billionaires

                    .map(
                        person =>
                            person.country
                    )

                    .filter(
                        country =>
                            country &&
                            country !==
                            "Unknown"
                    )

            )
        ]

        .sort(
            (a, b) =>
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

}


function filterBillionaires() {

    renderRankings();

}


/* =========================================================
   DETAIL LIST
========================================================= */

function renderInvestmentList(
    list
) {

    if (
        !Array.isArray(list) ||
        !list.length
    ) {

        return "";

    }


    return `

        <div class="detail-list">

            ${
                list.map(
                    item => {

                        if (
                            typeof item ===
                            "string"
                        ) {

                            return `

                                <div
                                    class="detail-row"
                                >

                                    <strong>
                                        ${escapeHTML(
                                            item
                                        )}
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

                            <div
                                class="detail-row"
                            >

                                <strong>
                                    ${escapeHTML(
                                        name
                                    )}
                                </strong>

                                ${
                                    amount
                                        ? `
                                            <span>
                                                ${escapeHTML(
                                                    amount
                                                )}
                                            </span>
                                          `
                                        : ""
                                }

                                ${
                                    reason
                                        ? `
                                            <p>
                                                ${escapeHTML(
                                                    reason
                                                )}
                                            </p>
                                          `
                                        : ""
                                }

                            </div>

                        `;

                    }
                ).join("")
            }

        </div>

    `;

}


/* =========================================================
   PROFILE: INVESTMENT FOCUS
========================================================= */

function renderInvestmentFocus(
    person
) {

    const focus =
        Array.isArray(
            person.investmentFocus
        )
            ? person.investmentFocus
            : [];


    if (!focus.length) {

        return `

            <p class="muted">

                Verified investment-focus
                information is not available
                in the current dataset.

            </p>

        `;

    }


    return `

        <div class="focus-grid">

            ${
                focus.map(
                    item => `

                        <div
                            class="focus-chip"
                        >

                            ${escapeHTML(
                                item
                            )}

                        </div>

                    `
                ).join("")
            }

        </div>

    `;

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


    const companiesHTML =
        renderInvestmentList(
            person.companies
        );


    const investmentsHTML =
        renderInvestmentList(
            person.investments
        );


    const stakesHTML =
        renderInvestmentList(
            person.stakes
        );


    content.innerHTML = `

        <div class="profile-hero">

            <div class="large-avatar">
                👤
            </div>

            <div class="profile-country">

                ${flag(
                    person.country
                )}

                ${escapeHTML(
                    person.country
                )}

            </div>

            <h2>
                ${escapeHTML(
                    person.name
                )}
            </h2>

            <div class="profile-worth">

                ${money(
                    person.netWorth
                )}

            </div>

            <span>
                Estimated Net Worth
            </span>

        </div>


        <!-- =========================================
             BIOGRAPHY
        ========================================== -->

        <div class="info-card">

            <h3>
                Biography
            </h3>

            <p>

                ${
                    escapeHTML(

                        person.biography ||

                        "Biography information is not available yet."

                    )
                }

            </p>

            ${
                person.biographySource
                    ? `
                        <small class="muted">
                            Source:
                            ${escapeHTML(
                                person.biographySource
                            )}
                        </small>
                      `
                    : ""
            }

        </div>


        <!-- =========================================
             COMPANIES
        ========================================== -->

        <div class="info-card">

            <h3>
                🏢 Companies
            </h3>

            ${
                companiesHTML ||

                `
                    <p class="muted">
                        No company information
                        available.
                    </p>
                `
            }

        </div>


        <!-- =========================================
             INVESTMENT FOCUS
        ========================================== -->

        <div class="info-card">

            <h3>
                🎯 Investment Focus
            </h3>

            ${renderInvestmentFocus(
                person
            )}

        </div>


        <!-- =========================================
             WHY
        ========================================== -->

        <div class="info-card">

            <h3>
                💡 Why invest in these areas?
            </h3>

            ${
                person.investmentWhy

                    ? `
                        <p>
                            ${escapeHTML(
                                person.investmentWhy
                            )}
                        </p>
                      `

                    : `

                        <p class="muted">

                            A verified investment
                            rationale is not available
                            in the current dataset.

                        </p>

                      `
            }

        </div>


        <!-- =========================================
             PORTFOLIO
        ========================================== -->

        <div class="info-card">

            <h3>
                ↗ Investments
            </h3>

            ${
                investmentsHTML ||

                `
                    <p class="muted">

                        No verified investment
                        portfolio data is available
                        for this person yet.

                    </p>
                `
            }

        </div>


        <!-- =========================================
             OWNERSHIP
        ========================================== -->

        <div class="info-card">

            <h3>
                📊 Stakes & Ownership
            </h3>

            ${
                stakesHTML ||

                `
                    <p class="muted">

                        No verified ownership
                        information is available.

                    </p>
                `
            }

        </div>

    `;


    openPage(
        "personPage"
    );

}


/* =========================================================
   COMPANIES
========================================================= */

function renderCompanies() {

    let list =
        [...state.companies];


    const input =
        document.getElementById(
            "companySearchInput"
        );


    const search =
        input

            ? input.value
                .trim()
                .toLowerCase()

            : "";


    if (search) {

        list =
            list.filter(
                company =>
                    company.name
                        .toLowerCase()
                        .includes(
                            search
                        )
            );

    }


    if (
        state.companySort ===
        "profit"
    ) {

        list.sort(
            (a, b) =>
                b.profit -
                a.profit
        );

    }

    else if (
        state.companySort ===
        "name"
    ) {

        list.sort(
            (a, b) =>
                a.name.localeCompare(
                    b.name
                )
        );

    }

    else {

        list.sort(
            (a, b) =>
                b.revenue -
                a.revenue
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


    if (!list.length) {

        container.innerHTML = `

            <div class="empty-card">

                <strong>
                    No companies found
                </strong>

            </div>

        `;

        return;
    }


    container.innerHTML =
        list

            .map(
                (company, index) =>
                    companyCard(
                        company,
                        index + 1
                    )
            )

            .join("");

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

        <div class="profile-hero company-profile">

            <div class="large-avatar">
                🏢
            </div>

            <div class="profile-country">

                ${flag(
                    company.country
                )}

                ${escapeHTML(
                    company.country
                )}

            </div>

            <h2>
                ${escapeHTML(
                    company.name
                )}
            </h2>

            <div class="profile-worth">

                ${
                    company.revenue
                        ? money(
                            company.revenue
                        )
                        : "—"
                }

            </div>

            <span>
                Annual Revenue
            </span>

        </div>


        <div class="financial-grid">

            <div class="financial-card">

                <small>
                    Revenue
                </small>

                <strong>

                    ${
                        company.revenue
                            ? money(
                                company.revenue
                            )
                            : "—"
                    }

                </strong>

            </div>


            <div class="financial-card">

                <small>
                    Net Profit
                </small>

                <strong>

                    ${
                        company.profit
                            ? money(
                                company.profit
                            )
                            : "—"
                    }

                </strong>

            </div>


            <div class="financial-card">

                <small>
                    Gross Profit
                </small>

                <strong>

                    ${
                        company.grossProfit
                            ? money(
                                company.grossProfit
                            )
                            : "—"
                    }

                </strong>

            </div>

        </div>


        <div class="info-card">

            <h3>
                Company Biography
            </h3>

            <p>

                ${
                    escapeHTML(

                        company.biography ||

                        "Company biography is not available yet."

                    )
                }

            </p>

        </div>


        <div class="info-card">

            <h3>
                ↗ Investments
            </h3>

            ${
                renderInvestmentList(
                    company.investments
                )

                ||

                `
                    <p class="muted">

                        Company investment
                        information is not available
                        in the current dataset.

                    </p>
                `
            }

        </div>


        <div class="info-card">

            <h3>
                📊 Stakes & Ownership
            </h3>

            ${
                renderInvestmentList(
                    company.stakes
                )

                ||

                `
                    <p class="muted">

                        Ownership information
                        is not available.

                    </p>
                `
            }

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
                (a, b) =>
                    b.netWorth -
                    a.netWorth
            )

            .slice(0, 10);


    const companies =
        [...state.companies]

            .sort(
                (a, b) =>
                    b.revenue -
                    a.revenue
            )

            .slice(0, 10);


    container.innerHTML = `

        <div class="info-card">

            <h3>
                👑 World's Richest
            </h3>

            ${
                richest.map(
                    (person, index) => `

                        <button
                            class="mini-row"
                            onclick="openPerson(
                                ${state.billionaires.indexOf(
                                    person
                                )}
                            )"
                        >

                            <span>
                                ${index + 1}
                            </span>

                            <strong>
                                ${escapeHTML(
                                    person.name
                                )}
                            </strong>

                            <b>
                                ${money(
                                    person.netWorth
                                )}
                            </b>

                        </button>

                    `
                ).join("")
            }

        </div>


        <div class="info-card">

            <h3>
                🏢 Leading Companies
            </h3>

            ${
                companies.map(
                    (company, index) => `

                        <button
                            class="mini-row"
                            onclick="openCompany(
                                ${state.companies.indexOf(
                                    company
                                )}
                            )"
                        >

                            <span>
                                ${index + 1}
                            </span>

                            <strong>
                                ${escapeHTML(
                                    company.name
                                )}
                            </strong>

                            <b>
                                ${
                                    company.revenue
                                        ? money(
                                            company.revenue
                                        )
                                        : "—"
                                }
                            </b>

                        </button>

                    `
                ).join("")
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

                    (
                        person.investments &&
                        person.investments.length
                    )

                    ||

                    (
                        person.investmentFocus &&
                        person.investmentFocus.length
                    )
            )

            .slice(0, 30);


    container.innerHTML = `

        <div class="info-card">

            <h3>
                ↗ Billionaire Investments
            </h3>

            <p class="muted">

                WorldElite shows verified
                investment information when
                it is available in the dataset.

            </p>

        </div>


        ${
            people.length

                ? people.map(
                    person => `

                        <div class="info-card">

                            <h3>
                                ${escapeHTML(
                                    person.name
                                )}
                            </h3>

                            ${
                                renderInvestmentFocus(
                                    person
                                )
                            }

                            ${
                                person.investmentWhy

                                    ? `
                                        <p>
                                            ${escapeHTML(
                                                person.investmentWhy
                                            )}
                                        </p>
                                      `

                                    : ""
                            }

                            ${
                                renderInvestmentList(
                                    person.investments
                                )
                            }

                        </div>

                    `
                ).join("")

                : `

                    <div class="empty-card">

                        Investment portfolio
                        data is currently unavailable.

                    </div>

                  `
        }

    `;

}


/* =========================================================
   INVESTMENT TAB
========================================================= */

function showInvestmentTab(type) {

    document
        .querySelectorAll(
            ".investment-tabs .tab"
        )
        .forEach(
            button => {

                button.classList.remove(
                    "active"
                );

            }
        );


    if (
        typeof event !==
        "undefined" &&
        event?.currentTarget
    ) {

        event.currentTarget
            .classList.add(
                "active"
            );

    }


    if (
        type ===
        "companies"
    ) {

        const container =
            document.getElementById(
                "investmentsContent"
            );


        if (!container) {
            return;
        }


        const companies =
            state.companies
                .filter(
                    company =>
                        company.investments &&
                        company.investments.length
                );


        container.innerHTML =

            companies.length

                ? companies.map(
                    company => `

                        <div
                            class="info-card"
                        >

                            <h3>

                                🏢
                                ${escapeHTML(
                                    company.name
                                )}

                            </h3>

                            ${
                                renderInvestmentList(
                                    company.investments
                                )
                            }

                        </div>

                    `
                ).join("")

                : `

                    <div class="empty-card">

                        Company investment
                        data is currently unavailable.

                    </div>

                  `;

        return;

    }


    renderInvestments();

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

            button.disabled =
                true;

            button.classList.add(
                "loading"
            );

            button.textContent =
                "↻ Updating...";

        }
    );


    try {

        await loadData();

    }

    finally {

        buttons.forEach(
            button => {

                button.disabled =
                    false;

                button.classList.remove(
                    "loading"
                );

                button.textContent =
                    "↻ Refresh Data";

            }
        );

    }

}


/* =========================================================
   AUTH
========================================================= */

function showLogin() {

    openPage(
        "loginPage"
    );

}


function showSignup() {

    openPage(
        "signupPage"
    );

}


function loginUser(event) {

    event.preventDefault();


    const email =
        document.getElementById(
            "loginEmail"
        ).value.trim();


    if (!email) {
        return;
    }


    localStorage.setItem(

        "worldelite_user",

        JSON.stringify({
            email
        })

    );


    alert(
        "Login saved locally for this demo."
    );


    openPage(
        "profilePage"
    );

}


function signupUser(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "signupName"
        ).value.trim();


    const email =
        document.getElementById(
            "signupEmail"
        ).value.trim();


    if (!name || !email) {
        return;
    }


    localStorage.setItem(

        "worldelite_user",

        JSON.stringify({
            name,
            email
        })

    );


    alert(
        "Account created locally for this demo."
    );


    openPage(
        "profilePage"
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
