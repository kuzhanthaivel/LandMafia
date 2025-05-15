"use client";
import { FaMapMarkerAlt } from "react-icons/fa";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Image from "next/image";
import { Outfit } from 'next/font/google';
import { FiFilter, FiSearch, FiChevronDown, FiX } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import { useRouter } from "next/navigation";
import {
  viewAll,
  sellProperty,
  listenForPropertyAdded,
  listenForPropertyVerified,
  listenForPropertyRequested,
  listenForPropertyApproved
} from "../../utils/contractintegration/Contract";

const outfit = Outfit({
  subsets: ["latin"],
  weight: "400",
});

export default function Profile() {
  const {
    isConnected,
    account,
    connectWallet,
    shortenAddress,
  } = useWallet();

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    landType: [],
    status: []
  });

  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleViewLand = (landId) => {
    router.push(`/viewLand/${landId}`);
  };

  const handleSellProperty = async (propertyId) => {
    try {
      await sellProperty(propertyId);
      await fetchUserProperties();
    } catch (error) {
      console.error("Error selling property:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProperties = async () => {
    if (!account) return;

    setLoading(true);
    try {
      const allProperties = await viewAll();
      const userProperties = allProperties
        .map((prop, index) => ({ ...prop, originalIndex: index })) 
        .filter(property =>
          property.seller.toLowerCase() === account.toLowerCase() ||
          (property.buyer && property.buyer.toLowerCase() === account.toLowerCase())
        );
      const formattedProperties = userProperties.map((prop) => ({
        id: prop.originalIndex,
        seller: prop.seller,
        buyer: prop.buyer,
        landImage: prop.landImage || "/placeholder-property.jpg",
        location: prop.location,
        googleMapLink: prop.googleMapLink,
        size: prop.size,
        price: prop.price,
        description: prop.description,
        landType: prop.landType,
        saleDeed: prop.saleDeed,
        clearanceCertificates: prop.clearanceCertificates,
        propertyTaxDocument: prop.propertyTaxDocument,
        encumbranceCertificate: prop.encumbranceCertificate,
        propertyVerification: prop.propertyVerification || "pending",
        registrationRequest: prop.registrationRequest || "pending",
        marketStatus: prop.marketStatus || "available",
        transactionData: prop.transactionData || "pending",
        createdAt: new Date().toISOString()
      }));

      setProperties(formattedProperties);
      setFilteredProperties(formattedProperties);

      const userTransactions = userProperties
        .filter(prop => prop.transactionData === "completed")
        .map(prop => ({
          id: prop.originalIndex,
          propertyName: `${prop.landType} in ${prop.location}`,
          amount: prop.price,
          counterparty: prop.seller.toLowerCase() === account.toLowerCase() ?
            prop.buyer : prop.seller,
          type: prop.seller.toLowerCase() === account.toLowerCase() ? "Sell" : "Buy",
          date: prop.createdAt,
          status: prop.registrationRequest
        }));

      setTransactions(userTransactions);
      setFilteredTransactions(userTransactions);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && account) {
      fetchUserProperties();

      const cleanUpAdded = listenForPropertyAdded(() => fetchUserProperties());
      const cleanUpVerified = listenForPropertyVerified(() => fetchUserProperties());
      const cleanUpRequested = listenForPropertyRequested(() => fetchUserProperties());
      const cleanUpApproved = listenForPropertyApproved(() => fetchUserProperties());

      return () => {
        cleanUpAdded();
        cleanUpVerified();
        cleanUpRequested();
        cleanUpApproved();
      };
    }
  }, [isConnected, account]);

  useEffect(() => {
    let result = properties.filter(property =>
      property.seller.toLowerCase() === account?.toLowerCase() ||
      (property.buyer && property.buyer.toLowerCase() === account?.toLowerCase())
    );

    if (searchTerm) {
      result = result.filter(property =>
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filters.landType.length > 0) {
      result = result.filter(property => filters.landType.includes(property.landType));
    }

    if (filters.status.length > 0) {
      result = result.filter(property => {
        if (filters.status.includes("available")) {
          return property.marketStatus === "available";
        }
        if (filters.status.includes("nonAvailable")) {
          return property.marketStatus !== "available";
        }
        return true;
      });
    }
    setFilteredProperties(result);
  }, [searchTerm, filters, properties, account]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = transactions.filter(tx =>
        tx.propertyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions(transactions);
    }
  }, [searchTerm, transactions]);

  const toggleFilter = (type, value) => {
    setFilters(prev => {
      const currentFilters = [...prev[type]];
      const index = currentFilters.indexOf(value);

      if (index === -1) {
        return { ...prev, [type]: [...currentFilters, value] };
      } else {
        return { ...prev, [type]: currentFilters.filter(item => item !== value) };
      }
    });
  };

  const clearFilters = () => {
    setFilters({
      landType: [],
      status: []
    });
    setSearchTerm("");
  };

  const allLandTypes = [...new Set(properties.map(item => item.landType))];
  const allStatuses = ["available", "nonAvailable"];

  if (!isConnected) {
    return (
      <div className={`${outfit.className} text-white min-h-screen flex flex-col`}>
        <div className="flex-grow">
          <Header />
          <div className="min-h-screen px-4 sm:px-8 lg:px-20 py-12 relative z-10 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>
            <p className="text-xl mb-8">Please connect your wallet to view your properties</p>
            <button
              onClick={connectWallet}
              className="bg-[#77227F] hover:bg-[#77227F] text-white px-6 py-3 rounded-lg font-semibold"
            >
              Connect Wallet
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`${outfit.className} text-white min-h-screen flex flex-col`}>
        <div className="flex-grow">
          <Header />
          <div className="min-h-screen px-4 sm:px-8 lg:px-20 py-12 relative z-10 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-6">Loading your properties...</h1>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`${outfit.className} text-white min-h-screen flex flex-col`}>
      <div className="flex-grow">
        <Header />

        <div className="min-h-screen px-4 sm:px-8 lg:px-20 py-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">My Properties</h1>
              <p className="text-gray-400">{shortenAddress(account)}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
              <div className="relative flex-grow max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#77227F]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <button
                  className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-4 py-2 transition-colors"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FiFilter />
                  <span>Filters</span>
                  <FiChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                {showFilters && (
                  <div className="absolute right-0 mt-2 w-72 bg-gray-800 rounded-lg shadow-lg z-10 p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold">Filters</h3>
                      <button
                        className="text-sm text-[#77227F] hover:text-[#77227F]"
                        onClick={clearFilters}
                      >
                        Clear all
                      </button>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Status</h4>
                      <div className="flex flex-wrap gap-2">
                        {allStatuses.map(status => (
                          <button
                            key={status}
                            className={`text-xs px-3 py-1 rounded-md ${filters.status.includes(status)
                              ? "bg-[#77227F] text-white"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                              }`}
                            onClick={() => toggleFilter('status', status)}
                          >
                            {status === "available" ? "Available" : "Sold"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Land Type</h4>
                      <div className="flex flex-wrap gap-2">
                        {allLandTypes.map(type => (
                          <button
                            key={type}
                            className={`text-xs px-3 py-1 rounded-md ${filters.landType.includes(type)
                              ? "bg-[#77227F] text-white"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                              }`}
                            onClick={() => toggleFilter('landType', type)}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {(filters.landType.length > 0 || filters.status.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {filters.status.map(status => (
                <div key={status} className="flex items-center bg-gray-700 rounded-full px-3 py-1 text-sm">
                  {status === "available" ? "Available" : "Sold"}
                  <button
                    onClick={() => toggleFilter('status', status)}
                    className="ml-2 text-gray-300 hover:text-white"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
              {filters.landType.map(type => (
                <div key={type} className="flex items-center bg-gray-700 rounded-full px-3 py-1 text-sm">
                  {type}
                  <button
                    onClick={() => toggleFilter('landType', type)}
                    className="ml-2 text-gray-300 hover:text-white"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/10 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Total Properties</p>
              <p className="text-2xl font-bold">{filteredProperties.length}</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Total Value</p>
              <p className="text-2xl font-bold">
                {filteredProperties.reduce((sum, item) => {
                  const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
                  return sum + (isNaN(price) ? 0 : price)
                }, 0).toLocaleString('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  minimumFractionDigits: 0
                })}
              </p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Most Valuable</p>
              <p className="text-2xl font-bold">
                {filteredProperties.length > 0
                  ? filteredProperties.reduce((max, item) => {
                    const currentPrice = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
                    const maxPrice = parseFloat(max.price.replace(/[^0-9.-]+/g, ""));
                    return currentPrice > maxPrice ? item : max;
                  }, filteredProperties[0]).location
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center mb-16">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                onClick={() => handleViewLand(property.id)}
                className="border rounded-lg shadow-lg text-[#6D737A] font-sans space-y-3 px-3 py-4 w-full max-w-xs bg-white/10 backdrop-blur-md border-white/10 hover:border-[#77227F] transition-colors relative cursor-pointer"
              >
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg flex items-center justify-center w-full h-48">
                  <Image
                    src={property.landImage}
                    alt={property.location}
                    fill
                    className="object-cover rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-property.jpg";
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">
                    {property.landType} in {property.location}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2">{property.description}</p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center text-sm">
                    <div className="text-gray-400">Size:</div>
                    <div className="text-white font-medium">
                      {property.size}
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-400 mt-1">
                    <FaMapMarkerAlt className="mr-1" />
                    <span>{property.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400">Price</span>
                    <span className="font-semibold text-white">₹ {property.price}</span>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded flex items-center ${property.propertyVerification === "approved" ? "bg-green-900/90 text-white" : property.propertyVerification === "rejected" ? "bg-red-900/90 text-white" : "bg-yellow-600/90 text-white"}`}>
                    {property.propertyVerification === "approved" ? "Approved" : property.propertyVerification === "rejected" ? "Rejected" : "Pending"}
                  </div>
                </div>

                {property.seller.toLowerCase() === account.toLowerCase() && (
                  <>
                    {property.transactionData === "completed" ? (
                      <button
                        className="w-full mt-3 bg-gray-600 text-white py-2 rounded-md font-medium cursor-not-allowed"
                        disabled
                      >
                        Sold Out
                      </button>
                    ) : (
                      <>
                        {property.propertyVerification === "approved" ? (
                          property.marketStatus === "available" ? (
                            <button
                              className="w-full mt-3 bg-green-600 text-white py-2 rounded-md font-medium cursor-not-allowed"
                              disabled
                            >
                              In Market
                            </button>
                          ) : (
                            <button
                              className="w-full mt-3 bg-[#77227F] hover:bg-[#77227F] text-white py-2 rounded-md font-medium transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSellProperty(property.id);
                              }}
                            >
                              Sell
                            </button>
                          )
                        ) : property.propertyVerification === "rejected" ? (
                          <button
                            className="w-full mt-3 bg-red-600 text-white py-2 rounded-md font-medium cursor-not-allowed"
                            disabled
                          >
                            Rejected
                          </button>
                        ) : (
                          <button
                            className="w-full mt-3 bg-yellow-600 text-white py-2 rounded-md font-medium cursor-not-allowed"
                            disabled
                          >
                            Verification Pending
                          </button>
                        )}
                      </>
                    )}
                  </>
                )}

                {property.buyer && property.buyer.toLowerCase() === account.toLowerCase() && (
                  <div className="flex flex-col gap-2 mt-3">
                    <div className={`absolute -top-2 -left-2 text-xs px-2 py-1 rounded text-center ${property.registrationRequest === "approved" ? "bg-green-900/90 text-white" : "bg-yellow-600/90 text-white"}`}>
                      Registration: {property.registrationRequest === "approved" ? "Approved" : "Pending"}
                    </div>
                    <button
                      className="w-full bg-gray-600 text-white py-2 rounded-md font-medium cursor-not-allowed"
                      disabled
                    >
                      Purchased
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-5xl mb-4">🏡</div>
              <h3 className="text-xl font-bold mb-2">No properties found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
              <button
                className="bg-[#77227F] text-white px-6 py-3 rounded-lg font-semibold"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          )}

          <h2 className="text-2xl font-bold text-center mb-6">My Transactions</h2>
          <div className="overflow-x-auto rounded-lg mb-12">
            <table className="min-w-full text-left text-sm text-white">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-4 py-3">S.No</th>
                  <th className="px-4 py-3">Property</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Counterparty</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white/5">
                {filteredTransactions.map((tx, i) => (
                  <tr key={i} className="border-b border-white/10 hover:bg-white/10 transition-colors">
                    <td className="px-4 py-3 font-bold">{i + 1}</td>
                    <td className="px-4 py-3 font-bold">{tx.propertyName}</td>
                    <td className="px-4 py-3">{tx.amount}</td>
                    <td className="px-4 py-3 text-gray-400">
                      {tx.type === "Buy" ? "Buyer" : "Seller"}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {shortenAddress(tx.counterparty)}
                    </td>
                    <td className={`px-4 py-3 ${tx.type === "Buy" ? "text-green-400" : "text-red-400"}`}>
                      {tx.type}
                    </td>
                    <td className={`px-4 py-3 ${tx.status === "approved" ? "text-green-400" : "text-yellow-400"}`}>
                      {tx.status === "approved" ? "Completed" : "Pending"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}