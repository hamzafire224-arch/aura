# AURA Core Brain (Python Backend)

This is the intelligence engine for the AURA platform. It uses CrewAI to simulate an "Executive Boardroom" of AI agents that analyze markets, design brands, and build Shopify stores automatically.

## Prerequisites

- Python 3.10+
- A Tavily API Key (for Search)
- A Google Gemini API Key (for Intelligence)
- A Shopify Admin Access Token (for Building)

## Setup

1.  **Install Dependencies**
    ```bash
    pip install -r requirements.txt
    ```

2.  **Environment Variables**
    Copy `.env.example` to `.env` and fill in your keys:
    ```bash
    cp .env.example .env
    ```

3.  **Run the Server**
    ```bash
    uvicorn main:app --reload
    ```
    The WebSocket will be active at `ws://localhost:8000/ws/war-room`.

## Architecture

- **`main.py`**: FastAPI server handling the WebSocket connection.
- **`agents/manager.py`**: The CrewAI Orchestrator that manages the flow.
- **`agents/*.py`**: Individual agent definitions (Analyst, Creative, Strategist, Architect).
- **`tools/*.py`**: Custom tools for agents (Search, Trends, Shopify).
