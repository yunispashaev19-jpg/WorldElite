/* =========================================================
   COUNTRY FLAGS (full names + ISO codes)
========================================================= */

const countryFlags = {
    // === Full names ===
    "Afghanistan": "🇦🇫", "Albania": "🇦🇱", "Algeria": "🇩🇿", "Andorra": "🇦🇩", "Angola": "🇦🇴",
    "Argentina": "🇦🇷", "Armenia": "🇦🇲", "Australia": "🇦🇺", "Austria": "🇦🇹", "Azerbaijan": "🇦🇿",
    "Bahamas": "🇧🇸", "Bahrain": "🇧🇭", "Bangladesh": "🇧🇩", "Barbados": "🇧🇧", "Belarus": "🇧🇾",
    "Belgium": "🇧🇪", "Belize": "🇧🇿", "Bermuda": "🇧🇲", "Bolivia": "🇧🇴", "Bosnia and Herzegovina": "🇧🇦",
    "Brazil": "🇧🇷", "Bulgaria": "🇧🇬", "Canada": "🇨🇦", "Chile": "🇨🇱", "China": "🇨🇳",
    "Colombia": "🇨🇴", "Costa Rica": "🇨🇷", "Croatia": "🇭🇷", "Cuba": "🇨🇺", "Cyprus": "🇨🇾",
    "Czech Republic": "🇨🇿", "Czechia": "🇨🇿", "Denmark": "🇩🇰", "Dominican Republic": "🇩🇴",
    "Ecuador": "🇪🇨", "Egypt": "🇪🇬", "Estonia": "🇪🇪", "Ethiopia": "🇪🇹", "Finland": "🇫🇮",
    "France": "🇫🇷", "Georgia": "🇬🇪", "Germany": "🇩🇪", "Ghana": "🇬🇭", "Greece": "🇬🇷",
    "Guatemala": "🇬🇹", "Hong Kong": "🇭🇰", "Hungary": "🇭🇺", "Iceland": "🇮🇸", "India": "🇮🇳",
    "Indonesia": "🇮🇩", "Iran": "🇮🇷", "Iraq": "🇮🇶", "Ireland": "🇮🇪", "Israel": "🇮🇱",
    "Italy": "🇮🇹", "Japan": "🇯🇵", "Jordan": "🇯🇴", "Kazakhstan": "🇰🇿", "Kenya": "🇰🇪",
    "Kuwait": "🇰🇼", "Latvia": "🇱🇻", "Lebanon": "🇱🇧", "Liechtenstein": "🇱🇮", "Lithuania": "🇱🇹",
    "Luxembourg": "🇱🇺", "Malaysia": "🇲🇾", "Malta": "🇲🇹", "Mexico": "🇲🇽", "Monaco": "🇲🇨",
    "Mongolia": "🇲🇳", "Morocco": "🇲🇦", "Netherlands": "🇳🇱", "New Zealand": "🇳🇿", "Nigeria": "🇳🇬",
    "Norway": "🇳🇴", "Pakistan": "🇵🇰", "Panama": "🇵🇦", "Peru": "🇵🇪", "Philippines": "🇵🇭",
    "Poland": "🇵🇱", "Portugal": "🇵🇹", "Qatar": "🇶🇦", "Romania": "🇷🇴", "Russia": "🇷🇺",
    "Rwanda": "🇷🇼", "Saudi Arabia": "🇸🇦", "Serbia": "🇷🇸", "Singapore": "🇸🇬", "Slovakia": "🇸🇰",
    "Slovenia": "🇸🇮", "South Africa": "🇿🇦", "South Korea": "🇰🇷", "Spain": "🇪🇸", "Sri Lanka": "🇱🇰",
    "Sweden": "🇸🇪", "Switzerland": "🇨🇭", "Taiwan": "🇹🇼", "Thailand": "🇹🇭", "Tunisia": "🇹🇳",
    "Turkey": "🇹🇷", "Türkiye": "🇹🇷", "Ukraine": "🇺🇦", "United Arab Emirates": "🇦🇪",
    "United Kingdom": "🇬🇧", "UK": "🇬🇧", "United States": "🇺🇸", "United States of America": "🇺🇸",
    "USA": "🇺🇸", "Uruguay": "🇺🇾", "Uzbekistan": "🇺🇿", "Venezuela": "🇻🇪", "Vietnam": "🇻🇳",
    "Zimbabwe": "🇿🇼",

    // === ISO 2-letter codes (самое важное) ===
    "af": "🇦🇫", "al": "🇦🇱", "dz": "🇩🇿", "ad": "🇦🇩", "ao": "🇦🇴",
    "ar": "🇦🇷", "am": "🇦🇲", "au": "🇦🇺", "at": "🇦🇹", "az": "🇦🇿",
    "bs": "🇧🇸", "bh": "🇧🇭", "bd": "🇧🇩", "bb": "🇧🇧", "by": "🇧🇾",
    "be": "🇧🇪", "bz": "🇧🇿", "bm": "🇧🇲", "bo": "🇧🇴", "ba": "🇧🇦",
    "br": "🇧🇷", "bg": "🇧🇬", "ca": "🇨🇦", "cl": "🇨🇱", "cn": "🇨🇳",
    "co": "🇨🇴", "cr": "🇨🇷", "hr": "🇭🇷", "cu": "🇨🇺", "cy": "🇨🇾",
    "cz": "🇨🇿", "dk": "🇩🇰", "do": "🇩🇴", "ec": "🇪🇨", "eg": "🇪🇬",
    "ee": "🇪🇪", "et": "🇪🇹", "fi": "🇫🇮", "fr": "🇫🇷", "ge": "🇬🇪",
    "de": "🇩🇪", "gh": "🇬🇭", "gr": "🇬🇷", "gt": "🇬🇹", "hk": "🇭🇰",
    "hu": "🇭🇺", "is": "🇮🇸", "in": "🇮🇳", "id": "🇮🇩", "ir": "🇮🇷",
    "iq": "🇮🇶", "ie": "🇮🇪", "il": "🇮🇱", "it": "🇮🇹", "jp": "🇯🇵",
    "jo": "🇯🇴", "kz": "🇰🇿", "ke": "🇰🇪", "kw": "🇰🇼", "lv": "🇱🇻",
    "lb": "🇱🇧", "li": "🇱🇮", "lt": "🇱🇹", "lu": "🇱🇺", "my": "🇲🇾",
    "mt": "🇲🇹", "mx": "🇲🇽", "mc": "🇲🇨", "mn": "🇲🇳", "ma": "🇲🇦",
    "nl": "🇳🇱", "nz": "🇳🇿", "ng": "🇳🇬", "no": "🇳🇴", "pk": "🇵🇰",
    "pa": "🇵🇦", "pe": "🇵🇪", "ph": "🇵🇭", "pl": "🇵🇱", "pt": "🇵🇹",
    "qa": "🇶🇦", "ro": "🇷🇴", "ru": "🇷🇺", "rw": "🇷🇼", "sa": "🇸🇦",
    "rs": "🇷🇸", "sg": "🇸🇬", "sk": "🇸🇰", "si": "🇸🇮", "za": "🇿🇦",
    "kr": "🇰🇷", "es": "🇪🇸", "lk": "🇱🇰", "se": "🇸🇪", "ch": "🇨🇭",
    "tw": "🇹🇼", "th": "🇹🇭", "tn": "🇹🇳", "tr": "🇹🇷", "ua": "🇺🇦",
    "ae": "🇦🇪", "gb": "🇬🇧", "uk": "🇬🇧", "us": "🇺🇸", "uy": "🇺🇾",
    "uz": "🇺🇿", "ve": "🇻🇪", "vn": "🇻🇳", "zw": "🇿🇼"
};


/* =========================================================
   GET FLAG
========================================================= */

function getFlag(country) {
    if (!country) return "🌍";

    const value = String(country).trim();

    // 1. Точное совпадение
    if (countryFlags[value]) {
        return countryFlags[value];
    }

    // 2. В нижнем регистре (для кодов us, fr, cn...)
    const lower = value.toLowerCase();
    if (countryFlags[lower]) {
        return countryFlags[lower];
    }

    // 3. Поиск по полному названию без учёта регистра
    const found = Object.keys(countryFlags).find(
        key => key.toLowerCase() === lower
    );

    if (found) {
        return countryFlags[found];
    }

    return "🌍";
}


/* =========================================================
   CLEAN COUNTRY
========================================================= */

function cleanCountry(country) {
    if (!country) return "Unknown";

    const value = String(country).trim();

    if (
        value === "" ||
        value.toLowerCase() === "unknown" ||
        value.toLowerCase() === "null" ||
        value.toLowerCase() === "undefined"
    ) {
        return "Unknown";
    }

    // Красивые названия для самых частых кодов
    const codeToName = {
        "us": "United States",
        "usa": "United States",
        "gb": "United Kingdom",
        "uk": "United Kingdom",
        "cn": "China",
        "in": "India",
        "fr": "France",
        "de": "Germany",
        "jp": "Japan",
        "ru": "Russia",
        "br": "Brazil",
        "ca": "Canada",
        "au": "Australia",
        "kr": "South Korea",
        "it": "Italy",
        "es": "Spain",
        "ch": "Switzerland",
        "se": "Sweden",
        "nl": "Netherlands",
        "sa": "Saudi Arabia",
        "ae": "United Arab Emirates",
        "hk": "Hong Kong",
        "tw": "Taiwan",
        "sg": "Singapore",
        "mx": "Mexico",
        "id": "Indonesia",
        "tr": "Turkey"
    };

    const lower = value.toLowerCase();

    if (codeToName[lower]) {
        return codeToName[lower];
    }

    return value;
}
