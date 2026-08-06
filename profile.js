const USER_KEY =
    "worldelite_user";


function getUser() {

    try {

        return JSON.parse(
            localStorage.getItem(
                USER_KEY
            )
        );

    } catch {

        return null;
    }
}


function saveUser(user) {

    localStorage.setItem(
        USER_KEY,
        JSON.stringify(user)
    );
}


function renderProfile() {

    const container =
        document.getElementById(
            "profileContent"
        );

    if (!container) return;


    const user =
        getUser();


    if (!user) {

        container.innerHTML = `

            <div class="profile-box">

                <div class="profile-icon">
                    👤
                </div>

                <h2>
                    WorldElite Profile
                </h2>

                <p>
                    Create an account to
                    personalize your experience.
                </p>

                <button
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
        `;

        return;
    }


    const favorites =
        typeof getFavorites ===
        "function"
            ? getFavorites()
            : [];


    container.innerHTML = `

        <div class="profile-box">

            <div class="profile-avatar">

                ${safeProfile(
                    user.name
                        ?.charAt(0)
                        ?.toUpperCase() ||
                    "U"
                )}

            </div>


            <h2>
                ${safeProfile(user.name)}
            </h2>


            <p>
                ${safeProfile(user.email)}
            </p>


            <br>


            <p>
                ☆ ${favorites.length}
                Favorite${favorites.length === 1 ? "" : "s"}
            </p>


            <button
                onclick="showProfileFavorites()"
            >
                View Favorites
            </button>


            <button
                class="secondary-button"
                onclick="logout()"
            >
                Log Out
            </button>

        </div>
    `;
}


function showLogin() {

    const container =
        document.getElementById(
            "profileContent"
        );

    if (!container) return;


    container.innerHTML = `

        <div class="profile-box">

            <h2>
                Welcome back
            </h2>

            <p>
                Login to WorldElite.
            </p>


            <input
                id="loginEmail"
                type="email"
                placeholder="Email"
            >


            <button
                onclick="login()"
            >
                Login
            </button>


            <button
                class="secondary-button"
                onclick="showSignup()"
            >
                Create Account
            </button>

        </div>
    `;
}


function showSignup() {

    const container =
        document.getElementById(
            "profileContent"
        );

    if (!container) return;


    container.innerHTML = `

        <div class="profile-box">

            <h2>
                Create Account
            </h2>

            <p>
                Join WorldElite.
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


            <button
                onclick="signup()"
            >
                Create Account
            </button>


            <button
                class="secondary-button"
                onclick="showLogin()"
            >
                Login
            </button>

        </div>
    `;
}


function signup() {

    const name =
        document.getElementById(
            "signupName"
        )?.value.trim();


    const email =
        document.getElementById(
            "signupEmail"
        )?.value.trim();


    if (!name || !email) {

        alert(
            "Please enter your name and email."
        );

        return;
    }


    saveUser({

        name,

        email,

        createdAt:
            new Date().toISOString()

    });


    renderProfile();
}


function login() {

    const email =
        document.getElementById(
            "loginEmail"
        )?.value.trim();


    const user =
        getUser();


    if (!user) {

        alert(
            "No account found. Sign up first."
        );

        return;
    }


    if (email !== user.email) {

        alert(
            "Email does not match."
        );

        return;
    }


    renderProfile();
}


function logout() {

    localStorage.removeItem(
        USER_KEY
    );

    renderProfile();
}


function showProfileFavorites() {

    const container =
        document.getElementById(
            "profileContent"
        );

    if (!container) return;


    const favorites =
        getFavorites();


    if (!favorites.length) {

        container.innerHTML = `

            <div class="profile-box">

                <h2>
                    Your Favorites
                </h2>

                <p>
                    You haven't added
                    any billionaires yet.
                </p>

                <button
                    onclick="renderProfile()"
                >
                    Back
                </button>

            </div>
        `;

        return;
    }


    container.innerHTML = `

        <div class="profile-box">

            <h2>
                Your Favorites
            </h2>


            ${favorites.map(
                person => `

                    <div
                        style="
                            padding:15px;
                            margin-top:10px;
                            border-radius:15px;
                            background:rgba(255,255,255,.06);
                        "
                    >

                        <strong>
                            ${safeProfile(
                                person.name
                            )}
                        </strong>

                        <br>

                        <small>
                            ${safeProfile(
                                person.country ||
                                "Unknown"
                            )}
                        </small>

                        <br>

                        <small>
                            $${Number(
                                person.netWorth || 0
                            ).toFixed(1)}B
                        </small>

                    </div>
                `
            ).join("")}


            <button
                onclick="renderProfile()"
            >
                Back
            </button>

        </div>
    `;
}


function safeProfile(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderProfile();

    }
);
