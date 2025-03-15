# Flask Image Quality Prediction App

This project is a Flask web application that allows users to upload images and predicts their quality as Weak, Moderate, Severe, or Irrelevant. The application uses a pre-trained InceptionV3 model for image classification.

## Project Structure

```
flask-server-app
├── app
│   ├── __init__.py
│   ├── main.py
│   ├── model.py
│   ├── static
│   │   └── uploads
│   └── templates
│       └── index.html
├── requirements.txt
└── README.md
```

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd flask-server-app
   ```

2. **Create a virtual environment** (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install the required packages**:
   ```
   pip install -r requirements.txt
   ```

4. **Run the Flask application**:
   ```
   python app/main.py
   ```

5. **Access the application**:
   Open your web browser and go to `http://127.0.0.1:5000`.

## Usage

- Navigate to the main page where you can upload images.
- After uploading, the application will process the image and display the predicted quality.
- The uploaded images will be stored in the `app/static/uploads` directory.

## Dependencies

- Flask
- TensorFlow
- Keras
- NumPy
- Matplotlib

## License

This project is licensed under the MIT License.