"use client";
import { useState ,useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../assets/logo.png";
import { useWallet } from "@/context/WalletContext";
import { useRouter } from "next/navigation";
import { MdOutlineArrowDropDownCircle } from "react-icons/md";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [verifiedStatus, setVerifiedStatus] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false)
    const router = useRouter();
  const {
    isConnected,
    account,
    connectWallet,
    disconnectWallet,
    shortenAddress,
  } = useWallet();

    useEffect(() => {
    const verifiedStatus = localStorage.getItem('isVerified') === 'true';
    setVerifiedStatus(verifiedStatus)
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const toggleVerifiedStatus = () => {
    localStorage.setItem('isVerified', 'false');
    const verifiedStatus = localStorage.getItem('isVerified') === 'true';
    setVerifiedStatus(verifiedStatus)
  };
    const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    router.push("/");
    setDropdownOpen(false);
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
        <div onClick={() => setDropdownOpen(!dropdownOpen)}>
                        <MdOutlineArrowDropDownCircle
                className={`text-lg text-gray-400 transition-transform ${
                  dropdownOpen ? "transform rotate-180" : ""
                }`}
              />  
        </div>
      <div className="flex flex-col gap-2 relative">
                <Link
          href="/approval"
          className="w-2 h-2 bg-[#77227F] items-end rounded-full"
        >
          {" "}
        </Link>
        <button
          onClick={toggleVerifiedStatus}
          className={`w-2 h-2  items-end rounded-full ${verifiedStatus ? "bg-green-800" : "bg-red-800"}`}
        >
          {" "}
        </button>
                    {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg z-10 overflow-hidden top-10">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left text-white  bg-[#77227F] transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
      </div>
      </div>
    </header>
  );
}
