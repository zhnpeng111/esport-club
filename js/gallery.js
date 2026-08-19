$(document).ready(function () {

    const localGallery = [
        { title: "Moble Legends Mid Season Cup 2026 Champions", image: "images/mlbb-champions.jpeg" },
        { title: "League of legends MId-Season Invitational 2026 Champions", image: "images/lol-champions.avif" },
        { title: "Esports World Cup 2026 VALORANT Champions", image: "images/valorant-champions.webp" },
        { title: "Counter-Strike IEM Cologne Major Champions 2026", image: "images/cs-champions.webp" },
        { title: "Valorant Champion Tour Americas Kickoff 2025", image: "images/valorant-champions-2025.jpg" },
        { title: "Valorant Champions 2024", image: "images/valorant-Champions-2024.webp" }
    ];

    let html = '';

    $.each(localGallery, function (index, item) {
        html += `
            <div class="col-md-6 col-12 mb-4">
                <div class="game-card shadow">
                    <img src="${item.image}" 
                         class="img-fluid" 
                         style="height:380px; width:100%; object-fit:cover;" 
                         alt="${item.title}">
                    <div class="p-2 text-center">
                        <h5 class="m-0 fs-6 text-white-50">${item.title}</h5>
                    </div>
                </div>
            </div>
        `;
    });

    $('#gallery-container').html(html);

});