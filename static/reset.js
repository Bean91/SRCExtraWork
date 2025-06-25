function getSessionToken() {
    const params = new URLSearchParams(window.location.search);
    return params.get("session_token");
}

function saveSessionToken() {
    const expiration = new Date(Date.now() + 2 * 60 * 60 * 1000);
    document.cookie = `session_token=${getSessionToken()}; expires=${expiration.toUTCString()}; path=/;`;
}

window.onload = function() {
    saveSessionToken();
}