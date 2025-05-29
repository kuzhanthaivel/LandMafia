'use client';

import { useState, useEffect } from 'react';
import { Web3Provider } from "../../components/Web3Provider";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import { useRouter } from 'next/navigation';
import { FaLandmarkFlag } from "react-icons/fa6";

function WalletConnectSection({
  onAddressChange
}) {
  const [connecting, setConnecting] = useState(false);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      onAddressChange(address);
      setConnecting(false);
    }
  }, [isConnected, address]);

  return (
    <div className="mb-4">
      <ConnectKitButton.Custom>
        {({ isConnected, show, truncatedAddress }) => (
          <button
            onClick={() => {
              setConnecting(true);
              show();
            }}
            className="w-full py-3 bg-neutral-300 text-black rounded-md font-medium hover:bg-neutral-400 transition"
          >
            {connecting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </span>
            ) : isConnected ? (
              truncatedAddress
            ) : (
              "CONTINUE WITH WALLET"
            )}
          </button>
        )}
      </ConnectKitButton.Custom>
    </div>
  );
}

export default function LoginPage() {
  const [isMember, setIsMember] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    walletAddress: ''
  });
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState({
    login: false,
    signup: false,
    usernameCheck: false
  });
  const router = useRouter();

  const checkUsernameAvailability = async (username) => {
    if (!username) {
      setUsernameAvailable(false);
      return false;
    }

    setLoading(prev => ({ ...prev, usernameCheck: true }));
    setCheckingUsername(true);
    try {
      const response = await fetch('/api/auth/name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      setUsernameAvailable(data.available);
      return data.available;
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameAvailable(false);
      return false;
    } finally {
      setLoading(prev => ({ ...prev, usernameCheck: false }));
      setCheckingUsername(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.username && formData.username.length >= 3) {
        checkUsernameAvailability(formData.username);
      } else {
        setUsernameAvailable(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username]);

  useEffect(() => {
    if (formData.walletAddress) {
      handleLogin();
    }
  }, [formData.walletAddress]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async () => {
    if (!formData.walletAddress) return;

    setLoading(prev => ({ ...prev, login: true }));
    setApiError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress: formData.walletAddress }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.isMember) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user.username);
        router.push('/profile');
      } else {
        setIsMember(false);
      }
    } catch (error) {
      setApiError(error.message || 'Login failed');
    } finally {
      setLoading(prev => ({ ...prev, login: false }));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!isMember && !usernameAvailable) {
      setApiError('Please choose an available username');
      return;
    }

    if (!formData.email || !formData.username || !formData.walletAddress) {
      setApiError('All fields are required');
      return;
    }

    setLoading(prev => ({ ...prev, signup: true }));
    setApiError(null);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          walletAddress: formData.walletAddress
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.user.username);
      router.push('/profile');
    } catch (error) {
      setApiError(error.message || 'Signup failed');
    } finally {
      setLoading(prev => ({ ...prev, signup: false }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-zinc-900 text-white">
      <div className="w-full max-w-md px-4 text-center">
        <div className="mb-6">
          <div className="mx-auto mb-4 items-center flex justify-center">
            <FaLandmarkFlag />
          </div>
          <h1 className="text-2xl font-semibold">{isMember ? 'Log in' : 'Sign up'}</h1>
        </div>

        <Web3Provider>
          <WalletConnectSection
            onAddressChange={(address) => setFormData(prev => ({ ...prev, walletAddress: address }))}
          />
        </Web3Provider>

        {apiError && (
          <div className="text-red-500 text-sm mb-4">
            {apiError}
          </div>
        )}

        {!isMember && (
          <form onSubmit={handleSignup} className="text-left mt-6 space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium">
                User Name
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="johndoe123"
                className="w-full px-3 py-2 bg-transparent border-b border-gray-400 placeholder-gray-500 focus:outline-none focus:border-white"
                required={!isMember}
                minLength={3}
              />
              {formData.username && (
                <p className={`text-xs mt-1 ${loading.usernameCheck ? 'text-gray-400' :
                    usernameAvailable ? 'text-green-400' : 'text-red-400'
                  }`}>
                  {loading.usernameCheck ? 'Checking...' :
                    usernameAvailable ? 'Username available!' : 'Username not available'}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="name@example.com"
                className="w-full px-3 py-2 bg-transparent border-b border-gray-400 placeholder-gray-500 focus:outline-none focus:border-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-neutral-300 text-black rounded-md font-medium hover:bg-neutral-400 transition"
              disabled={loading.signup || (!isMember && (!usernameAvailable || loading.usernameCheck))}
            >
              {loading.signup ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : isMember ? 'LOG IN' : 'SIGN UP'}
            </button>
          </form>
        )}

        {loading.login && (
          <div className="mt-4 text-center">
            <svg className="animate-spin mx-auto h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2">Checking account...</p>
          </div>
        )}

        <div className="flex justify-center mt-4">
          <button
            onClick={() => setIsMember(!isMember)}
            className="text-sm text-gray-300 underline hover:text-white"
            disabled={loading.login || loading.signup}
          >
            {isMember ? 'Need to create an account?' : 'Already have an account?'}
          </button>
        </div>
      </div>
    </div>
  );
}