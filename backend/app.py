from flask import Flask, request, jsonify
from flask_cors import CORS
from deepface import DeepFace
import cv2
import numpy as np
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def bytes_to_image(image_bytes):
    """Convert uploaded bytes to OpenCV image"""
    print("Converting bytes to image...")
    np_array = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
    print(f"Image shape: {img.shape}")  
    return img

CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:3001",  # Allow development frontend
            "https://your-production-frontend.com"  # Allow production frontend
        ]
    }
})

@app.route('/versions')
def versions():
    import pkg_resources
    return {
        'numpy': pkg_resources.get_distribution('numpy').version,
        'tensorflow': pkg_resources.get_distribution('tensorflow').version
    }
    
@app.route('/verify-face', methods=['POST'])
def verify_face():
    print("\n=== New Face Verification Request ===")
    try:
        print("Reading uploaded files...")
        document_bytes = request.files['document'].read()
        selfie_bytes = request.files['selfie'].read()
        print(f"Document size: {len(document_bytes)} bytes")
        print(f"Selfie size: {len(selfie_bytes)} bytes")
        
        print("Converting document...")
        document_img = bytes_to_image(document_bytes)
        print("Converting selfie...")
        selfie_img = bytes_to_image(selfie_bytes)
        
        print("Starting face verification...")
        result = DeepFace.verify(
            img1_path=document_img,
            img2_path=selfie_img,
            model_name="VGG-Face",
            detector_backend="opencv",
            enforce_detection=False
        )
        print("Verification complete!")
        print(f"Result: {result}")
        
        response = {
            "match": bool(result["verified"]),
            "confidence": float(result["distance"]),
            "message": "Success" if result["verified"] else "Faces do not match"
        }
        print(f"Returning response: {response}")
        return jsonify(response)
        
    except Exception as e:
        print(f"!!! ERROR: {str(e)}")
        error_response = {
            "match": False,
            "error": str(e),
            "message": "Verification failed"
        }
        print(f"Returning error: {error_response}")
        return jsonify(error_response), 500

if __name__ == '__main__':
    print("Starting Flask server...........")
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))