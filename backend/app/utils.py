import numpy as np
from PIL import Image

CLASS_NAMES = ["normal", "glaucoma", "diabetic_retinopathy", "cataract"]

def preprocess_image(img: Image.Image, size=(256,256)):
    img = img.resize(size)
    img_array = np.array(img)/255.0          # normalize
    img_array = np.expand_dims(img_array, axis=0)  # batch dimension
    return img_array