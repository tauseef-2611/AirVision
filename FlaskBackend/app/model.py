from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.applications.inception_v3 import preprocess_input
import numpy as np
import os

# Load the pre-trained model
model = load_model(os.path.join(os.path.dirname(__file__), 'model_inception.h5'))

# Define the prediction function
def predict_image_quality(img_path):
    # Load and preprocess the image
    img = load_img(img_path, target_size=(224, 224))
    x = img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    
    # Make a prediction
    p = np.argmax(model.predict(x))
    
    # Map the prediction to a quality label
    if p == 0:
        return "Irrelevant"
    elif p == 1:
        return "Moderate"
    elif p == 2:
        return "Weak"
    elif p == 3:
        return "Severe"

# Function to save uploaded images
def save_uploaded_file(upload_folder, file):
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    file_path = os.path.join(upload_folder, file.filename)
    file.save(file_path)
    return file_path