import pandas as pd
import torch
from langchain_community.document_loaders import DataFrameLoader
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

class CarFaultRAG:
    def __init__(self, dataset_path="automotive_faults_knowledge.csv"):
        print("Initializing CarFaultRAG with Automotive Faults Dataset...")

        # Load rich knowledge base
        self.df = pd.read_csv(dataset_path)

        # Build rich combined text per row for semantic vector search
        self.df["combined_text"] = self.df.apply(
            lambda row: (
                f"Fault: {row['fault']}. "
                f"Symptoms: {row['symptoms']}. "
                f"Diagnosis: {row['diagnostic_procedures']}. "
                f"Repair: {row['repair_outcomes']}. "
                f"Maintenance: {row['maintenance_knowledge']}"
            ),
            axis=1
        )

        # Load into LangChain documents
        loader = DataFrameLoader(self.df, page_content_column="combined_text")
        docs = loader.load()

        # HuggingFace sentence embeddings for semantic search
        print("Loading sentence embeddings (all-MiniLM-L6-v2)...")
        self.embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

        # FAISS vector store - top-3 most relevant knowledge entries per query
        print("Building FAISS VectorStore from Automotive Faults Dataset...")
        self.vectorstore = FAISS.from_documents(docs, self.embeddings)
        self.retriever = self.vectorstore.as_retriever(search_kwargs={"k": 3})

        # Load flan-t5-small directly (encoder-decoder seq2seq)
        print("Loading google/flan-t5-small (seq2seq)...")
        model_name = "google/flan-t5-small"
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
        self.model.eval()
        print("CarFaultRAG initialization complete.")

    def generate_enhanced_response(self, symptoms, predicted_fault, resolution_data):
        """Use FAISS retrieval + flan-t5 to generate an expert mechanic response."""

        # Retrieve top relevant knowledge entries
        retrieved_docs = self.retriever.invoke(symptoms)
        context = " | ".join(doc.page_content for doc in retrieved_docs)

        # Concise expert prompt
        prompt = (
            f"You are an expert mechanic. "
            f"Customer complaint: {symptoms}. "
            f"Predicted fault: {predicted_fault}. "
            f"Knowledge base context: {context}. "
            f"Temporary fix: {resolution_data['temporary_fix']}. "
            f"Permanent fix: {resolution_data['permanent_fix']}. "
            f"Write 2-3 sentences: explain the cause, what to do now, and one maintenance tip."
        )

        try:
            inputs = self.tokenizer(
                prompt,
                return_tensors="pt",
                max_length=512,
                truncation=True
            )
            with torch.no_grad():
                output_ids = self.model.generate(
                    inputs["input_ids"],
                    max_new_tokens=150,
                    num_beams=4,
                    early_stopping=True
                )
            text = self.tokenizer.decode(output_ids[0], skip_special_tokens=True).strip()
            return text if text else "Fault detected. Please follow the fix recommendations above."
        except Exception as e:
            print(f"LLM generation failed: {e}")
            return "Based on your symptoms, a fault was identified. Please review the repair details and consult a certified mechanic."


rag_system = None

def get_rag_system():
    global rag_system
    if rag_system is None:
        rag_system = CarFaultRAG()
    return rag_system
