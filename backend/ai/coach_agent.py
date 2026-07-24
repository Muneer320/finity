# ai/coach_agent.py (Production Ready Code for Gemini Integration)

from google import genai
from google.genai import types
from dotenv import load_dotenv
import os
from typing import List, Dict
from datetime import datetime, timedelta

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

ASSET_CATALOG = [
    {"id": 1, "symbol": "TECH", "name": "Tech Corp", "price": 2500, "change": 5.2, "category": "Technology", "dividend": 2.5, "peRatio": 18.5, "marketCap": "Large", "type": "Stock"},
    {"id": 2, "symbol": "FIN", "name": "Finance Ltd", "price": 1800, "change": -2.1, "category": "Finance", "dividend": 0, "peRatio": 22.3, "marketCap": "Mid", "type": "Stock"},
    {"id": 3, "symbol": "HEALTH", "name": "Health Inc", "price": 3200, "change": 3.8, "category": "Healthcare", "dividend": 3.2, "peRatio": 15.7, "marketCap": "Large", "type": "Stock"},
    {"id": 4, "symbol": "ENERGY", "name": "Energy Co", "price": 1500, "change": -1.5, "category": "Energy", "dividend": 4.5, "peRatio": 12.1, "marketCap": "Mid", "type": "Stock"},
    {"id": 5, "symbol": "CONS", "name": "Consumer Goods", "price": 2100, "change": 2.3, "category": "Consumer", "dividend": 1.8, "peRatio": 20.4, "marketCap": "Small", "type": "Stock"},
    {"id": 6, "symbol": "BALANCED", "name": "Balanced Fund", "price": 5000, "change": 1.8, "category": "Mutual Fund", "riskLevel": "Medium", "returns3Y": 12.5, "type": "Mutual Fund"},
    {"id": 7, "symbol": "GROWTH", "name": "Growth Fund", "price": 8000, "change": 4.2, "category": "Mutual Fund", "riskLevel": "High", "returns3Y": 18.3, "type": "Mutual Fund"},
    {"id": 8, "symbol": "DEBT", "name": "Debt Fund", "price": 3500, "change": 0.8, "category": "Mutual Fund", "riskLevel": "Low", "returns3Y": 7.2, "type": "Mutual Fund"},
]
for asset in ASSET_CATALOG:
    asset["positive"] = asset["change"] >= 0
    asset["trend"] = [round(asset["price"] * (0.94 + i * 0.006), 2) for i in range(10)]
STATIC_ASSET_HISTORY = {asset["symbol"]: [
    {"date": (datetime.now().date() - timedelta(days=9-i)).isoformat(), "price": value}
    for i, value in enumerate(asset["trend"])
] for asset in ASSET_CATALOG}
ASSET_LIST = list(STATIC_ASSET_HISTORY)

def get_mock_asset_history(symbol: str) -> List[Dict]:
    """Retrieves the static 10-day historical data for a symbol."""
    return STATIC_ASSET_HISTORY.get(symbol, [])

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
    - Monthly Fixed Budget: ₹{user_data.get('fixed_budget', 0)}
    - Financial Confidence Score: {user_data.get('financial_confidence', 5)}/10
    - Goal: {user_data.get('goal_name', 'No Goal Set')}
    - Highest Spending Category (Recent): {highest_category} (₹{highest_spent})
    
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
    if not client:
        return ("This is a hypothetical projection, not a forecast. Compounding means returns may generate further returns over time. "
                "Compare the projected value with your total contributions, then try different contribution and risk assumptions. "
                "Actual investment returns can differ substantially and can be negative.")
    
    # Combine user goals with structured simulation data
    simulation_text = (
        f"Goal: {user_data.get('goal_name')}. "
        f"Simulation Result: Projected Value=₹{simulation_result['projected_final_value']}, "
        f"Total Gain=₹{simulation_result['total_gain']} over {simulation_result['total_years']} years."
    )
    
    prompt = f"""
    SYSTEM ROLE: You are an expert financial educator. Your goal is to simplify investment concepts based on the user's simulation.
    
    INSTRUCTIONS:
    1.  Create a title: **Your 5-Minute Investment Masterclass**
    2.  Explain the power of **compound interest** using the user's projected gain (₹{simulation_result['total_gain']}) as the primary example.
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

def get_chat_response(user_message: str, chat_history: List[Dict]) -> str:
    """Handles conversational chat, including general Q&A and financial literacy."""
    if not client:
        question = user_message.lower()
        if "compound" in question:
            return "Compound interest means interest can earn more interest over time. Try different assumptions in the paper simulator to see how the projection changes."
        if "emergency" in question:
            return "An emergency fund is cash set aside for unexpected costs. Start by tracking expenses so you can choose a target that fits your situation."
        if "mutual" in question:
            return "A mutual fund pools investors' money into a portfolio. Its value can rise or fall; Finity's fund prices are fictional and only for practice."
        if "budget" in question:
            return "A budget compares income with planned and actual spending. Log a few expenses and look at the category chart to spot patterns."
        return "The optional AI coach is unavailable. You can still use Finity's paper trading, expense tracking, and investment projection demo. Ask about compound interest, emergency funds, mutual funds, or budgeting for a built-in explanation."

    # Inject the history and a system persona
    full_prompt = f"""
    SYSTEM ROLE: You are 'Frugal Friend,' an empathetic and witty AI Financial Coach. 
    Your goal is to answer user questions, guide them to financial literacy, and encourage saving. 
    Keep responses concise and conversational.
    
    CHAT HISTORY: {chat_history}
    USER MESSAGE: {user_message}
    """
    
    response = client.models.generate_content(
        model=MODEL,
        contents=full_prompt,
        config=types.GenerateContentConfig(temperature=0.7)
    )
    return response.text

def generate_next_lesson(user_data: Dict, lesson_index: int) -> Dict:
    """
    Generates a single personalized lesson and its required Proof-of-Concept assignment.
    The lesson content is generated by the LLM, but the assignment criteria are hardcoded 
    to ensure predictable backend checks.
    """
    # Check for Gemini client initialization failure
    if not client:
        lessons = [
            ("Spending awareness", "A useful budget starts with a record of what you actually spend. Fixed costs recur, while variable costs change. Log expenses in Finity to see both patterns.", "Log expenses on three consecutive days.", "consecutive_logs_3"),
            ("Compound growth", "Compounding means returns can produce further returns. Finity's projection uses hypothetical rates and is not a forecast. Change the contribution and risk setting to explore the assumptions.", "Run a projection with at least ₹50 monthly contribution.", "simulator_run_min_50"),
            ("Category planning", "Grouping expenses can reveal where money goes. Compare categories with your income and choose goals that fit your circumstances.", "Log expenses in five categories.", "expense_categories_5"),
        ]
        index = min(max(lesson_index, 1), len(lessons)) - 1
        title, content, assignment, key = lessons[index]
        return {"lesson_title": title, "lesson_content": content, "assignment_text": assignment, "unlock_criteria_key": key, "lesson_number": index + 1}

    # --- 1. Define POC Assignment and Criteria based on Index ---
    # This dictionary maps the lesson index to the required POC activity.
    ASSIGNMENTS = {
        1: {
            "topic": "Introduction to Financial Awareness: Fixed vs. Variable Spending", 
            "criteria": "consecutive_logs_3", 
            "instruction": "Your challenge: Log every expense (any amount) for the next 3 days straight to prove you've started the habit."
        },
        2: {
            "topic": "The Power of Compounding Interest: Making Money Work", 
            "criteria": "simulator_run_min_50", 
            "instruction": "Your assignment: Go to the Investment Simulator and run a scenario with a monthly contribution of at least ₹50. Find your gain!"
        },
        3: {
            "topic": "Mastering the Budget: The Zero-Based Audit", 
            "criteria": "expense_categories_5", 
            "instruction": "Your audit: Log at least one expense in five different categories to demonstrate you've considered all budgeting areas."
        }
    }
    
    # Get the data for the current lesson index (defaults to Lesson 1 if index > 3 for MVP)
    lesson_data = ASSIGNMENTS.get(lesson_index, ASSIGNMENTS[1]) 
    
    topic = lesson_data['topic']
    criteria_key = lesson_data['criteria']
    instruction = lesson_data['instruction']
    
    # --- 2. Construct LLM Prompt to Generate Lesson Content ---

    prompt = f"""
    SYSTEM ROLE: You are 'Frugal Friend,' an expert financial educator. Your goal is to simplify investment concepts and budgeting habits for a beginner user.
    
    USER DATA: Fixed Budget: ₹{user_data['fixed_budget']}, Confidence: {user_data['financial_confidence']}/10.
    
    INSTRUCTIONS:
    1.  Generate a concise, simplified lesson content (max 5 sentences) on the topic: '{topic}'.
    2.  The tone must be encouraging and match the user's confidence level.
    3.  Output ONLY the lesson content text, nothing else.
    """
    
    # --- 3. Call LLM to generate the content ---
    
    # Use gemini-2.5-pro for better adherence to complex instructions
    try:
        response = client.models.generate_content(
            model='gemini-2.5-pro', 
            contents=prompt
        )
        generated_lesson_text = response.text.strip()
    except Exception as e:
        # Fallback if AI API call fails during the hackathon
        generated_lesson_text = f"Error generating content: {e}. Focus on the assignment below!"

    # --- 4. Return the structured result ---
    # This structure is easily parsed by Mallika's frontend
    return {
        "lesson_title": topic, 
        "lesson_content": generated_lesson_text, 
        "assignment_text": instruction, 
        "unlock_criteria_key": criteria_key, # Key used by Muneer's frontend logic
        "lesson_number": lesson_index
    }
