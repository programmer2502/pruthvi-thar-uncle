from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import joblib
import pandas as pd
import numpy as np
from rag_service import get_rag_system

app = FastAPI(title="Vehicle Fault Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
try:
    model = joblib.load('fault_detection_model.pkl')
except Exception as e:
    print("Warning: Model not found. Please train it first.")
    model = None

# Fault resolution database
resolutions = {
    "Battery Issue": {
        "severity": "Low",
        "temporary_fix": "Try jump-starting the vehicle.",
        "permanent_fix": "Replace battery and check alternator.",
        "estimated_cost": "₹2000 - ₹5000"
    },
    "Engine Misfire": {
        "severity": "High",
        "temporary_fix": "Avoid high speeds; pull over if shaking is severe.",
        "permanent_fix": "Replace spark plugs or ignition coils.",
        "estimated_cost": "₹3000 - ₹8000"
    },
    "Catalytic Converter Failure": {
        "severity": "High",
        "temporary_fix": "Minimize driving. Fix any engine misfires first.",
        "permanent_fix": "Replace catalytic converter.",
        "estimated_cost": "₹15000 - ₹25000"
    },
    "Oxygen Sensor Failure": {
        "severity": "Medium",
        "temporary_fix": "Safe to drive short distances, but fuel economy will suffer.",
        "permanent_fix": "Replace the faulty O2 sensor.",
        "estimated_cost": "₹4000 - ₹7000"
    },
    "Worn Brake Pads": {
        "severity": "High",
        "temporary_fix": "Drive carefully, leave extra stopping distance.",
        "permanent_fix": "Replace brake pads and inspect rotors.",
        "estimated_cost": "₹2000 - ₹6000"
    },
    "Coolant Leak": {
        "severity": "High",
        "temporary_fix": "Top up coolant. Do NOT drive if temperature gauge is in red.",
        "permanent_fix": "Find and fix the leak; replace hose or radiator.",
        "estimated_cost": "₹1500 - ₹7000"
    },
    "Wheel Alignment Issue": {
        "severity": "Low",
        "temporary_fix": "Keep firm grip on steering wheel while driving.",
        "permanent_fix": "Get a professional 4-wheel alignment.",
        "estimated_cost": "₹800 - ₹1500"
    },
    "AC Refrigerant Leak": {
        "severity": "Low",
        "temporary_fix": "Roll down windows for ventilation.",
        "permanent_fix": "Locate the leak, repair, and recharge AC refrigerant.",
        "estimated_cost": "₹2500 - ₹5000"
    },
    "Alternator Failure": {
        "severity": "High",
        "temporary_fix": "Turn off all non-essential electronics to conserve battery.",
        "permanent_fix": "Replace the alternator.",
        "estimated_cost": "₹5000 - ₹12000"
    },
    "Transmission Issue": {
        "severity": "High",
        "temporary_fix": "Avoid driving to prevent further internal damage.",
        "permanent_fix": "Transmission rebuild or full replacement.",
        "estimated_cost": "₹25000 - ₹80000"
    }
}

# Keyword-based fallback rules for low-confidence situations
# Maps symptom keywords → most likely fault
KEYWORD_RULES = [
    (["engine symbol", "engine light", "engine warning", "check engine", "warning light", "malfunction indicator", "engine sign", "engine display"], "Engine Misfire"),
    (["brake", "braking", "squealing", "grinding noise", "pedal soft", "screeching"], "Worn Brake Pads"),
    (["overheat", "temperature high", "steam", "coolant", "sweet smell", "green liquid", "yellow liquid"], "Coolant Leak"),
    (["ac", "air condition", "cold air", "warm air", "air conditioning", "refrigerant"], "AC Refrigerant Leak"),
    (["gear", "transmission", "shifting", "slipping", "clunking", "revs high"], "Transmission Issue"),
    (["pull to one side", "alignment", "steering shakes", "vibration driving", "uneven tire", "drift"], "Wheel Alignment Issue"),
    (["dead battery", "won't start", "won't turn over", "clicks", "no power", "dashboard dark", "battery"], "Battery Issue"),
    (["alternator", "battery light", "dim lights", "car dies while driving", "electrical failing"], "Alternator Failure"),
    (["rotten egg", "sulfur", "poor fuel", "sluggish", "catalytic"], "Catalytic Converter Failure"),
    (["oxygen", "o2 sensor", "running lean", "fuel efficiency", "poor mileage"], "Oxygen Sensor Failure"),
]

def keyword_fallback(symptoms_text: str) -> Optional[str]:
    """Return a fault name if symptom text strongly matches keyword rules."""
    text = symptoms_text.lower()
    best_fault = None
    best_score = 0
    for keywords, fault in KEYWORD_RULES:
        score = sum(1 for kw in keywords if kw in text)
        if score > best_score:
            best_score = score
            best_fault = fault
    return best_fault if best_score > 0 else None


class OBDData(BaseModel):
    rpm: Optional[int] = 0
    temp: Optional[int] = 0
    dtc: Optional[str] = ""

class PredictionRequest(BaseModel):
    symptoms: str
    obd_data: Optional[OBDData] = None

@app.post("/predict")
async def predict_fault(req: PredictionRequest):
    if not model:
        raise HTTPException(status_code=500, detail="Model not loaded. Train the model first.")

    obd = req.obd_data or OBDData()
    input_df = pd.DataFrame([{
        'dtc': obd.dtc if obd.dtc else 'None',
        'symptoms': req.symptoms
    }])

    try:
        prediction = model.predict(input_df)[0]
        probabilities = model.predict_proba(input_df)[0]
        confidence = round(max(probabilities) * 100, 2)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    fault = str(prediction)

    # --- Low-confidence fallback ---
    # If model isn't confident enough, try keyword-based override
    LOW_CONFIDENCE_THRESHOLD = 40.0
    fallback_used = False
    if confidence < LOW_CONFIDENCE_THRESHOLD:
        fallback_fault = keyword_fallback(req.symptoms)
        if fallback_fault:
            fault = fallback_fault
            fallback_used = True

    res = resolutions.get(fault, {
        "severity": "Unknown",
        "temporary_fix": "Consult a mechanic for proper diagnosis.",
        "permanent_fix": "Professional diagnosis needed.",
        "estimated_cost": "Varies"
    })

    # Generate enhanced RAG response
    rag = get_rag_system()
    enhanced_answer = rag.generate_enhanced_response(req.symptoms, fault, res)

    return {
        "fault": fault,
        "confidence": f"{confidence}%" if not fallback_used else f"{confidence}% (keyword-assisted)",
        "severity": res["severity"],
        "temporary_fix": res["temporary_fix"],
        "permanent_fix": res["permanent_fix"],
        "estimated_cost": res["estimated_cost"],
        "enhanced_answer": enhanced_answer
    }

@app.get("/")
def root():
    return {"message": "Vehicle Fault Detection API is running"}
