import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI

def get_llm():
    """
    Returns the configured LLM for the agents.
    Prioritizes OpenAI (GPT-4o) for maximum reasoning capability (High-End).
    Falls back to Gemini 2.0 Flash if OpenAI key is missing.
    """
    openai_key = os.getenv("OPENAI_API_KEY")
    gemini_key = os.getenv("GEMINI_API_KEY")

    if openai_key:
        print("⚡ Using OpenAI (GPT-4o) for Agents")
        return ChatOpenAI(
            model="gpt-4o",
            temperature=0.7,
            api_key=openai_key
        )
    
    if gemini_key:
        print("⚡ Using Gemini (2.0 Flash) for Agents")
        return ChatGoogleGenerativeAI(
            model="gemini-2.0-flash-exp",
            verbose=True,
            temperature=0.7,
            google_api_key=gemini_key
        )

    raise ValueError("No valid API Key found. Please set OPENAI_API_KEY or GEMINI_API_KEY in backend/.env")
