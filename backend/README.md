# Backend API

FastAPI backend for The Frugal Friend application.

## Setup

See main [README.md](../README.md) for setup instructions.

## API Documentation

Once the server is running, visit:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development

To run in development mode with auto-reload:

```bash
uvicorn main:app --reload
```

To run on a different port:

```bash
uvicorn main:app --reload --port 8080
```

## Database

The application uses SQLite for simplicity during the hackathon. The database file (`app.db`) is created automatically on first run.

## Environment Variables

Create a `.env` file with the following variables:

- `DATABASE_URL` - Database connection string
- `OPENAI_API_KEY` or `GOOGLE_API_KEY` - LLM API key
- `ALLOWED_ORIGINS` - CORS allowed origins
