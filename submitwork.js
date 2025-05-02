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

async function submitRequest() {
    let date = new Date();
    const requestData = {

        type: document.getElementById('type').value,
        mins: document.getElementById('mins').value
    };

    let username;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith("username" + '=')) {
            username = cookie.substring(9);
            break;
        }
    }
    try {
        currdata = await db.collection("work").doc(username).get()
        requestData.push(currdata.data())
    } catch (error) {
        console.log("First data")
    }
    

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