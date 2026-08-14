from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://192.168.29.193:8080",
        "http://172.17.238.55:8080",
        "http://172.17.238.55:5173",
        "http://10.105.34.55:8080",
        "http://10.121.147.55:8080",  
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://edu-vision-ai-ruby.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)