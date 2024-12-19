from pypdf import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter

def process_pdf(file_path: str) -> str:
    """Process PDF file and return its text content"""
    reader = PdfReader(file_path)
    text = ""
    
    for page in reader.pages:
        text += page.extract_text()
    
    # Split text into chunks for better processing
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    
    chunks = text_splitter.split_text(text)
    return "\n\n".join(chunks)