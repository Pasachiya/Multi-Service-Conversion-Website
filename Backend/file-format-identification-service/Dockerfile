FROM python:3.9-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY file_format_identification_service.py .

RUN mkdir /app/uploads

CMD ["python", "file_format_identification_service.py"]