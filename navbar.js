// Load navbar.html into each page
document.addEventListener("DOMContentLoaded", () => {
    fetch("/navbar.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("afterbegin", data);
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].trim();
                if (cookie.startsWith("username" + '=')) {
                    if(cookie.substring(9)) {
                        document.getElementById('signin').style.display = "none";
                        document.getElementById('dashboard').style.display = "inline-block";
                    }
                }
                if (cookie.startsWith("admin" + '=')) {
                    if(cookie.substring(6)) {
                        document.getElementById('admin').style.display = "inline-block";
                    }
                }
            }
            attachNavbarEvents(); // Reattach event listeners after inserting the HTML
        });
    fetch("/cookie.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("beforeend", data);
        });
});

function attachNavbarEvents() {
    const menuIcon = document.querySelector('.menuIcon');
    const nav = document.querySelector('.overlay-menu');

    menuIcon.addEventListener('click', () => {
        if (nav.style.transform !== 'translateX(0%)') {
            nav.style.transform = 'translateX(0%)';
            nav.style.transition = 'transform 0.2s ease-out';
        } else {
            nav.style.transform = 'translateX(-100%)';
            nav.style.transition = 'transform 0.2s ease-out';
        }
    });

    // Toggle Menu Icon
    const toggleIcon = document.querySelector('.menuIcon');

    toggleIcon.addEventListener('click', () => {
        if (toggleIcon.className !== 'menuIcon toggle') {
            toggleIcon.className += ' toggle';
        } else {
            toggleIcon.className = 'menuIcon';
        }
    });
}

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    document.cookie = name + "=" + value + ";expires=" + d.toUTCString() + ";path=/";
}

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for(let cookie of cookies) {
        if (cookie.trim().startsWith(name + "=")) {
            return cookie.trim().substring((name + "=").length);
        }
    }
    return null;
}

function acceptCookies() {
    setCookie("cookiesAccepted", "true", 365);
    document.getElementById("cookie-consent").style.display = "none";
}

function denyCookies() {
    alert("You denied cookies. This page will now close.");
    window.location.href = "https://www.google.com";
}

window.onload = function() {
    if (!getCookie("cookiesAccepted")) {
        document.getElementById("cookie-consent").style.display = "block";
    }
    console.log("ran")
}