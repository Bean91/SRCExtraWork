function deleteCookie(name) {
  document.cookie = `${name}=; Max-Age=0; path=/`;
}

function signOut() {
    deleteCookie("session_token");
    window.location.href = "/static/signin.html";
}

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for(let cookie of cookies) {
        if (cookie.trim().startsWith(name + "=")) {
            return cookie.trim().substring((name + "=").length);
        }
    }
    return null;
}

function deleteAccount() {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        fetch('/delete_account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: getCookie("session_token") })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Account deleted successfully.");
                signOut();
            } else {
                alert("Error deleting account: " + data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    }
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


function loadWork() {
    let username = document.getElementById("searchbox").value;
    fetch('/fetch_work?'+username, {
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

window.onload = function() {
    if (!getCookie("session_token")) {
        window.location.href = "/static/notallowed.html";
        return;
    }
    fetch('/user_info', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: getCookie("session_token") })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log(data);
            document.getElementById("user").innerText = data.user_info[0];
            document.getElementById("currentemail").innerText = data.user_info[1];
            document.getElementById("currentfirstname").innerText = data.user_info[2];
            document.getElementById("currentlastname").innerText = data.user_info[3];
            document.getElementById("currentusername").innerText = data.user_info[0];
            document.getElementById("currentteam").innerText = data.user_info[4];
        } else {
            alert("Error fetching user info: " + data.error);
        }
    })
    .catch(error => console.error('Error:', error));
    loadWork();
}