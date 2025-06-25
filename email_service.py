import os
from email.message import EmailMessage
from jinja2 import Environment, FileSystemLoader, select_autoescape
import aiosmtplib
from dotenv import load_dotenv

load_dotenv()

# Jinja2 setup
env = Environment(
    loader=FileSystemLoader("templates"),
    autoescape=select_autoescape(["html", "xml"])
)

# Email server credentials
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")

# Function to send the email
async def send_reset_email(to_email: str, name: str, reset_link: str):
    template = env.get_template("resetpw_template.html")
    html_content = template.render(name=name, link=reset_link)

    msg = EmailMessage()
    msg["Subject"] = "Reset Your Password"
    msg["From"] = SMTP_USER
    msg["To"] = to_email
    msg.set_content("Click the password reset link in the HTML version of this email.")
    msg.add_alternative(html_content, subtype="html")

    await aiosmtplib.send(
        msg,
        hostname=SMTP_HOST,
        port=SMTP_PORT,
        start_tls=True,
        username=SMTP_USER,
        password=SMTP_PASS,
    )