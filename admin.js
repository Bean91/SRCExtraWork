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
    let team = "";
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

async function searchUsers() {
    let userRequested = document.getElementById('searchbox').value;
    let dataTable = document.getElementById('searchtable');
    let username;
    const snapshot = await db.collection("accounts").get()
    snapshot.forEach(document => {
        if (document.data().name === userRequested) {
            username = document.id;
        }
    });
    if (username === undefined) {
        alert("User not found");
        return;
    }
    let doc = await db.collection("work").doc(username).get();
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
        } else {
            alert("User has no extra work");
            return;
        }
    });
    document.getElementById('searchresults').style.display = "block";
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

window.onload = async function() {
    checkAdmin();
    await fetchUsers();
}