# Base Image: Use a minimal Python image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED 1
ENV APP_HOME /app
WORKDIR $APP_HOME

# Install dependencies (Copy and install requirements.txt)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend source code
COPY . .

# Expose the port Uvicorn will listen on
EXPOSE 8000

# Define the command to start the server
# The --host 0.0.0.0 is crucial for containerized deployment
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]