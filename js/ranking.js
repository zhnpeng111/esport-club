// ===========================
// REST API config
// ===========================
const API_URL = "http://localhost:3000/teams";

let teams = []; // populated from the API

const rankingBody = document.getElementById("rankingBody");
const searchTeam = document.getElementById("searchTeam");
const gameFilter = document.getElementById("gameFilter");
const favoriteTeamList = document.getElementById("favoriteTeamList");
const addTeamForm = document.getElementById("addTeamForm");

// ---- Session Storage keys ----
const SEARCH_KEY = "rankingSearch";
const GAME_KEY = "rankingGameFilter";
const FAVOURITE_KEY = "rankingFavourites";

// ===========================
// GET - load teams from the API (jQuery AJAX)
// ===========================
function loadTeams() {

    rankingBody.innerHTML = `<tr><td colspan="7" class="text-center">Loading rankings...</td></tr>`;

    $.getJSON(API_URL)
        .done(function (data) {

            teams = data;
            restoreState();

        })
        .fail(function () {

            rankingBody.innerHTML = `
                <tr><td colspan="7" class="text-center text-danger">
                    Could not load rankings. Is json-server running at ${API_URL}?
                </td></tr>
            `;

        });

}

function displayTeams(teamArray) {

    rankingBody.innerHTML = "";

    if (teamArray.length === 0) {
        rankingBody.innerHTML = `<tr><td colspan="7" class="text-center">No teams found.</td></tr>`;
        return;
    }

    teamArray.forEach(team => {

        rankingBody.innerHTML += `
            <tr>
                <td><span class="rank-badge">#${team.rank}</span></td>
                <td>${team.team}</td>
                <td>${team.game}</td>
                <td>${team.points}</td>
                <td>${team.wins}</td>
                <td>${team.losses}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick='saveFavouriteTeam(${JSON.stringify(team.id)})'>
                        <i class="fa-solid fa-star"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-light" onclick='deleteTeam(${JSON.stringify(team.id)})'>
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;

    });

}

function applyFilters() {

    const keyword = searchTeam.value.toLowerCase();
    const selectedGame = gameFilter.value;

    // Persist current search & filter choice for this browser session
    sessionStorage.setItem(SEARCH_KEY, searchTeam.value);
    sessionStorage.setItem(GAME_KEY, selectedGame);

    const result = teams
        .filter(team => team.team.toLowerCase().includes(keyword))
        .filter(team => selectedGame === "all" || team.game === selectedGame)
        .sort((a, b) => a.rank - b.rank);

    displayTeams(result);

}

searchTeam.addEventListener("keyup", applyFilters);
gameFilter.addEventListener("change", applyFilters);

// ===========================
// POST - add a new team via the API (jQuery AJAX)
// ===========================
addTeamForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const newTeam = {
        rank: Number(document.getElementById("newRank").value),
        team: document.getElementById("newTeamName").value,
        game: document.getElementById("newTeamGame").value,
        points: Number(document.getElementById("newPoints").value),
        wins: Number(document.getElementById("newWins").value),
        losses: Number(document.getElementById("newLosses").value)
    };

    $.ajax({
        url: API_URL,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(newTeam)
    })
        .done(function () {

            addTeamForm.reset();
            loadTeams();

        })
        .fail(function () {

            alert("Could not add team. Is json-server running?");

        });

});

// ===========================
// DELETE - remove a team via the API (jQuery AJAX)
// ===========================
function deleteTeam(id) {

    if (!confirm("Delete this team?")) return;

    $.ajax({
        url: `${API_URL}/${id}`,
        method: "DELETE"
    })
        .done(function () {

            removeFavouriteTeam(id);
            loadTeams();

        })
        .fail(function () {

            alert("Could not delete team. Is json-server running?");

        });

}

// ===========================
// Session Storage - favourite teams (kept client-side, per browser session)
// ===========================
function saveFavouriteTeam(id) {

    let favourites = JSON.parse(sessionStorage.getItem(FAVOURITE_KEY)) || [];

    if (!favourites.includes(id)) {
        favourites.push(id);
        sessionStorage.setItem(FAVOURITE_KEY, JSON.stringify(favourites));
    }

    showFavouriteTeams();

}

function removeFavouriteTeam(id) {

    let favourites = JSON.parse(sessionStorage.getItem(FAVOURITE_KEY)) || [];
    favourites = favourites.filter(fId => fId !== id);
    sessionStorage.setItem(FAVOURITE_KEY, JSON.stringify(favourites));

    showFavouriteTeams();

}

function showFavouriteTeams() {

    let favourites = JSON.parse(sessionStorage.getItem(FAVOURITE_KEY)) || [];

    favoriteTeamList.innerHTML = "";

    if (favourites.length === 0) {
        favoriteTeamList.innerHTML = `<li class="list-group-item">No favourite teams yet this session.</li>`;
        return;
    }

    favourites.forEach(id => {

        const team = teams.find(t => String(t.id) === String(id));
        if (!team) return;

        favoriteTeamList.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span><i class="fa-solid fa-star"></i> ${team.team} (${team.game})</span>
                <button class="btn btn-sm btn-outline-light" onclick='removeFavouriteTeam(${JSON.stringify(team.id)})'>
                    Remove
                </button>
            </li>
        `;

    });

}

// ---- Restore saved search / filter state from Session Storage ----
function restoreState() {

    const savedSearch = sessionStorage.getItem(SEARCH_KEY);
    const savedGame = sessionStorage.getItem(GAME_KEY);

    if (savedSearch) {
        searchTeam.value = savedSearch;
    }

    if (savedGame) {
        gameFilter.value = savedGame;
    }

    applyFilters();
    showFavouriteTeams();

}

loadTeams();