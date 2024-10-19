# file_format_identification_service.py
from flask import Flask, request, jsonify
import magic
import os
import uuid

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = '/app/uploads'

@app.route('/identify', methods=['POST'])
def identify_file_format():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    input_filename = str(uuid.uuid4()) + os.path.splitext(file.filename)[1]
    input_path = os.path.join(app.config['UPLOAD_FOLDER'], input_filename)
    
    try:
        file.save(input_path)
        mime = magic.Magic(mime=True)
        file_type = mime.from_file(input_path)
        
        return jsonify({
            "filename": file.filename,
            "mime_type": file_type
        }), 200
    except Exception as e:
        return jsonify({"error": f"File format identification failed: {str(e)}"}), 500
    finally:
        if os.path.exists(input_path):
            os.remove(input_path)

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(debug=True, host='0.0.0.0', port=5007)