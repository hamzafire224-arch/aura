"""
Enhanced Agent State for the LangGraph Debate System.
Includes support for thinking states and extended metadata.
"""
from typing import TypedDict, Annotated, List, Optional, Literal
import operator


class MessageContent(TypedDict, total=False):
    """Individual message in the debate."""
    role: Literal["agent", "user", "system"]
    name: str
    content: str
    verdict: Optional[str]
    decision: Optional[str]
    concept: Optional[str]
    data_points: Optional[List[str]]
    visuals: Optional[dict]


class ThinkingState(TypedDict, total=False):
    """Represents an agent's current thinking status."""
    agent: str
    status: Literal["idle", "thinking", "analyzing", "responding", "complete"]
    timestamp: str


class AgentState(TypedDict):
    """
    Complete state for the multi-agent debate workflow.
    """
    # User input
    niche: str
    
    # Internal dialogue history (accumulates via operator.add)
    messages: Annotated[List[dict], operator.add]
    
    # Produced artifacts
    market_report: dict
    brand_identity: dict
    business_plan: dict
    
    # Decision flags
    risk_level: str  # "Low", "Medium", "High"
    approved: bool
    critique_round: int  # To prevent infinite loops (max 3 rounds)
    aura_score: int  # The calculated potential of the idea (0-100)
    
    # Thinking states for frontend visualization
    thinking_states: Optional[dict]  # {agent_name: ThinkingState}
    
    # Session metadata
    session_id: Optional[str]
    started_at: Optional[str]
    completed_at: Optional[str]
