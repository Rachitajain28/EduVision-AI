from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime
import PyPDF2
import json
import hashlib
from bson import ObjectId
from jose import jwt
from fastapi.security import OAuth2PasswordBearer

from ml.learning_style.schema import LearningInput
from ml.learning_style.predictor import predict_learning_style
from ml.predictor_career import predict_top_careers, validate_scores
from auth import create_token
from database import users_collection
from config import SECRET_KEY, ALGORITHM, groq_client

router = APIRouter()

# ================= AUTH DEPENDENCY =================
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

# ================= REQUEST MODELS =================
class TextInput(BaseModel):
    text: str

class CareerInput(BaseModel):
    scores: list

class QuizRequest(BaseModel):
    career: str

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

class QuizResultInput(BaseModel):
    career: str
    score: int
    total: int
    fit_percent: int

# ================= ROOT =================
@router.get("/")
def home():
    return {"message": "EduVision AI Backend Running 🚀"}

# ================= TEXT SUMMARY =================
@router.post("/summarize")
def summarize(data: TextInput):
    try:
        prompt = f"""
        Summarize the following text into:
        - Clear bullet points
        - Key concepts

        Text:
        {data.text}
        """

        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful AI tutor."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5
        )

        return {"summary": response.choices[0].message.content}

    except Exception as e:
        return {"error": "Something went wrong"}

# ================= PDF SUMMARY =================
@router.post("/summarize-pdf")
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

        response = groq_client.chat.completions.create(
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
@router.post("/predict-learning-style")
async def predict_style(data: LearningInput, current_user: dict = Depends(get_current_user)):
    try:
        result = predict_learning_style(data.answers)
        await users_collection.update_one(
            {"_id": current_user["_id"]},
            {"$set": {"learning_style": result}}
        )
        return result

    except Exception as e:
        return {"error": str(e)}

# ================= CAREER AI =================
@router.post("/predict-career")
async def predict_career(data: CareerInput, current_user: dict = Depends(get_current_user)):
    try:
        scores = data.scores
        if not validate_scores(scores):
            raise HTTPException(status_code=400, detail="Invalid scores")

        results = predict_top_careers(scores)

        career_result = {
            "main_career": results[0],
            "other_careers": results[1:]
            }

        await users_collection.update_one(
            {"_id": current_user["_id"]},
            {"$set": {"career_result": career_result}}
        )
        return career_result

    except Exception as e:
        print("ERROR:", e)
        return {"error": str(e)}

# ================= QUIZ GENERATION =================
@router.post("/generate-quiz")
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
        response = groq_client.chat.completions.create(
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
@router.post("/signup")
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
        "quiz_results": [],
        "learning_style": None,
        "career_result": None
    }

    result = await users_collection.insert_one(user_doc)
    return {"message": "User created successfully"}

@router.post("/login")
async def login(data: LoginInput):
    hashed_password = hashlib.sha256(data.password.encode()).hexdigest()

    user = await users_collection.find_one({"email": data.email})

    if not user or user["password"] != hashed_password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({"user_id": str(user["_id"])})
    return {"access_token": token}

@router.get("/profile")
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

@router.get("/me")
async def get_current_user_data(current_user: dict = Depends(get_current_user)):
    current_user["_id"] = str(current_user["_id"])
    return current_user

@router.post("/save-quiz-result")
async def save_quiz_result(data: QuizResultInput, current_user: dict = Depends(get_current_user)):
    print(f"Saving result for user: {current_user['email']}, career: {data.career}")
    result = {
        "career": data.career,
        "score": data.score,
        "total": data.total,
        "fitPercent": data.fit_percent,
        "date": datetime.now().strftime("%d %b %Y")
    }
    await users_collection.update_one(
        {"_id": current_user["_id"]},
        {"$push": {"quiz_results": result}}
    )
    return {"message": "Result saved"}

@router.get("/user-data")
async def get_user_data(current_user: dict = Depends(get_current_user)):
    return {
        "learning_style": current_user.get("learning_style", None),
        "career_result": current_user.get("career_result", None),
        "quiz_results": current_user.get("quiz_results", [])
    }