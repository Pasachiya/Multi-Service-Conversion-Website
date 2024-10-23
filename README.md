# Multi-Service-Conversion-Website

A web platform for converting various document and image formats, performing OCR (Optical Character Recognition), and handling PDF operations. This application supports multiple formats like PDF, DOCX, JPG, PNG, and more. It is built with a microservices architecture to ensure scalability and fault tolerance.

## Features

- **Multi-format support**: PDF, DOCX, JPG, PNG, and more.
- **OCR functionality**: Extract text from images or scanned documents.
- **Batch Processing**: Upload multiple files for batch conversion and processing.
- **Drag-and-Drop**: Simple and intuitive file uploads.
- **Secure File Handling**: Ensures files are processed securely and deleted after use.
- **User Management**: Registration, login, and authentication.
- **Task Management**: Scalable background task processing with Celery.
- **RESTful API**: API for conversion and file operations, making it easy to integrate with other applications.
- **Microservices Architecture**: Backend divided into modular services for better scalability.

## Technologies Used

- **Frontend**: 
  - React.js: For building the user interface with drag-and-drop file uploads and real-time status updates.

- **Backend**: 
  - Python Flask: RESTful APIs for handling file conversion, OCR, and PDF operations.
  - Celery: For managing background tasks and ensuring that file conversions are handled asynchronously.
  - RabbitMQ: For Celery task queue management.

- **Database**:
  - PostgreSQL: To store user information and task status.
  
- **Containerization**:
  - Docker: Used to containerize the application for easy deployment and scaling.

- **Microservices**:
  - Each service (OCR, file conversion, PDF operations) is built as a separate microservice using Flask.
  
- **Storage**:
  - Azure blob storage: Used for temporarily storing the files while they are being processed.



## Setup and Installation

### Prerequisites

- Python 3.8+
- Node.js and npm
- Docker (optional but recommended for deployment)
- RabbitMQ for Celery task management

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/Multi-Service-Conversion-Website.git
   cd Multi-Service-Conversion-Website/backend

