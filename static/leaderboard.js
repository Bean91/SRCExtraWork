function welcome() {
    fetch("/get_username", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json())
    .then(name => {
        console.log(name.name)
        if(name.success) {
            document.getElementById("welcome").innerHTML = `Welcome to the Leaderboard, ${name.name}`;
        }
    });
}

async function loadLeaderboard() {
    let workData = [];
    let usersResponse = await fetch("/get_users", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    });
    let users = await usersResponse.json();

    // Map each user to a promise that fetches their work data
    let userPromises = users.users.map(async data => {
        const name = data[1] + " " + data[2];
        let team = "";
        let teamCode = data[3];
        if (teamCode === "nb") team = "Novice Boys";
        else if (teamCode === "ng") team = "Novice Girls";
        else if (teamCode === "vb") team = "Varsity Boys";
        else if (teamCode === "vg") team = "Varsity Girls";

        // Get username
        let usernameResp = await fetch(`/name_to_username?first_name=${data[1]}&last_name=${data[2]}`, {
            method: "post",
            headers: { "Content-Type": "application/json" }
        });
        let usernameData = await usernameResp.json();
        let username = usernameData.username;

        // Get work
        let workResp = await fetch(`/user_work?username=${username}`, {
            method: "post",
            headers: { "Content-Type": "application/json" }
        });
        let workDataResp = await workResp.json();
        let minsHold = 0;
        workDataResp.work.forEach(workout => {
            minsHold += workout[1];
        });
        if (minsHold > 0) {
            workData.push([minsHold, name, team]);
        }
    });

    // Wait for all user fetches to finish
    await Promise.all(userPromises);

    // Now workData is ready to use
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
    let filterDate = new Date();
    if (timeFilter === "week") {
        filterDate = sevenDaysAgo;
    } else if (timeFilter === "month") {
        filterDate = thirtyDaysAgo;
    }

    let workData = [];
    let usersResponse = await fetch("/get_users", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    });
    let users = await usersResponse.json();

    let userPromises = users.users.map(async data => {
        const name = data[1] + " " + data[2];
        let team = "";
        let teamCode = data[3];
        if (teamCode === "nb") team = "Novice Boys";
        else if (teamCode === "ng") team = "Novice Girls";
        else if (teamCode === "vb") team = "Varsity Boys";
        else if (teamCode === "vg") team = "Varsity Girls";

        // Get username
        let usernameResp = await fetch(`/name_to_username?first_name=${data[1]}&last_name=${data[2]}`, {
            method: "post",
            headers: { "Content-Type": "application/json" }
        });
        let usernameData = await usernameResp.json();
        let username = usernameData.username;

        // Get work
        let workResp = await fetch(`/user_work?username=${username}`, {
            method: "post",
            headers: { "Content-Type": "application/json" }
        });
        let workDataResp = await workResp.json();
        let minsHold = 0;
        workDataResp.work.forEach(workout => {
            let date = new Date(workout[2]);
            if ((teamCode === teamFilter || teamFilter === "at") &&
                (typeFilter === "all" || workout[0] === typeFilter) &&
                (timeFilter === "all" || date >= filterDate)) {
                minsHold += workout[1];
            }
        });
        if (minsHold > 0) {
            workData.push([minsHold, name, team]);
        }
    });

    await Promise.all(userPromises);

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
}