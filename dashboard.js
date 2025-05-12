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
                    document.getElementById("currentpassword").innerHTML = data.data().password;
                    if(data.data().team === "nb"){
                        document.getElementById("currentteam").innerHTML = "Novice Boys";
                    } else if(data.data().team === "ng"){
                        document.getElementById("currentteam").innerHTML = "Novice Girls";
                    } else if(data.data().team === "vb"){
                        document.getElementById("currentteam").innerHTML = "Varsity Boys";
                    } else if(data.data().team === "vg"){
                        document.getElementById("currentteam").innerHTML = "Varsity Girls";
                    }
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
    if(confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
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
                    team: document.getElementById("team").value
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

async function emailChange() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith("username" + '=')) {
            if(cookie.substring(9)) {
                await db.collection("accounts").doc(cookie.substring(9)).update({
                    email: document.getElementById("email").value
                }).then(() => {
                    alert("Email successfully changed!");
                }).catch((error) => {
                    console.error("Error changing email: ", error);
                });
                location.reload();
            }
        }
    }
}

async function passwordChange() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith("username" + '=')) {
            if(cookie.substring(9)) {
                await db.collection("accounts").doc(cookie.substring(9)).update({
                    password: document.getElementById("password").value
                }).then(() => {
                    alert("Password successfully changed!");
                }).catch((error) => {
                    console.error("Error changing password: ", error);
                });
                location.reload();
            }
        }
    }
}

async function loadWork() {
    let username;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith("username" + '=')) {
            if(cookie.substring(9)) {
                username = cookie.substring(9);
            }
        }
    }
    let doc = await db.collection("work").doc(username).get();
    let dataTable = document.getElementById('table');
    if (doc.exists) {
        let docData = doc.data();
        console.log(docData);
        Object.keys(docData).forEach(key => {
            console.log(key);
            console.log(docData[key]);
            let data = docData[key];
            let date = new Date(key).toLocaleString();
            if (data) {
                if (data.hasSplit) {
                    dataTable.innerHTML += `<tr><td>${data.mins}</td><td>${data.split}</td><td>${data.type}</td><td>${date}</td><td><a href="${data.image}" target="_blank" rel="noreferrer">Image</a></td><td><a onclick="deleteWorkout('${key}')">Delete?</a></td></tr>`;
                } else if (data.hasDistance) {
                    dataTable.innerHTML += `<tr><td>${data.mins}</td><td>${data.distance}</td><td>${data.type}</td><td>${date}</td><td><a href="${data.image}" target="_blank" rel="noreferrer">Image</a></td><td><a onclick="deleteWorkout('${key}')">Delete?</a></td></tr>`;
                } else {
                    dataTable.innerHTML += `<tr><td>${data.mins}</td><td>N/A</td><td>${data.type}</td><td>${date}</td><td><a href="${data.image}" target="_blank" rel="noreferrer">Image</a></td><td><a onclick="deleteWorkout('${key}')">Delete?</a></td></tr>`;
                }
            }
        });
    } else {
        dataTable.innerHTML = `<tr><td colspan="6">No data found</td></tr>`;
    }
}

async function deleteWorkout(id) {
    let userRequested = document.getElementById('searchbox').value;
    let dataTable = document.getElementById('searchtable');
    let username;
    const snapshot = await db.collection("accounts").get()
    snapshot.forEach(document => {
        if (document.data().name === userRequested) {
            username = document.id;
        }
    });
    let doc = await db.collection("work").doc(username).get();
    let docData = doc.data();
    deleteImgurImage(docData[id].deletehash);
    console.log(docData);
    if (docData.length !== 1) {
        Object.keys(docData).forEach(key => {
            console.log(key);
            console.log(docData[key]);
            if (key === id) {
                db.collection("work").doc(username).update({
                    [key]: firebase.firestore.FieldValue.delete()
                })
            }
        });
    } else {
        db.collection("work").doc(userRequested).delete()
    }
    setTimeout(() => {
        location.reload();
    }, 1000);
}

function deleteImgurImage(deletehash) {
    const clientId = '5be34558b5d3a89';
    const url = `https://api.imgur.com/3/image/${deletehash}`;
  
    fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Client-ID ${clientId}`,
      },
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('Image deleted successfully.');
      } else {
        console.error('Failed to delete image:', data);
      }
    })
    .catch(error => console.error('Error deleting image:', error));
  }

window.onload = async () => {
    checkSignIn();
    await fillIn();
    await loadWork();
}