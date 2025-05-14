import { ethers } from "ethers";

const propertyContractABI = [
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
];

const propertyContractAddress = "";

const getPropertyContract = () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed!");
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(propertyContractAddress, propertyContractABI, signer);
};

export const addProperty = async (propertyData) => {
  const contract = getPropertyContract();
  const tx = await contract.addProperty(
    propertyData.seller,
    propertyData.buyer,
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
    propertyData.encumbranceCertificate,
    propertyData.propertyVerification,
    propertyData.registrationRequest,
    propertyData.marketStatus,
    propertyData.transactionData
  );
  await tx.wait();
  return tx;
};

export const verifyProperty = async (indexId) => {
  const contract = getPropertyContract();
  const tx = await contract.verifyProperty(indexId);
  await tx.wait();
  return tx;
};

export const sellProperty = async (indexId) => {
  const contract = getPropertyContract();
  const tx = await contract.sellProperty(indexId);
  await tx.wait();
  return tx;
};

export const requestToBuy = async (indexId) => {
  const contract = getPropertyContract();
  const tx = await contract.requestToBuy(indexId);
  await tx.wait();
  return tx;
};

export const approveBuy = async (indexId) => {
  const contract = getPropertyContract();
  const tx = await contract.approveBuy(indexId);
  await tx.wait();
  return tx;
};

export const viewPropertyByIndex = async (indexId) => {
  const contract = getPropertyContract();
  return await contract.viewByIndex(indexId);
};

export const viewAllProperties = async () => {
  const contract = getPropertyContract();
  return await contract.viewAll();
};

export const listenForPropertyAdded = (callback) => {
  const contract = getPropertyContract();
  contract.on("PropertyAdded", callback);
  return () => contract.off("PropertyAdded", callback);
};

export const listenForPropertySold = (callback) => {
  const contract = getPropertyContract();
  contract.on("PropertySold", callback);
  return () => contract.off("PropertySold", callback);
};

export const listenForVerificationUpdates = (callback) => {
  const contract = getPropertyContract();
  contract.on("PropertyVerified", callback);
  return () => contract.off("PropertyVerified", callback);
};
