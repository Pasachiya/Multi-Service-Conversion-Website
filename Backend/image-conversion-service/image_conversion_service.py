# image_conversion_service.py
from flask import Flask, request, jsonify, send_file
from PIL import Image
import os
import uuid

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = '/app/uploads'
app.config['CONVERTED_FOLDER'] = '/app/converted'

ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/convert', methods=['POST'])
def convert_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    output_format = request.form.get('output_format')
    if file.filename == '' or not output_format:
        return jsonify({"error": "No selected file or output format"}), 400
    if file and allowed_file(file.filename):
        input_filename = str(uuid.uuid4()) + os.path.splitext(file.filename)[1]
        input_path = os.path.join(app.config['UPLOAD_FOLDER'], input_filename)
        file.save(input_path)
        
        output_filename = str(uuid.uuid4()) + '.' + output_format
        output_path = os.path.join(app.config['CONVERTED_FOLDER'], output_filename)
        
        try:
            with Image.open(input_path) as img:
                if output_format.lower() == 'jpg':
                    img = img.convert('RGB')
                img.save(output_path, format=output_format.upper())
            return send_file(output_path, as_attachment=True)
        except Exception as e:
            return jsonify({"error": f"Conversion failed: {str(e)}"}), 500
        finally:
            os.remove(input_path)
            if os.path.exists(output_path):
                os.remove(output_path)
    return jsonify({"error": "File type not allowed"}), 400

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['CONVERTED_FOLDER'], exist_ok=True)
    app.run(debug=True, host='0.0.0.0', port=5003)