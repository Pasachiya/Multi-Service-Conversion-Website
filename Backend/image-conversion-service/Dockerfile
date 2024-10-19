FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY image_conversion_service.py .

RUN mkdir /app/uploads /app/converted

CMD ["python", "image_conversion_service.py"]