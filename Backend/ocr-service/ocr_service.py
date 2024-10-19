# ocr_service.py
from flask import Flask, request, jsonify, send_file
import pytesseract
from PIL import Image
from pdf2image import convert_from_bytes
import io
import os
import uuid
from PyPDF2 import PdfWriter, PdfReader

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = '/app/uploads'
app.config['PROCESSED_FOLDER'] = '/app/processed'

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'tiff', 'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/ocr', methods=['POST'])
def perform_ocr():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    output_format = request.form.get('output_format', 'txt')
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and allowed_file(file.filename):
        input_filename = str(uuid.uuid4()) + os.path.splitext(file.filename)[1]
        input_path = os.path.join(app.config['UPLOAD_FOLDER'], input_filename)
        file.save(input_path)
        
        output_filename = str(uuid.uuid4()) + '.' + output_format
        output_path = os.path.join(app.config['PROCESSED_FOLDER'], output_filename)
        
        try:
            if input_path.lower().endswith('.pdf'):
                images = convert_from_bytes(open(input_path, 'rb').read())
            else:
                images = [Image.open(input_path)]

            text = ""
            for image in images:
                text += pytesseract.image_to_string(image) + "\n\n"

            if output_format == 'txt':
                with open(output_path, 'w', encoding='utf-8') as f:
                    f.write(text)
            elif output_format == 'pdf':
                pdf_writer = PdfWriter()
                pdf_reader = PdfReader(input_path) if input_path.lower().endswith('.pdf') else None
                
                for i, image in enumerate(images):
                    img_byte_arr = io.BytesIO()
                    image.save(img_byte_arr, format='PNG')
                    img_byte_arr = img_byte_arr.getvalue()
                    
                    pdf_writer.add_page()
                    if pdf_reader and i < len(pdf_reader.pages):
                        pdf_writer.pages[-1].merge_page(pdf_reader.pages[i])
                    pdf_writer.add_annotation(i, 0, 0, image.width, image.height, text)

                with open(output_path, 'wb') as f:
                    pdf_writer.write(f)
            else:
                return jsonify({"error": "Invalid output format"}), 400

            return send_file(output_path, as_attachment=True)
        except Exception as e:
            return jsonify({"error": f"OCR failed: {str(e)}"}), 500
        finally:
            os.remove(input_path)
            if os.path.exists(output_path):
                os.remove(output_path)
    return jsonify({"error": "File type not allowed"}), 400

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['PROCESSED_FOLDER'], exist_ok=True)
    app.run(debug=True, host='0.0.0.0', port=5005)