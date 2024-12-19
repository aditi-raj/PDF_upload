from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from .utils.pdf_processor import process_pdf
from .utils.qa_chain import get_qa_chain
from .database import get_db
from .models import PDFDocument
from typing import Dict
import shutil
import os
from app.database import get_db, create_tables

app = FastAPI()

create_tables()

# Test endpoint
@app.get("/")
def read_root():
    return {"status": "success", "message": "Backend is running!"}

# Test database connection
@app.get("/test-db")
async def test_db(db: Session = Depends(get_db)):
    try:
        # Modified this line to use text()
        result = db.execute(text("SELECT 1")).fetchone()
        return {"status": "success", "message": "Database connection successful!", "result": result[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory
os.makedirs("uploads", exist_ok=True)

@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)  # Added dependency injection
):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    try:
        # Save file to uploads directory
        file_path = f"uploads/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Process PDF and store in vector database
        document_text = process_pdf(file_path)
        
        # Store document info in database
        pdf_doc = PDFDocument(
            filename=file.filename,
            filepath=file_path,
            content=document_text
        )
        db.add(pdf_doc)
        db.commit()
        db.refresh(pdf_doc)
        
        return {
            "id": pdf_doc.id,
            "filename": file.filename,
            "message": "File uploaded successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ask")
async def ask_question(
    request: Dict,
    db: Session = Depends(get_db)  # Added dependency injection
):
    try:
        file_id = request.get("file_id")
        question = request.get("question")
        
        if not file_id or not question:
            raise HTTPException(status_code=400, detail="Missing file_id or question")
        
        # Get document from database
        document = db.query(PDFDocument).filter(PDFDocument.id == file_id).first()
        
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Get answer using QA chain
        qa_chain = get_qa_chain(document.content)
        response = qa_chain({"question": question})
        
        return {"answer": response["answer"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))