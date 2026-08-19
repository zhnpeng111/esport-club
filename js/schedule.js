const events = [
    {
        title: "Esports Gaming Night",
        type: "Social",
        date: "22 August 2026",
        location: "Kuala Lumpur, Malaysia",
        description: "A casual gaming night where esports fans can meet, play together and enjoy a fun gaming experience."
    },
    {
        title: "Esports Watch Party",
        type: "Social",
        date: "29 August 2026",
        location: "Petaling Jaya, Selangor, Malaysia",
        description: "Watch and enjoy exciting esports matches together with fellow fans and share the hype."
    },
    {
        title: "Esports Content Creator Meetup",
        type: "Social",
        date: "5 September 2026",
        location: "Kuala Lumpur, Malaysia",
        description: "Meet fellow content creators, exchange ideas and grow together in the esports content scene."
    },
    {
        title: "Esports Strategy Workshop",
        type: "Learning",
        date: "12 September 2026",
        location: "Johor Bahru, Johor, Malaysia",
        description: "Learn game strategies, teamwork, communication and decision-making from experienced players."
    },
    {
        title: "Game Development Workshop",
        type: "Learning",
        date: "19 September 2026",
        location: "Cyberjaya, Selangor, Malaysia",
        description: "Discover the basics of game development, game design and the technology behind esports."
    },
    {
        title: "Player Wellness Talk",
        type: "Learning",
        date: "26 September 2026",
        location: "Ipoh, Perak, Malaysia",
        description: "Learn about healthy gaming habits, time management and maintaining a balanced gaming lifestyle."
    },
    {
        title: "Esports Community Meetup",
        type: "Community",
        date: "3 October 2026",
        location: "Penang, Malaysia",
        description: "A friendly meetup for esports enthusiasts to connect, share experiences and build new friendships."
    },
    {
        title: "Esports Charity Community Day",
        type: "Community",
        date: "10 October 2026",
        location: "Melaka, Malaysia",
        description: "Join us in giving back to the community through charity activities and esports fun events."
    },
    {
        title: "Esports Networking Day",
        type: "Community",
        date: "17 October 2026",
        location: "Kuching, Sarawak, Malaysia",
        description: "Network with gamers, creators and industry professionals interested in the esports community."
    }
];

const eventContainer = document.getElementById("eventContainer");
const savedEvents = document.getElementById("savedEvents");

function displayEvents() {
    eventContainer.innerHTML = "";

    events.forEach(event => {
        let badgeClass = "bg-secondary";

        if (event.type === "Social") {
            badgeClass = "bg-primary";
        } else if (event.type === "Learning") {
            badgeClass = "bg-success";
        } else if (event.type === "Community") {
            badgeClass = "bg-warning text-dark";
        }

        eventContainer.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card bg-dark text-white h-100 shadow">
                    <div class="card-body">
                        <span class="badge ${badgeClass} mb-3">${event.type}</span>

                        <h4>${event.title}</h4>

                        <p><strong>Date:</strong> ${event.date}</p>

                        <p><strong>Location:</strong> ${event.location}</p>

                        <p>${event.description}</p>

                        <button
                            class="btn btn-success"
                            onclick="saveEvent('${event.title}')">
                            ⭐ Save Event
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

displayEvents();

function saveEvent(title) {
    let myEvents = JSON.parse(localStorage.getItem("savedEvents")) || [];

    if (!myEvents.includes(title)) {
        myEvents.push(title);
        localStorage.setItem("savedEvents", JSON.stringify(myEvents));
    }

    showSavedEvents();
}

function showSavedEvents() {
    let myEvents = JSON.parse(localStorage.getItem("savedEvents")) || [];

    savedEvents.innerHTML = "";

    myEvents.forEach(event => {
        savedEvents.innerHTML += `
            <li class="list-group-item">
                ⭐ ${event}
            </li>
        `;
    });
}

showSavedEvents();
