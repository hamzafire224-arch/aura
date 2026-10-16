from crewai.tools import BaseTool
from pytrends.request import TrendReq
import pandas as pd

class TrendsTool(BaseTool):
    name: str = "Google Trends Analyzer"
    description: str = "Useful for analyzing the interest over time for a specific keyword. Returns a trend score (0-100) to determine if a niche is dying or growing."

    def _run(self, keyword: str) -> str:
        try:
            pytrends = TrendReq(hl='en-US', tz=360)
            kw_list = [keyword]
            pytrends.build_payload(kw_list, cat=0, timeframe='today 12-m', geo='', gprop='')
            
            # Get interest over time
            df = pytrends.interest_over_time()
            
            if df.empty:
                return f"No trend data found for '{keyword}'."
            
            # Simple analysis: Compare last month avg to first month avg
            last_3_months = df.tail(12).mean()[keyword]
            first_3_months = df.head(12).mean()[keyword]
            
            trend_direction = "UP" if last_3_months > first_3_months else "DOWN"
            return f"Trend Data for '{keyword}': Direction={trend_direction}. (Last 3mo Avg: {last_3_months:.1f} vs Start: {first_3_months:.1f})."
            
        except Exception as e:
            return f"Error fetching trends: {str(e)} (Google may be rate-limiting)"
