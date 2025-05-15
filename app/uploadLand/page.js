"use client";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Image from "next/image";
import { Outfit } from 'next/font/google';
import { useWallet } from "@/context/WalletContext";
import { useState, useRef, useEffect } from "react";
import {
  FileText
} from 'lucide-react';
import { addProperty, listenForPropertyAdded } from "../../utils/contractintegration/Contract";

const outfit = Outfit({
  subsets: ["latin"],
  weight: "400",
});

const tamilNaduDistricts = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
  "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kancheepuram",
  "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam",
  "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram",
  "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur",
  "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur",
  "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore",
  "Viluppuram", "Virudhunagar"
];

const landTypes = [
  "Agricultural Land",
  "Residential Plot",
  "Commercial Plot",
  "Industrial Land",
  "Farm House",
  "Plantation",
  "Shop",
  "House Area",
  "Vacant Land"
];

const measurementTypes = [
  "Acres",
  "Sq. Ft.",
  "Cents",
  "Hectares",
  "Sq. Meters"
];

export default function UploadLand() {
  const {
    isConnected,
    account
  } = useWallet();

  const [landData, setLandData] = useState({
    description: '',
    price: '',
    district: '',
    landType: '',
    landSize: '',
    measurementType: '',
    googleMapLink: '',
    propertyImage: null,
    preview: null,
    encumbranceCert: { file: null, hasFile: false },
    saleDeed: { file: null, hasFile: false },
    clearanceCert: { file: null, hasFile: false },
    propertyTaxDoc: { file: null, hasFile: false }
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const imageInputRef = useRef(null);
  const encumbranceRef = useRef(null);
  const saleDeedRef = useRef(null);
  const clearanceRef = useRef(null);
  const taxDocRef = useRef(null);

  useEffect(() => {
    const unsubscribe = listenForPropertyAdded((propertyId, seller) => {
      if (seller.toLowerCase() === account?.toLowerCase()) {
        setUploadStatus(`Property successfully registered on blockchain! Property ID: ${propertyId.toString()}`);
        setIsUploading(false);
        setLandData({
          description: '',
          price: '',
          district: '',
          landType: '',
          landSize: '',
          measurementType: '',
          googleMapLink: '',
          propertyImage: null,
          preview: null,
          encumbranceCert: { file: null, hasFile: false },
          saleDeed: { file: null, hasFile: false },
          clearanceCert: { file: null, hasFile: false },
          propertyTaxDoc: { file: null, hasFile: false }
        });
      }
    });

    return () => unsubscribe();
  }, [account]);

  const uploadFileToIPFS = async (file) => {
    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    const formData = new FormData();
    formData.append("file", file);

    const metadata = JSON.stringify({
      name: file.name,
    });
    formData.append('pinataMetadata', metadata);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          pinata_api_key: "b670445db8b318a6e492",
          pinata_secret_api_key: "7d343880e219ccc78e44c8c8ffd43d62a5fc250d087a809a8f2123aac91c9aed",
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload file");
      }

      const result = await response.json();
      if (result.IpfsHash) {
        return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
      } else {
        throw new Error("IPFS hash not found in response");
      }
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLandData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLandData(prev => ({
          ...prev,
          propertyImage: file,
          preview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = (e, docType) => {
    const file = e.target.files[0];
    if (file) {
      setLandData(prev => ({
        ...prev,
        [docType]: {
          file: file,
          hasFile: true
        }
      }));
    }
  };

  const triggerFileInput = (ref) => {
    ref.current.click();
  };

  const handleUpload = async () => {
    if (!isConnected ||
      !landData.propertyImage ||
      !landData.description ||
      !landData.price ||
      !landData.district ||
      !landData.landType ||
      !landData.landSize ||
      !landData.measurementType) {
      return;
    }

    setIsUploading(true);
    setUploadStatus('Uploading property image to IPFS...');

    try {
      const imageUrl = await uploadFileToIPFS(landData.propertyImage);

      setUploadStatus('Registering property on blockchain...');
      const propertyData = {
        landImage: imageUrl,
        location: landData.district,
        googleMapLink: landData.googleMapLink || "",
        size: `${landData.landSize} ${landData.measurementType}`,
        price: landData.price.toString(),
        description: landData.description,
        landType: landData.landType,
        saleDeed: landData.saleDeed.hasFile,
        clearanceCertificates: landData.clearanceCert.hasFile,
        propertyTaxDocument: landData.propertyTaxDoc.hasFile,
        encumbranceCertificate: landData.encumbranceCert.hasFile
      };
      const tx = await addProperty(propertyData);
      setUploadStatus('Transaction sent. Waiting for confirmation...');
      await tx.wait();

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus(`Error: ${error.message}`);
      setIsUploading(false);
    }
  };

  return (
    <div className={`${outfit.className} text-white min-h-screen flex flex-col`}>
      <div className="flex-grow">
        <Header />

        <section className="px-4 sm:px-8 md:px-12 lg:px-20 py-16 relative z-10">
          <div className="max-w-4xl mx-auto bg-gray-950/10 backdrop-blur-lg border-gray-100/10 border rounded-xl p-6 sm:p-8 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center hover:text-[#77227F]">Register Your Property</h2>

            {uploadStatus && (
              <div className="mb-4 p-3 bg-gray-800 rounded-lg text-sm">
                {uploadStatus}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <div
                    onClick={!isUploading ? () => triggerFileInput(imageInputRef) : undefined}
                    className={`border-2 border-dashed border-gray-600 rounded-xl h-64 flex flex-col items-center justify-center ${!isUploading ? 'cursor-pointer hover:border-[#77227F]' : 'opacity-70'}`}
                  >
                    {landData.preview ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={landData.preview}
                          alt="Property Preview"
                          fill
                          className="object-contain rounded-lg"
                        />
                      </div>
                    ) : (
                      <>
                        <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-400">Upload Property Image</p>
                        <p className="text-gray-500 text-sm mt-1">Supports: JPG, PNG (Max 10MB)</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={imageInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                    disabled={isUploading}
                  />
                  <div className="text-xs text-gray-400 text-center mt-1">
                    {landData.propertyImage && `Selected: ${landData.propertyImage.name}`}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Document Uploads:</h3>

                  <div className="space-y-3">
                    <div>
                      <button
                        onClick={() => triggerFileInput(encumbranceRef)}
                        disabled={isUploading}
                        className={`w-full text-left p-3 border rounded-lg flex items-center justify-between ${landData.encumbranceCert.hasFile
                            ? 'border-green-500 bg-green-500/10'
                            : 'border-gray-700 hover:border-[#77227F]'
                          }`}
                      >
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-2" />
                          <span className="text-sm">
                            {landData.encumbranceCert.hasFile
                              ? landData.encumbranceCert.file.name
                              : "Encumbrance Certificate"}
                          </span>
                        </div>
                        <span>{landData.encumbranceCert.hasFile ? '✓ Selected' : '✗ Not Selected'}</span>
                      </button>
                      <input
                        type="file"
                        ref={encumbranceRef}
                        onChange={(e) => handleDocumentUpload(e, 'encumbranceCert')}
                        className="hidden"
                        disabled={isUploading}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    </div>

                    <div>
                      <button
                        onClick={() => triggerFileInput(saleDeedRef)}
                        disabled={isUploading}
                        className={`w-full text-left p-3 border rounded-lg flex items-center justify-between ${landData.saleDeed.hasFile
                            ? 'border-green-500 bg-green-500/10'
                            : 'border-gray-700 hover:border-[#77227F]'
                          }`}
                      >
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-2" />
                          <span className="text-sm">
                            {landData.saleDeed.hasFile
                              ? landData.saleDeed.file.name
                              : "Sale Deed"}
                          </span>
                        </div>
                        <span>{landData.saleDeed.hasFile ? '✓ Selected' : '✗ Not Selected'}</span>
                      </button>
                      <input
                        type="file"
                        ref={saleDeedRef}
                        onChange={(e) => handleDocumentUpload(e, 'saleDeed')}
                        className="hidden"
                        disabled={isUploading}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    </div>

                    <div>
                      <button
                        onClick={() => triggerFileInput(clearanceRef)}
                        disabled={isUploading}
                        className={`w-full text-left p-3 border rounded-lg flex items-center justify-between ${landData.clearanceCert.hasFile
                            ? 'border-green-500 bg-green-500/10'
                            : 'border-gray-700 hover:border-[#77227F]'
                          }`}
                      >
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-2" />
                          <span className="text-sm">
                            {landData.clearanceCert.hasFile
                              ? landData.clearanceCert.file.name
                              : "Clearance Certificate"}
                          </span>
                        </div>
                        <span>{landData.clearanceCert.hasFile ? '✓ Selected' : '✗ Not Selected'}</span>
                      </button>
                      <input
                        type="file"
                        ref={clearanceRef}
                        onChange={(e) => handleDocumentUpload(e, 'clearanceCert')}
                        className="hidden"
                        disabled={isUploading}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    </div>

                    <div>
                      <button
                        onClick={() => triggerFileInput(taxDocRef)}
                        disabled={isUploading}
                        className={`w-full text-left p-3 border rounded-lg flex items-center justify-between ${landData.propertyTaxDoc.hasFile
                            ? 'border-green-500 bg-green-500/10'
                            : 'border-gray-700 hover:border-[#77227F]'
                          }`}
                      >
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-2" />
                          <span className="text-sm">
                            {landData.propertyTaxDoc.hasFile
                              ? landData.propertyTaxDoc.file.name
                              : "Property Tax Document"}
                          </span>
                        </div>
                        <span>{landData.propertyTaxDoc.hasFile ? '✓ Selected' : '✗ Not Selected'}</span>
                      </button>
                      <input
                        type="file"
                        ref={taxDocRef}
                        onChange={(e) => handleDocumentUpload(e, 'propertyTaxDoc')}
                        className="hidden"
                        disabled={isUploading}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">

                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={landData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your property..."
                    rows="3"
                    className="w-full bg-gray-900/50 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#77227F]"
                    required
                    disabled={isUploading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={landData.price}
                      onChange={handleInputChange}
                      placeholder="1000000"
                      min="0"
                      className="w-full bg-gray-900/50 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#77227F]"
                      required
                      disabled={isUploading}
                    />
                  </div>

                  <div>
                    <label htmlFor="district" className="block text-sm font-medium mb-1">District *</label>
                    <select
                      id="district"
                      name="district"
                      value={landData.district}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900/50 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#77227F]"
                      required
                      disabled={isUploading}
                    >
                      <option value="">Select District</option>
                      {tamilNaduDistricts.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="landType" className="block text-sm font-medium mb-1">Land Type *</label>
                    <select
                      id="landType"
                      name="landType"
                      value={landData.landType}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900/50 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#77227F]"
                      required
                      disabled={isUploading}
                    >
                      <option value="">Select Land Type</option>
                      {landTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="googleMapLink" className="block text-sm font-medium mb-1">Google Map Link</label>
                    <input
                      type="text"
                      id="googleMapLink"
                      name="googleMapLink"
                      value={landData.googleMapLink}
                      onChange={handleInputChange}
                      placeholder="https://maps.google.com/..."
                      className="w-full bg-gray-900/50 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#77227F]"
                      disabled={isUploading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="landSize" className="block text-sm font-medium mb-1">Land Size *</label>
                    <input
                      type="number"
                      id="landSize"
                      name="landSize"
                      value={landData.landSize}
                      onChange={handleInputChange}
                      placeholder="100"
                      min="0"
                      step="0.01"
                      className="w-full bg-gray-900/50 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#77227F]"
                      required
                      disabled={isUploading}
                    />
                  </div>

                  <div>
                    <label htmlFor="measurementType" className="block text-sm font-medium mb-1">Measurement Type *</label>
                    <select
                      id="measurementType"
                      name="measurementType"
                      value={landData.measurementType}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900/50 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#77227F]"
                      required
                      disabled={isUploading}
                    >
                      <option value="">Select Type</option>
                      {measurementTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleUpload}
                    disabled={isUploading || !isConnected ||
                      !landData.propertyImage ||
                      !landData.description ||
                      !landData.price ||
                      !landData.district ||
                      !landData.landType ||
                      !landData.landSize ||
                      !landData.measurementType}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${(isUploading || !isConnected ||
                        !landData.propertyImage ||
                        !landData.description ||
                        !landData.price ||
                        !landData.district ||
                        !landData.landType ||
                        !landData.landSize ||
                        !landData.measurementType)
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-[#77227F] hover:bg-purple-700'
                      }`}
                  >
                    {isUploading ? 'Registering...' : !isConnected ? 'Connect Wallet to Register' : 'Register Property'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}