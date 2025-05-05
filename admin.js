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

let userList = document.getElementById('users');

async function removeData(id, area) {
    db.collection(area).doc(id).delete().then(() => {
        console.log("Document successfully deleted!");
        location.reload();
    });
}

async function fetchUsers() {
    let requestList = document.getElementById('users');
    const snapshot = await db.collection("accounts").get();
    snapshot.forEach(doc => {
        const data = doc.data();
        let teamname;
        if(data.team === "nb"){
            teamname = "Novice Boys";
        } else if(data.team === "ng"){
            teamname = "Novice Girls";
        } else if(data.team === "vb"){
            teamname = "Varsity Boys";
        } else if(data.team === "vg"){
            teamname = "Varsity Girls";
        }
        let li = `<li>${data.name} (${data.email}) in team: ${teamname}.`;
        if (data.admin) {
            li += ` Is a coach/coxswain.`;
        } if(data.mvp) {
            li += ` Is a captain.`;
        }
        li += ` <span onclick="removeData('${doc.id}', 'accounts')">Remove?</span></li>`;
        requestList.innerHTML += li;
    });
}

function checkAdmin() {
    const cookies = document.cookie.split(';');
    let done = false;
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith("admin" + '=')) {
            if(cookie.substring(6) === "true") {
                console.log("Admin");
                done = true;
            } else {
                window.location.href = "/notallowed.html";
                console.log("Not an admin");
            }
            console.log("Admin cookie found");
        }
    }
    if (!done) {
        window.location.href = "/notallowed.html";
        console.log("No admin cookie found");
    }
}

window.onload = async function() {
    checkAdmin();
    await fetchUsers();
}