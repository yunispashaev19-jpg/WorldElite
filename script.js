// WorldElite — script.js

const DATA_URL = "data.json";

let data = {
    billionaires: [],
    companies: [],
    countries: []
};

let currentSection = "billionaires";
let searchQuery = "";

document.addEventListener("DOMContentLoaded", () => {
    loadData();
    setupNavigation();
    setupSearch();
});

async function loadData() {
    try {
        const response = await fetch(DATA_URL);

        if (!response.ok) {
            throw new Error("data.json not found");
        }

        data = await response.json();

        if (!Array.isArray(data.billionaires)) data.billionaires = [];
        if (!Array.isArray(data.companies)) data.companies = [];
        if (!Array.isArray(data.countries)) data.countries = [];

        showBillionaires();

    } catch (error) {
        console.error(error);

        const container = getMainContainer();

        if (container) {
            container.innerHTML = `
                <div class="error-box">
                    <h2>WorldElite</h2>
                    <p>Data could not be loaded.</p>
                    <button onclick="loadData()">Retry</button>
                </div>
            `;
        }
    }
}

function getMainContainer() {
    return (
        document.querySelector("#content") ||
        document.querySelector("#main-content") ||
        document.querySelector("main") ||
        document.querySelector(".content")
    );
}

function setupNavigation() {
    document.addEventListener("click", (event) => {
        const button = event.target.closest("[data-section]");

        if (!button) return;

        const section = button.dataset.section;

        if (section === "billionaires") {
            showBillionaires();
        }

        if (section === "companies") {
            showCompanies();
        }

        if (section === "countries") {
            showCountries();
        }
    });
}

function setupSearch() {
    const search =
        document.querySelector("#search") ||
        document.querySelector("#searchInput") ||
        document.querySelector('input[type="search"]');

    if (!search) return;

    search.addEventListener("input", () => {
        searchQuery = search.value.toLowerCase().trim();

        if (currentSection === "billionaires") {
            showBillionaires();
        }

        if (currentSection === "companies") {
            showCompanies();
        }

        if (currentSection === "countries") {
            showCountries();
        }
    });
}

function showBillionaires() {
    currentSection = "billionaires";

    let people = [...data.billionaires];

    if (searchQuery) {
        people = people.filter(person => {
            return JSON.stringify(person)
                .toLowerCase()
                .includes(searchQuery);
        });
    }

    people.sort((a, b) => {
        return getNumber(b.netWorth) - getNumber(a.netWorth);
    });

    render(`
        <section class="worldelite-section">

            <div class="section-header">
                <div>
                    <h1>World's Billionaires</h1>
                    <p>Global wealth rankings</p>
                </div>

                <div class="section-count">
                    ${people.length}
                </div>
            </div>

            <div class="cards">
                ${
                    people.length
                        ? people.map((person, index) =>
                            billionaireCard(person, index)
                        ).join("")
                        : emptyMessage("No billionaires found")
                }
            </div>

        </section>
    `);
}

function billionaireCard(person, index) {
    const name =
        person.name ||
        person.fullName ||
        "Unknown";

    const netWorth =
        person.netWorth ??
        person.wealth ??
        person.value ??
        0;

    const change =
        person.change ??
        person.dailyChange ??
        person.changePercent ??
        "";

    const company =
        person.company ||
        person.companies ||
        "";

    const country =
        person.country ||
        person.nationality ||
        "";

    const image =
        person.image ||
        person.photo ||
        "";

    return `
        <article class="elite-card">

            <div class="rank">
                #${index + 1}
            </div>

            ${
                image
                    ? `<img src="${escapeHTML(image)}"
                            class="person-image"
                            alt="${escapeHTML(name)}"
                            onerror="this.style.display='none'">`
                    : `<div class="person-image-placeholder">
                            ${getInitials(name)}
                       </div>`
            }

            <div class="card-info">

                <h2>${escapeHTML(name)}</h2>

                <div class="wealth">
                    ${formatMoney(netWorth)}
                </div>

                ${
                    change !== ""
                        ? `<div class="change">
                            ${formatChange(change)}
                           </div>`
                        : ""
                }

                ${
                    company
                        ? `<p class="meta">
                            🏢 ${escapeHTML(company)}
                           </p>`
                        : ""
                }

                ${
                    country
                        ? `<p class="meta">
                            🌍 ${escapeHTML(country)}
                           </p>`
                        : ""
                }

            </div>

        </article>
    `;
}

function showCompanies() {
    currentSection = "companies";

    let companies = [...data.companies];

    if (searchQuery) {
        companies = companies.filter(company => {
            return JSON.stringify(company)
                .toLowerCase()
                .includes(searchQuery);
        });
    }

    render(`
        <section class="worldelite-section">

            <div class="section-header">
                <div>
                    <h1>Global Companies</h1>
                    <p>Companies and market information</p>
                </div>

                <div class="section-count">
                    ${companies.length}
                </div>
            </div>

            <div class="cards">
                ${
                    companies.length
                        ? companies.map(companyCard).join("")
                        : emptyMessage("No companies found")
                }
            </div>

        </section>
    `);
}

function companyCard(company) {
    const name =
        company.name ||
        company.company ||
        "Unknown Company";

    const value =
        company.value ??
        company.marketCap ??
        company.marketValue ??
        "";

    const country =
        company.country ||
        "";

    const sector =
        company.sector ||
        company.industry ||
        "";

    const change =
        company.change ??
        company.changePercent ??
        "";

    return `
        <article class="elite-card company-card">

            <div class="company-logo">
                ${getInitials(name)}
            </div>

            <div class="card-info">

                <h2>${escapeHTML(name)}</h2>

                ${
                    value !== ""
                        ? `<div class="wealth">
                            ${formatMoney(value)}
                           </div>`
                        : ""
                }

                ${
                    change !== ""
                        ? `<div class="change">
                            ${formatChange(change)}
                           </div>`
                        : ""
                }

                ${
                    sector
                        ? `<p class="meta">
                            📊 ${escapeHTML(sector)}
                           </p>`
                        : ""
                }

                ${
                    country
                        ? `<p class="meta">
                            🌍 ${escapeHTML(country)}
                           </p>`
                        : ""
                }

            </div>

        </article>
    `;
}

function showCountries() {
    currentSection = "countries";

    let countries = [...data.countries];

    if (searchQuery) {
        countries = countries.filter(country => {
            return JSON.stringify(country)
                .toLowerCase()
                .includes(searchQuery);
        });
    }

    render(`
        <section class="worldelite-section">

            <div class="section-header">
                <div>
                    <h1>Countries</h1>
                    <p>Global economic information</p>
                </div>

                <div class="section-count">
                    ${countries.length}
                </div>
            </div>

            <div class="cards">
                ${
                    countries.length
                        ? countries.map(countryCard).join("")
                        : emptyMessage("No countries found")
                }
            </div>

        </section>
    `);
}

function countryCard(country) {
    const name =
        country.name ||
        country.country ||
        "Unknown Country";

    const gdp =
        country.gdp ??
        country.GDP ??
        "";

    const population =
        country.population ??
        "";

    const wealth =
        country.wealth ??
        "";

    return `
        <article class="elite-card country-card">

            <div class="country-icon">
                🌍
            </div>

            <div class="card-info">

                <h2>${escapeHTML(name)}</h2>

                ${
                    gdp !== ""
                        ? `<p class="meta">
                            GDP: ${formatMoney(gdp)}
                           </p>`
                        : ""
                }

                ${
                    population !== ""
                        ? `<p class="meta">
                            Population: ${formatNumber(population)}
                           </p>`
                        : ""
                }

                ${
                    wealth !== ""
                        ? `<div class="wealth">
                            ${formatMoney(wealth)}
                           </div>`
                        : ""
                }

            </div>

        </article>
    `;
}

function render(html) {
    const container = getMainContainer();

    if (!container) {
        console.error("Main content container not found.");
        return;
    }

    container.innerHTML = html;
}

function emptyMessage(message) {
    return `
        <div class="empty-box">
            <h3>${escapeHTML(message)}</h3>
        </div>
    `;
}

function formatMoney(value) {
    if (value === null || value === undefined || value === "") {
        return "—";
    }

    if (typeof value === "string") {
        if (
            value.includes("$") ||
            value.includes("£") ||
            value.includes("€") ||
            value.includes("B") ||
            value.includes("M")
        ) {
            return escapeHTML(value);
        }

        const number = parseFloat(
            value.replace(/[^0-9.-]/g, "")
        );

        if (isNaN(number)) {
            return escapeHTML(value);
        }

        return "$" + formatNumber(number);
    }

    const number = Number(value);

    if (isNaN(number)) {
        return "—";
    }

    if (number >= 1000000000000) {
        return "$" + (number / 1000000000000).toFixed(2) + "T";
    }

    if (number >= 1000000000) {
        return "$" + (number / 1000000000).toFixed(2) + "B";
    }

    if (number >= 1000000) {
        return "$" + (number / 1000000).toFixed(2) + "M";
    }

    return "$" + formatNumber(number);
}

function formatNumber(value) {
    const number = Number(value);

    if (isNaN(number)) {
        return escapeHTML(String(value));
    }

    return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 2
    }).format(number);
}

function getNumber(value) {
    if (typeof value === "number") {
        return value;
    }

    if (!value) return 0;

    const text = String(value)
        .replace(/,/g, "")
        .toUpperCase();

    const number = parseFloat(text);

    if (isNaN(number)) return 0;

    if (text.includes("T")) return number * 1e12;
    if (text.includes("B")) return number * 1e9;
    if (text.includes("M")) return number * 1e6;

    return number;
}

function formatChange(value) {
    const text = String(value);

    const number = parseFloat(
        text.replace("%", "").replace("+", "")
    );

    if (isNaN(number)) {
        return escapeHTML(text);
    }

    if (number > 0) {
        return `▲ +${number}%`;
    }

    if (number < 0) {
        return `▼ ${number}%`;
    }

    return "— 0%";
}

function getInitials(name) {
    return String(name)
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word[0])
        .join("")
        .toUpperCase();
}

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Make functions available to HTML buttons
window.showBillionaires = showBillionaires;
window.showCompanies = showCompanies;
window.showCountries = showCountries;
window.loadData = loadData;
