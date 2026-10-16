"""
LangGraph Multi-Agent Debate System
Enhanced with robust JSON extraction, thinking states, and streaming support.
"""
import json
import re
from typing import Optional, Generator
from langgraph.graph import StateGraph, END
from .state import AgentState
from .agents.market_analyst import create_market_analyst
from .agents.creative_director import create_creative_director
from .agents.strategist import create_strategist
from .agents.personas import PERSONAS
from crewai import Task, Crew


# Initialize Agents
analyst_agent = create_market_analyst()
designer_agent = create_creative_director()
chief_agent = create_strategist()


def extract_json_robust(text: str, fallback_key: str = "content") -> dict:
    """
    Robust JSON extraction with multiple fallback strategies.
    Strategy 1: Direct JSON parse
    Strategy 2: Extract from markdown code block
    Strategy 3: Find first { to last } 
    Strategy 4: Create fallback dict
    """
    if not text:
        return {fallback_key: "No response generated"}
    
    # Strategy 1: Direct parse
    try:
        return json.loads(text.strip())
    except json.JSONDecodeError:
        pass
    
    # Strategy 2: Extract from markdown code blocks
    code_block_patterns = [
        r'```json\s*([\s\S]*?)\s*```',
        r'```\s*([\s\S]*?)\s*```',
    ]
    for pattern in code_block_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            try:
                return json.loads(match.group(1).strip())
            except json.JSONDecodeError:
                continue
    
    # Strategy 3: Find first { to last }
    first_brace = text.find('{')
    last_brace = text.rfind('}')
    if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
        try:
            return json.loads(text[first_brace:last_brace + 1])
        except json.JSONDecodeError:
            pass
    
    # Strategy 4: Structured fallback
    return {
        fallback_key: text,
        "_parsing_failed": True,
        "_original_response": text[:500]  # Truncate for debugging
    }


def emit_thinking_state(agent_name: str, status: str) -> dict:
    """
    Emit a thinking state message for frontend visualization.
    """
    return {
        "type": "thinking_state",
        "agent": agent_name,
        "status": status,  # "thinking", "analyzing", "responding", "complete"
        "timestamp": __import__('datetime').datetime.now().isoformat()
    }


def run_agent_turn_with_streaming(agent, persona_key: str, input_data: str, context: str = "", 
                                   on_thinking: Optional[callable] = None) -> str:
    """
    Executes a turn for a specific persona with optional thinking state callbacks.
    Injects the Strict System Prompt (PERSONA) into the task description.
    """
    system_prompt = PERSONAS[persona_key]
    
    # Emit thinking state
    if on_thinking:
        on_thinking(emit_thinking_state(persona_key, "thinking"))
    
    full_prompt = f"""
    {system_prompt}
    
    ---------------------------------------------
    CURRENT INPUT:
    {input_data}
    
    ADDITIONAL CONTEXT:
    {context}
    ---------------------------------------------
    
    CRITICAL: Output ONLY valid JSON as defined in your persona. No markdown, no explanation, just pure JSON.
    """
    
    task = Task(
        description=full_prompt,
        expected_output="Valid JSON Response matching the persona schema",
        agent=agent
    )
    
    crew = Crew(
        agents=[agent],
        tasks=[task],
        verbose=False  # Reduce noise in production
    )
    
    # Emit analyzing state
    if on_thinking:
        on_thinking(emit_thinking_state(persona_key, "analyzing"))
    
    result = crew.kickoff()
    
    # Emit complete state
    if on_thinking:
        on_thinking(emit_thinking_state(persona_key, "complete"))
    
    return str(result)


def analyst_node(state: AgentState) -> dict:
    """
    Market Analyst node - scrutinizes the niche with data-driven skepticism.
    """
    niche = state["niche"]
    print(f"🔵 ANALYST: Scrutinizing '{niche}'...")
    
    result_str = run_agent_turn_with_streaming(
        analyst_agent, 
        "Analyst", 
        f"Analyze this niche: {niche}"
    )
    
    data = extract_json_robust(result_str, "critique")
    
    # Ensure required fields exist
    verdict = data.get("verdict", "VIABLE")
    critique = data.get("critique", str(data))
    data_points = data.get("data_points", [])
    
    return {
        "messages": [{
            "role": "agent", 
            "name": "Analyst", 
            "content": critique,
            "verdict": verdict,
            "data_points": data_points
        }],
        "market_report": {
            "summary": critique,
            "verdict": verdict,
            "data_points": data_points,
            "raw": data
        }
    }


def designer_node(state: AgentState) -> dict:
    """
    Creative Director node - envisions the brand identity.
    """
    niche = state["niche"]
    analyst_message = state["messages"][-1] if state["messages"] else {}
    analyst_critique = analyst_message.get("content", "No previous analysis")
    
    print(f"🟣 DESIGNER: Envisioning '{niche}'...")
    
    result_str = run_agent_turn_with_streaming(
        designer_agent, 
        "Designer", 
        f"Create visual identity for: {niche}",
        context=f"Analyst Critique: {analyst_critique}"
    )
    
    data = extract_json_robust(result_str, "concept")
    
    concept = data.get("concept", "Premium Modern")
    response = data.get("response_to_analyst", "Design transcends data limitations.")
    visuals = data.get("visuals", {
        "colors": ["#6366F1", "#06B6D4"],
        "font": "Inter",
        "imagery": "Abstract geometric forms"
    })
    
    # Calculate Aura Score based on analysis
    base_score = 75
    if analyst_message.get("verdict") == "RISKY":
        base_score -= 15
    if concept and len(concept) > 5:
        base_score += 10
    score = min(100, max(0, base_score))
    
    return {
        "messages": [{
            "role": "agent",
            "name": "Designer",
            "content": f"**Concept: {concept}**\n\n{response}",
            "concept": concept,
            "visuals": visuals
        }],
        "brand_identity": {
            "summary": concept,
            "response": response,
            "visuals": visuals,
            "raw": data
        },
        "aura_score": score
    }


def chief_node(state: AgentState) -> dict:
    """
    Chief Strategist node - makes final decision synthesizing both perspectives.
    """
    print("⚪ CHIEF: Making final decision...")
    
    analyst_report = state.get("market_report", {})
    brand_identity = state.get("brand_identity", {})
    
    result_str = run_agent_turn_with_streaming(
        chief_agent, 
        "Chief", 
        "Review team proposals and make final decision.",
        context=f"""
        ANALYST REPORT:
        {json.dumps(analyst_report, indent=2)}
        
        DESIGNER PROPOSAL:
        {json.dumps(brand_identity, indent=2)}
        """
    )
    
    data = extract_json_robust(result_str, "strategy")
    
    decision = data.get("decision", "APPROVED")
    strategy = data.get("strategy", str(data))
    why = data.get("why", "Strategic alignment achieved.")
    
    # Determine risk level
    risk_level = "Low"
    if decision == "REJECTED":
        risk_level = "High"
    elif analyst_report.get("verdict") == "RISKY":
        risk_level = "Medium"
    
    return {
        "messages": [{
            "role": "agent",
            "name": "Chief",
            "content": f"**DECISION: {decision}**\n\n{strategy}\n\n*Rationale: {why}*",
            "decision": decision
        }],
        "risk_level": risk_level,
        "approved": decision == "APPROVED",
        "business_plan": {
            "decision": decision,
            "strategy": strategy,
            "why": why,
            "raw": data
        }
    }


def router(state: AgentState) -> str:
    """
    Route to next node based on Chief's decision.
    Implements loop-back for rejected proposals (max 3 rounds).
    """
    last_msg = state["messages"][-1] if state["messages"] else {}
    critique_round = state.get("critique_round", 0)
    
    if "REJECTED" in last_msg.get("decision", "") and critique_round < 3:
        print(f"🔄 CHIEF REJECTED. Looping back to Analyst (Round {critique_round + 1}/3)...")
        return "analyst"
    
    return END


# Build the StateGraph
workflow = StateGraph(AgentState)

# Add nodes
workflow.add_node("analyst", analyst_node)
workflow.add_node("designer", designer_node)
workflow.add_node("chief", chief_node)

# Set entry point
workflow.set_entry_point("analyst")

# Add edges (linear flow)
workflow.add_edge("analyst", "designer")
workflow.add_edge("designer", "chief")

# Conditional edge for loop-back on rejection
workflow.add_conditional_edges("chief", router, {"analyst": "analyst", END: END})

# Compile the graph
app = workflow.compile()


# Export for streaming endpoint
def run_debate_stream(niche: str) -> Generator[dict, None, None]:
    """
    Run the debate and yield events for real-time streaming.
    """
    initial_state = {
        "niche": niche,
        "messages": [],
        "market_report": {},
        "brand_identity": {},
        "business_plan": {},
        "risk_level": "Analyzing...",
        "approved": False,
        "critique_round": 0,
        "aura_score": 0
    }
    
    for event in app.stream(initial_state):
        for node_name, node_output in event.items():
            yield {
                "type": "node_complete",
                "node": node_name,
                "output": node_output
            }
    
    yield {"type": "debate_complete"}
