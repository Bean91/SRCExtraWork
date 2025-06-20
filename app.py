import os, bcrypt, secrets, dbservice as db
from fastapi import FastAPI, Form, Response, Cookie, Query
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, RedirectResponse
from dotenv import load_dotenv

load_dotenv()

db.create_user_table()
db.create_work_table()

def hash_password(plain_password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(plain_password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

app = FastAPI(title="SRC Extra Work")

app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return FileResponse("static/index.html")

@app.post("/signup")
def signup(username: str = Form(...), password: str = Form(...), confirm_password: str = Form(...), email: str = Form(...), first_name: str = Form(...), last_name: str = Form(...), team: str = Form(...)):
    if db.get_user_password(username):
        return {"error": "Username already exists"}
    if password != confirm_password:
        return {"error": "Passwords do not match"}
    hashed = hash_password(password)
    db.create_user(username, hashed, email, first_name, last_name, team)
    return RedirectResponse(url="/static/signin.html", status_code=303)

@app.post("/login")
def login(response: Response, username: str = Form(...), password: str = Form(...)):
    if bcrypt.checkpw(password.encode('utf-8'), db.get_user_password(username).encode('utf-8')):
        session_token = secrets.token_urlsafe(32)
        db.store_session(session_token, username)
        response = RedirectResponse(url="/", status_code=303)
        response.set_cookie(key="session_token", value=session_token, max_age=7200, httponly=False)
        return response
    return {"error": "Invalid credentials"}

@app.post("/isAdmin")
def is_admin(session_token: str = Cookie(None)):
    if not session_token:
        return {"is_admin": False}
    username = db.get_session_user(session_token)
    if not username:
        return {"is_admin": False}
    return {"is_admin": db.check_admin(username)}

@app.post("/user_info")
def user_info(session_token: str = Cookie(default=None)):
    if not session_token:
        return {"error": "No session token provided. Please log in."}
    username = db.get_session_user(session_token)
    user_info = db.get_user_info(username)
    if user_info:
        print(user_info)
        return {"success": True, "user_info": user_info}
    return {"error": "User not found."}

@app.post("/updateusername")
def update_user(username: str = Form(...), session_token: str = Cookie(default=None)):
    if not session_token:
        return {"error": "No session token provided. Please log in."}
    current_user = db.get_session_user(session_token)
    if current_user != username:
        return {"error": "You can only update your own information."}
    db.update_user(current_user, username)
    return RedirectResponse(url="/static/dashboard.html", status_code=303)

@app.post("/updateemail")
def update_email(email: str = Form(...), session_token: str = Cookie(default=None)):
    if not session_token:
        return {"error": "No session token provided. Please log in."}
    username = db.get_session_user(session_token)
    db.update_user_email(username, email)
    return RedirectResponse(url="/static/dashboard.html", status_code=303)

@app.post("/delete_account")
def delete_account(session_token: str = Cookie(default=None)):
    if not session_token:
        return {"error": "No session token provided. Please log in."}
    username = db.get_session_user(session_token)
    db.delete_user(username)
    return RedirectResponse(url="/", status_code=303)

@app.post("/updatefirstname")
def update_firstname(firstname: str = Form(...), session_token: str = Cookie(default=None)):
    if not session_token:
        return {"error": "No session token provided. Please log in."}
    username = db.get_session_user(session_token)
    db.update_user_firstname(username, firstname)
    return RedirectResponse(url="/static/dashboard.html", status_code=303)

@app.post("/updatelastname")
def update_lastname(lastname: str = Form(...), session_token: str = Cookie(default=None)):
    if not session_token:
        return {"error": "No session token provided. Please log in."}
    username = db.get_session_user(session_token)
    db.update_user_lastname(username, lastname)
    return RedirectResponse(url="/static/dashboard.html", status_code=303)

@app.post("/updateteam")
def update_team(team: str = Form(...), session_token: str = Cookie(default=None)):
    if not session_token:
        return {"error": "No session token provided. Please log in."}
    username = db.get_session_user(session_token)
    db.update_user_team(username, team)
    return RedirectResponse(url="/static/dashboard.html", status_code=303)

@app.post("/remove_work")
def remove_work(work_id: str = Query()):
    work_id = int(work_id)
    print(work_id)
    deletehash = db.remove_work(work_id)
    return {"success": True, "deletehash": deletehash}

@app.post("/load_work")
def load_work(session_token: str = Cookie(default=None)):
    if not session_token:
        return {"error": "No session token provided. Please log in."}
    username = db.get_session_user(session_token)
    if not username:
        return {"error": "Invalid session token."}
    work_items = db.load_work(username)
    return {"success": True, "work": work_items}

@app.post("/submit_work")
def submit_work(date: str = Query(...), split_distance: str = Query(...), type: str = Query(...), mins: str = Query(...), image: str = Query(...), deletehash: str = Query(...), session_token: str = Cookie(default=None)):
    if not session_token:
        return {"error": "No session token provided. Please log in."}
    username = db.get_session_user(session_token)
    if not username:
        return {"error": "Invalid session token."}
    if not date or not split_distance or not type or not mins or not image:
        return {"error": "All fields are required."}
    work_id = db.submit_work(username, date, split_distance, type, mins, image, deletehash)
    return {"success": True}

@app.post("/remove_user")
def delete_account(username: str = Query()):
    db.delete_user(username)
    return RedirectResponse(url="/", status_code=303)

@app.post("/get_users")
def get_users():
    users = db.get_all_users()
    return {"success": True, "users": users}

@app.post("/get_username")
def get_username(session_token: str = Cookie(default=None)):
    if not session_token:
        return {"success": False}
    username = db.get_session_user(session_token)
    if not username:
        return {"success": False}
    data = db.get_user_name(username)
    return {"success": True, "name": data[0]}

@app.post("/user_work")
def user_work(username: str = Query()):
    work_items = db.load_work(username)
    return {"success": True, "work": work_items}