from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings, OpenAI
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.prompts import PromptTemplate
from langchain.chains import RetrievalQA
import os

def get_qa_chain(text_content):
    try:
        # Make sure OPENAI_API_KEY is set
        if not os.getenv("OPENAI_API_KEY"):
            raise ValueError("OPENAI_API_KEY environment variable is not set")

        # Split text into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        chunks = text_splitter.split_text(text_content)

        # Create embeddings and vector store
        embeddings = OpenAIEmbeddings()
        vectorstore = FAISS.from_texts(chunks, embeddings)

        # Create prompt template
        prompt_template = """Use the following pieces of context to answer the question at the end.
        If you don't know the answer, just say that you don't know, don't try to make up an answer.

        {context}

        Question: {question}
        Answer: """

        PROMPT = PromptTemplate(
            template=prompt_template, input_variables=["context", "question"]
        )

        # Create chain
        chain_type_kwargs = {"prompt": PROMPT}
        qa = RetrievalQA.from_chain_type(
            llm=OpenAI(),
            chain_type="stuff",
            retriever=vectorstore.as_retriever(),
            chain_type_kwargs=chain_type_kwargs,
            return_source_documents=True
        )

        return qa
    except Exception as e:
        print(f"Error in get_qa_chain: {str(e)}")
        raise