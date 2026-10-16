import requests
from bs4 import BeautifulSoup
import json
import re

class CompetitorSpy:
    """
    A tool for analyzing Shopify stores to extract theme, pricing, and copy strategy.
    """
    
    def analyze_store(self, url: str):
        if not url.startswith("http"):
            url = f"https://{url}"
            
        try:
            print(f"🕵️ Spying on: {url}")
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code != 200:
                return {"error": f"Failed to access store. Status: {response.status_code}"}
                
            soup = BeautifulSoup(response.text, 'html.parser')
            
            return {
                "theme": self._detect_theme(soup),
                "pricing": self._analyze_pricing(soup),
                "copy_tone": self._analyze_copy(soup)
            }
            
        except Exception as e:
            return {"error": str(e)}

    def _detect_theme(self, soup):
        # Look for Shopify.theme in scripts
        scripts = soup.find_all('script')
        for script in scripts:
            if script.string and 'Shopify.theme' in script.string:
                match = re.search(r'"name":"([^"]+)"', script.string)
                if match:
                    return match.group(1)
        return "Unknown / Custom"

    def _analyze_pricing(self, soup):
        # basic heuristics for product prices
        prices = []
        price_elements = soup.find_all(class_=re.compile("price", re.IGNORECASE))
        
        for el in price_elements:
            text = el.get_text().strip()
            match = re.search(r'\$?(\d+\.?\d*)', text)
            if match:
                try:
                    prices.append(float(match.group(1)))
                except:
                    pass
                    
        if not prices:
            return "Hidden / Dynamic"
            
        avg_price = sum(prices) / len(prices)
        return {
            "average_price": round(avg_price, 2),
            "price_range": f"${min(prices)} - ${max(prices)}"
        }

    def _analyze_copy(self, soup):
        # Extract meta description and h1s
        description = soup.find('meta', attrs={'name': 'description'})
        desc_text = description['content'] if description else "No description"
        
        h1s = [h.get_text().strip() for h in soup.find_all('h1')]
        
        # Simple keyword density
        words = (desc_text + " " + " ".join(h1s)).lower().split()
        keywords = [w for w in words if len(w) > 4]
        
        return {
            "headlines": h1s[:3],
            "meta_description": desc_text[:100] + "...",
            "keywords": list(set(keywords))[:5]
        }
