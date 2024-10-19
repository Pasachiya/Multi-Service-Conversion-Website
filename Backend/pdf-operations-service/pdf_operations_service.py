# pdf_operations_service.py
from flask import Flask, request, jsonify, send_file
from PyPDF2 import PdfWriter, PdfReader
import os
import uuid

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = '/app/uploads'
app.config['PROCESSED_FOLDER'] = '/app/processed'

@app.route('/merge', methods=['POST'])
def merge_pdfs():
    if 'files' not in request.files:
        return jsonify({"error": "No file part"}), 400
    files = request.files.getlist('files')
    if not files or files[0].filename == '':
        return jsonify({"error": "No selected files"}), 400
    
    merger = PdfWriter()
    input_paths = []
    
    try:
        for file in files:
            if file and file.filename.lower().endswith('.pdf'):
                input_filename = str(uuid.uuid4()) + '.pdf'
                input_path = os.path.join(app.config['UPLOAD_FOLDER'], input_filename)
                file.save(input_path)
                input_paths.append(input_path)
                merger.append(input_path)
            else:
                return jsonify({"error": "Only PDF files are allowed"}), 400
        
        output_filename = str(uuid.uuid4()) + '.pdf'
        output_path = os.path.join(app.config['PROCESSED_FOLDER'], output_filename)
        
        with open(output_path, 'wb') as output_file:
            merger.write(output_file)
        
        return send_file(output_path, as_attachment=True)
    except Exception as e:
        return jsonify({"error": f"PDF merge failed: {str(e)}"}), 500
    finally:
        for path in input_paths:
            if os.path.exists(path):
                os.remove(path)
        if os.path.exists(output_path):
            os.remove(output_path)

@app.route('/split', methods=['POST'])
def split_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and file.filename.lower().endswith('.pdf'):
        input_filename = str(uuid.uuid4()) + '.pdf'
        input_path = os.path.join(app.config['UPLOAD_FOLDER'], input_filename)
        file.save(input_path)
        
        try:
            pdf = PdfReader(input_path)
            for page in range(len(pdf.pages)):
                pdf_writer = PdfWriter()
                pdf_writer.add_page(pdf.pages[page])
                
                output_filename = f"{str(uuid.uuid4())}_page_{page + 1}.pdf"
                output_path = os.path.join(app.config['PROCESSED_FOLDER'], output_filename)
                
                with open(output_path, 'wb') as output_file:
                    pdf_writer.write(output_file)
            
            # Create a zip file containing all split PDFs
            import zipfile
            zip_filename = str(uuid.uuid4()) + '.zip'
            zip_path = os.path.join(app.config['PROCESSED_FOLDER'], zip_filename)
            with zipfile.ZipFile(zip_path, 'w') as zip_file:
                for file in os.listdir(app.config['PROCESSED_FOLDER']):
                    if file.endswith('.pdf'):
                        zip_file.write(os.path.join(app.config['PROCESSED_FOLDER'], file), file)
            
            return send_file(zip_path, as_attachment=True)
        except Exception as e:
            return jsonify({"error": f"PDF split failed: {str(e)}"}), 500
        finally:
            os.remove(input_path)
            for file in os.listdir(app.config['PROCESSED_FOLDER']):
                if file.endswith('.pdf'):
                    os.remove(os.path.join(app.config['PROCESSED_FOLDER'], file))
            if os.path.exists(zip_path):
                os.remove(zip_path)
    return jsonify({"error": "Only PDF files are allowed"}), 400

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['PROCESSED_FOLDER'], exist_ok=True)
    app.run(debug=True, host='0.0.0.0', port=5006)