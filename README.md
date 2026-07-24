# Finity

Finity is a local financial literacy prototype from a 2025 hackathon. It combines a fictional ₹ paper market, expense and income records, an investment projection, short lessons, and a learning assistant. **Prices and returns are invented for practice. No real orders are placed, no market feed is connected, and projections are not forecasts.**

## Run the demo

With Docker installed, run:

```bash
docker compose up --build
```

Open `http://localhost:3000`, create an account, and complete the questionnaire. The backend serves `http://localhost:8000/docs`. SQLite data persists in the `finity_data` Docker volume. Stop with `docker compose down`. For sessions that should survive a restart, set a strong `SECRET_KEY` in a root `.env` first.

For native development, use Python 3.13 and Node.js 22:

```bash
python -m venv .venv
# Activate .venv for your shell
pip install -r backend/requirements.txt
cd backend
uvicorn main:app --reload --port 8000
```

In another terminal, run `cd frontend`, `npm ci`, and `npm run dev`. The frontend's Vite proxy targets `http://127.0.0.1:8000`; `VITE_PROXY_TARGET` can change that target. For a separately deployed frontend, set `VITE_API_BASE_URL` to the backend's public base URL. Backend `DATABASE_URL` defaults to a local SQLite file; see `backend/.env.example` for the other settings. Set `ALLOWED_ORIGINS` for the actual frontend origins. A `GEMINI_API_KEY` is optional: it enables open-ended assistant and course text. Paper trading, expense records, projections, and built-in educational answers work without it.

## What works

- New accounts start with ₹100,000 of server-stored paper cash. The eight fictional assets have fixed prices; buy and sell operations update holdings and cash in one database transaction. The API rejects unknown symbols, overspending, and overselling. Data is scoped to the signed-in user.
- Expenses, income, age and occupation, and earned achievements are saved in the backend. Analytics reads the saved transaction history. The assistant receives the current conversation history in each request, but does not save conversations between sessions.
- The investment projection uses hypothetical growth assumptions. Three backend lessons describe budgeting and compounding; six additional frontend lesson cards are static educational content. Some badges and trading counters still use browser state, so they are illustrative rather than authoritative progress records.
- `backend/tests/test_demo.py` exercises signup, trading limits, account isolation, expense records, streaks, profile edits, achievements and assistant fallback. GitHub CI runs that test and builds the frontend.

## Limits and deployment

This is a single-process local demo. SQLite is the default, with `DATABASE_URL` available for a hosted database. Existing deployments were unavailable when this repo was repaired, so this README does not claim a working public site. Chat with no Gemini key uses built-in explanations; Gemini output has not been independently verified as financial guidance. User interface text should be read as education, not an instruction to invest or spend.

The original hackathon work was collaborative: Amogh worked on the backend; Muneer worked on the frontend. This maintenance pass repaired the local demo and made its claims match the code. See `LICENSE` for the MIT license.
