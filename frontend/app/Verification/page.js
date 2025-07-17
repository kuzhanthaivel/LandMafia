"use client";
import { useState, useRef, useEffect } from 'react';
import Header from "../../components/header";
import Footer from "../../components/footer";
import { Outfit } from 'next/font/google';
import { useRouter } from 'next/navigation';
import {Check} from 'lucide-react';
const outfit = Outfit({
  subsets: ["latin"],
  weight: "400",
});

export default function DocumentVerification() {
  const router = useRouter();
  const [documentImage, setDocumentImage] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const documentInputRef = useRef();
  const selfieInputRef = useRef();

  // Check if already verified
  useEffect(() => {
    const isVerified = localStorage.getItem('isVerified') === 'true';
    if (isVerified) {
      router.push('/uploadLand');
    }
  }, [router]);

  const handleImageUpload = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size should be less than 10MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!documentImage || !selfieImage) {
      setError('Please upload both images');
      return;
    }

    setLoading(true);
    setError(null);
    setVerificationResult(null);

    try {
      const formData = new FormData();
      const documentFile = dataURLtoFile(documentImage, 'document.jpg');
      const selfieFile = dataURLtoFile(selfieImage, 'selfie.jpg');
      
      formData.append('document', documentFile);
      formData.append('selfie', selfieFile);

      const response = await fetch('https://land-register.onrender.com/verify-face', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      if (!data.match) {
        throw new Error(data.message || 'Face verification failed. Please ensure the photos match.');
      }

      setVerificationResult(data);
      localStorage.setItem('isVerified', 'true');
      setTimeout(() => {
        router.push('/uploadLand');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
      console.error('Verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const resetForm = () => {
    setDocumentImage(null);
    setSelfieImage(null);
    setVerificationResult(null);
    setError(null);
    documentInputRef.current.value = '';
    selfieInputRef.current.value = '';
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push(`/login`);
    }
  }, []);
  return (
    <div className={`${outfit.className} text-white min-h-screen flex flex-col`}>
      <div className="flex-grow">
        <Header />

        <section className="px-4 sm:px-8 md:px-12 lg:px-20 py-16 relative z-10">
          <div className="max-w-4xl mx-auto bg-gray-950/10 backdrop-blur-lg border-gray-100/10 border rounded-xl p-6 sm:p-8 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center hover:text-[#77227F]">
              Identity Verification
            </h2>
            <p className="text-gray-400 text-center mb-8">
              Please verify your identity to list properties for sale
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-900/50 rounded-lg text-sm">
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {verificationResult && (
              <div className="mb-4 p-3 bg-green-900/50 rounded-lg text-sm">
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Verification successful! Redirecting to property upload...
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Government ID (Aadhaar, Passport, etc.) *
                  </label>
                  <div
                    onClick={() => !loading && documentInputRef.current.click()}
                    className={`border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center ${
                      loading ? 'border-gray-700 cursor-not-allowed' : 'border-gray-600 cursor-pointer hover:border-[#77227F]'
                    }`}
                  >
                    {documentImage ? (
                      <img 
                        src={documentImage} 
                        alt="Document preview" 
                        className="h-full w-full object-contain rounded-lg"
                      />
                    ) : (
                      <>
                        <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-400">Upload Document Image</p>
                        <p className="text-gray-500 text-sm mt-1">Supports: JPG, PNG (Max 10MB)</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={documentInputRef}
                    onChange={(e) => handleImageUpload(e, setDocumentImage)}
                    accept="image/*"
                    className="hidden"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Selfie with Document *
                  </label>
                  <div
                    onClick={() => !loading && selfieInputRef.current.click()}
                    className={`border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center ${
                      loading ? 'border-gray-700 cursor-not-allowed' : 'border-gray-600 cursor-pointer hover:border-[#77227F]'
                    }`}
                  >
                    {selfieImage ? (
                      <img 
                        src={selfieImage} 
                        alt="Selfie preview" 
                        className="h-full w-full object-contain rounded-lg"
                      />
                    ) : (
                      <>
                        <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-400">Upload Selfie Image</p>
                        <p className="text-gray-500 text-sm mt-1">Hold your ID next to your face</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={selfieInputRef}
                    onChange={(e) => handleImageUpload(e, setSelfieImage)}
                    accept="image/*"
                    className="hidden"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="flex space-x-4 pt-4 justify-end">
                <button
                  type="submit"
                  disabled={loading || verificationResult}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center ${
                    (loading || verificationResult)
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-[#77227F] hover:bg-purple-700'
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </>
                  ) : verificationResult ? (
                    'Verified!'
                  ) : (
                    'Verify Identity'
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading || verificationResult}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    (loading || verificationResult)
                      ? 'bg-gray-700 cursor-not-allowed'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  Reset
                </button>
              </div>
            </form>

                        <div className="mt-8 pt-6 border-t border-gray-800">
              <h3 className="text-lg font-medium mb-3">Verification Requirements</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Government-issued ID must be valid and clearly visible</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Selfie must be recent and match your ID photo</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>All documents must be in JPG, PNG, or PDF format</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>File size should not exceed 10MB per document</span>
                </li>
              </ul>
            </div>

            {verificationResult && (
              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium">Verification Details</h3>
                    <div className="mt-2 text-sm space-y-1">
                      <p>Status: <span className="text-green-400">Verified</span></p>

                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}