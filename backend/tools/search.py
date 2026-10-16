import os
import json
from crewai.tools import BaseTool
from tavily import TavilyClient

class SearchTool(BaseTool):
    name: str = "Market Search"
    description: str = "Useful for searching the internet for real-time market trends, competitor stores, and viral products. Input should be a specific search query."

    def _run(self, query: str) -> str:
        api_key = os.getenv("TAVILY_API_KEY")
        if not api_key:
            return "Error: TAVILY_API_KEY not found in environment. Cannot perform search."

        try:
            client = TavilyClient(api_key=api_key)
            # "context" includes the answer + raw content from top sources
            response = client.get_search_context(query, search_depth="advanced", max_tokens=1500)
            return response
        except Exception as e:
            return f"Error performing search: {str(e)}"
