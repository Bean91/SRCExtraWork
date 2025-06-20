// Load navbar.html into each page
document.addEventListener("DOMContentLoaded", () => {
    fetch("/static/navbar.html")
        .then(response => response.text())
        .then(data => {
            let dash = false;
            let submit = false;
            let signin = true;
            let admin = false;
            document.body.insertAdjacentHTML("afterbegin", data);
            if (getCookie("session_token")) {
                dash = true;
                submit = true;
                signin = false;
            }
            fetch("/isAdmin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ session_token: getCookie("session_token") })
            }).then(response => response.json())
            .then(data => {
                if (data.is_admin) {
                    admin = true;
                }
                console.log(dash, submit, signin, admin);
                attachNavbarEvents(dash, submit, signin, admin)
            }).catch(error => {
                console.error("Error checking admin status:", error);
            });
        });
    fetch("/static/cookie.html")
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

    if(dash){
        document.getElementById('dashboard').style.display = "inline-block";
    } else {
        document.getElementById('dashboard').style.display = "none";
    }
    if(submit){
        document.getElementById('submitwork').style.display = "inline-block";
    } else {
        document.getElementById('submitwork').style.display = "none";
    }
    if(signin){
        document.getElementById('signin').style.display = "inline-block";
    } else {
        document.getElementById('signin').style.display = "none";
    }
    if(admin){
        document.getElementById('admin').style.display = "inline-block";
    } else {
        document.getElementById('admin').style.display = "none";
    }
    menuIcon.addEventListener('click', () => {
        
        if (nav.style.transform !== 'translateX(0%)') {
            nav.style.transform = 'translateX(0%)';
            nav.style.transition = 'transform 0.2s ease-out';
        }
    });

    const toggleIcon = document.querySelector('.menuIcon');

    toggleIcon.addEventListener('click', () => {
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