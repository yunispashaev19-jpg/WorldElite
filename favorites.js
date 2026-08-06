const FAVORITES_KEY = "worldelite_favorites";


function getFavorites() {

    try {

        const data =
            localStorage.getItem(FAVORITES_KEY);

        return data
            ? JSON.parse(data)
            : [];

    } catch (error) {

        console.error(error);

        return [];
    }
}


function saveFavorites(favorites) {

    localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(favorites)
    );
}


function toggleFavorite(index) {

    const favorites = getFavorites();

    const position =
        favorites.indexOf(index);

    if (position >= 0) {

        favorites.splice(position, 1);

    } else {

        favorites.push(index);
    }

    saveFavorites(favorites);
}


function isFavorite(index) {

    return getFavorites()
        .includes(index);
}


function toggleFavoriteFromProfile(index) {

    toggleFavorite(index);

    const button =
        document.querySelector(
            ".person-profile .primary-button"
        );

    if (!button) return;

    if (isFavorite(index)) {

        button.textContent =
            "★ Added to Favorites";

    } else {

        button.textContent =
            "☆ Add Favorite";
    }
}
