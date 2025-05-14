"use client";
import Header from "../components/header";
import Footer from "../components/footer";
import { Outfit } from 'next/font/google';
import { useState } from "react";
import { 
  ShieldCheck, 
  FileText, 
  Landmark, 
  Search, 
  ArrowRight,
  Users,
  Building,
  Database,
  CheckCircle,
  FileCheck
} from 'lucide-react';

const outfit = Outfit({
  subsets: ["latin"],
  weight: "400",
});

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('buyer');

  return (
    <div className={`${outfit.className} text-white min-h-screen flex flex-col bg-transparent`}>
      <div className="flex-grow">
        <Header />
        <section className="relative px-4 sm:px-8 md:px-12 lg:px-20 py-24 mx-24">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-[#77227F]">
              Decentralized Land Registry
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              Secure, transparent land ownership records powered by blockchain technology.
              Register, verify, and transfer property with complete trust.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-3 bg-[#77227F] hover:bg-purple-700 rounded-lg font-medium transition-colors">
                Browse Properties
              </button>
              <button className="px-8 py-3 border border-[#77227F] text-[#77227F] hover:bg-purple-900/10 rounded-lg font-medium transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </section>
        <div className="mx-24 px-4 sm:px-8 md:px-12 lg:px-20 py-12 bg-gray-900/50 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 border border-gray-800 rounded-xl">
              <p className="text-3xl font-bold text-[#77227F]">1200+</p>
              <p className="mt-1 text-gray-400">Properties</p>
            </div>
            <div className="text-center p-6 border border-gray-800 rounded-xl">
              <p className="text-3xl font-bold text-[#77227F]">850+</p>
              <p className="mt-1 text-gray-400">Verified Owners</p>
            </div>
            <div className="text-center p-6 border border-gray-800 rounded-xl">
              <p className="text-3xl font-bold text-[#77227F]">450+</p>
              <p className="mt-1 text-gray-400">Transactions</p>
            </div>
            <div className="text-center p-6 border border-gray-800 rounded-xl">
              <p className="text-3xl font-bold text-[#77227F]">12</p>
              <p className="mt-1 text-gray-400">Districts</p>
            </div>
          </div>
        </div>
        <section className="px-4 sm:px-8 md:px-12 lg:px-20 py-16 mx-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Why Choose Our Platform</h2>
            <p className="text-gray-400 text-center max-w-3xl mx-auto mb-12">
              Our technology provides unparalleled security and transparency for land registration
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-[#77227F] transition-colors">
                <div className="w-12 h-12 bg-[#77227F]/20 rounded-lg flex items-center justify-center mb-4">
                  <ShieldCheck className="text-[#77227F]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Tamper-Proof Records</h3>
                <p className="text-gray-400">
                  All land records are stored on blockchain, making them immutable and secure from fraud.
                </p>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-[#77227F] transition-colors">
                <div className="w-12 h-12 bg-[#77227F]/20 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="text-[#77227F]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Instant Verification</h3>
                <p className="text-gray-400">
                  Verify property documents and ownership history in seconds, not weeks.
                </p>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-[#77227F] transition-colors">
                <div className="w-12 h-12 bg-[#77227F]/20 rounded-lg flex items-center justify-center mb-4">
                  <Landmark className="text-[#77227F]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Reduced Costs</h3>
                <p className="text-gray-400">
                  Eliminate middlemen and paperwork, reducing transaction costs by up to 70%.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="px-4 sm:px-8 md:px-12 lg:px-20 py-12 bg-gray-900/50 mx-24">
          <div className="max-w-4xl mx-auto">
            <div className="flex rounded-lg bg-gray-800 p-1 mb-8">
              <button
                onClick={() => setActiveTab('buyer')}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg ${activeTab === 'buyer' ? 'bg-[#77227F] text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Users className="inline mr-2 h-4 w-4" />
                I'm Buying
              </button>
              <button
                onClick={() => setActiveTab('seller')}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg ${activeTab === 'seller' ? 'bg-[#77227F] text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Building className="inline mr-2 h-4 w-4" />
                I'm Selling
              </button>
            </div>

            {/* Buyer Content */}
            {activeTab === 'buyer' && (
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#77227F]/20 rounded-lg flex items-center justify-center">
                      <Search className="text-[#77227F]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Find Verified Properties</h3>
                    <p className="text-gray-400">
                      Browse our marketplace of pre-verified properties with complete documentation and clear ownership history.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#77227F]/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="text-[#77227F]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
                    <p className="text-gray-400">
                      Complete purchases with smart contracts that ensure funds are only released when all conditions are met.
                    </p>
                  </div>
                </div>
                <button className="w-full sm:w-auto px-8 py-3 bg-[#77227F] hover:bg-purple-700 rounded-lg font-medium transition-colors mt-6">
                  Browse Properties <ArrowRight className="inline ml-2 h-4 w-4" />
                </button>
              </div>
            )}

            {/* Seller Content */}
            {activeTab === 'seller' && (
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#77227F]/20 rounded-lg flex items-center justify-center">
                      <FileCheck className="text-[#77227F]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">List Your Property</h3>
                    <p className="text-gray-400">
                      Easily register your property with our guided process and required documentation.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#77227F]/20 rounded-lg flex items-center justify-center">
                      <Database className="text-[#77227F]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Permanent Record</h3>
                    <p className="text-gray-400">
                      Your property details are stored on blockchain, creating an immutable record of ownership.
                    </p>
                  </div>
                </div>
                <button className="w-full sm:w-auto px-8 py-3 bg-[#77227F] hover:bg-purple-700 rounded-lg font-medium transition-colors mt-6">
                  Start Listing <ArrowRight className="inline ml-2 h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </section>
        <section className="px-4 sm:px-8 md:px-12 lg:px-20 py-20 text-center bg-gradient-to-br from-gray-900 to-[#1e0a21] mx-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ready to Experience Modern Land Registration?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join hundreds of property owners who have simplified their land transactions.
            </p>
            <button className="px-8 py-3 bg-[#77227F] hover:bg-purple-700 rounded-lg font-medium transition-colors">
              Get Started Today
            </button>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}