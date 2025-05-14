import { ethers } from "ethers";

const marketContractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "assetId",
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
				"name": "assetName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "category",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "price",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "assetImage",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "royality",
				"type": "string"
			}
		],
		"name": "AssetAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "assetId",
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
				"internalType": "string",
				"name": "price",
				"type": "string"
			}
		],
		"name": "AssetSold",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "assetId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "ProfileStatus",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "MarketStatus",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "TransactionStatus",
				"type": "string"
			}
		],
		"name": "AssetStatusUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_assetName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_category",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_assetImage",
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
				"name": "_royality",
				"type": "string"
			}
		],
		"name": "addAsset",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_indexId",
				"type": "uint256"
			}
		],
		"name": "buyAsset",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_indexId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_newPrice",
				"type": "string"
			}
		],
		"name": "reSell",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_indexId",
				"type": "uint256"
			}
		],
		"name": "sellAsset",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_indexId",
				"type": "uint256"
			}
		],
		"name": "unlistAsset",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "viewAllAssets",
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
						"name": "assetName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "category",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "price",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "assetImage",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "royality",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "ProfileStatus",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "MarketStatus",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "TransactionStatus",
						"type": "string"
					}
				],
				"internalType": "struct NFTMarketplace.Asset[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

const marketContractAddress = "0x68704B89173E4Ef328c790352470B85307D20A28";

const getMarketContract = () => {
	if (!window.ethereum) {
		throw new Error("MetaMask is not installed!");
	}
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const signer = provider.getSigner();
	return new ethers.Contract(marketContractAddress, marketContractABI, signer);
};

export const addAsset = async (assetData) => {
	const contract = getMarketContract();
	const tx = await contract.addAsset(
		assetData.assetName,
		assetData.category,
		assetData.assetImage,
		assetData.price,
		assetData.description,
		assetData.royality
	);
	await tx.wait();
	return tx;
};

export const viewAllAssets = async () => {
	const contract = getMarketContract();
	return await contract.viewAllAssets();
};

export const sellAsset = async (indexId) => {
	const contract = getMarketContract();
	const tx = await contract.sellAsset(indexId);
	await tx.wait();
	return tx;
};

export const buyAsset = async (indexId) => {
	const contract = getMarketContract();
	const tx = await contract.buyAsset(indexId);
	await tx.wait();
	return tx;
};

export const unlistAsset = async (indexId) => {
	const contract = getMarketContract();
	const tx = await contract.unlistAsset(indexId);
	await tx.wait();
	return tx;
};

export const reSellAsset = async (indexId, newPrice) => {
	const contract = getMarketContract();
	const tx = await contract.reSell(indexId, newPrice);
	await tx.wait();
	return tx;
};

export const listenForAssetAdded = (callback) => {
	const contract = getMarketContract();
	contract.on("AssetAdded", callback);
	return () => contract.off("AssetAdded", callback);
};

export const listenForAssetSold = (callback) => {
	const contract = getMarketContract();
	contract.on("AssetSold", callback);
	return () => contract.off("AssetSold", callback);
};

export const listenForStatusUpdates = (callback) => {
	const contract = getMarketContract();
	contract.on("AssetStatusUpdated", callback);
	return () => contract.off("AssetStatusUpdated", callback);
};	