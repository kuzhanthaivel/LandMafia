"use client";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { useRouter } from "next/navigation";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { Outfit } from "next/font/google";
import dummyProperties from "@/utils/testData";
import Image from "next/image";
import DummyImage from '../../assets/Bg.jpg'
const outfit = Outfit({
    subsets: ["latin"],
    weight: "400",
});

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("verification");
    const [loading, setLoading] = useState(false);

    const handleViewLand = (landId) => {
        router.push(`/viewLand/${landId}`);
    };

    const {
        isConnected,
        account,
        connectWallet,
        disconnectWallet,
        shortenAddress,
    } = useWallet();

    const isAdmin = account?.toLowerCase() === process.env.NEXT_PUBLIC_ADMIN?.toLowerCase();

    const verificationRequests = dummyProperties.filter(
        (property) =>
            property.propertyVerification === "pending" &&
            !property.buyer
    );

    const buyRequests = dummyProperties.filter(
        (property) =>
            property.registrationRequest === "pending" && property.propertyVerification === "approved" &&
            property.buyer
    );

    const handleApproveVerification = (propertyId) => {
        alert(`Approving verification for property ${propertyId}`);
    };

    const handleRejectVerification = (propertyId) => {
        alert(`Rejecting verification for property ${propertyId}`);
    };

    const handleApproveBuyRequest = (propertyId) => {
        alert(`Approving buy request for property ${propertyId}`);
    };

    const handleGoBack = () => {
        router.push("/");
    };

    if (!isAdmin) {
        return (
            <div className={`${outfit.className} text-white min-h-screen flex flex-col`}>
                <Header />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-lg max-w-md mx-4">
                        <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
                        <p className="mb-6">You don't have permission to access this page.</p>
                        <button
                            onClick={handleGoBack}
                            className="bg-[#77227F] hover:bg-[#8a2d92] text-white px-6 py-2 rounded-md font-semibold transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
    return (
        <div className={`${outfit.className} text-white min-h-screen flex flex-col`}>
            <Header />
            <div className="flex-grow px-4 sm:px-8 lg:px-24 py-8">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
                <div className="flex border-b border-gray-700 mb-8">
                    <button
                        className={`px-4 py-2 font-medium ${activeTab === "verification" ? "text-[#77227F] border-b-2 border-[#77227F]" : "text-gray-400"}`}
                        onClick={() => setActiveTab("verification")}
                    >
                        Land Verification ({verificationRequests.length})
                    </button>
                    <button
                        className={`px-4 py-2 font-medium ${activeTab === "buyRequests" ? "text-[#77227F] border-b-2 border-[#77227F]" : "text-gray-400"}`}
                        onClick={() => setActiveTab("buyRequests")}
                    >
                        Buy Requests ({buyRequests.length})
                    </button>
                </div>
                {activeTab === "verification" ? (
                    <div>
                        <h2 className="text-2xl font-semibold mb-6">Land Verification Requests</h2>

                        {verificationRequests.length === 0 ? (
                            <div className="text-center py-12 bg-white/5 rounded-lg">
                                <p className="text-gray-400">No pending verification requests</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {verificationRequests.map((property) => (
                                    <div key={property.id} className="bg-white/5 rounded-lg p-6 border border-white/10"
                                        onClick={() => handleViewLand(property.id)}>
                                        <div className="mb-4">
                                            <h3 className="text-xl font-semibold">{property.landType} in {property.location}</h3>
                                        </div>
                                        <div className="relative h-48 w-full rounded-lg overflow-hidden">
                                            <Image
                                                src={property.landimage || DummyImage}
                                                alt={property.location}
                                                fill
                                                className="object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = DummyImage;
                                                }}
                                            />
                                        </div>
                                        <div className="pt-2">
                                            <div className="flex items-center text-sm text-gray-400 mt-1">
                                                <FaMapMarkerAlt className="mr-1" />
                                                <span>{property.location}</span>
                                            </div>
                                            <div className="flex justify-between items-center mt-3">
                                                <div>
                                                    <span className="text-xs text-gray-500">Type</span>
                                                    <p className="text-sm font-medium text-white">
                                                        {property.landType}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-gray-500">Size</span>
                                                    <p className="text-sm font-medium text-white">
                                                        {property.size}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3 mb-6">
                                            <div>
                                                <span className="text-gray-400 text-sm">Price:</span>
                                                <p>{property.price}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 text-sm">Seller:</span>
                                                <p className="truncate">{property.seller}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 text-sm">Documents:</span>
                                                <div className="grid grid-cols-2 gap-2 mt-1">
                                                    <span className={`text-xs px-2 py-1 rounded ${property.saleDeed ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>
                                                        Sale Deed
                                                    </span>
                                                    <span className={`text-xs px-2 py-1 rounded ${property.clearanceCertificates ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>
                                                        Clearance
                                                    </span>
                                                    <span className={`text-xs px-2 py-1 rounded ${property.propertyTaxdocument ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>
                                                        Tax Doc
                                                    </span>
                                                    <span className={`text-xs px-2 py-1 rounded ${property.encumbranceCertificate ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>
                                                        Encumbrance
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => handleApproveVerification(property.id)}
                                                className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-md font-medium transition-colors"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleRejectVerification(property.id)}
                                                className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-md font-medium transition-colors"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-semibold mb-6">Buy Requests</h2>

                        {buyRequests.length === 0 ? (
                            <div className="text-center py-12 bg-white/5 rounded-lg">
                                <p className="text-gray-400">No pending buy requests</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {buyRequests.map((property) => (
                                    <div key={property.id} className="bg-white/5 rounded-lg p-6 border border-white/10" onClick={() => handleViewLand(property.id)}>
                                        <div className="mb-4">
                                            <h3 className="text-xl font-semibold">{property.landType} in {property.location}</h3>
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            <div>
                                                <span className="text-gray-400 text-sm">Size:</span>
                                                <p>{property.size}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 text-sm">Price:</span>
                                                <p>{property.price}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 text-sm">Seller:</span>
                                                <p className="truncate">{property.seller}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 text-sm">Buyer:</span>
                                                <p className="truncate">{property.buyer}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 text-sm">Verification:</span>
                                                <span className={`text-xs px-2 py-1 rounded ${property.propertyVerification === "approved" ? "bg-green-900/30 text-green-400" :
                                                        property.propertyVerification === "rejected" ? "bg-red-900/30 text-red-400" :
                                                            "bg-yellow-900/30 text-yellow-400"
                                                    }`}>
                                                    {property.propertyVerification}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => handleApproveBuyRequest(property.id)}
                                                className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-md font-medium transition-colors"
                                            >
                                                Approve
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}