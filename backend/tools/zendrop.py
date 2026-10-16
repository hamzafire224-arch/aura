import random

class ZendropClient:
    """
    A client for the Zendrop API (Sourcing).
    Currently runs in MOCK mode until a valid API Key is provided.
    """
    
    def __init__(self, api_key=None):
        self.api_key = api_key
        # Check environment variable in real implementation
        
    def search_winning_products(self, niche: str):
        """
        Simulates fetching 'Winning' products from Zendrop.
        Applies Analyst filters (Shipping < 20 days, Margin > 60%).
        """
        print(f"📦 Zendrop Sourcing for: {niche}")
        
        # MOCK DATA - simulating a real API response
        mock_products = [
            {
                "name": f"Premium {niche.title()} Kit",
                "cost": 12.50,
                "retail": 49.99,
                "shipping_days": 12,
                "supplier": "Zendrop Verified",
                "image": "https://placehold.co/300x300/10b981/ffffff?text=Product+A"
            },
            {
                "name": f"Eco {niche.title()} Accessory",
                "cost": 4.20,
                "retail": 19.99,
                "shipping_days": 8,
                "supplier": "US Warehouse",
                "image": "https://placehold.co/300x300/3b82f6/ffffff?text=Product+B"
            },
            {
                "name": "Generic Drop Item",
                "cost": 15.00,
                "retail": 20.00,
                "shipping_days": 35, # This should be filtered out
                "supplier": "Slow Boat"
            }
        ]
        
        # APPLY ANALYST LOGIC
        filtered = []
        for p in mock_products:
            margin = (p['retail'] - p['cost']) / p['retail']
            
            # Filters
            if p['shipping_days'] > 20:
                continue
            if margin < 0.60:
                continue
                
            p['margin_percent'] = round(margin * 100, 1)
            filtered.append(p)
            
        return filtered
