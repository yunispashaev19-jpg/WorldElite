const FAVORITES_KEY =
    "worldelite_favorites";


function getFavorites() {

    try {

        return JSON.parse(
            localStorage.getItem(
                FAVORITES_KEY
            )
        ) || [];

    } catch {

        return [];
    }
}


function saveFavorites(favorites) {

    localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(favorites)
    );
}


function isFavorite(name) {

    return getFavorites()
        .some(
            person =>
                person.name === name
        );
}


function toggleFavorite(person) {

    let favorites =
        getFavorites();


    if (
        favorites.some(
            item =>
                item.name === person.name
        )
    ) {

        favorites =
            favorites.filter(
                item =>
                    item.name !== person.name
            );

    } else {

        favorites.push(person);
    }


    saveFavorites(favorites);
}
