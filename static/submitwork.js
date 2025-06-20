const IMGUR_CLIENT_ID = "5be34558b5d3a89";

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for(let cookie of cookies) {
        if (cookie.trim().startsWith(name + "=")) {
            return cookie.trim().substring((name + "=").length);
        }
    }
    return null;
}

window.onload = function() {
    if (!getCookie("session_token")) {
        window.location.href = "/static/notallowed.html";
    }
};

async function uploadToImgur(imageFile) {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch("https://api.imgur.com/3/image", {
        method: "POST",
        headers: {
            Authorization: "Client-ID " + IMGUR_CLIENT_ID
        },
        body: formData
    });

    const data = await response.json();
    if (data.success) {
        return {
            link: data.data.link,
            deletehash: data.data.deletehash
        };
    } else {
        throw new Error("Imgur upload failed");
    }
}

async function submit() {
    let date = document.getElementById('date').value;
    let splitDistanceData = document.getElementById('split_distance').value;
    let typeData = document.getElementById('type').value;
    let minsData = document.getElementById('mins').value;
    minsData = parseFloat(minsData);
    console.log(typeof(splitdata), typeof(distanceData), typeof(minsData));
    if(Number.isNaN(splitDistanceData) || Number.isNaN(minsData)) {
        alert("Please make sure you use only numbers, no letters.");
        return;
    }
    const imageFile = document.getElementById("image").files[0];
    let imageUrl = "";
    let deleteHash = "";
    let requestData = "";
    if (imageFile) {
        try {
            const imgurData = await uploadToImgur(imageFile);
            imageUrl = imgurData.link;
            deleteHash = imgurData.deletehash;
        } catch (err) {
            alert("Image upload failed: " + err.message);
            return;
        }
    }
    if (imageUrl) {
        requestData = "?date=" + date + "&split_distance=" + splitDistanceData + "&type=" + typeData + "&mins=" + minsData + "&image=" + imageUrl + "&deletehash=" + deleteHash;
    }
    fetch("/submit_work" + requestData, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            token: getCookie("session_token")
        })
    }).then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Work submitted successfully!");
            window.location.href = "/";
        } else {
            alert("Error submitting work: " + data.error);
        }
    }).catch(error => {
        console.error("Error:", error);
        alert("An error occurred while submitting work.");
    });
}

window.onload = function() {
    checkSignIn();
}