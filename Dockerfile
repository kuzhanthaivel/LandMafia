# Use official Python 3.9 image (DeepFace works best with Python 3.9)
FROM python:3.9-slim

# Set working directory to /app
WORKDIR /app

# Install system dependencies (required for OpenCV & DeepFace)
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy ONLY requirements.txt first (for caching)
COPY ./backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend folder
COPY ./backend /app



# Expose port (Render will override $PORT)
EXPOSE 5000

# Run Gunicorn with timeout (DeepFace needs longer timeouts)
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--timeout", "600", "app:app"]