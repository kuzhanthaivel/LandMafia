# LandMafia Backend

This is the backend service for LandMafia, responsible for face verification and version reporting. It is built with Flask and uses DeepFace for facial recognition.

## Features

- **Face Verification API**: Compares a government ID image and a selfie to verify user identity.
- **Version Endpoint**: Reports installed versions of key dependencies.
- **CORS Support**: Configured for secure frontend-backend communication.

## Endpoints

### `POST /verify-face`

Verifies if the face in the uploaded document matches the selfie.

**Request:**
- `multipart/form-data` with fields:
  - `document`: Image file (ID card, etc.)
  - `selfie`: Image file (selfie with/without ID)

**Response:**
```json
{
  "match": true,
  "confidence": 0.34,
  "message": "Success"
}
```

### `GET /versions`

Returns the versions of `numpy` and `tensorflow` used by the backend.

**Response:**
```json
{
  "numpy": "1.24.3",
  "tensorflow": "2.12.0"
}
```

## Running Locally

1. **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```

2. **Run the server:**
   ```sh
   python app.py
   ```

   The server will start on `http://0.0.0.0:5000`.

## Docker

Build and run with Docker:

```sh
docker build -t landmafia-backend .
docker run -p 5000:5000 landmafia-backend
```

## Environment Variables

- `PORT` (optional): Port to run the server (default: 5000).

## File Structure

- [`app.py`](app.py): Main Flask application.
- [`requirements.txt`](requirements.txt): Python dependencies.
- [`Dockerfile`](Dockerfile): Docker build instructions.

## License

MIT