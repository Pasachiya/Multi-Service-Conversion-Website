FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY pdf_operations_service.py .

RUN mkdir /app/uploads /app/processed

CMD ["python", "pdf_operations_service.py"]