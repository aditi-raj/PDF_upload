from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import google.generativeai as genai
from langchain.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

def process_pdf(file_path):
    """Process PDF and return text content"""
    text = ""
    pdf_reader = PdfReader(file_path)
    for page in pdf_reader.pages:
        text += page.extract_text()
    
    # Create text chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=10000, 
        chunk_overlap=1000
    )
    chunks = text_splitter.split_text(text)
    
    # Create and save vector store
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector_store = FAISS.from_texts(chunks, embedding=embeddings)
    vector_store.save_local("faiss_index")
    
    return text

def get_qa_chain():
    prompt_template = """
    Answer the question in concise way from the provided context, make sure to provide all the details, if the answer is not in 
    provided context generate your own response, give an organised response like use bullet points, don't provide the wrong answer\n\n
    Context:\n {context}?\n
    Question: \n{question}\n
    Answer:
    """
    
    model = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash-exp",
        temperature=0.3
    )
    
    prompt = PromptTemplate(
        template=prompt_template, 
        input_variables=["context", "question"]
    )
    
    chain = load_qa_chain(
        model, 
        chain_type="stuff", 
        prompt=prompt
    )
    
    return chain

def get_answer(question):
    try:
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        vector_store = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
        docs = vector_store.similarity_search(question)
        
        chain = get_qa_chain()
        response = chain(
            {
                "input_documents": docs, 
                "question": question
            },
            return_only_outputs=True
        )
        
        return response["output_text"]
    except Exception as e:
        print(f"Error in get_answer: {str(e)}")
        raise