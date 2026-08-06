function renderProfile() {

    const container =
        document.getElementById("profileContent");

    if (!container) return;

    const favorites =
        typeof getFavorites === "function"
            ? getFavorites()
            : [];

    container.innerHTML = `

        <div class="account-card">

            <div class="account-avatar">
                👤
            </div>

            <h2>WorldElite Profile</h2>

            <p>
                Your personal wealth dashboard.
            </p>

            <button
                class="primary-button"
                type="button"
                onclick="showLoginMessage()"
            >
                Log in
            </button>

            <button
                class="secondary-button"
                type="button"
                onclick="showSignupMessage()"
            >
                Sign up
            </button>

            <div class="profile-info" style="margin-top:25px;">

                <span>Favorites</span>

                <strong>
                    ${favorites.length}
                    saved billionaire${favorites.length === 1 ? "" : "s"}
                </strong>

            </div>

        </div>
    `;
}


function showLoginMessage() {

    alert(
        "Login system will be connected next."
    );
}


function showSignupMessage() {

    alert(
        "Sign up system will be connected next."
    );
}
