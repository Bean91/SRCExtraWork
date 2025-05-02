const firebaseConfig = {
    apiKey: "AIzaSyAhYI3MaQWMTd_DhQwQW7pQRRXjmy_2ZuQ",
    authDomain: "rowing-extra-work.firebaseapp.com",
    projectId: "rowing-extra-work",
    storageBucket: "rowing-extra-work.firebasestorage.app",
    messagingSenderId: "550424826105",
    appId: "1:550424826105:web:8f4e82053bb3b67b1a5228",
    measurementId: "G-NHW04V84MM"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function checkSignIn() {
    const cookies = document.cookie.split(';');
    let done = false;
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith("username" + '=')) {
            if(cookie.substring(9)) {
                done = true;
            } else {
                window.location.href = "/notallowed.html";
            }
        }
    }
    if (!done) {
        window.location.href = "/notallowed.html";
    }
}

async function fillIn() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith("username" + '=')) {
            if(cookie.substring(9)) {
                document.getElementById("user").innerHTML = cookie.substring(9);
                document.getElementById("currentusername").innerHTML = cookie.substring(9);
                await db.collection("accounts").doc(cookie.substring(9)).get().then((data) => {
                    document.getElementById("currentname").innerHTML = data.data().name;
                    document.getElementById("currentemail").innerHTML = data.data().email;
                    document.getElementById("currentteam").innerHTML = data.data().team;
                }
                ).catch((error) => {
                    console.error("Error getting document:", error);
                });
            }
        }
    }
}

function signOut() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith("username" + '=')) {
            if(cookie.substring(9)) {
                document.cookie = "username=";
            }
        }
        if (cookie.startsWith("admin" + '=')) {
            if(cookie.substring(6)) {
                document.cookie = "admin=";
            }
        }
        if (cookie.startsWith("mvp" + '=')) {
            if(cookie.substring(4)) {
                document.cookie = "mvp=";
            }
        }
    }
    alert("You have been signed out");
    window.location.href = "/index.html";
}

async function deleteAccount() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith("username" + '=')) {
            if(cookie.substring(9)) {
                await db.collection("accounts").doc(cookie.substring(9)).delete().then(() => {
                    alert("Document successfully deleted!");
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                });
            }
        }
    }
    signOut();
}

async function usernameChange() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith("username" + '=')) {
            if(cookie.substring(9)) {
                let data = await db.collection("accounts").doc(cookie.substring(9)).get();
                let realData = data.data();
                console.log(realData);
                await db.collection("accounts").doc(cookie.substring(9)).delete();
                await db.collection("accounts").doc(document.getElementById("username").value).set(realData);
                document.cookie = "username=" + document.getElementById("username").value + ";";
                location.reload();
            }
        }
    }
}

async function nameChange() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith("username" + '=')) {
            if(cookie.substring(9)) {
                await db.collection("accounts").doc(cookie.substring(9)).update({
                    name: document.getElementById("name").value
                }).then(() => {
                    alert("Name successfully changed!");
                }).catch((error) => {
                    console.error("Error changing name: ", error);
                });
                location.reload();
            }
        }
    }
}

async function teamChange() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith("username" + '=')) {
            if(cookie.substring(9)) {
                await db.collection("accounts").doc(cookie.substring(9)).update({
                    email: document.getElementById("team").value
                }).then(() => {
                    alert("Team successfully changed!");
                }).catch((error) => {
                    console.error("Error changing team: ", error);
                });
                location.reload();
            }
        }
    }
}


window.onload = async () => {
    checkSignIn();
    await fillIn();
}