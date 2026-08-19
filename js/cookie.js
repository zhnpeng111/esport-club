// =========================
// Cookie Functions
// =========================

// Set Cookie
function setCookie(name, value, days) {

    let date = new Date();

    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

    let expires = "expires=" + date.toUTCString();

    document.cookie =
        name + "=" + value + ";" + expires + ";path=/";

}

// Get Cookie
function getCookie(name) {

    let cookieName = name + "=";

    let decodedCookie = decodeURIComponent(document.cookie);

    let cookieArray = decodedCookie.split(";");

    for (let i = 0; i < cookieArray.length; i++) {

        let cookie = cookieArray[i];

        while (cookie.charAt(0) == " ") {

            cookie = cookie.substring(1);

        }

        if (cookie.indexOf(cookieName) == 0) {

            return cookie.substring(cookieName.length, cookie.length);

        }

    }

    return "";

}

// =========================
// Cookie Banner
// =========================

window.onload = function () {

    let cookie = getCookie("cookieAccepted");

    if (cookie == "true") {

        document.getElementById("cookie-banner").style.display = "none";

    }

}

// =========================
// Accept Button
// =========================

document.getElementById("acceptCookies").onclick = function () {

    setCookie("cookieAccepted", "true", 30);

    document.getElementById("cookie-banner").style.display = "none";

}