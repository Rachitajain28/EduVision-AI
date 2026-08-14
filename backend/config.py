import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))