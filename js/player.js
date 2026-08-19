const players = [
    {
        name: "Faker",
        team: "T1",
        game: "League of Legends",
        country: "South Korea",
        image: "images/faker.jpg"
    },
    {
        name: "TenZ",
        team: "Sentinels",
        game: "Valorant",
        country: "Canada",
        image: "images/tenz.jpg"
    },
    {
        name: "Jinggg",
        team: "Paper Rex",
        game: "Valorant",
        country: "Singapore",
        image: "images/jinggg.jpg"
    },
    {
        name: "Aspas",
        team: "MIBR",
        game: "Valorant",
        country: "Brazil",
        image: "images/aspas.jpg"
    },
    {
        name: "Demon1",
        team: "NRG",
        game: "Valorant",
        country: "USA",
        image: "images/demon1.jpg"
    },
    {
        name: "ZmjjKK",
        team: "EDward Gaming",
        game: "Valorant",
        country: "China",
        image: "images/zmjjkk.jpg"
    }
];

const playerContainer = document.getElementById("playerContainer");
const searchPlayer = document.getElementById("searchPlayer");
const favoriteList = document.getElementById("favoriteList");

function displayPlayers(playerArray) {

    playerContainer.innerHTML = "";

    playerArray.forEach(player => {

        playerContainer.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card bg-dark text-white h-100 shadow">

                    <img src="${player.image}"
                         class="card-img-top"
                         style="height:300px; object-fit:cover;">

                    <div class="card-body">

                        <h4>${player.name}</h4>

                        <p><strong>Team:</strong> ${player.team}</p>

                        <p><strong>Game:</strong> ${player.game}</p>

                        <p><strong>Country:</strong> ${player.country}</p>

                        <button
                            class="btn btn-primary"
                            onclick="saveFavourite('${player.name}')">

                            ❤️ Add Favourite

                        </button>

                    </div>

                </div>
            </div>
        `;

    });

}

displayPlayers(players);

searchPlayer.addEventListener("keyup", function () {

    const keyword = this.value.toLowerCase();

    const result = players.filter(player =>
        player.name.toLowerCase().includes(keyword)
    );

    displayPlayers(result);

});

function saveFavourite(name) {

    let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

    if (!favourites.includes(name)) {

        favourites.push(name);

        localStorage.setItem("favourites", JSON.stringify(favourites));

    }

    showFavourite();

}

function showFavourite() {

    let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

    favoriteList.innerHTML = "";

    favourites.forEach(player => {

        favoriteList.innerHTML += `
            <li class="list-group-item">
                ❤️ ${player}
            </li>
        `;

    });

}

showFavourite();