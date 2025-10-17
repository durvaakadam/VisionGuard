from tensorflow.keras.models import load_model
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "CNNforEyeDiseases.keras")

def load_cnn_model():
    model = load_model(MODEL_PATH)
    return model
