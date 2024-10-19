FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY file_upload_service.py .

RUN mkdir /app/uploads

CMD ["python", "file_upload_service.py"]