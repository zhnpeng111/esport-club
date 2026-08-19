window.addEventListener("scroll", function () {

    let navbar = document.getElementById("mainNavbar");

    if (window.scrollY > 50) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

});