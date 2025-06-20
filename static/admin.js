let userList = document.getElementById('users');

function removeWork(id) {
    if (confirm("Are you sure you want to remove this work? This action cannot be undone.")) {
        fetch("/remove_work?work_id="+id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: id})
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Work removed successfully.");
                deleteImgurImage(data.deletehash);
                location.reload();
            } else {
                alert("Error removing work: " + data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

function removeUser(username) {
    if (confirm("Are you sure you want to remove this user? This action cannot be undone.")) {
        fetch("/remove_user?username="+username, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: username})
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("User removed successfully.");
                location.reload();
            } else {
                alert("Error removing user: " + data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

function fetchUsers() {
    fetch("/get_users", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({session_token: getCookie("session_token")})
    }).then(response => response.json())
    .then(userInfo => {
        userInfo.users.forEach(data => {;
            console.log(data)
            let requestList = document.getElementById('users');
            let teamname;
            let team = data[3]
            if(team === "nb"){
                teamname = "Novice Boys";
            } else if(team === "ng"){
                teamname = "Novice Girls";
            } else if(team === "vb"){
                teamname = "Varsity Boys";
            } else if(team === "vg"){
                teamname = "Varsity Girls";
            }
            let li = `<li>${data[1]} ${data[2]} (${data[0]}) in team: ${teamname}.`;
            if (data[4]) {
                li += ` Is a coach/coxswain (or creator).`;
            }
            li += ` <span onclick="removeUser(${data[5]})">Remove?</span></li>`;
            requestList.innerHTML += li;
            document.getElementById('searchbox').innerHTML += `<option value="${data[1]} ${data[2]}">${data[1]} ${data[2]}</option>`;
        });
    });
    
}

function checkAdmin() {
    fetch("/isAdmin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ session_token: getCookie("session_token") })
    }).then(response => response.json())
    .then(data => {
        if (!data.is_admin) {
            window.location.href = "/static/notallowed.html";
        }
    });
}

function loadWork() {
    document.getElementById("searchresults").style.display = "block"
    let username = document.getElementById("searchbox").value
    fetch('/user_work?username='+username, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: getCookie("session_token") })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log(data)
            const workList = document.getElementById("extraworkbody");
            workList.innerHTML = "";
            data.work.forEach(work => {
                const workItem = document.createElement("tr");
                workItem.className = "work-item";
                let date = new Date(work[2]);
                date.toLocaleDateString();
                workItem.innerHTML = `
                    <td>${date}</td>
                    <td>${work[0]}</td>
                    <td>${work[1]}</td>
                    <td>${work[5]}</td>
                    <td><a href="${work[3]}" target="_blank" rel="noreferrer">Image Link</a></td>
                    <td><a onclick="removeWork('${work[4]}')">Remove Work</a></td>
                `;
                workList.appendChild(workItem);
            });
        } else {
           document.getElementById("extraworkbody").innerHTML = "<tr><td colspan='6'>No work found.</td></tr>";
           document.getElementById("extraworkhead").style.display = "none";
        }
        if(!data.work || data.work.length === 0) {
            document.getElementById("extraworkbody").innerHTML = "<tr><td colspan='6'>No work found.</td></tr>";
            document.getElementById("extraworkhead").style.display = "none";
        }
    })
    .catch(error => console.error('Error:', error));
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
    fetchUsers();
}