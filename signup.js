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

async function submit() {
    let passed = true;
    if (document.getElementById('password').value !== document.getElementById('confirm_password').value) {
        alert("Passwords do not match");
        passed = false;
    }
    if (document.getElementById('password').value.length < 8) {
        alert("Password must be at least 8 characters long");
        passed = false;
    }
    if (!document.getElementById('password').value.includes('!') && !document.getElementById('password').value.includes('@') && !document.getElementById('password').value.includes('#') && !document.getElementById('password').value.includes('?') && !document.getElementById('password').value.includes('$') && !document.getElementById('password').value.includes('%') && !document.getElementById('password').value.includes('^') && !document.getElementById('password').value.includes('&') && !document.getElementById('password').value.includes('*')) {
        alert("Password must contain at least one special character (!, @, #, ?, $, %, ^, &, *)");
        passed = false;
    }
    if (!document.getElementById('email').value.includes('@')) {
        alert("Please enter a valid email address");
        passed = false;
    }
    snapshot = await db.collection("accounts").get();
    snapshot.forEach(doc => {
        if (doc.id === document.getElementById('username').value) {
            alert("Username already exists");
            passed = false;
        }
    });

    const data = {
        name: document.getElementById('name').value,
        password: document.getElementById('password').value,
        team: document.getElementById('team').value,
        email: document.getElementById('email').value,
        admin: false,
        mvp: false
    };
    if (!passed) {
        return;
    } else if (passed) {
        db.collection("accounts").doc(document.getElementById('username').value).set(data)
    }
    
    setTimeout(() => {
        location.reload();
    }, 1000);
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const now = new Date();
    const futureDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
 
    try {
        const data = await db.collection("accounts").doc(username).get()
        if (username === data.id && password === data.data().password) {
            document.cookie = `username=${username};`;
            if (data.data().admin) {
                document.cookie = `admin=true;`;
            } else {
                document.cookie = `admin=false;`;
            }
            if (data.data().mvp) {
                document.cookie = `mvp=true;`;
            } else {
                document.cookie = `mvp=false;`;
            }
            alert("Login successful");
            window.location.href = "/index.html";
        } else {
            alert("Wrong password");
        }
    } catch (error) {
        alert("Account not found");
    }
}