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

async function welcome() {
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
    let account = await db.collection("accounts").doc(username).get();
    let data = account.data();
    let name = data.name;
    document.getElementById("welcome").innerHTML = `Welcome to the Leaderboard, ${name}`;
}

async function loadLeaderboard() {
    let data = [];

    const snapshot = await db.collection("work").get();

    for (const doc of snapshot.docs) {
        let minsHold = 0;

        const accountRef = await db.collection("accounts").doc(doc.id).get();
        const name = accountRef.data().name;
        let team = "";
        if(accountRef.data().team === "nb"){
            team = "Novice Boys";
        } else if(accountRef.data().team === "ng"){
            team = "Novice Girls";
        } else if(accountRef.data().team === "vb"){
            team = "Varsity Boys";
        } else if(accountRef.data().team === "vg"){
            team = "Varsity Girls";
        }

        const workouts = doc.data();
        for (const key in workouts) {
            if (workouts.hasOwnProperty(key) && workouts[key].mins) {
                minsHold += workouts[key].mins;
            }
        }
        if (minsHold > 0) {
            data.push([minsHold, name, team]);
        }
    }
    data.sort((a, b) => b[0] - a[0]);
    const leaderboard = document.getElementById("leaderboardBody");
    leaderboard.innerHTML = "";
    data.forEach(([mins, name, team]) => {
        leaderboard.innerHTML += `<tr><td>${name}</td><td>${team}</td><td>${mins}</td></tr>`;
    });
}

async function filter() {
    const teamFilter = document.getElementById("team").value;
    const typeFilter = document.getElementById("type").value;
    const timeFilter = document.getElementById("timeFilter").value;

    let data = [];

    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    let workDate;
    let filter = new Date();
    if (timeFilter === "week") {
        filter = sevenDaysAgo;
    } else if (timeFilter === "month") {
        filter = thirtyDaysAgo;
    }

    const snapshot = await db.collection("work").get();

    for (const doc of snapshot.docs) {
        let minsHold = 0;

        const accountRef = await db.collection("accounts").doc(doc.id).get();
        const name = accountRef.data().name;
        const teamCode = accountRef.data().team;

        if (teamCode === teamFilter || teamFilter === "at") {
            const workouts = doc.data();
            for (const key in workouts) {
                workDate = new Date(key);
                console.log(workDate);
                console.log(filter)
                if (workouts.hasOwnProperty(key) && workouts[key].mins) {
                    if (typeFilter === "all" || workouts[key].type === typeFilter) {
                        if (timeFilter === "all" || (workDate >= filter)) {
                            minsHold += workouts[key].mins;
                        }
                    }
                }
            }
            if (minsHold > 0) {
                let team = "";
                if(teamCode === "nb"){
                    team = "Novice Boys";
                } else if(teamCode === "ng"){
                    team = "Novice Girls";
                } else if(teamCode === "vb"){
                    team = "Varsity Boys";
                } else if(teamCode === "vg"){
                    team = "Varsity Girls";
                }
                data.push([minsHold, name, team]);
            }
        }
    }

    data.sort((a, b) => b[0] - a[0]);

    const leaderboard = document.getElementById("leaderboardBody");
    leaderboard.innerHTML = "";
    data.forEach(([mins, name, team]) => {
        leaderboard.innerHTML += `<tr><td>${name}</td><td>${team}</td><td>${mins}</td></tr>`;
    });
}


window.onload = async function() {
    await welcome();
    await loadLeaderboard();
}