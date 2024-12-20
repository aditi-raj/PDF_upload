# PDF Question-Answering System

A full-stack application that allows users to upload PDF documents and ask questions about their content using natural language processing. The system processes the PDFs and provides relevant answers based on the document content.

## Features

- PDF document upload and processing
- Natural language question answering based on PDF content
- User-friendly interface with error handling

## Tech Stack

### Backend
- FastAPI
- LangChain for NLP processing
- PyPDF2 for PDF processing
- SQLite for database
- Python virtual environment

### Frontend
- React.js
- Node.js
- npm package manager

## Prerequisites

Before running the application, ensure you have the following installed:
- Python (any recent version)
- Node.js and npm
- Virtual environment tool (venv)

### API Keys Required
- Google API Key (for LangChain integration, its free of cost)

## Installation & Setup

### Backend Setup

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Create and activate virtual environment:
   ```bash
   # For Windows
   python -m venv venv
   venv\Scripts\activate

   # For Unix/MacOS
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file in the Backend directory and add:
   ```
   GOOGLE_API_KEY=your_google_api_key_here
   //To generate API go to this link:https://aistudio.google.com/app/u/2/prompts/new_chat
   //Click on Get API Key -> Create API Key
   ```

5. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. Navigate to the Frontend directory:
   ```bash
   cd Frontend/myapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

## API Documentation

### Endpoints

#### PDF Upload
```
POST /api/upload
Content-Type: multipart/form-data

Request:
- file: PDF file (required)

Response:
{
    "status": "success",
    "document_id": "string",
    "message": "Document uploaded successfully"
}
```

#### Ask Question
```
POST /api/question
Content-Type: application/json

Request:
{
    "document_id": "string",
    "question": "string"
}

Response:
{
    "status": "success",
    "answer": "string",
    "context": "string"
}
```

### Error Responses
```
{
    "status": "error",
    "message": "Error description"
}
```

