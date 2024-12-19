from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from .database import Base

class PDFDocument(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    filepath = Column(String)
    content = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# class Question(Base):
#     __tablename__ = "questions"

#     id = Column(Integer, primary_key=True, index=True)
#     pdf_id = Column(Integer, nullable=False)  # Links to the PDF document
#     question_text = Column(Text, nullable=False)  # The user's question
#     answer_text = Column(Text, nullable=True)  # The AI's answer
#     created_at = Column(DateTime, default=func.now())  # Timestamp