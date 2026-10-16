from crewai import Agent
from .base_agent import get_llm
from tools.shopify import ShopifyTool

def create_shopify_architect():
    return Agent(
        role='Shopify Solutions Architect',
        goal='Take the business strategy and PHYSICALLY BUILD the store on Shopify.',
        backstory="""You are a senior Shopify Developer and Site Reliability Engineer. 
        You do not care about "vibes" or "trends"; you care about CLEAN CODE and API execution.
        You take the Strategist's plan and turn it into real Products and Pages.
        You are precise. If the plan says "Price: $50", you set it to 50.00.""",
        verbose=True,
        allow_delegation=False,
        llm=get_llm(),
        tools=[ShopifyTool()]
    )
