# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set environment variables for Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory in the container
WORKDIR /app

# Install system dependencies if any (e.g., for psycopg2 if not using -binary)
# RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container at /app
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
# Using --no-cache-dir to reduce image size
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy the .env file. For Cloud Run, it's often better to set environment variables directly in the service configuration.
# If you choose to copy it, ensure it's managed securely and consider .dockerignore.
# COPY .env .

# Copy the rest of the application code into the container at /app
COPY ./app ./app

# Expose port 8000 to the outside world
EXPOSE 8000

# Command to run the application
# We use 0.0.0.0 to allow connections from outside the container
# The port should match the EXPOSE instruction and your app's configuration
# We are running the app as a module, similar to how we got it working locally.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
