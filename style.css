/* =========================================
   WORLDELITE
   MAIN APPLICATION
========================================= */

const app = document.getElementById("app");

const DATA_URL = "data.json";

let data = {
    billionaires: [],
    companies: [],
    countries: []
};

let currentUser =
    localStorage.getItem("worldEliteUser") || "";

let favorites =
    JSON.parse(
        localStorage.getItem(
            "worldEliteFavorites"
        ) || "[]"
    );


/* =========================================
   START
========================================= */

showStart();


/* =========================================
   START PAGE
========================================= */

function showStart() {

    app.innerHTML = `

        <div class="start-page">

            <header class="topbar">

                <div class="logo">
                    WorldElite
                </div>

                <div class="top-actions">

                    <button
                        onclick="showLogin()"
                    >
                        Log In
                    </button>

                    <button
                        class="signup-btn"
                        onclick="showSignUp()"
                    >
                        Sign Up
                    </button>

                </div>

            </header>


            <main class="hero">

                <div class="hero-content">

                    <div class="badge">
                        GLOBAL WEALTH & BUSINESS
                    </div>

                    <h1>
                        Explore the world's
                        <span>
                            most powerful
                        </span>
                        people & companies.
                    </h1>

                    <p>
                        Discover billionaires,
                        companies and global
                        business intelligence
                        in one place.
                    </p>


                    <div class="hero-buttons">

                        <button
                            class="primary-btn"
                            onclick="showBillionaires()"
                        >
                            Explore Billionaires
                        </button>


                        <button
                            class="secondary-btn"
                            onclick="showCompanies()"
                        >
                            Explore Companies
                        </button>

                    </div>

                </div>

            </main>


            <section class="features">

                <div class="feature-card">

                    <div class="feature-icon">
                        💰
                    </div>

                    <h3>
                        Billionaires
                    </h3>

                    <p>
                        Track the world's
                        wealthiest people
                        and their rankings.
                    </p>

                </div>


                <div class="feature-card">

                    <div class="feature-icon">
                        🏢
                    </div>

                    <h3>
                        Companies
                    </h3>

                    <p>
                        Explore major global
                        companies and
                        business leaders.
                    </p>

                </div>


                <div class="feature-card">

                    <div class="feature-icon">
                        📈
                    </div>

                    <h3>
                        Intelligence
                    </h3>

                    <p>
                        Follow wealth,
                        business and
                        global economic data.
                    </p>

                </div>

            </section>


            <footer>

                <div>
                    © 2026 WorldElite
                </div>

                <div>
                    Global Wealth Intelligence
                </div>

            </footer>

        </div>

    `;
}


/* =========================================
   LOGIN
========================================= */

function showLogin() {

    app.innerHTML = `

        <div class="container">

            <h1>
                Login
            </h1>

            <p>
                Enter WorldElite
            </p>


            <input
                id="loginEmail"
                type="email"
                placeholder="Email"
            >


            <input
                id="loginPassword"
                type="password"
                placeholder="Password"
            >


            <button
                class="primary-btn"
                id="loginBtn"
            >
                LOGIN
            </button>


            <button
                class="secondary-btn"
                id="backStartBtn"
            >
                BACK
            </button>

        </div>

    `;


    document
        .getElementById("loginBtn")
        .onclick = function () {

            const email =
                document
                .getElementById("loginEmail")
                .value
                .trim();


            if (!email) {

                alert(
                    "Please enter your email."
                );

                return;
            }


            currentUser = email;

            localStorage.setItem(
                "worldEliteUser",
                currentUser
            );


            showHome();
        };


    document
        .getElementById("backStartBtn")
        .onclick = showStart;
}


/* =========================================
   SIGN UP
========================================= */

function showSignUp() {

    app.innerHTML = `

        <div class="container">

            <h1>
                Create Account
            </h1>

            <p>
                Join WorldElite
            </p>


            <input
                id="signupName"
                type="text"
                placeholder="Name"
            >


            <input
                id="signupEmail"
                type="email"
                placeholder="Email"
            >


            <input
                id="signupPassword"
                type="password"
                placeholder="Password"
            >


            <button
                class="primary-btn"
                id="createAccountBtn"
            >
                CREATE ACCOUNT
            </button>


            <button
                class="secondary-btn"
                id="backSignupBtn"
            >
                BACK
            </button>

        </div>

    `;


    document
        .getElementById(
            "createAccountBtn"
        )
        .onclick = function () {

            const name =
                document
                .getElementById("signupName")
                .value
                .trim();


            const email =
                document
                .getElementById("signupEmail")
                .value
                .trim();


            if (!name || !email) {

                alert(
                    "Please enter your name and email."
                );

                return;
            }


            currentUser = name;

            localStorage.setItem(
                "worldEliteUser",
                currentUser
            );


            showHome();
        };


    document
        .getElementById(
            "backSignupBtn"
        )
        .onclick = showStart;
}


/* =========================================
   HOME
========================================= */

function showHome() {

    const richest =
        [...data.billionaires]
        .sort(
            (a, b) =>
                getWorth(b) - getWorth(a)
        )[0];


    app.innerHTML = `

        <div class="container">

            <p>
                WELCOME TO
            </p>

            <h1>
                WorldElite
            </h1>

            <p>
                Global wealth and
                business intelligence.
            </p>


            ${
                richest
                ? `
                    <div class="card">

                        <div class="rank">
                            #1 RICHEST
                        </div>

                        <div class="card-title">
                            ${richest.flag || "🌍"}
                            ${escapeHTML(
                                richest.name || "Unknown"
                            )}
                        </div>

                        <div class="money">
                            ${formatMoney(
                                richest.netWorth
                            )}
                        </div>

                        <p>
                            ${
                                escapeHTML(
                                    richest.company || ""
                                )
                            }
                        </p>

                    </div>
                `
                : ""
            }


            <div class="stat-grid">

                <div class="stat">

                    <div class="stat-number">
                        ${data.billionaires.length}
                    </div>

                    <div class="stat-label">
                        Billionaires
                    </div>

                </div>


                <div class="stat">

                    <div class="stat-number">
                        ${data.companies.length}
                    </div>

                    <div class="stat-label">
                        Companies
                    </div>

                </div>

            </div>


            <div
                class="card clickable"
                onclick="showBillionaires()"
            >

                <div class="card-title">
                    🏆 Billionaires
                </div>

                <p>
                    Explore global wealth rankings.
                </p>

            </div>


            <div
                class="card clickable"
                onclick="showCompanies()"
            >

                <div class="card-title">
                    🏢 Companies
                </div>

                <p>
                    Explore major global companies.
                </p>

            </div>

        </div>


        ${navigation("home")}

    `;


    setupNavigation();
}


/* =========================================
   BILLIONAIRES
========================================= */

function showBillionaires() {

    app.innerHTML = `

        <div class="container">

            <h1>
                Billionaires
            </h1>

            <p>
                World's wealthiest people
            </p>


            <input
                id="billionaireSearch"
                type="search"
                placeholder="🔎 Search billionaire"
            >


            <div
                id="billionaireList"
            ></div>

        </div>


        ${navigation("billionaires")}

    `;


    document
        .getElementById(
            "billionaireSearch"
        )
        .oninput =
        renderBillionaires;


    renderBillionaires();

    setupNavigation();
}


function renderBillionaires() {

    const search =
        document
        .getElementById(
            "billionaireSearch"
        )
        .value
        .toLowerCase()
        .trim();


    let people =
        [...data.billionaires];


    people =
        people.filter(
            person => {

                const text =
                    JSON.stringify(person)
                    .toLowerCase();


                return text.includes(search);
            }
        );


    people.sort(
        (a, b) =>
            getWorth(b) - getWorth(a)
    );


    const container =
        document.getElementById(
            "billionaireList"
        );


    if (!people.length) {

        container.innerHTML = `
            <div class="empty">
                <p>
                    No billionaires found.
                </p>
            </div>
        `;

        return;
    }


    container.innerHTML =
        people
        .map(
            (person, index) =>
                billionaireCard(
                    person,
                    index
                )
        )
        .join("");


    document
        .querySelectorAll(
            "[data-person-id]"
        )
        .forEach(
            card => {

                card.onclick =
                    function () {

                        const id =
                            Number(
                                card.dataset
                                .personId
                            );


                        const person =
                            data.billionaires
                            .find(
                                item =>
                                    Number(
                                        item.id
                                    ) === id
                            );


                        if (person) {

                            showBillionaireDetails(
                                person
                            );
                        }
                    };
            }
        );
}


function billionaireCard(
    person,
    index
) {

    const id =
        Number(
            person.id ??
            index + 1
        );


    const favorite =
        favorites.includes(id);


    return `

        <div
            class="card clickable"
            data-person-id="${id}"
        >

            <button
                class="favorite"
                data-favorite="${id}"
                onclick="
                    event.stopPropagation();
                    toggleFavorite(${id});
                    renderBillionaires();
                "
            >
                ${
                    favorite
                    ? "⭐"
                    : "☆"
                }
            </button>


            <div class="rank">
                #${index + 1}
            </div>


            <div class="card-title">

                ${
                    person.flag ||
                    "🌍"
                }

                ${
                    escapeHTML(
                        person.name ||
                        "Unknown"
                    )
                }

            </div>


            <div class="card-subtitle">

                ${
                    escapeHTML(
                        person.company ||
                        ""
                    )
                }

            </div>


            <div class="money">

                ${
                    formatMoney(
                        person.netWorth
                    )
                }

            </div>


            <p>

                ${
                    escapeHTML(
                        person.country ||
                        ""
                    )
                }

            </p>

        </div>

    `;
}


/* =========================================
   DETAILS
========================================= */

function showBillionaireDetails(
    person
) {

    const id =
        Number(person.id);


    const favorite =
        favorites.includes(id);


    app.innerHTML = `

        <div class="container">

            <button
                class="secondary-btn"
                onclick="showBillionaires()"
            >
                ← Rankings
            </button>


            <div class="profile-card">

                <div class="profile-icon">
                    ${
                        person.flag ||
                        "🌍"
                    }
                </div>


                <h1>
                    ${
                        escapeHTML(
                            person.name ||
                            "Unknown"
                        )
                    }
                </h1>


                <p>
                    ${
                        escapeHTML(
                            person.country ||
                            ""
                        )
                    }
                </p>


                <div class="big-money">
                    ${
                        formatMoney(
                            person.netWorth
                        )
                    }
                </div>


                <p>
                    Estimated Net Worth
                </p>


                <p>
                    🏢
                    ${
                        escapeHTML(
                            person.company ||
                            ""
                        )
                    }
                </p>


                <button
                    class="primary-btn"
                    onclick="
                        toggleFavorite(${id});
                        showBillionaireDetails(
                            ${JSON.stringify(person).replace(/"/g, "&quot;")}
                        );
                    "
                >
                    ${
                        favorite
                        ? "⭐ Remove Favorite"
                        : "☆ Add Favorite"
                    }
                </button>

            </div>

        </div>


        ${navigation("billionaires")}

    `;


    setupNavigation();
}


/* =========================================
   COMPANIES
========================================= */

function showCompanies() {

    app.innerHTML = `

        <div class="container">

            <h1>
                Companies
            </h1>

            <p>
                Major global businesses
            </p>


            <input
                id="companySearch"
                type="search"
                placeholder="🔎 Search company"
            >


            <div
                id="companyList"
            ></div>

        </div>


        ${navigation("companies")}

    `;


    document
        .getElementById(
            "companySearch"
        )
        .oninput =
        renderCompanies;


    renderCompanies();

    setupNavigation();
}


function renderCompanies() {

    const search =
        document
        .getElementById(
            "companySearch"
        )
        .value
        .toLowerCase()
        .trim();


    const list =
        data.companies.filter(
            company => {

                return JSON.stringify(
                    company
                )
                .toLowerCase()
                .includes(search);
            }
        );


    const container =
        document.getElementById(
            "companyList"
        );


    if (!list.length) {

        container.innerHTML = `
            <div class="empty">
                <p>
                    No companies found.
                </p>
            </div>
        `;

        return;
    }


    container.innerHTML =
        list
        .map(
            company => `

                <div class="card">

                    <div class="card-title">
                        🏢
                        ${
                            escapeHTML(
                                company.name ||
                                "Company"
                            )
                        }
                    </div>

                    <div class="card-subtitle">
                        ${
                            escapeHTML(
                                company.sector ||
                                company.industry ||
                                ""
                            )
                        }
                    </div>

                    <p>
                        ${
                            escapeHTML(
                                company.founder ||
                                company.ceo ||
                                ""
                            )
                        }
                    </p>

                </div>

            `
        )
        .join("");
}


/* =========================================
   FAVORITES
========================================= */

function toggleFavorite(id) {

    id = Number(id);


    if (
        favorites.includes(id)
    ) {

        favorites =
            favorites.filter(
                item =>
                    item !== id
            );

    } else {

        favorites.push(id);
    }


    localStorage.setItem(
        "worldEliteFavorites",
        JSON.stringify(
            favorites
        )
    );
}


function showFavorites() {

    const list =
        data.billionaires.filter(
            person =>
                favorites.includes(
                    Number(person.id)
                )
        );


    app.innerHTML = `

        <div class="container">

            <h1>
                Favorites
            </h1>

            <p>
                Your saved people
            </p>


            <div id="favoriteList"></div>

        </div>


        ${navigation("profile")}

    `;


    const container =
        document.getElementById(
            "favoriteList"
        );


    if (!list.length) {

        container.innerHTML = `

            <div class="empty">

                <p>
                    No favorites yet.
                </p>

                <button
                    class="primary-btn"
                    onclick="showBillionaires()"
                >
                    Explore Rankings
                </button>

            </div>

        `;

        setupNavigation();

        return;
    }


    container.innerHTML =
        list
        .map(
            (person, index) =>
                billionaireCard(
                    person,
                    index
                )
        )
        .join("");


    setupNavigation();
}


/* =========================================
   PROFILE
========================================= */

function showProfile() {

    app.innerHTML = `

        <div class="container">

            <div class="profile-card">

                <div class="profile-icon">
                    👤
                </div>


                <h1>
                    ${
                        escapeHTML(
                            currentUser ||
                            "Guest"
                        )
                    }
                </h1>


                <p>
                    WorldElite Member
                </p>

            </div>


            <div class="stat-grid">

                <div class="stat">

                    <div class="stat-number">
                        ${favorites.length}
                    </div>

                    <div class="stat-label">
                        Favorites
                    </div>

                </div>


                <div class="stat">

                    <div class="stat-number">
                        ${data.billionaires.length}
                    </div>

                    <div class="stat-label">
                        Billionaires
                    </div>

                </div>

            </div>


            <button
                class="primary-btn"
                onclick="showFavorites()"
            >
                ⭐ My Favorites
            </button>


            <button
                class="secondary-btn"
                onclick="logout()"
            >
                LOG OUT
            </button>

        </div>


        ${navigation("profile")}

    `;


    setupNavigation();
}


function logout() {

    localStorage.removeItem(
        "worldEliteUser"
    );

    currentUser = "";

    showStart();
}


/* =========================================
   NAVIGATION
========================================= */

function navigation(active) {

    return `

        <div class="bottom-nav">

            <button
                class="
                    nav-item
                    ${
                        active === "home"
                        ? "active"
                        : ""
                    }
                "
                data-nav="home"
            >

                <span class="nav-icon">
                    🏠
                </span>

                Home

            </button>


            <button
                class="
                    nav-item
                    ${
                        active === "billionaires"
                        ? "active"
                        : ""
                    }
                "
                data-nav="billionaires"
            >

                <span class="nav-icon">
                    🏆
                </span>

                Rankings

            </button>


            <button
                class="
                    nav-item
                    ${
                        active === "companies"
                        ? "active"
                        : ""
                    }
                "
                data-nav="companies"
            >

                <span class="nav-icon">
                    🏢
                </span>

                Companies

            </button>


            <button
                class="
                    nav-item
                    ${
                        active === "profile"
                        ? "active"
                        : ""
                    }
                "
                data-nav="profile"
            >

                <span class="nav-icon">
                    👤
                </span>

                Profile

            </button>

        </div>

    `;
}


function setupNavigation() {

    document
        .querySelectorAll(
            "[data-nav]"
        )
        .forEach(
            button => {

                button.onclick =
                    function () {

                        const page =
                            button.dataset.nav;


                        if (
                            page === "home"
                        ) {

                            showHome();

                        }


                        if (
                            page ===
                            "billionaires"
                        ) {

                            showBillionaires();

                        }


                        if (
                            page ===
                            "companies"
                        ) {

                            showCompanies();

                        }


                        if (
                            page ===
                            "profile"
                        ) {

                            showProfile();

                        }

                    };
            }
        );
}


/* =========================================
   DATA
========================================= */

async function loadData() {

    try {

        const response =
            await fetch(
                DATA_URL,
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "data.json could not be loaded"
            );
        }


        const json =
            await response.json();


        if (
            Array.isArray(json)
        ) {

            data.billionaires =
                json;

        } else {

            data =
                {
                    billionaires:
                        json.billionaires ||
                        [],

                    companies:
                        json.companies ||
                        [],

                    countries:
                        json.countries ||
                        []
                };
        }


        console.log(
            "WorldElite data loaded."
        );


    } catch (error) {

        console.error(
            "Data error:",
            error
        );

        data = {
            billionaires: [],
            companies: [],
            countries: []
        };
    }
}


/* =========================================
   HELPERS
========================================= */

function getWorth(person) {

    if (!person) return 0;

    return parseFloat(
        String(
            person.netWorth ||
            person.worth ||
            0
        )
        .replace(/[^0-9.]/g, "")
    ) || 0;
}


function formatMoney(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return "—";
    }


    if (
        typeof value === "string" &&
        (
            value.includes("$") ||
            value.includes("€") ||
            value.includes("£") ||
            value.includes("B") ||
            value.includes("M")
        )
    ) {

        return escapeHTML(value);
    }


    const number =
        Number(value);


    if (isNaN(number)) {

        return escapeHTML(
            String(value)
        );
    }


    if (
        number >=
        1000000000000
    ) {

        return (
            "$" +
            (
                number /
                1000000000000
            ).toFixed(2) +
            "T"
        );
    }


    if (
        number >=
        1000000000
    ) {

        return (
            "$" +
            (
                number /
                1000000000
            ).toFixed(2) +
            "B"
        );
    }


    if (
        number >=
        1000000
    ) {

        return (
            "$" +
            (
                number /
                1000000
            ).toFixed(2) +
            "M"
        );
    }


    return (
        "$" +
        number.toLocaleString(
            "en-US"
        )
    );
}


function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


/* =========================================
   LOAD DATA THEN SHOW START
========================================= */

loadData()
    .then(
        () => {

            showStart();

        }
    );
