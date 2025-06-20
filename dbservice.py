import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()

neon_db = os.environ["NEON_DB"]

def get_db_connection():
    return psycopg2.connect(neon_db)

def create_user_table():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            session_token TEXT,
            team VARCHAR(255) NOT NULL,
            admin BOOLEAN DEFAULT FALSE
        );
        """
    )
    conn.commit()
    cursor.close()
    conn.close()

def get_user_password(username):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT password FROM users WHERE username = %s;",
        (username,)
    )
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    return result[0] if result else None

def get_user_name(username):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT first_name, last_name FROM users WHERE username = %s;",
        (username,)
    )
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    return result if result else None

def create_user(username, hashed_password, email, first_name, last_name, team):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO users (username, password, email, first_name, last_name, session_token, team) VALUES (%s, %s, %s, %s, %s, %s, %s);",
        (username, hashed_password, email, first_name, last_name, "N/A", team)
    )
    conn.commit()
    cursor.close()
    conn.close()

def store_session(session_token, username):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE users SET session_token = %s WHERE username = %s;",
        (session_token, username)
    )
    conn.commit()
    cursor.close()
    conn.close()

def get_session_user(session_token):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT username FROM users WHERE session_token = %s;",
        (session_token,)
    )
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    return result[0] if result else None

def update_user(current_user, username):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE users SET username = %s WHERE username = %s;",
        (username, current_user)
    )
    cursor.execute(
        "UPDATE work SET user_id = %s WHERE user_id = %s;",
        (username, current_user)
    )
    conn.commit()
    cursor.close()
    conn.close()

def update_user_email(username, email):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE users SET email = %s WHERE username = %s;",
        (email, username)
    )
    conn.commit()
    cursor.close()
    conn.close()

def delete_user(username):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM users WHERE username = %s;",
        (username,)
    )
    cursor.execute(
        "DELETE FROM work WHERE user_id = %s;",
        (username,)
    )
    conn.commit()
    cursor.close()
    conn.close()

def update_user_firstname(username, first_name):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE users SET first_name = %s WHERE username = %s;",
        (first_name, username)
    )
    conn.commit()
    cursor.close()
    conn.close()

def update_user_lastname(username, last_name):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE users SET last_name = %s WHERE username = %s;",
        (last_name, username)
    )
    conn.commit()
    cursor.close()
    conn.close()

def get_user_info(username):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT username, email, first_name, last_name, team FROM users WHERE username = %s;",
        (username,)
    )
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    return result if result else None

def update_user_password(username, hashed_password):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE users SET password = %s WHERE username = %s;",
        (hashed_password, username)
    )
    conn.commit()
    cursor.close()
    conn.close()

def check_admin(username):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT admin FROM users WHERE username = %s;",
        (username,)
    )
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    return result[0] if result else False

def update_user_team(username, team):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE users SET team = %s WHERE username = %s;",
        (team, username)
    )
    conn.commit()
    cursor.close()
    conn.close()

def create_work_table():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS work (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            type TEXT NOT NULL,
            mins INTEGER NOT NULL,
            date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            image TEXT NOT NULL,
            deletehash TEXT NOT NULL,
            split_distance TEXT NOT NULL
        );
        """
    )
    conn.commit()
    cursor.close()
    conn.close()

def remove_work(work_id, username):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT deletehash FROM work WHERE id = %s;",
        (work_id,)
    )
    result = cursor.fetchone()
    cursor.execute(
        "DELETE FROM work WHERE id = %s;",
        (work_id,)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return result[0] if result else None

def load_work(username):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT type, mins, date, image, id, split_distance FROM work WHERE user_id = %s ORDER BY date DESC;",
        (username,)
    )
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return result if result else []

def submit_work(username, date, split_distance, type, mins, image, deletehash):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO work (user_id, type, mins, date, image, deletehash, split_distance) VALUES (%s, %s, %s, %s, %s, %s, %s);",
        (username, type, mins, date, image, deletehash, split_distance)
    )
    conn.commit()
    cursor.close()
    conn.close()

def get_all_users():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT email, first_name, last_name, team, admin, username FROM users;"
    )
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return result if result else []