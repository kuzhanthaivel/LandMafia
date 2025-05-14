import { ethers } from "ethers";

const marketContractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_landImage",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_location",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_googleMapLink",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_size",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_price",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_landType",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "_saleDeed",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "_clearanceCertificates",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "_propertyTaxDocument",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "_encumbranceCertificate",
				"type": "bool"
			}
		],
		"name": "addProperty",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_propertyId",
				"type": "uint256"
			}
		],
		"name": "approveBuy",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "propertyId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "location",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "price",
				"type": "string"
			}
		],
		"name": "PropertyAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "propertyId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			}
		],
		"name": "PropertyApproved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "propertyId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			}
		],
		"name": "PropertyRequested",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "propertyId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "propertyVerification",
				"type": "string"
			}
		],
		"name": "PropertyVerified",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_propertyId",
				"type": "uint256"
			}
		],
		"name": "requestToBuy",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_propertyId",
				"type": "uint256"
			}
		],
		"name": "sellProperty",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_propertyId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_verificationStatus",
				"type": "string"
			}
		],
		"name": "verifyProperty",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "viewAll",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "seller",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "buyer",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "landImage",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "location",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "googleMapLink",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "size",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "price",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "landType",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "saleDeed",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "clearanceCertificates",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "propertyTaxDocument",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "encumbranceCertificate",
						"type": "bool"
					},
					{
						"internalType": "string",
						"name": "propertyVerification",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "registrationRequest",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "marketStatus",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "transactionData",
						"type": "string"
					}
				],
				"internalType": "struct LandRegistry.Property[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_propertyId",
				"type": "uint256"
			}
		],
		"name": "viewByIndex",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "seller",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "buyer",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "landImage",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "location",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "googleMapLink",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "size",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "price",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "landType",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "saleDeed",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "clearanceCertificates",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "propertyTaxDocument",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "encumbranceCertificate",
						"type": "bool"
					},
					{
						"internalType": "string",
						"name": "propertyVerification",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "registrationRequest",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "marketStatus",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "transactionData",
						"type": "string"
					}
				],
				"internalType": "struct LandRegistry.Property",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]:

const marketContractAddress = "0x599d490EEEB99d6eAE5396059671C45c6BAacFED"; 

const getMarketContract = () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed!");
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(marketContractAddress, marketContractABI, signer);
};

export const addProperty = async (propertyData) => {
  const contract = getMarketContract();
  const tx = await contract.addProperty(
    propertyData.landImage,
    propertyData.location,
    propertyData.googleMapLink,
    propertyData.size,
    propertyData.price,
    propertyData.description,
    propertyData.landType,
    propertyData.saleDeed,
    propertyData.clearanceCertificates,
    propertyData.propertyTaxDocument,
    propertyData.encumbranceCertificate
  );
  await tx.wait();
  return tx;
};

export const verifyProperty = async (propertyId, verificationStatus) => {
  const contract = getMarketContract();
  const tx = await contract.verifyProperty(propertyId, verificationStatus);
  await tx.wait();
  return tx;
};

export const sellProperty = async (propertyId) => {
  const contract = getMarketContract();
  const tx = await contract.sellProperty(propertyId);
  await tx.wait();
  return tx;
};

export const requestToBuy = async (propertyId) => {
  const contract = getMarketContract();
  const tx = await contract.requestToBuy(propertyId);
  await tx.wait();
  return tx;
};

export const approveBuy = async (propertyId) => {
  const contract = getMarketContract();
  const tx = await contract.approveBuy(propertyId);
  await tx.wait();
  return tx;
};

export const viewByIndex = async (propertyId) => {
  const contract = getMarketContract();
  return await contract.viewByIndex(propertyId);
};

export const viewAll = async () => {
  const contract = getMarketContract();
  return await contract.viewAll();
};

export const listenForPropertyAdded = (callback) => {
  const contract = getMarketContract();
  contract.on("PropertyAdded", callback);
  return () => contract.off("PropertyAdded", callback);
};

export const listenForPropertyVerified = (callback) => {
  const contract = getMarketContract();
  contract.on("PropertyVerified", callback);
  return () => contract.off("PropertyVerified", callback);
};

export const listenForPropertyRequested = (callback) => {
  const contract = getMarketContract();
  contract.on("PropertyRequested", callback);
  return () => contract.off("PropertyRequested", callback);
};

export const listenForPropertyApproved = (callback) => {
  const contract = getMarketContract();
  contract.on("PropertyApproved", callback);
  return () => contract.off("PropertyApproved", callback);
};
