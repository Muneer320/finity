# ai/coach_agent.py (Production Ready Code for Gemini Integration)

from google import genai
from google.genai import types
from dotenv import load_dotenv
import os
from typing import List, Dict
import random

# --- Configuration and Client Initialization ---
load_dotenv()
# We use the correct environment variable name for Google's API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") 

try:
    client = genai.Client(api_key=GEMINI_API_KEY)
    MODEL = 'gemini-2.5-flash' # Chosen for speed and chat capability
except Exception as e:
    # If key fails, use a mock client to unblock Mallika and Muneer
    print(f"Gemini client initialization failed: {e}. Using mock functions.")
    client = None

# --- Investment Simulation Logic (Internal Tool for the LLM) ---

def run_mock_simulation(start: float, monthly: float, years: int, risk: str) -> Dict:
    """Mocks a backend compounding interest calculation."""
    # Use different rates to provide meaningful simulation results
    RATE = 0.05 if risk == 'Low' else 0.08 if risk == 'Medium' else 0.12 # Mock rates
    
    total_months = years * 12
    # Standard Future Value formula (simplified)
    future_value = start * ((1 + RATE / 12)**total_months) + monthly * (((1 + RATE / 12)**total_months - 1) / (RATE / 12))
    
    total_contributed = start + (monthly * total_months)
    
    return {
        "start_amount": start,
        "monthly_contribution": monthly,
        "total_years": years,
        "mock_annual_rate": round(RATE * 100, 1),
        "total_contributed": round(total_contributed),
        "projected_final_value": round(future_value),
        "total_gain": round(future_value - total_contributed)
    }

# --- AI Generative Functions ---

def generate_financial_summary(user_data: Dict, expenses: List[Dict]) -> str:
    """Generates the three-part personalized budget summary."""
    if not client: return "AI Coach is currently offline. Check API key."

    # Convert complex expenses list into a simpler string for the LLM
    expense_summary = "\n".join([f"Category: {e['category']}, Amount: {e['amount']}" for e in expenses])
    
    # Analyze spending by category (Amogh's P3 task from previous steps)
    category_totals = {}
    for e in expenses:
        category_totals[e['category']] = category_totals.get(e['category'], 0) + e['amount']

    # Identify the highest spending category for the Awareness Check
    highest_category = max(category_totals, key=category_totals.get) if category_totals else "Uncategorized"
    highest_spent = round(category_totals.get(highest_category, 0), 2)


    # Inject all gathered data into the System Prompt
    prompt = f"""
    SYSTEM ROLE: You are 'Frugal Friend,' a supportive, expert financial coach. Analyze the user's spending and goals to provide a summary in a friendly, non-judgmental tone.
    
    USER FINANCIAL DATA:
    - Monthly Fixed Budget: ${user_data.get('fixed_budget', 0)}
    - Financial Confidence Score: {user_data.get('financial_confidence', 5)}/10
    - Goal: {user_data.get('goal_name', 'No Goal Set')}
    - Highest Spending Category (Recent): {highest_category} (${highest_spent})
    
    INSTRUCTIONS:
    1.  **Quick Win:** Find one positive aspect (e.g., consistency, low spending in a non-essential area, or simply logging daily).
    2.  **Awareness Check:** Address the highest spending category identified in the data. Frame it as an opportunity.
    3.  **Next Step Nudge:** Provide ONE specific, behaviorally-informed action to reduce spending in that highest category.
    
    RESPOND ONLY in the following exact format (use the exact headings and Markdown):
    ## Your Weekly Financial Snapshot 🧭
    ### ✅ Great Job!
    [One sentence of positive reinforcement.]
    
    ### 🚩 Awareness Check
    [One sentence identifying the problem category and total spent this period.]
    
    ### 🚀 Next Step Nudge
    [One specific, actionable tip for habit change.]
    """
    
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(temperature=0.4)
    )
    return response.text

def generate_investment_micro_course(user_data: Dict, simulation_result: Dict) -> str:
    """Generates the investment micro-course based on simulation results."""
    if not client: return "AI Course Generator is offline."
    
    # Combine user goals with structured simulation data
    simulation_text = (
        f"Goal: {user_data.get('goal_name')}. "
        f"Simulation Result: Projected Value=${simulation_result['projected_final_value']}, "
        f"Total Gain=${simulation_result['total_gain']} over {simulation_result['total_years']} years."
    )
    
    prompt = f"""
    SYSTEM ROLE: You are an expert financial educator. Your goal is to simplify investment concepts based on the user's simulation.
    
    INSTRUCTIONS:
    1.  Create a title: **Your 5-Minute Investment Masterclass**
    2.  Explain the power of **compound interest** using the user's projected gain (${simulation_result['total_gain']}) as the primary example.
    3.  Explain the **mock risk level** ({simulation_result['mock_annual_rate']}% mock rate) in simple terms, adjusted for the user's confidence ({user_data.get('financial_confidence')}/10).
    4.  End with one **simple action step** to "start paper trading."
    
    DATA: {simulation_text}
    """
    
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(temperature=0.5)
    )
    return response.text