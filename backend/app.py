from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from ml.learning_style.schema import LearningInput
from ml.learning_style.predictor import predict_learning_style
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
import os
from dotenv import load_dotenv
import PyPDF2
from jose import jwt
from fastapi.security import OAuth2PasswordBearer
import hashlib
import json
from bson import ObjectId

# your modules
from ml.predictor_career import predict_top_careers, validate_scores
from auth import create_token, verify_token
from database import users_collection
import models
import random
import string
model = None


def generate_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))


# ✅ Study Room Models
class RoomCreate(BaseModel):
    name: str

class JoinRoom(BaseModel):
    code: str

# ================= INIT =================
app = FastAPI()


# ================= ENV =================
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

# ================= CORS =================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://192.168.29.193:8080",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://10.105.34.55:8080",   # <-- add this
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= AUTH =================
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

# ================= GROQ =================
api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("❌ GROQ_API_KEY not found")

client = Groq(api_key=api_key)

# ================= REQUEST MODELS =================
class TextInput(BaseModel):
    text: str

class CareerInput(BaseModel):
    scores: list

# ================= ROOT =================
@app.get("/")
def home():
    return {"message": "EduVision AI Backend Running 🚀"}

# ================= TEXT SUMMARY =================
@app.post("/summarize")
def summarize(data: TextInput):
    try:
        prompt = f"""
        Summarize the following text into:
        - Clear bullet points
        - Key concepts

        Text:
        {data.text}
        """

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful AI tutor."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5
        )

        return {"summary": response.choices[0].message.content}

    except Exception as e:
        print("ERROR:", e)
        return {"error": "Something went wrong"}

# ================= PDF SUMMARY =================
@app.post("/summarize-pdf")
async def summarize_pdf(file: UploadFile = File(...)):
    try:
        pdf_reader = PyPDF2.PdfReader(file.file)
        text = ""

        for page in pdf_reader.pages:
            text += page.extract_text() or ""

        if not text.strip():
            return {"error": "No readable text found"}

        text = text[:4000]

        prompt = f"""
        Summarize the following PDF content into:
        - Clear bullet points
        - Key concepts

        Text:
        {text}
        """

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful AI tutor."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5
        )

        return {"summary": response.choices[0].message.content}

    except Exception as e:
        print("ERROR:", e)
        return {"error": "Something went wrong"}

# ================= LEARNING STYLE =================
@app.post("/predict-learning-style")
def predict_style(data: LearningInput):
    try:
        result = predict_learning_style(data.answers)
        return result   
    except Exception as e:
        return {"error": str(e)}

# ================= CAREER AI =================


@app.post("/predict-career")
def predict_career(data: CareerInput):
    try:
        scores = data.scores
        if not validate_scores(scores):
            raise HTTPException(status_code=400, detail="Invalid scores")

        results = predict_top_careers(scores)

        return {
            "main_career": results[0],
            "other_careers": results[1:]
        }

    except Exception as e:
        print("ERROR:", e)
        return {"error": str(e)}

# ================= QUIZ GENERATION =================
class QuizRequest(BaseModel):
    career: str

@app.post("/generate-quiz")
def generate_quiz(data: QuizRequest):
    try:
        prompt = f"""
Generate exactly 10 multiple choice questions to test knowledge about the career: {data.career}

Rules:
- Each question must have exactly 4 options
- Only one option is correct
- Questions should test real knowledge about this career field
- Vary difficulty: 3 easy, 4 medium, 3 hard
- Return ONLY valid JSON, no extra text, no markdown

Format:
{{
  "questions": [
    {{
      "q": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": 0
    }}
  ]
}}

answer is the index (0-3) of the correct option.
"""
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert educator. Always respond with valid JSON only. No markdown, no extra text, no backticks."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7
        )

        raw = response.choices[0].message.content.strip()

        # Clean markdown if Groq adds it anyway
        if "```" in raw:
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]

        questions = json.loads(raw.strip())
        return questions

    except Exception as e:
        print("ERROR generating quiz:", e)
        return {"error": str(e)}
    
# ================= AUTH APIs =================
class LoginInput(BaseModel):
    email: str
    password: str

class SignupInput(BaseModel):
    name: str
    email: str
    password: str
    age: int
    gender: str
    college: str
    course: str

@app.post("/signup")
async def signup(data: SignupInput):
    existing = await users_collection.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed_password = hashlib.sha256(data.password.encode()).hexdigest()

    user_doc = {
        "name": data.name,
        "email": data.email,
        "password": hashed_password,
        "age": data.age,
        "gender": data.gender,
        "college": data.college,
        "course": data.course,
        "xp": 0,
        "streak": 0
    }

    result = await users_collection.insert_one(user_doc)
    return {"message": "User created successfully"}

@app.post("/login")
async def login(data: LoginInput):
    hashed_password = hashlib.sha256(data.password.encode()).hexdigest()

    user = await users_collection.find_one({"email": data.email})

    if not user or user["password"] != hashed_password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({"user_id": str(user["_id"])})
    return {"access_token": token}

@app.get("/profile")
async def profile(current_user: dict = Depends(get_current_user)):
    return {
        "name": current_user["name"],
        "email": current_user["email"],
        "xp": current_user.get("xp", 0),
        "streak": current_user.get("streak", 0),
        "age": current_user.get("age"),
        "gender": current_user.get("gender"),
        "college": current_user.get("college"),
        "course": current_user.get("course")
    }

@app.get("/me")
async def get_current_user_data(current_user: dict = Depends(get_current_user)):
    current_user["_id"] = str(current_user["_id"])
    return current_user


# ===============================
# 🔥 STUDY ROOM APIs
# ===============================
rooms = []  # In-memory storage for rooms 
@app.post("/rooms")
def create_room(data: RoomCreate):
    new_room = {
        "name": data.name,
        "members": 1,
        "code": generate_code()
    }
    rooms.append(new_room)
    return new_room


@app.get("/rooms")
def get_rooms():
    return rooms


@app.post("/rooms/join")
def join_room(data: JoinRoom):
    for room in rooms:
        if room["code"] == data.code:
            room["members"] += 1
            return room
    return {"error": "Room not found"}


@app.delete("/rooms/{code}")
def delete_room(code: str):
    global rooms
    rooms = [r for r in rooms if r["code"] != code]
    return {"message": "Room deleted"}
