from fastapi import APIRouter, Request, HTTPException, Header
from pydantic import BaseModel
from typing import Dict, Any, Optional
import os
import hmac
import hashlib
import json
from datetime import datetime, timedelta

# Mock Supabase Client (In prod, use supabase-py)
# from supabase import create_client

router = APIRouter()

# LEMON SQUEEZY SECRETS
LS_WEBHOOK_SECRET = os.getenv("LEMONSQUEEZY_WEBHOOK_SECRET", "super_secret_mock_key")

# VARIANT MAPPING (You get these from LS Dashboard)
VARIANT_MAP = {
    "12345": "starter",
    "67890": "professional",
    "11223": "agency"
}

@router.post("/lemonsqueezy/webhook")
async def handle_lemonsqueezy_webhook(request: Request, x_signature: str = Header(None)):
    """
    Handles Subscription Events:
    - subscription_created: Grant access
    - subscription_updated: Handle Upgrades/Downgrades
    - subscription_payment_failed: Enter Grace Period
    """
    raw_body = await request.body()
    
    # 1. Verify Signature
    if not verify_signature(raw_body, x_signature):
        raise HTTPException(status_code=401, detail="Invalid Signature")

    data = json.loads(raw_body)
    event_name = data.get("meta", {}).get("event_name")
    payload = data.get("data", {}).get("attributes", {})
    custom_data = data.get("meta", {}).get("custom_data", {}) # We pass user_id here
    
    print(f"🍋 LEMON EVENT: {event_name}")

    if event_name == "subscription_created" or event_name == "subscription_updated":
        # Handle Tier Change
        variant_id = str(payload.get("variant_id"))
        status = payload.get("status")
        user_id = custom_data.get("user_id") # Passed during checkout
        
        new_tier = VARIANT_MAP.get(variant_id, "starter")
        
        print(f"🔄 Syncing User {user_id} -> {new_tier} ({status})")
        
        # TODO: Update Supabase
        # supabase.table('businesses').update({'tier': new_tier, 'subscription_status': status}).eq('user_id', user_id)
        
    elif event_name == "subscription_payment_failed":
        # Handle Dunning (Grace Period)
        user_id = custom_data.get("user_id")
        print(f"⚠️ PAYMENT FAILED for User {user_id}. Entering Grace Period.")
        
        # TODO: Update Supabase
        # supabase.table('businesses').update({'subscription_status': 'past_due'}).eq('user_id', user_id)

    return {"status": "processed"}

def verify_signature(body: bytes, signature: str) -> bool:
    if not signature:
        return False
    digest = hmac.new(LS_WEBHOOK_SECRET.encode(), body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(digest, signature)
