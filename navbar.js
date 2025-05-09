// Load navbar.html into each page
document.addEventListener("DOMContentLoaded", () => {
    fetch("/navbar.html")
        .then(response => response.text())
        .then(data => {
            let dash = false;
            let submit = false;
            let signin = true;
            let admin = false;
             document.body.insertAdjacentHTML("afterbegin", data);
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].trim();
                if (cookie.startsWith("username" + '=')) {
                    if(cookie.substring(9)) {
                        document.getElementById('signin').style.display = "none";
                        document.getElementById('dashboard').style.display = "inline-block";
                        document.getElementById('submitwork').style.display = "inline-block";
                        let dash = true;
                        let submit = true;
                        let signin = false;
                    }
                }
                if (cookie.startsWith("admin" + '=')) {
                    if(cookie.substring(6) === "true") {
                        document.getElementById('admin').style.display = "inline-block";
                        let admin = true;
                    }
                }
            }
            attachNavbarEvents(dash, submit, signin, admin); // Reattach event listeners after inserting the HTML
        });
    fetch("/cookie.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("beforeend", data);
            console.log(getCookie("cookiesAccepted"))
            if (getCookie("cookiesAccepted") === "true") {
                document.getElementById("cookie-consent").style.display = "none";
                console.log("Cookies accepted");
            }
        }); 
});

function attachNavbarEvents(dash, submit, signin, admin) {
    const menuIcon = document.querySelector('.menuIcon');
    const nav = document.querySelector('.overlay-menu');

    menuIcon.addEventListener('click', () => {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.startsWith("username" + '=')) {
                if(cookie.substring(9)) {
                    document.getElementById('signin').style.display = "none";
                    document.getElementById('dashboard').style.display = "inline-block";
                    document.getElementById('submitwork').style.display = "inline-block";
                }
            }
            if (cookie.startsWith("admin" + '=')) {
                if(cookie.substring(6) === "true") {
                    document.getElementById('admin').style.display = "inline-block";
                }
            }
        }
        if (nav.style.transform !== 'translateX(0%)') {
            nav.style.transform = 'translateX(0%)';
            nav.style.transition = 'transform 0.2s ease-out';
        }
    });

    // Toggle Menu Icon
    const toggleIcon = document.querySelector('.menuIcon');

    toggleIcon.addEventListener('click', () => {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.startsWith("username" + '=')) {
                if(cookie.substring(9)) {
                    dash = true;
                    submit = true;
                    signin = false;
                }
            }
            if (cookie.startsWith("admin" + '=')) {
                if(cookie.substring(6) === "true") {
                    admin = true;
                }
            }
        }
        if (toggleIcon.className !== 'menuIcon toggle') {
            toggleIcon.className += ' toggle';
        } else {
            toggleIcon.className = 'menuIcon';
            document.querySelector('.overlay-menu').style.transform = 'translateX(-100%)';
        }
        if (!dash) {
            document.getElementById('over-dash').style.display = "none";
            console.log("Signed out");
        } 
        if (!submit) {
            document.getElementById('over-submit').style.display = "none";
            console.log("Signed out");
        }
        if (!signin) {
            document.getElementById('over-signin').style.display = "none";
            console.log("Signed in");
        }
        if (!admin) {
            document.getElementById('over-admin').style.display = "none";
            console.log("Not an admin");
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
    
}