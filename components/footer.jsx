import {
  FaFacebookF,
  FaPinterestP,
  FaDiscord,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import Image from "next/image";
import logo from "../assets/logo.png";
import Link from "next/link";
export default function Footer() {
  return (
    <div className=" text-white px-24 py-8 bg-transparent">
      <div className="border p-4 rounded-2xl pt-24  px-16  border-dashed border-gray-700 hover:border-[#77227F] transition-all duration-300 ">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="space-y-4">
            <div className="flex items-center ">
              <Image src={logo} alt={logo} className="w-40" />
            </div>
            <p className="text-gray-400 text-sm max-w-xs">
Secure, transparent land ownership records powered by blockchain technology. Register, verify, and transfer property with complete trust.
            </p>
            <div className="flex space-x-3 text-lg">
              <Link href="#" className="hover:text-[#77227F]">
                <FaFacebookF />
              </Link>
              <Link href="#" className="hover:text-[#77227F]">
                <FaPinterestP />
              </Link>
              <Link href="#" className="hover:text-[#77227F]">
                <FaDiscord />
              </Link>
              <Link href="#" className="hover:text-[#77227F]">
                <FaYoutube />
              </Link>
              <Link href="#" className="hover:text-[#77227F]">
                <FaTiktok />
              </Link>
            </div>
          </div>

          <div className="flex justify-center">
            <button className="bg-[#77227F] text-white px-8 py-3 rounded-full font-semibold hover:[#77227F] transition">
              Try Now
            </button>
          </div>

          <div className="text-sm text-left ">
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-[#77227F]">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="hover:text-[#77227F]">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/collaborators" className="hover:text-[#77227F]">
                  Upload Land
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-[#77227F]">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 border-t border-gray-800 pt-6">
          <p>2025 © Copyright LandMafia. All Rights Reserved</p>
          <div className="space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">
              Terms Of Service
            </a>
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
