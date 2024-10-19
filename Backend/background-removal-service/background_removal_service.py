# background_removal_service.py
from flask import Flask, request, jsonify, send_file
from rembg import remove
from PIL import Image
import io
import os
import uuid

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = '/app/uploads'
app.config['PROCESSED_FOLDER'] = '/app/processed'

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/remove_background', methods=['POST'])
def remove_background():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and allowed_file(file.filename):
        input_filename = str(uuid.uuid4()) + os.path.splitext(file.filename)[1]
        input_path = os.path.join(app.config['UPLOAD_FOLDER'], input_filename)
        file.save(input_path)
        
        output_filename = str(uuid.uuid4()) + '.png'
        output_path = os.path.join(app.config['PROCESSED_FOLDER'], output_filename)
        
        try:
            with open(input_path, 'rb') as input_file:
                input_data = input_file.read()
                output_data = remove(input_data)
                output_image = Image.open(io.BytesIO(output_data))
                output_image.save(output_path, 'PNG')
            return send_file(output_path, as_attachment=True)
        except Exception as e:
            return jsonify({"error": f"Background removal failed: {str(e)}"}), 500
        finally:
            os.remove(input_path)
            if os.path.exists(output_path):
                os.remove(output_path)
    return jsonify({"error": "File type not allowed"}), 400

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['PROCESSED_FOLDER'], exist_ok=True)
    app.run(debug=True, host='0.0.0.0', port=5004)