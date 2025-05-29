import { ethers } from "ethers";

const marketContractABI = [
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
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "registrationDate",
				"type": "uint256"
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
				"internalType": "string",
				"name": "_saleDeed",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_clearanceCertificates",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_propertyTaxDocument",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_encumbranceCertificate",
				"type": "string"
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
			},
			{
				"internalType": "uint256",
				"name": "_registrationDate",
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
						"internalType": "string",
						"name": "saleDeed",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "clearanceCertificates",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "propertyTaxDocument",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "encumbranceCertificate",
						"type": "string"
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
					},
					{
						"internalType": "uint256",
						"name": "registrationDate",
						"type": "uint256"
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
						"internalType": "string",
						"name": "saleDeed",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "clearanceCertificates",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "propertyTaxDocument",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "encumbranceCertificate",
						"type": "string"
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
					},
					{
						"internalType": "uint256",
						"name": "registrationDate",
						"type": "uint256"
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
]

const marketContractAddress = "0x5B9AF6282B49cf4EDD3821910105Ed1076F641A5";

const getMarketContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed!");
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  return new ethers.Contract(marketContractAddress, marketContractABI, signer);
};

const contractCallWrapper = async (method, ...args) => {
  try {
    const contract = await getMarketContract();
    const tx = await method(contract, ...args, { gasLimit: 500000 }); 
    if (tx.wait) await tx.wait();
    return tx;
  } catch (error) {
    console.error("Contract interaction failed:", error);
    throw error;
  }
};

export const addProperty = async (propertyData) =>
  contractCallWrapper(async (contract) =>
    contract.addProperty(
      propertyData.landImage,
      propertyData.location,
      propertyData.googleMapLink,
      propertyData.size,
      propertyData.price,
      propertyData.description,
      propertyData.landType,
      propertyData.saleDeed || "", 
      propertyData.clearanceCertificates || "", 
      propertyData.propertyTaxDocument || "",  
      propertyData.encumbranceCertificate || "" 
    )
  );

export const verifyProperty = async (propertyId, verificationStatus) =>
  contractCallWrapper(async (contract) =>
    contract.verifyProperty(propertyId, verificationStatus)
  );

export const sellProperty = async (propertyId) =>
  contractCallWrapper(async (contract) =>
    contract.sellProperty(propertyId)
  );

export const requestToBuy = async (propertyId) =>
  contractCallWrapper(async (contract) =>
    contract.requestToBuy(propertyId)
  );

export const approveBuy = async (propertyId, registrationDate) =>
  contractCallWrapper(async (contract) =>
    contract.approveBuy(propertyId, registrationDate)
  );

export const viewByIndex = async (propertyId) => {
  const contract = await getMarketContract();
  const property = await contract.viewByIndex(propertyId);
  return {
    ...property,
    registrationDate: property.registrationDate.toString()
  };
};

export const viewAll = async () => {
  const contract = await getMarketContract();
  const properties = await contract.viewAll();
  return properties.map(prop => ({
    ...prop,
    registrationDate: prop.registrationDate.toString()
  }));
};

export const createEventListener = (eventName, callback) => {
  let contract;
  let cleanup;

  const setupListener = async () => {
    contract = await getMarketContract();
    contract.on(eventName, callback);
    cleanup = () => contract.off(eventName, callback);
  };

  setupListener();

  return () => {
    if (cleanup) cleanup();
  };
};

export const listenForPropertyAdded = (callback) =>
  createEventListener("PropertyAdded", callback);

export const listenForPropertyVerified = (callback) =>
  createEventListener("PropertyVerified", callback);

export const listenForPropertyRequested = (callback) =>
  createEventListener("PropertyRequested", callback);

export const listenForPropertyApproved = (callback) =>
  createEventListener("PropertyApproved", (propertyId, seller, buyer, registrationDate) => {
    callback({
      propertyId,
      seller,
      buyer,
      registrationDate: registrationDate.toString() 
    });
  });