async function welcome() {
    fetch("/get_username")
    document.getElementById("welcome").innerHTML = `Welcome to the Leaderboard, ${name}`;
}

async function loadLeaderboard() {
    let workData = [];
    let minsHold = 0;
    let username = "";
    fetch("/get_users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json())
    .then(users => {
        users.users.forEach(data => {
            const name = data[1] + " " + data[2];
            let team = "";
            let teamCode = data[3];
            if(teamCode === "nb"){
                team = "Novice Boys";
            } else if(teamCode === "ng"){
                team = "Novice Girls";
            } else if(teamCode === "vb"){
                team = "Varsity Boys";
            } else if(teamCode === "vg"){
                team = "Varsity Girls";
            }
            fetch("/name_to_username?name=" + name, {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response => response.json())
            .then(data => {
                username = data.username;
            });
            fetch("/user_work?username=" + username, {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response => response.json())
            .then(data => {
                work = data.work;
                work.forEach(workout => {
                    minsHold += workout[1];
                });
                if (minsHold > 0) {
                    workData.push([minsHold, name, team]);
                }
                
            });
            minsHold = 0;
        });
    });
    workData.sort((a, b) => b[0] - a[0]);
    const leaderboard = document.getElementById("leaderboardBody");
    leaderboard.innerHTML = "";
    workData.forEach(([mins, name, team]) => {
        leaderboard.innerHTML += `<tr><td>${name}</td><td>${team}</td><td>${mins}</td></tr>`;
    });
}

async function filter() {
    const teamFilter = document.getElementById("team").value;
    const typeFilter = document.getElementById("type").value;
    const timeFilter = document.getElementById("timeFilter").value;
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
let workData = [];
    let minsHold = 0;
    let username = "";
    fetch("/get_users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json())
    .then(users => {
        users.users.forEach(data => {
            const name = data[1] + " " + data[2];
            let team = "";
            let teamCode = data[3];
            if(teamCode === "nb"){
                team = "Novice Boys";
            } else if(teamCode === "ng"){
                team = "Novice Girls";
            } else if(teamCode === "vb"){
                team = "Varsity Boys";
            } else if(teamCode === "vg"){
                team = "Varsity Girls";
            }
            fetch("/name_to_username?name=" + name, {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response => response.json())
            .then(data => {
                username = data.username;
            });
            fetch("/user_work?username=" + username, {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response => response.json())
            .then(data => {
                work = data.work;
                work.forEach(workout => {
                    let date = new Date(workout[2]);
                    if (teamCode === teamFilter || teamFilter === "at") {
                        if (typeFilter === "all" || workout[0] === typeFilter) {
                            if (timeFilter === "all" || (date >= filter)) {
                                minsHold += workout[1];
                            }
                        }
                    }
                });
                if (minsHold > 0) {
                    workData.push([minsHold, name, team]);
                }
                
            });
            minsHold = 0;
        });
    });
    workData.sort((a, b) => b[0] - a[0]);
    const leaderboard = document.getElementById("leaderboardBody");
    leaderboard.innerHTML = "";
    workData.forEach(([mins, name, team]) => {
        leaderboard.innerHTML += `<tr><td>${name}</td><td>${team}</td><td>${mins}</td></tr>`;
    });
}

window.onload = async function() {
    welcome();
    await loadLeaderboard();
    await filter();
}