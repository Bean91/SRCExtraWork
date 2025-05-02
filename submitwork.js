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

let split = true;
let distance = false;

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

function change() {
    const type = document.getElementById('type').value;
    if (type === "bike" || type === "run") {
        document.getElementById('distan').style.display = "inline-block";
        document.getElementById('splits').style.display = "none";
        split = false;
        distance = true;
    } else if (type === "erg" || type === "berg") {
        document.getElementById('distan').style.display = "none";
        document.getElementById('splits').style.display = "inline-block";
        split = true;
        distance = false;
    } else if (type === "core") {
        document.getElementById('distan').style.display = "none";
        document.getElementById('splits').style.display = "none";
        split = false;
        distance = false;
    }
}

async function submitWork() {
    let date = document.getElementById('date').value;
    console.log(split);
    console.log(distance);
    console.log(date);
    let requestData;
    if (split) {
        console.log("Split");
        requestData = {
            [date]: {
                hasSplit: split,
                hasDistance: distance,
                split: document.getElementById('split').value,
                type: document.getElementById('type').value,
                mins: document.getElementById('mins').value
            }
        };
    } else if (distance) {
        console.log("Distance");
        requestData = {
            [date]: {
                hasSplit: split,
                hasDistance: distance,
                distance: document.getElementById('dista').value,
                type: document.getElementById('type').value,
                mins: document.getElementById('mins').value
            }
        };
    } else {
        console.log("Core");
        requestData = {
            [date]: {
                hasSplit: split,
                hasDistance: distance,
                type: document.getElementById('type').value,
                mins: document.getElementById('mins').value
            }
        };
    }

    let username;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith("username" + '=')) {
            username = cookie.substring(9);
            break;
        }
    }
    // try {
        currdata = await db.collection("work").doc(username).get()
        let data = currdata.data();
        data = {
            ...data,
            ...requestData
        }
        
    // } catch (error) {
    //     console.log("First data")
    // }
    

    db.collection("work").doc(username).set(requestData)
        .then(() => {
            console.log("Work submitted successfully");
            alert("Work submitted successfully");
        })
        .catch((error) => {
            console.error("Error submitting work: ", error);
            alert("Error submitting work");
        });
    
    setTimeout(() => {
        location.reload();
    }, 1000);
}

window.onload = function() {
    checkSignIn();
}