import os
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import uvicorn
import json

# Routers
from routers import webhooks

# Graph
from graph import app as graph_app
from langchain_core.messages import HumanMessage

# Load environment variables
load_dotenv()

app = FastAPI()
app.include_router(webhooks.router, prefix="/api")

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://localhost:5173",  # Vite default
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "online", "system": "AURA Core Brain"}

@app.websocket("/ws/war-room")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    queue = asyncio.Queue()
    loop = asyncio.get_event_loop()

    # Instantiate Graph
    from graph import app as graph_app

    try:
        while True:
            # Wait for niche input
            data = await websocket.receive_text()
            
            # Send acknowledgement
            await websocket.send_json({"agent": "system", "message": f"Initializing Deep Research for: {data}..."})

            # Run LangGraph via asyncio executor to prevent blocking
            # We want to use .stream() to get updates after each node
            
            initial_state = {"niche": data, "messages": [], "critique_round": 0}

            # We define a sync generator function that runs the graph
            def run_and_stream():
                return list(graph_app.stream(initial_state))

            # Run it in a thread (blocking call)
            # This returns a list of state updates (one per node)
            steps = await loop.run_in_executor(None, run_and_stream)

            # Process the steps and send to websocket
            for step in steps:
                # 'step' is a dict like {'analyst': {...state...}}
                for node_name, state_update in step.items():
                    # Extract the last message from this node
                    if "messages" in state_update and state_update["messages"]:
                        last_msg = state_update["messages"][-1]
                        # Send to WS
                        await websocket.send_json({
                            "agent": last_msg["role"], # 'agent' role
                            "name": last_msg.get("name", node_name),
                            "message": last_msg["content"]
                        })
                        
                    # Also stream state updates (Aura Score, Risk)
                    if "aura_score" in state_update:
                         await websocket.send_json({
                            "type": "state_update",
                            "payload": {"aura_score": state_update["aura_score"]}
                        })
                    if "risk_level" in state_update:
                         await websocket.send_json({
                            "type": "state_update",
                            "payload": {"risk_level": state_update["risk_level"]}
                        })

                    # Add a small delay for visual pacing
                    await asyncio.sleep(0.5)

            await websocket.send_json({
                "agent": "system", 
                "message": "Strategy Finalized. Consensus Reached."
            })

    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"Error: {e}")
        await websocket.send_json({"agent": "system", "message": f"Critical Error: {str(e)}"})
