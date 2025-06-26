"use client"

import React, { useState } from 'react';

const VideoUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState('');
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      // Validate file type and size (max 100MB)
      if (!file.type.startsWith('video/')) {
        setError('Please select a video file (MP4, MOV, etc.)');
        return;
      }
      
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        setError('File size too large (max 100MB)');
        return;
      }
      
      setSelectedFile(file);
      setError('');
      setIpfsHash('');
      setUploadProgress(0);
    }
  };

  const uploadFileToIPFS = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const metadata = JSON.stringify({
      name: file.name,
    });
    formData.append('pinataMetadata', metadata);

    try {
      const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          // IMPORTANT: Replace these with environment variables in production
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY || "b670445db8b318a6e492",
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY || "7d343880e219ccc78e44c8c8ffd43d62a5fc250d087a809a8f2123aac91c9aed",
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to upload file");
      }

      const result = await response.json();
      return result.IpfsHash;
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error(error.message || "Network error during upload");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      const hash = await uploadFileToIPFS(selectedFile);
      setIpfsHash(hash);
      setUploadProgress(100);
    } catch (err) {
      setError(err.message || 'Failed to upload video');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Video Upload to IPFS</h2>
      
      <div className="file-input-container">
        <label className="file-input-label">
          Choose Video File
          <input 
            type="file" 
            accept="video/*" 
            onChange={handleFileChange}
            className="file-input"
          />
        </label>
        
        {selectedFile && (
          <div className="file-info">
            <p>Selected: {selectedFile.name}</p>
            <p>Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
            <p>Type: {selectedFile.type}</p>
          </div>
        )}
      </div>
      
      <button 
        onClick={handleUpload} 
        disabled={!selectedFile || isUploading}
        className={`upload-button ${isUploading ? 'uploading' : ''}`}
      >
        {isUploading ? (
          <>
            <span className="spinner"></span>
            Uploading... {uploadProgress}%
          </>
        ) : (
          'Upload Video'
        )}
      </button>
      
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
      
      {error && (
        <div className="error-message">{error}</div>
      )}
      
      {ipfsHash && (
        <div className="success-message">
          <h3>Upload Successful!</h3>
          <p>IPFS Hash: <code>{ipfsHash}</code></p>
          <div className="ipfs-link">
            <a 
              href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              View Your Video on IPFS
            </a>
          </div>
          <div className="embed-container">
            <video controls width="100%">
              <source 
                src={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`} 
                type={selectedFile.type} 
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}

      <style jsx>{`
        .upload-container {
          max-width: 600px;
          margin: 2rem auto;
          padding: 2rem;
          background: #f8f9fa;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .file-input-label {
          display: inline-block;
          padding: 12px 20px;
          background: #4CAF50;
          color: white;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.3s;
          margin-bottom: 1rem;
        }
        
        .file-input-label:hover {
          background: #45a049;
        }
        
        .file-input {
          display: none;
        }
        
        .file-info {
          margin: 1rem 0;
          padding: 1rem;
          background: #e9ecef;
          border-radius: 4px;
        }
        
        .upload-button {
          padding: 12px 24px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: background 0.3s;
          width: 100%;
          position: relative;
        }
        
        .upload-button:hover:not(:disabled) {
          background: #0069d9;
        }
        
        .upload-button:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }
        
        .upload-button.uploading {
          background: #17a2b8;
        }
        
        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
          margin-right: 8px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e9ecef;
          border-radius: 4px;
          margin: 1rem 0;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: #28a745;
          transition: width 0.3s ease;
        }
        
        .error-message {
          color: #dc3545;
          margin: 1rem 0;
          padding: 0.5rem;
          background: #f8d7da;
          border-radius: 4px;
        }
        
        .success-message {
          margin: 1rem 0;
          padding: 1rem;
          background: #d4edda;
          border-radius: 4px;
          color: #155724;
        }
        
        .ipfs-link a {
          color: #155724;
          text-decoration: underline;
        }
        
        .embed-container {
          margin-top: 1rem;
          border-radius: 4px;
          overflow: hidden;
        }
        
        code {
          background: #f1f1f1;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: monospace;
        }
      `}</style>
    </div>
  );
};

export default VideoUploader;