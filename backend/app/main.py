from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from io import BytesIO
import numpy as np
from .model import load_cnn_model
from .utils import preprocess_image, CLASS_NAMES

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend dev URL
    allow_methods=["*"],
    allow_headers=["*"],
)

model = load_cnn_model()

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    img = Image.open(BytesIO(contents)).convert("RGB")
    x = preprocess_image(img)
    preds = model.predict(x)
    predicted_class = CLASS_NAMES[int(np.argmax(preds))]
    confidence = float(np.max(preds))
    return {"class": predicted_class, "confidence": confidence}

@app.get("/")
def read_root():
    return {"message": "VisionGuard API is running"}