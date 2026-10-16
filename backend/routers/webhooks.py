from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
import os

router = APIRouter()

# Simple mock DB interface for now (In production this connects to Supabase)
# For this MLP phase, we just log the event to show it works.

class WebhookPayload(BaseModel):
    id: int
    total_price: str
    currency: str
    confirmed: bool
    # We allow extra fields since Shopify sends a lot of data
    class Config:
        extra = "allow"

@router.post("/shopify/orders-paid")
async def handle_shopify_order(payload: Dict[Any, Any], request: Request):
    """
    Receives 'orders/paid' webhook from Shopify.
    This is the "Safe Observer" - we only read data, we don't touch funds.
    """
    # 1. verify signature (Skipped for MLP speed, but crucial for Prod)
    # 2. Extract Data
    try:
        total_price = payload.get("total_price", "0.00")
        currency = payload.get("currency", "USD")
        order_id = payload.get("id")
        
        print(f"💰 REVENUE ALERT: Order #{order_id} - {currency} {total_price}")
        
        # 3. Update 'Marketing Data' (Simulated DB update)
        # In a real app: supabase.table('marketing_data').upsert(...)
        
        return {"status": "success", "message": "Revenue recorded"}
        
    except Exception as e:
        print(f"❌ Webhook Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process webhook")
