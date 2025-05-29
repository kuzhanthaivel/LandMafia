"use client";
import {
  FaMapMarkerAlt,
  FaCheckCircle,
  FaArrowLeft,
  FaFileAlt,
} from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { RiVerifiedBadgeLine } from "react-icons/ri";
import { Outfit } from "next/font/google";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DummyImage from "../../../assets/Bg.jpg";
import { viewByIndex } from "../../../utils/contractintegration/Contract";
import Link from "next/link";
const outfit = Outfit({
  subsets: ["latin"],
  weight: "400",
});

export default function ViewLand({ params }) {
  const router = useRouter();
  const slug = params.slug;
  const [land, setLand] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push(`/login`);
    }
  }, []);
  useEffect(() => {
    const fetchLandData = async () => {
      try {
        const propertyId = parseInt(slug);

        if (isNaN(propertyId)) {
          throw new Error("Invalid property ID");
        }

        const landData = await viewByIndex(propertyId);

        const formattedLand = {
          id: propertyId,
          landimage: landData.landImage,
          location: landData.location,
          googlemaplink: landData.googleMapLink,
          size: landData.size,
          price: landData.price,
          description: landData.description,
          landType: landData.landType,
          saleDeed: landData.saleDeed,
          clearanceCertificates: landData.clearanceCertificates,
          propertyTaxdocument: landData.propertyTaxDocument,
          encumbranceCertificate: landData.encumbranceCertificate,
          propertyVerification: landData.propertyVerification,
          registrationRequest: landData.registrationRequest,
          marketStatus: landData.marketStatus,
          seller: landData.seller,
          buyer: landData.buyer,
          status: landData.marketStatus === "listed" ? "Available" : "Sold",
        };

        setLand(formattedLand);
      } catch (err) {
        console.error("Error fetching land data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLandData();
  }, [slug]);

  if (loading) {
    return (
      <div
        className={`${outfit.className} text-white min-h-screen flex items-center justify-center`}
      >
        <p>Loading...</p>
      </div>
    );
  }

  if (!land) {
    return (
      <div
        className={`${outfit.className} text-white min-h-screen flex items-center justify-center`}
      >
        <p>Land not found</p>
      </div>
    );
  }

  return (
    <div
      className={`${outfit.className} text-white min-h-screen p-4 sm:p-8 relative`}
    >
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="bg-gray-800/50 rounded-xl p-4 sm:p-6 shadow-lg absolute left-4 flex items-center text-gray-300 hover:text-white mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Go Back
        </button>
        <div className="bg-gray-800/50 rounded-xl p-6 shadow-lg mt-16 sm:mt-0">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/2 flex flex-col justify-between">
              <div className="relative h-80 lg:h-96 w-full rounded-lg overflow-hidden">
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

              <div className="mt-6">
                <a
                  href={land.googlemaplink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-[#77227F] hover:bg-[#8a2d92] text-white px-6 py-3 rounded-md font-medium transition-colors w-full"
                >
                  <FaMapMarkerAlt className="mr-2" />
                  View on Map
                </a>
              </div>
            </div>

            <div className="w-full lg:w-1/2 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                    {land.landType} in {land.location}
                  </h1>
                  <div className="flex items-center text-gray-300">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{land.location}</span>
                  </div>
                </div>

                {land.propertyVerification === "approved" && (
                  <div className="flex items-center bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm">
                    <FaCheckCircle className="mr-1" />
                    Verified
                  </div>
                )}
              </div>

              <p className="text-gray-300 text-lg leading-relaxed">
                {land.description || land.discribtion}
              </p>

              <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Price</span>
                  <span className="text-2xl font-bold text-white">
                    ₹ {land.price}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 text-lg border-b border-gray-600 pb-2">
                    Property Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Type</span>
                      <span className="font-medium">{land.landType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Size</span>
                      <span className="font-medium">{land.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Status</span>
                      <span className="font-medium">
                        {land.status || "Available"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 text-lg border-b border-gray-600 pb-2 flex items-center">
                    <FaFileAlt className="mr-2" />
                    Documents
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Link
                        href={land.encumbranceCertificate}
                        className="text-gray-300 hover:text-blue-400 hover:underline cursor-pointer transition duration-300"
                      >
                        Encumbrance Certificate
                      </Link>
                      {land.encumbranceCertificate ? (
                        <span className="text-green-400 flex items-center">
                          <RiVerifiedBadgeLine className="mr-1" />
                        </span>
                      ) : (
                        <span className="text-red-400 flex items-center">
                          <RxCrossCircled className="mr-1" />
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <Link
                        href={land.saleDeed}
                        className="text-gray-300 hover:text-blue-400 hover:underline cursor-pointer transition duration-300"
                      >
                        Sale Deed
                      </Link>
                      {land.saleDeed ? (
                        <span className="text-green-400 flex items-center">
                          <RiVerifiedBadgeLine className="mr-1" />
                        </span>
                      ) : (
                        <span className="text-red-400 flex items-center">
                          <RxCrossCircled className="mr-1" />
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <Link
                        href={land.clearanceCertificates}
                        className="text-gray-300 hover:text-blue-400 hover:underline cursor-pointer transition duration-300"
                      >
                        Clearance Certificates
                      </Link>
                      {land.clearanceCertificates ? (
                        <span className="text-green-400 flex items-center">
                          <RiVerifiedBadgeLine className="mr-1" />
                        </span>
                      ) : (
                        <span className="text-red-400 flex items-center">
                          <RxCrossCircled className="mr-1" />
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <Link
                        href={land.propertyTaxdocument}
                        className="text-gray-300 hover:text-blue-400 hover:underline cursor-pointer transition duration-300"
                      >
                        Property Tax
                      </Link>
                      {land.propertyTaxdocument ? (
                        <span className="text-green-400 flex items-center">
                          <RiVerifiedBadgeLine className="mr-1" />
                        </span>
                      ) : (
                        <span className="text-red-400 flex items-center">
                          <RxCrossCircled className="mr-1" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 text-lg border-b border-gray-600 pb-2">
                    Seller
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-300 block mb-1">
                        Wallet Address
                      </span>
                      <span className="font-mono text-sm bg-gray-800/50 p-2 rounded break-all">
                        {land.seller}
                      </span>
                    </div>
                  </div>
                </div>

                {land.buyer &&
                land.buyer !== "0x0000000000000000000000000000000000000000" ? (
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3 text-lg border-b border-gray-600 pb-2">
                      Buyer
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-300 block mb-1">
                          Wallet Address
                        </span>
                        <span className="font-mono text-sm bg-gray-800/50 p-2 rounded break-all">
                          {land.buyer}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Registration</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            land.registrationRequest === "approved"
                              ? "bg-green-900/30 text-green-400"
                              : land.registrationRequest === "pending"
                              ? "bg-yellow-900/30 text-yellow-400"
                              : "bg-red-900/30 text-red-400"
                          }`}
                        >
                          {land.registrationRequest === "approved"
                            ? "Approved"
                            : land.registrationRequest === "pending"
                            ? "Pending"
                            : "Rejected"}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3 text-lg border-b border-gray-600 pb-2">
                      Buyer
                    </h3>
                    <p className="text-gray-400 italic">
                      No buyer assigned yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
