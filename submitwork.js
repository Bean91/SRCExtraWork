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
    let splitdata = document.getElementById('split').value;
    let distanceData = document.getElementById('dista').value;
    let typeData = document.getElementById('type').value;
    let minsData = document.getElementById('mins').value;
        if (split) {
            splitdata = parseFloat(splitdata);
        } 
        if (distance) {
            distanceData = parseFloat(distanceData);
        }
        minsData = parseFloat(minsData);
        console.log(typeof(splitdata), typeof(distanceData), typeof(minsData));
    if(Number.isNaN(splitdata) || Number.isNaN(distanceData) || Number.isNaN(minsData)) {
        alert("Please make sure you use only numbers, no letters.");
        return;
    }
    let requestData;
    if (split) {
        console.log("Split");
        requestData = {
            [date]: {
                hasSplit: split,
                hasDistance: distance,
                split: splitdata,
                type: typeData,
                mins: minsData
            }
        };
    } else if (distance) {
        console.log("Distance");
        requestData = {
            [date]: {
                hasSplit: split,
                hasDistance: distance,
                distance: distanceData,
                type: typeData,
                mins: minsData
            }
        };
    } else {
        console.log("Core");
        requestData = {
            [date]: {
                hasSplit: split,
                hasDistance: distance,
                type: typeData,
                mins: minsData
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

    currdata = await db.collection("work").doc(username).get()
    let data = currdata.data();
    console.log(data);
    data = {
        ...data,
        ...requestData
    }
    console.log(data);

    db.collection("work").doc(username).set(data)
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