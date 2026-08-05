let billionaires = [];
let companies = [];

let currentPage = "homePage";

const $ = (id) => document.getElementById(id);


/* =========================
   DATA
========================= */

async function loadData() {

  showLoading(true);

  try {

    const response = await fetch("./data.json?version=" + Date.now(), {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Could not load data.json");
    }

    const data = await response.json();

    /*
      Supports several possible data.json structures.
    */

    if (Array.isArray(data)) {

      billionaires = data;

      companies = [];

    } else {

      billionaires =
        data.billionaires ||
        data.people ||
        data.richest ||
        data.data ||
        [];

      companies =
        data.companies ||
        data.businesses ||
        [];

    }

    if (!Array.isArray(billionaires)) {
      billionaires = [];
    }

    if (!Array.isArray(companies)) {
      companies = [];
    }

    normalizeData();

    renderEverything();

    updateTime();

    showLoading(false);

  } catch (error) {

    console.error(error);

    showLoading(false);

    $("errorBox").textContent =
      "Unable to load WorldElite data. Please refresh the page.";

    $("errorBox").classList.remove("hidden");

  }

}


/* =========================
   NORMALIZE DATA
========================= */

function normalizeData() {

  billionaires = billionaires.map((person, index) => {

    const name =
      person.name ||
      person.fullName ||
      person.personName ||
      `Billionaire ${index + 1}`;

    const country =
      person.country ||
      person.countryName ||
      person.nationality ||
      "Unknown";

    const worth =
      Number(
        person.netWorth ??
        person.net_worth ??
        person.estimatedNetWorth ??
        person.wealth ??
        person.totalWorth ??
        0
      ) || 0;

    const company =
      person.company ||
      person.companies ||
      person.business ||
      person.sourceCompany ||
      "";

    const image =
      person.image ||
      person.photo ||
      person.imageUrl ||
      person.photoUrl ||
      "";

    return {
      ...person,
      name,
      country,
      worth,
      company,
      image
    };

  });

}


/* =========================
   RENDER EVERYTHING
========================= */

function renderEverything() {

  updateStats();

  populateCountries();

  renderTopBillionaires();

  renderRankings();

  renderCompanies();

}


/* =========================
   STATS
========================= */

function updateStats() {

  $("billionaireCount").textContent =
    billionaires.length.toLocaleString();

  $("companyCount").textContent =
    companies.length.toLocaleString();

}


/* =========================
   TOP BILLIONAIRES
========================= */

function renderTopBillionaires() {

  const container = $("topBillionaires");

  container.innerHTML = "";

  const top = [...billionaires]
    .sort((a, b) => b.worth - a.worth)
    .slice(0, 5);

  if (!top.length) {

    container.innerHTML =
      `<div class="loading">No billionaire data available.</div>`;

    return;
  }

  top.forEach((person, index) => {

    container.appendChild(
      createPersonCard(person, index + 1)
    );

  });

}


/* =========================
   RANKINGS
========================= */

function renderRankings() {

  const search =
    $("searchInput").value.toLowerCase().trim();

  const country =
    $("countryFilter").value;

  const sort =
    $("sortSelect").value;


  let list = [...billionaires];


  if (search) {

    list = list.filter(person =>
      person.name.toLowerCase().includes(search) ||
      person.country.toLowerCase().includes(search) ||
      String(person.company)
        .toLowerCase()
        .includes(search)
    );

  }


  if (country !== "all") {

    list = list.filter(person =>
      person.country === country
    );

  }


  if (sort === "low") {

    list.sort((a, b) => a.worth - b.worth);

  } else {

    list.sort((a, b) => b.worth - a.worth);

  }


  const container = $("rankingList");

  container.innerHTML = "";


  if (!list.length) {

    container.innerHTML =
      `<div class="loading">No results found.</div>`;

    return;

  }


  list.forEach((person, index) => {

    container.appendChild(
      createPersonCard(person, index + 1)
    );

  });

}


/* =========================
   PERSON CARD
========================= */

function createPersonCard(person, rank) {

  const card =
    document.createElement("div");

  card.className = "person-card";


  let avatar = "👤";

  if (person.image) {

    avatar =
      `<img src="${escapeHTML(person.image)}"
            onerror="this.style.display='none'">`;

  }


  card.innerHTML = `

    <div class="person-avatar">
      ${avatar}
    </div>

    <div class="person-info">

      <div class="person-name">
        ${rank}. ${escapeHTML(person.name)}
      </div>

      <div class="person-country">
        ${countryFlag(person.country)}
        ${escapeHTML(person.country)}
      </div>

      ${
        person.company
        ?
        `<div class="person-company">
          🏢 ${escapeHTML(String(person.company))}
        </div>`
        :
        ""
      }

    </div>

    <div class="person-worth">
      ${formatWorth(person.worth)}
    </div>

  `;


  card.addEventListener("click", () => {

    openPerson(person);

  });


  return card;

}


/* =========================
   PERSON DETAILS
========================= */

function openPerson(person) {

  showPage("personPage");

  const container =
    $("personDetails");

  let avatar = "👤";

  if (person.image) {

    avatar =
      `<img src="${escapeHTML(person.image)}"
            onerror="this.style.display='none'">`;

  }


  container.innerHTML = `

    <div class="detail-card">

      <div class="detail-avatar">
        ${avatar}
      </div>

      <h1>
        ${escapeHTML(person.name)}
      </h1>

      <div class="detail-country">
        ${countryFlag(person.country)}
        ${escapeHTML(person.country)}
      </div>

      <div class="detail-worth">
        ${formatWorth(person.worth)}
      </div>

      <div class="detail-label">
        Estimated Net Worth
      </div>

      ${
        person.company
        ?
        `<div class="detail-company">
          🏢 ${escapeHTML(String(person.company))}
        </div>`
        :
        ""
      }

      <button class="primary-btn"
              style="margin-top:25px"
              onclick="addFavorite('${escapeHTML(person.name)}')">
        ☆ Add Favorite
      </button>

    </div>

  `;

}


/* =========================
   COMPANIES
========================= */

function renderCompanies() {

  const container =
    $("companiesList");

  container.innerHTML = "";


  if (!companies.length) {

    /*
      If companies aren't separately provided,
      show companies extracted from billionaire data.
    */

    const extracted = [];

    billionaires.forEach(person => {

      if (person.company) {

        const name = String(person.company);

        if (!extracted.includes(name)) {
          extracted.push(name);
        }

      }

    });


    if (extracted.length) {

      extracted.slice(0, 100).forEach(name => {

        const card =
          document.createElement("div");

        card.className = "company-card";

        card.innerHTML = `
          <h3>🏢 ${escapeHTML(name)}</h3>
          <p>Company associated with WorldElite billionaire data.</p>
        `;

        container.appendChild(card);

      });

    } else {

      container.innerHTML =
        `<div class="loading">
          Company data will appear here when available.
        </div>`;

    }

    return;

  }


  companies.forEach(company => {

    const name =
      company.name ||
      company.company ||
      "Unknown company";

    const description =
      company.description ||
      company.industry ||
      "Global company";


    const card =
      document.createElement("div");

    card.className = "company-card";

    card.innerHTML = `

      <h3>
        🏢 ${escapeHTML(name)}
      </h3>

      <p>
        ${escapeHTML(description)}
      </p>

    `;

    container.appendChild(card);

  });

}


/* =========================
   COUNTRY FILTER
========================= */

function populateCountries() {

  const select =
    $("countryFilter");

  const countries =
    [...new Set(
      billionaires
        .map(person => person.country)
        .filter(Boolean)
    )]
    .sort();


  select.innerHTML =
    `<option value="all">All countries</option>`;


  countries.forEach(country => {

    const option =
      document.createElement("option");

    option.value = country;

    option.textContent =
      `${countryFlag(country)} ${country}`;

    select.appendChild(option);

  });

}


/* =========================
   FLAGS
========================= */

function countryFlag(country) {

  const map = {

    "United States": "🇺🇸",
    "United States of America": "🇺🇸",
    "US": "🇺🇸",

    "United Kingdom": "🇬🇧",
    "UK": "🇬🇧",

    "France": "🇫🇷",
    "Germany": "🇩🇪",
    "Italy": "🇮🇹",
    "Spain": "🇪🇸",

    "Russia": "🇷🇺",
    "Russian Federation": "🇷🇺",

    "Ukraine": "🇺🇦",

    "China": "🇨🇳",

    "India": "🇮🇳",

    "Japan": "🇯🇵",

    "South Korea": "🇰🇷",

    "Canada": "🇨🇦",

    "Australia": "🇦🇺",

    "Brazil": "🇧🇷",

    "Mexico": "🇲🇽",

    "Turkey": "🇹🇷",

    "Singapore": "🇸🇬",

    "Switzerland": "🇨🇭",

    "Israel": "🇮🇱",

    "United Arab Emirates": "🇦🇪",

    "Saudi Arabia": "🇸🇦"

  };


  return map[country] || "🌍";

}


/* =========================
   FORMAT MONEY
========================= */

function formatWorth(value) {

  const number =
    Number(value) || 0;


  if (number >= 1000) {

    return "$" +
      (number / 1000).toFixed(1) +
      "T";

  }


  return "$" +
    number.toFixed(1) +
    "B";

}


/* =========================
   NAVIGATION
========================= */

function showPage(pageId) {

  document.querySelectorAll(".page")
    .forEach(page => {
      page.classList.add("hidden");
    });


  const page =
    $(pageId);

  if (page) {
    page.classList.remove("hidden");
  }


  document.querySelectorAll(".nav-item")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.page === pageId
      );

    });


  currentPage = pageId;

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


function setupNavigation() {

  document.querySelectorAll(".nav-item")
    .forEach(button => {

      button.addEventListener("click", () => {

        showPage(button.dataset.page);

      });

    });


  $("exploreBtn").onclick = () =>
    showPage("rankingsPage");


  $("seeAllBtn").onclick = () =>
    showPage("rankingsPage");


  $("backBtn").onclick = () =>
    showPage("rankingsPage");

}


/* =========================
   SEARCH / FILTERS
========================= */

function setupFilters() {

  $("searchInput")
    .addEventListener("input", renderRankings);


  $("countryFilter")
    .addEventListener("change", renderRankings);


  $("sortSelect")
    .addEventListener("change", renderRankings);

}


/* =========================
   REFRESH
========================= */

function setupRefresh() {

  $("refreshBtn").onclick =
    async () => {

      await loadData();

    };


  $("rankingRefreshBtn").onclick =
    async () => {

      await loadData();

    };

}


/* =========================
   AUTH
========================= */

function setupAuth() {

  $("loginBtn").onclick = () => {

    $("loginModal")
      .classList.remove("hidden");

  };


  $("signupBtn").onclick = () => {

    $("signupModal")
      .classList.remove("hidden");

  };


  $("profileLoginBtn").onclick = () => {

    $("loginModal")
      .classList.remove("hidden");

  };


  $("profileSignupBtn").onclick = () => {

    $("signupModal")
      .classList.remove("hidden");

  };


  document.querySelectorAll(".close-modal")
    .forEach(button => {

      button.addEventListener("click", () => {

        const id =
          button.dataset.close;

        $(id).classList.add("hidden");

      });

    });


  $("doSignup").onclick = () => {

    const name =
      $("signupName").value.trim();

    const email =
      $("signupEmail").value.trim();

    const password =
      $("signupPassword").value;


    if (!name || !email || !password) {

      $("signupMessage").textContent =
        "Please fill in all fields.";

      return;

    }


    localStorage.setItem(
      "worldelite_user",
      JSON.stringify({
        name,
        email
      })
    );


    $("signupMessage").textContent =
      "Account created successfully.";

  };


  $("doLogin").onclick = () => {

    const email =
      $("loginEmail").value.trim();

    if (!email) {

      $("loginMessage").textContent =
        "Enter your email.";

      return;

    }


    $("loginMessage").textContent =
      "Logged in successfully.";

  };

}


/* =========================
   FAVORITES
========================= */

function addFavorite(name) {

  let favorites =
    JSON.parse(
      localStorage.getItem("worldelite_favorites") || "[]"
    );


  if (!favorites.includes(name)) {

    favorites.push(name);

    localStorage.setItem(
      "worldelite_favorites",
      JSON.stringify(favorites)
    );

    alert("Added to favorites.");

  } else {

    alert("Already in favorites.");

  }

}


/* =========================
   HELPERS
========================= */

function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


function showLoading(show) {

  $("loading").classList.toggle(
    "hidden",
    !show
  );

}


function updateTime() {

  const now =
    new Date();

  $("lastUpdated").textContent =
    "Last updated: " +
    now.toLocaleString();

}


/* =========================
   START
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    setupNavigation();

    setupFilters();

    setupRefresh();

    setupAuth();

    loadData();

  }
);
