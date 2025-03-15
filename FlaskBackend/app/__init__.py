from flask import Flask
import os

app = Flask(__name__)

# Configure upload folder
app.config['UPLOAD_FOLDER'] = 'app/static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Limit upload size to 16 MB

# Ensure the upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

from app import main  # Import routes from main.py to register them with the app

# Initialize the Flask application
if __name__ == '__main__':
    app.run(debug=True)