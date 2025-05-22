"use client";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import { useRouter } from "next/navigation";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { Outfit } from "next/font/google";
import {
    viewAll,
    verifyProperty,
    approveBuy,
    listenForPropertyAdded,
    listenForPropertyVerified,
    listenForPropertyRequested,
    listenForPropertyApproved
} from "@/utils/contractintegration/Contract";

const outfit = Outfit({
    subsets: ["latin"],
    weight: "400",
});

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("verification");
    const [properties, setProperties] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [loadingStates, setLoadingStates] = useState({});

    const {
        account
    } = useWallet();

    const isAdmin = account?.toLowerCase() === process.env.NEXT_PUBLIC_ADMIN?.toLowerCase();

    useEffect(() => {
        const fetchProperties = async () => {
            if (!isAdmin) return;

            try {
                const allProperties = await viewAll();
                setProperties(allProperties);
            } catch (error) {
                console.error("Error fetching properties:", error);
            }
        };

        fetchProperties();

        const cleanups = [
            listenForPropertyAdded(() => setRefresh(prev => !prev)),
            listenForPropertyVerified(() => setRefresh(prev => !prev)),
            listenForPropertyRequested(() => setRefresh(prev => !prev)),
            listenForPropertyApproved(() => setRefresh(prev => !prev))
        ];

        return () => cleanups.forEach(cleanup => cleanup());
    }, [isAdmin, refresh]);

    const handleViewLand = (index) => {
        router.push(`/viewLand/${index}`);
    };

    const verificationRequests = properties
        .map((property, index) => ({ ...property, index }))
        .filter(property => property.propertyVerification === "pending");

    const buyRequests = properties
        .map((property, index) => ({ ...property, index }))
        .filter(property => 
            property.registrationRequest === "pending" &&
            property.propertyVerification === "approved" &&
            property.buyer
        );

    const handleApproveVerification = async (index) => {
        try {
            setLoadingStates(prev => ({ ...prev, [index]: true }));
            await verifyProperty(index, "approved");
            setRefresh(prev => !prev);
        } catch (error) {
            console.error("Error approving verification:", error);
            alert("Failed to approve verification");
        } finally {
            setLoadingStates(prev => ({ ...prev, [index]: false }));
        }
    };

    const handleRejectVerification = async (index) => {
        try {
            setLoadingStates(prev => ({ ...prev, [index]: true }));
            await verifyProperty(index, "rejected");
            setRefresh(prev => !prev);
        } catch (error) {
            console.error("Error rejecting verification:", error);
            alert("Failed to reject verification");
        } finally {
            setLoadingStates(prev => ({ ...prev, [index]: false }));
        }
    };

    const handleApproveBuyRequest = async (index) => {
        try {
            setLoadingStates(prev => ({ ...prev, [index]: true }));
            await approveBuy(index);
            setRefresh(prev => !prev);
        } catch (error) {
            console.error("Error approving buy request:", error);
            alert("Failed to approve buy request");
        } finally {
            setLoadingStates(prev => ({ ...prev, [index]: false }));
        }
    };

    const handleGoBack = () => {
        router.push("/");
    };

    if (!isAdmin) {
        return (
            <div className={`${outfit.className} text-white min-h-screen flex flex-col`}>
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-lg max-w-md mx-4">
                        <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
                        <p className="mb-6">You do not have permission to access this page.</p>
                        <button
                            onClick={handleGoBack}
                            className="bg-[#77227F] hover:bg-[#8a2d92] text-white px-6 py-2 rounded-md font-semibold transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
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
                                    <div key={property.index} className="bg-white/5 rounded-lg p-6 border border-white/10"
                                        onClick={() => handleViewLand(property.index)}>
                                        <div className="mb-4">
                                            <h3 className="text-xl font-semibold">{property.landType} in {property.location}</h3>
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
                                                <p>₹ {property.price}</p>
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
                                                    <span className={`text-xs px-2 py-1 rounded ${property.propertyTaxDocument ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>
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
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleApproveVerification(property.index);
                                                }}
                                                disabled={loadingStates[property.index]}
                                                className={`flex-1 py-2 rounded-md font-medium transition-colors ${
                                                    loadingStates[property.index] 
                                                        ? "bg-gray-600 cursor-not-allowed" 
                                                        : "bg-green-600 hover:bg-green-700"
                                                }`}
                                            >
                                                {loadingStates[property.index] ? "Processing..." : "Approve"}
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRejectVerification(property.index);
                                                }}
                                                disabled={loadingStates[property.index]}
                                                className={`flex-1 py-2 rounded-md font-medium transition-colors ${
                                                    loadingStates[property.index] 
                                                        ? "bg-gray-600 cursor-not-allowed" 
                                                        : "bg-red-600 hover:bg-red-700"
                                                }`}
                                            >
                                                {loadingStates[property.index] ? "Processing..." : "Reject"}
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
                                    <div key={property.index} className="bg-white/5 rounded-lg p-6 border border-white/10"
                                        onClick={() => handleViewLand(property.index)}>
                                        <div className="mb-4">
                                            <h3 className="text-xl font-semibold">{property.landType} in {property.location}</h3>
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
                                                <p>₹ {property.price}</p>
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
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleApproveBuyRequest(property.index);
                                                }}
                                                disabled={loadingStates[property.index]}
                                                className={`flex-1 py-2 rounded-md font-medium transition-colors ${
                                                    loadingStates[property.index] 
                                                        ? "bg-gray-600 cursor-not-allowed" 
                                                        : "bg-green-600 hover:bg-green-700"
                                                }`}
                                            >
                                                {loadingStates[property.index] ? "Processing..." : "Approve"}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}