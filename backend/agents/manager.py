from crewai import Crew, Task, Process
from .market_analyst import create_market_analyst
from .creative_director import create_creative_director
from .strategist import create_strategist
from .shopify_architect import create_shopify_architect

class BoardroomManager:
    def __init__(self, callback_function=None):
        self.callback = callback_function
        self.analyst = create_market_analyst()
        self.creative = create_creative_director()
        self.strategist = create_strategist()
        self.architect = create_shopify_architect()

    def run_debate(self, niche: str):
        """
        Orchestrates the debate for a given niche with STRICT JSON outputs.
        """
        
        # Task 1: Analyst Intelligence
        task_analysis = Task(
            description=f"Conduct a deep analysis on the niche '{niche}'. USE TOOLS. Find 3 viral angles and 1 major risk.",
            expected_output="""A report with:
            1. 'viral_angles': List of 3 angles.
            2. 'risk_factor': The biggest downside.
            3. 'source': Specific URL or trend score verifying this.""",
            agent=self.analyst
        )

        # Task 2: Brand Concept (Creative)
        task_creative = Task(
            description=f"Create a luxury brand identity for '{niche}'. DO NOT be generic.",
            expected_output="""JSON format with:
            {
                "brand_name": "Name",
                "slogan": "Tagline",
                "color_palette": ["#Hex1", "#Hex2", "#Hex3"],
                "vibe": "Description"
            }""",
            agent=self.creative,
            context=[task_analysis]
        )

        # Task 3: Execution Plan (Strategist)
        task_strategy = Task(
            description=f"Synthesize analysis and creative into a Business Plan for '{niche}'.",
            expected_output="""JSON format with:
            {
                "hero_product": "Product Name",
                "price_point": "$XX.XX",
                "marketing_channel": "TikTok/IG/Ads",
                "target_audience": "Demographic"
            }""",
            agent=self.strategist,
            context=[task_analysis, task_creative]
        )

        # Task 4: Construction (Architect)
        task_build = Task(
            description=f"Create the store implementation plan.",
            expected_output="Confirmation of store architecture readiness.",
            agent=self.architect,
            context=[task_strategy]
        )

        crew = Crew(
            agents=[self.analyst, self.creative, self.strategist, self.architect],
            tasks=[task_analysis, task_creative, task_strategy, task_build],
            verbose=True,
            process=Process.sequential,
            step_callback=self.step_handler
        )

        result = crew.kickoff()
        return result

    def step_handler(self, step_output):
        if self.callback:
            self.callback(step_output)
