"use client";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { Outfit } from "next/font/google";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import { useRouter } from "next/navigation";
import DummyImage from '../../assets/Bg.jpg'
import dummyProperties from "@/utils/testData";

const outfit = Outfit({
  subsets: ["latin"],
  weight: "400",
});

export default function LandMarketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLandType, setSelectedLandType] = useState("All Types");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    isConnected,
    account,
    connectWallet,
    disconnectWallet,
    shortenAddress,
  } = useWallet();

  // Filter properties that are available in the market
  const availableProperties = dummyProperties.filter(
    (property) => property.marketStatus === "available"
  );

  // Get all unique land types from the data
  const allLandTypes = [
    "All Types",
    ...new Set(availableProperties.map((property) => property.landType)),
  ];

  // Get all unique locations from the data
  const allLocations = [
    "All Locations",
    ...new Set(availableProperties.map((property) => property.location)),
  ];

  const filteredLands = availableProperties.filter((property) => {
    // Search term filter
    const matchesSearch =
      property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.discribtion.toLowerCase().includes(searchTerm.toLowerCase());

    // Land type filter
    const matchesLandType =
      selectedLandType === "All Types" ||
      property.landType === selectedLandType;

    // Location filter
    const matchesLocation =
      selectedLocation === "All Locations" ||
      property.location === selectedLocation;

    return matchesSearch && matchesLandType && matchesLocation;
  });

  const handleBuyLand = (landId) => {
    if (!isConnected) {
      alert("Please connect your wallet to purchase land");
      return;
    }
    alert(`Initiating purchase for land ID: ${landId}`);
    // Here you would typically call your contract function
  };

  const handleViewLand = (landId) => {
  router.push(`/viewLand/${landId}`);
  };

  return (
    <div className={`${outfit.className} text-white min-h-screen flex flex-col`}>
      <div className="flex-grow">
        <Header />

        <section className="px-4 sm:px-8 lg:px-24 relative z-10">
          <div className="text-center mb-8 relative">
            <div className="bg-white/10 backdrop-blur-md border-white/10 mt-6 px-6 py-3 rounded-lg flex items-center justify-between max-w-lg mx-auto shadow-inner z-20">
              <input
                type="text"
                placeholder="Search lands by location or description..."
                className="bg-transparent outline-none w-full placeholder-[#6D737A]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="text-gray-400 ml-2" />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
            <div className="relative">
              <select
                value={selectedLandType}
                onChange={(e) => setSelectedLandType(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-[#77227F]"
              >
                {allLandTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-[#77227F]"
              >
                {allLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-8 lg:px-24 py-10 relative z-10">
          {filteredLands.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold mb-4">No lands found</h3>
              <p className="text-[#6D737A]">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center mb-16">
              {filteredLands.map((land) => (
                <div
                  key={land.id}
                  className="border rounded-md shadow-lg text-[#6D737A] font-sans space-y-2 px-3 py-4 bg-white/10 backdrop-blur-md border-white/10 hover:border-[#77227F] transition-colors cursor-pointer w-full max-w-xs"
                  onClick={() => handleViewLand(land.id)}
                >
                  <div className="relative h-48 w-full rounded-lg overflow-hidden">
                    <Image
                      src={land.landimage || DummyImage}
                      alt={land.location}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DummyImage;
                      }}
                    />
                  </div>

                  <div className="pt-2">
                    <h3 className="font-semibold text-white text-lg">
                      {land.landType} in {land.location}
                    </h3>
                    <div className="flex items-center text-sm text-gray-400 mt-1">
                      <FaMapMarkerAlt className="mr-1" />
                      <span>{land.location}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                      {land.discribtion}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <div>
                        <span className="text-xs text-gray-500">Type</span>
                        <p className="text-sm font-medium text-white">
                          {land.landType}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Size</span>
                        <p className="text-sm font-medium text-white">
                          {land.size}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Price</span>
                      <span className="font-semibold text-white text-lg">
                        {land.price}
                      </span>
                    </div>
                    <button
                      className="bg-[#77227F] hover:bg-[#8a2d92] text-white text-sm px-4 py-2 rounded-md font-semibold transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuyLand(land.id);
                      }}
                    >
                      Buy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
}