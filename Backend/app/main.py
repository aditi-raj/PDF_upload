from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .utils.qa_chain import process_pdf, get_answer
from .database import get_db, create_tables
from .models import PDFDocument
from typing import Dict
import shutil
import os
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI()

# Create database tables on startup
create_tables()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
async def read_root():
    return {"status": "success", "message": "PDF Q&A API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
    
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Validate file extension
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(
                status_code=400, 
                detail="Only PDF files are allowed"
            )
        
        # Generate safe filename and path
        safe_filename = os.path.basename(file.filename)
        file_path = os.path.join(UPLOAD_DIR, safe_filename)
        
        # Save file to uploads directory
        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as e:
            logger.error(f"Error saving file: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="Failed to save uploaded file"
            )
        
        try:
            # Process PDF
            content = process_pdf(file_path)
        except Exception as e:
            logger.error(f"Error processing PDF: {str(e)}")
            # Clean up the uploaded file if processing fails
            if os.path.exists(file_path):
                os.remove(file_path)
            raise HTTPException(
                status_code=500,
                detail="Failed to process PDF file"
            )
        
        # Store in database
        db = get_db()
        pdf_doc = PDFDocument(
            filename=safe_filename,
            filepath=file_path,
            content=content
        )
        try:
            db.add(pdf_doc)
            db.commit()
            db.refresh(pdf_doc)
            
            return {
                "id": pdf_doc.id,
                "filename": safe_filename,
                "message": "File uploaded successfully"
            }
        except Exception as e:
            logger.error(f"Database error: {str(e)}")
            db.rollback()
            # Clean up the uploaded file if database operation fails
            if os.path.exists(file_path):
                os.remove(file_path)
            raise HTTPException(
                status_code=500,
                detail="Failed to store file information in database"
            )
            
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Unexpected error in upload_file: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )
    finally:
        await file.close()

@app.post("/ask")
async def ask_question(request: Dict):
    try:
        question = request.get("question")
        
        if not question:
            raise HTTPException(
                status_code=400,
                detail="Question is required"
            )
        
        # Get answer using QA chain
        try:
            answer = get_answer(question)
            return {"answer": answer}
        except Exception as e:
            logger.error(f"Error getting answer: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="Failed to generate answer"
            )
            
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Unexpected error in ask_question: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}")