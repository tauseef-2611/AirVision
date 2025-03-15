from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from model import predict_image_quality

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
UPLOAD_FOLDER = os.path.abspath(r"static\uploads")  # Ensure absolute path
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return send_file('templates/index.html')

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files or 'userId' not in request.form:
        return jsonify({'error': 'No file part or userId'}), 400
    
    file = request.files['file']
    userId = request.form['userId']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{userId}.jpg")
        file.save(file_path)
        
        # Log the file path to ensure it's correct
        app.logger.info(f"File saved to: {file_path}")
        
        return jsonify({'message': 'File uploaded successfully', 'file_path': file_path}), 200

@app.route('/predict', methods=['POST'])
def predict():
    if 'userId' not in request.json:
        return jsonify({'error': 'No userId provided'}), 400
    
    userId = request.json['userId']
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{userId}.jpg")
    
    if not os.path.exists(file_path):
        return jsonify({'error': 'File not found'}), 404
    
    # Make a prediction
    message = predict_image_quality(file_path)
    
    if message == "Irrelevant":
        return jsonify({'message': message}), 422  # Unique status code for irrelevant data
    else:
        return jsonify({'message': message}), 200
    
@app.route('/image/<userId>', methods=['GET'])
def get_image(userId):
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{userId}.jpg")
    file_path = os.path.normpath(file_path)  # Normalize path for Windows/Linux
    app.logger.info(f"Serving file from: {file_path}")
    app.logger.info(f"File exists: {os.path.isfile(file_path)}")
    app.logger.info(f"Absolute Path: {file_path}")

    if not os.path.isfile(file_path):
        return jsonify({'error': 'File not found'}), 404

    # Ensure the file path is correctly formatted for `send_file`
    return send_file(file_path, as_attachment=False)

if __name__ == '__main__':
    app.run(debug=True, port=8000)