function getCookie(name) {
    const cookies = document.cookie.split(';');
    for(let cookie of cookies) {
        if (cookie.trim().startsWith(name + "=")) {
            return cookie.trim().substring((name + "=").length);
        }
    }
    return null;
}

window.onload = function() {
    if (getCookie("session_token")) {
        window.location.href = "/static/notallowed.html";
    }
};