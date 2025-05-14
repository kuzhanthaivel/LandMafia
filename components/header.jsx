"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../assets/logo.png";
import { useWallet } from "@/context/WalletContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    isConnected,
    account,
    connectWallet,
    disconnectWallet,
    shortenAddress,
  } = useWallet();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full px-4 sm:px-6 lg:px-20 py-4 sm:py-6 lg:py-8 flex flex-wrap items-center justify-between bg-black border-b border-gray-800 bg-transparent">
      <div className="flex items-center justify-between w-full md:w-auto">
        <div className="mr-4">
          <Image src={logo} alt="Logo" className="w-32 lg:w-40" />
        </div>

        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-300 hover:text-[#77227F] focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      <nav
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:block w-full md:w-auto mt-4 md:mt-0`}
      >
        <ul className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0 text-lg text-gray-300">
          <li>
            <Link
              href="/"
              className="hover:text-[#77227F] block py-2 md:py-0"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/marketplace"
              className="hover:text-[#77227F] block py-2 md:py-0"
              onClick={() => setIsMenuOpen(false)}
            >
              Marketplace
            </Link>
          </li>
          <li>
            <Link
              href="/uploadLand"
              className="hover:text-[#77227F] block py-2 md:py-0"
              onClick={() => setIsMenuOpen(false)}
            >
              Upload Land
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              className="hover:text-[#77227F] block py-2 md:py-0"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
          </li>
        </ul>
      </nav>

<div className=" flex justify-center items-center gap-4 ">
        <div
        className={`${
          isMenuOpen ? "block mt-4 w-full" : "hidden"
        } md:block md:mt-0 md:w-auto`}
      >
        {isConnected ? (
          <div className="flex justify-center md:justify-end">
            <button
              onClick={disconnectWallet}
              className="bg-[#77227F] hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition w-full md:w-36"
            >
              <span>{shortenAddress(account)}</span>
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-[#77227F] hover:[#77227F] text-white px-4 py-2 rounded-lg text-sm transition w-full md:w-36"
          >
            Connect Wallet
          </button>
        )}
      </div>
     <Link href='/Admin ' className="w-2 h-2 bg-[#77227F] items-end rounded-full"> </Link>
</div>
    </header>
  );
}
