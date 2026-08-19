// ===========================
// REST API config
// ===========================
const API_URL = "https://esport-club.onrender.com/tournaments";

let tournaments = []; // populated from the API

const tournamentContainer = document.getElementById("tournamentContainer");
const searchTournament = document.getElementById("searchTournament");
const bookmarkList = document.getElementById("bookmarkList");
const statusFilters = document.getElementById("statusFilters");
const addTournamentForm = document.getElementById("addTournamentForm");

// ---- Session Storage keys ----
const SEARCH_KEY = "tournamentSearch";
const STATUS_KEY = "tournamentStatusFilter";
const BOOKMARK_KEY = "tournamentBookmarks";

const statusLabels = {
    upcoming: "Upcoming",
    ongoing: "Ongoing",
    completed: "Completed"
};

function formatDate(dateStr) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString("en-US", options);
}

// ===========================
// GET - load tournaments from the API (jQuery AJAX)
// ===========================
function loadTournaments() {

    tournamentContainer.innerHTML = `<p class="text-center w-100">Loading tournaments...</p>`;

    $.getJSON(API_URL)
        .done(function (data) {

            tournaments = data;
            restoreState();

        })
        .fail(function () {

            tournamentContainer.innerHTML = `
                <p class="text-center w-100 text-danger">
                    Could not load tournaments. Is json-server running at ${API_URL}?
                </p>
            `;

        });

}

function displayTournaments(tournamentArray) {

    tournamentContainer.innerHTML = "";

    if (tournamentArray.length === 0) {
        tournamentContainer.innerHTML = `<p class="text-center w-100">No tournaments found.</p>`;
        return;
    }

    tournamentArray.forEach(tournament => {

        tournamentContainer.innerHTML += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card bg-dark text-white h-100 shadow">

                    <div class="card-body">

                        <span class="badge status-badge status-${tournament.status} mb-2">
                            ${statusLabels[tournament.status]}
                        </span>

                        <h4>${tournament.name}</h4>

                        <p><strong>Game:</strong> ${tournament.game}</p>

                        <p><i class="fa-solid fa-calendar-days"></i> ${formatDate(tournament.date)}</p>

                        <p><i class="fa-solid fa-location-dot"></i> ${tournament.location}</p>

                        <p><strong>Prize Pool:</strong> ${tournament.prizePool}</p>

                        <p><strong>Teams:</strong> ${tournament.teams.join(", ")}</p>

                        <button class="btn btn-primary" onclick='saveBookmark(${JSON.stringify(tournament.id)})'>
                            <i class="fa-solid fa-bookmark"></i> Bookmark
                        </button>

                        <button class="btn btn-outline-light" onclick='deleteTournament(${JSON.stringify(tournament.id)})'>
                            <i class="fa-solid fa-trash"></i> Delete
                        </button>

                    </div>

                </div>
            </div>
        `;

    });

}

function applyFilters() {

    const keyword = searchTournament.value.toLowerCase();
    const activeStatus = document.querySelector(".btn-filter.active").dataset.status;

    // Persist current search & filter choice for this browser session
    sessionStorage.setItem(SEARCH_KEY, searchTournament.value);
    sessionStorage.setItem(STATUS_KEY, activeStatus);

    const result = tournaments.filter(tournament => {
        const matchesKeyword = tournament.name.toLowerCase().includes(keyword);
        const matchesStatus = activeStatus === "all" || tournament.status === activeStatus;
        return matchesKeyword && matchesStatus;
    });

    displayTournaments(result);

}

searchTournament.addEventListener("keyup", applyFilters);

statusFilters.addEventListener("click", function (e) {

    if (!e.target.classList.contains("btn-filter")) return;

    document.querySelectorAll(".btn-filter").forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");

    applyFilters();

});

// ===========================
// POST - add a new tournament via the API (jQuery AJAX)
// ===========================
addTournamentForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const newTournament = {
        name: document.getElementById("newName").value,
        game: document.getElementById("newGame").value,
        date: document.getElementById("newDate").value,
        location: document.getElementById("newLocation").value,
        status: document.getElementById("newStatus").value,
        prizePool: document.getElementById("newPrize").value,
        teams: document.getElementById("newTeams").value
            .split(",")
            .map(t => t.trim())
            .filter(t => t.length > 0)
    };

    $.ajax({
        url: API_URL,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(newTournament)
    })
        .done(function () {

            addTournamentForm.reset();
            loadTournaments();

        })
        .fail(function () {

            alert("Could not add tournament. Is json-server running?");

        });

});

// ===========================
// DELETE - remove a tournament via the API (jQuery AJAX)
// ===========================
function deleteTournament(id) {

    if (!confirm("Delete this tournament?")) return;

    $.ajax({
        url: `${API_URL}/${id}`,
        method: "DELETE"
    })
        .done(function () {

            removeBookmark(id);
            loadTournaments();

        })
        .fail(function () {

            alert("Could not delete tournament. Is json-server running?");

        });

}

// ===========================
// Session Storage - bookmarks (kept client-side, per browser session)
// ===========================
function saveBookmark(id) {

    let bookmarks = JSON.parse(sessionStorage.getItem(BOOKMARK_KEY)) || [];

    if (!bookmarks.includes(id)) {
        bookmarks.push(id);
        sessionStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));
    }

    showBookmarks();

}

function removeBookmark(id) {

    let bookmarks = JSON.parse(sessionStorage.getItem(BOOKMARK_KEY)) || [];
    bookmarks = bookmarks.filter(bId => bId !== id);
    sessionStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));

    showBookmarks();

}

function showBookmarks() {

    let bookmarks = JSON.parse(sessionStorage.getItem(BOOKMARK_KEY)) || [];

    bookmarkList.innerHTML = "";

    if (bookmarks.length === 0) {
        bookmarkList.innerHTML = `<li class="list-group-item">No bookmarks yet this session.</li>`;
        return;
    }

    bookmarks.forEach(id => {

        const tournament = tournaments.find(t => String(t.id) === String(id));
        if (!tournament) return;

        bookmarkList.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span><i class="fa-solid fa-bookmark"></i> ${tournament.name}</span>
                <button class="btn btn-sm btn-outline-light" onclick='removeBookmark(${JSON.stringify(tournament.id)})'>
                    Remove
                </button>
            </li>
        `;

    });

}

// ---- Restore saved search / filter state from Session Storage ----
function restoreState() {

    const savedSearch = sessionStorage.getItem(SEARCH_KEY);
    const savedStatus = sessionStorage.getItem(STATUS_KEY);

    if (savedSearch) {
        searchTournament.value = savedSearch;
    }

    if (savedStatus) {
        document.querySelectorAll(".btn-filter").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.status === savedStatus);
        });
    }

    applyFilters();
    showBookmarks();

}

loadTournaments();
