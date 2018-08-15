import ethereumTransaction from "ethereumjs-tx";
import * as constant from "../helper/constant";
import * as collection from "../helper/collection";
import ethereumMethods from "../helper/ethereumMethods";
import * as internet from "../helper/internet";


const ethereumClient = (web3Client) => {
	return {
		newAccount: (password) => newAccount(web3Client, password),
		getBalance: (address, blockNumber = "latest") => getBalance(web3Client, address, blockNumber),
		getAccounts: () => getAccounts(web3Client),
		unlockAccount: (address) => unlockAccount(web3Client, address),
		getBlock: (blockNumber) => getBlock(web3Client, blockNumber),
		getTransaction: (transactionHash) => getTransaction(web3Client, transactionHash),
		getBlockNumber: () => getBlockNumber(web3Client),
		getBlockTransactionCount: (blockNumber) => getBlockTransactionCount(web3Client, blockNumber),
		getTransactionCount: (address, blockNumber = "latest") => getTransactionCount(web3Client, address, blockNumber),
		getSyncing: () => getSyncing(web3Client),
		estimateGas: (payload) => estimateGas(web3Client, payload),
		getGasPrice: () => getGasPrice(web3Client),
		getGasValue: (payload) => getGasValue(web3Client, payload),
		getTransactionReceipt: (transactionHash) => getTransactionReceipt(web3Client, transactionHash),
		sendRawEtherTransaction: (payload) => sendRawEtherTransaction(web3Client, payload),

		initializeContract: (contractAddress, binaryABI) => initializeContract(web3Client, contractAddress, binaryABI),
		balanceOf: (contractInstance, address) => balanceOf(web3Client, contractInstance, address),
		estimateContractGas: (contractInstance, payload) => estimateContractGas(web3Client, contractInstance, payload),
		getContractGasValue: (contractInstance, payload) => getContractGasValue(web3Client, contractInstance, payload),
		sendRawErcTransaction: (contractInstance, payload) => sendRawErcTransaction(web3Client, contractInstance, payload)
	};
};

//creating new account
const newAccount = (web3Client, password) => {
	return new Promise(async (resolve, reject) => {

		callback(await internet.makeNodeRequest([password], ethereumMethods.newAccount), resolve);
	});
};

// get balance of a account
const getBalance = (web3Client, address, blockNumber) => {
	return new Promise(async (resolve, reject) => {
		callback(await internet.makeNodeRequest([address, blockNumber], ethereumMethods.getBalance), resolve);
	});
};

// get list of accounts
const getAccounts = (web3Client) => {
	return new Promise(async (resolve, reject) => {
		callback(await internet.makeNodeRequest([], ethereumMethods.getAccounts), resolve);
	});
};

//unlock account
const unlockAccount = (web3Client, address, password) => {
	return new Promise(async (resolve, reject) => {
		//console.log(web3Client.eth.personal);
		//callback(await web3Client.eth.personal.unlockAccount(address, password));
		callback(await internet.makeNodeRequest([address, password], ethereumMethods.unlockAccount), resolve);
	});
};

//get block info
const getBlock = (web3Client, blockNumber) => {
	return new Promise(async (resolve, reject) => {
		callback(await internet.makeNodeRequest([blockNumber, true], ethereumMethods.getBlock), resolve);
	});
};

//get transaction info
const getTransaction = (web3Client, transactionHash) => {
	return new Promise(async (resolve, reject) => {
		callback(await internet.makeNodeRequest([transactionHash], ethereumMethods.getTransaction), resolve);
	});
};

// get lastest block number
const getBlockNumber = (web3Client) => {
	return new Promise(async (resolve, reject) => {
		callback(await internet.makeNodeRequest([], ethereumMethods.getBlockNumber), resolve);
	});
};

// get lastest block number
const getBlockTransactionCount = (web3Client, blockNumber) => {
	return new Promise(async (resolve, reject) => {
		callback(await internet.makeNodeRequest([blockNumber], ethereumMethods.getBlockTransactionCount), resolve);
	});
};

// get transaction count for the address
const getTransactionCount = (web3Client, address, blockNumber = "latest") => {
	return new Promise(async (resolve, reject) => {
		callback(await internet.makeNodeRequest([address, blockNumber], ethereumMethods.getTransactionCount), resolve);
	});
};

// is node sycing
const getSyncing = (web3Client) => {
	return new Promise(async (resolve, reject) => {
		callback(await internet.makeNodeRequest([], ethereumMethods.getSyncing), resolve);
	});
};

// for gas amount calculations
const estimateGas = (web3Client, payload) => {
	return new Promise(async (resolve, reject) => {
		callback(await internet.makeNodeRequest([{ from: payload.from, to: payload.to }], ethereumMethods.estimateGas), resolve);
	});
};

const estimateContractGas = (web3Client, contractInstance, payload) => {
	return new Promise((resolve, reject) => {
		const _payload = payload._payload;
		console.log(_payload);
		contractInstance.methods.addDocument(_payload.walletAddress, _payload.fileHash, _payload.alias1, _payload.alias2, _payload.policyId, payload.capsule, _payload.signedPublicKey, _payload.alicePubKey).estimateGas({ from: payload.from })
			.then(result => {
				if (result) {
					resolve(result);
				} else {
					resolve(null);
				}
			}).catch(err => resolve(null));
	});
};

//for gas price calculation
const getGasPrice = (web3Client) => {
	return new Promise(async (resolve, reject) => {
		callback(await internet.makeNodeRequest([], ethereumMethods.getGasPrice), resolve);
	});
};


// for getting actual value in wei or ether
export const getGasValue = (web3Client, payload) => {
	return new Promise(async (resolve, reject) => {
		let gasLimit = await estimateGas(web3Client, payload);
		let gasPrice = await getGasPrice(web3Client);

		if (gasLimit && gasPrice) {
			gasLimit = Math.ceil(Number(web3Client.utils.hexToNumberString(gasLimit)) * constant.configServer.utils.gasFactor);
			gasPrice = Math.ceil(Number(web3Client.utils.hexToNumberString(gasPrice)) * constant.configServer.utils.gasFactor);
		}

		const gasValue = gasLimit * gasPrice; // in wei
		resolve(web3Client.utils.fromWei(gasValue.toString()));
	});
};

// for getting actual value in wei or ether
export const getContractGasValue = (web3Client, contractInstance, payload) => {
	return new Promise(async (resolve, reject) => {
		let gasLimit = await estimateContractGas(web3Client, contractInstance, payload);
		let gasPrice = await getGasPrice(web3Client);

		if (gasLimit && gasPrice) {
			gasLimit = Math.ceil(Number(web3Client.utils.hexToNumberString(gasLimit)) * constant.configServer.utils.gasFactor);
			gasPrice = Math.ceil(Number(web3Client.utils.hexToNumberString(gasPrice)) * constant.configServer.utils.gasFactor);
		}

		const gasValue = gasLimit * gasPrice; // in wei
		resolve(web3Client.utils.fromWei(gasValue.toString()));
	});
};

// getting receipt : only for completed transaction
const getTransactionReceipt = (web3Client, transactionHash) => {
	return new Promise(async (resolve, reject) => {
		callback(await internet.makeNodeRequest([transactionHash], ethereumMethods.getTransactionReceipt), resolve)
	});
};

//initialize contract 
const initializeContract = (web3Client, contractAddress, binaryABI) => {
	return new Promise((resolve, reject) => {
		binaryABI = collection.getJsonFromString(String(binaryABI));
		const contractInstance = new web3Client.eth.Contract(binaryABI, contractAddress);
		resolve(contractInstance);
	});
};

// get balaceOf contract address
const balanceOf = (web3Client, contractInstance, address) => {
	return new Promise(async (resolve, reject) => {
		contractInstance.methods.balanceOf(address).call()
			.then(result => {
				if (result) {
					resolve(result);
				} else {
					resolve(null);
				}
			})
			.catch(err => resolve(null));
	});
};

// send ether
const sendRawEtherTransaction = (web3Client, payload) => {
	return new Promise(async (resolve, reject) => {
		let gasLimit = await estimateGas(web3Client, payload);

		let nonce = await getTransactionCount(web3Client, payload.from);
		let gasPrice = await getGasPrice(web3Client);

		if (gasLimit && nonce && gasPrice) {
			const signedEtherTransactionData = prepareEtherTransaction(web3Client, payload, gasLimit, gasPrice, nonce);
			if (signedEtherTransactionData) {
				
				const data = await internet.makeNodeRequest([signedEtherTransactionData], ethereumMethods.sendRawTransaction);
				
				if (data && data.result) {
					resolve({ hash: data.result, nonce: web3Client.utils.hexToNumberString(nonce) });
				} else {
					console.log("BLOCKCHAIN ERROR", data);
					resolve({ hash: null, nonce: web3Client.utils.hexToNumberString(nonce) });
				}
			} else {
				resolve({ hash: null, nonce: web3Client.utils.hexToNumberString(nonce) });
			}
		} else {
			resolve(null);
		}
	});
};


const prepareEtherTransaction = (web3Client, payload, gasLimit, gasPrice, nonce) => {

	let gasPriceIncrementFactor = 1;
	const _nonce = web3Client.utils.hexToNumber(nonce);
	// if both are same and there is fail count
	if (_nonce == payload.nonce) {
		gasPriceIncrementFactor = 1.1; //Math.ceil(gasPriceIncrementFactor + (constant.configServer.utils.failFactor * payload.failCount));
	}

	const transactionObject = Object.assign({}, {
		nonce: web3Client.utils.toHex(nonce),
		from: payload.from,
		to: payload.to,
		value: web3Client.utils.toHex(web3Client.utils.toWei(payload.value)),
		data: "0x0",
		gas: web3Client.utils.toHex(Math.ceil(gasLimit * constant.configServer.utils.gasFactor)),
		gasPrice: web3Client.utils.toHex(Math.ceil(gasPrice * constant.configServer.utils.gasFactor * gasPriceIncrementFactor)),
		chainId: web3Client.utils.toHex(constant.configServer.blockchainNode.chainId)
	});

	const privateKey = new Buffer(payload.privateKey, "hex");

	//sign transaction
	let _transaction = new ethereumTransaction(transactionObject);
	_transaction.sign(privateKey);

	//serialize transaction
	let serializedTransaction = _transaction.serialize();
	const signedEtherTransactionData = collection.appendHexPrefix(serializedTransaction.toString("hex"), "0");

	return signedEtherTransactionData;
};

// send erc token
const sendRawErcTransaction = (web3Client, contractInstance, payload) => {
	return new Promise(async (resolve, reject) => {
		let gasLimit = 4712388; //await estimateContractGas(web3Client, contractInstance, payload);
		let nonce = await getTransactionCount(web3Client, payload.from);
		let gasPrice = await getGasPrice(web3Client);

		if (gasLimit && nonce && gasPrice) {
			const signedErcTransactionData = prepareErcTransaction(web3Client, payload, gasLimit, gasPrice, nonce, contractInstance);
			if (signedErcTransactionData) {
				const data = await internet.makeNodeRequest([signedErcTransactionData], ethereumMethods.sendRawTransaction);
				if (data && data.result) {
					resolve({ hash: data.result, nonce: web3Client.utils.hexToNumberString(nonce) });
				} else {
					console.log("BLOCKCHAIN ERROR", data);
					resolve({ hash: null, nonce: web3Client.utils.hexToNumberString(nonce) });
				}
			} else {
				resolve({ hash: null, nonce: web3Client.utils.hexToNumberString(nonce) });
			}
		} else {
			resolve(null);
		}
	});
};

const prepareErcTransaction = (web3Client, payload, gasLimit, gasPrice, nonce, contractInstance) => {
	let gasPriceIncrementFactor = 1;
	const _nonce = web3Client.utils.hexToNumber(nonce);
	// if both are same and there is fail count
	if (_nonce == payload.nonce) {
		gasPriceIncrementFactor = 1.1; //Math.ceil(gasPriceIncrementFactor + (constant.configServer.utils.failFactor * payload.failCount));
	}

	const transactionObject = Object.assign({}, {
		nonce: web3Client.utils.toHex(nonce),
		from: payload.from,
		to: contractInstance._address,
		value: "0x0",
		data: payload.value, //contractInstance.methods.transfer(payload.to, payload.value).encodeABI(),
		gas: web3Client.utils.toHex(Math.ceil(gasLimit * constant.configServer.utils.gasFactor)),
		gasPrice: web3Client.utils.toHex(Math.ceil(gasPrice * constant.configServer.utils.gasFactor * 1.5 * gasPriceIncrementFactor)),
		chainId: web3Client.utils.toHex(constant.configServer.blockchainNode.chainId)
	});

	//console.log(transactionObject);
	const privateKey = new Buffer(payload.privateKey, "hex");

	//sign transaction
	let _transaction = new ethereumTransaction(transactionObject);
	_transaction.sign(privateKey);

	//serialize transaction
	let serializedTransaction = _transaction.serialize();
	const signedEtherTransactionData = collection.appendHexPrefix(serializedTransaction.toString("hex"), "0");

	return signedEtherTransactionData;
};




// helper callback
const callback = (data, resolve) => {
	if (data && data.result) {
		resolve(data.result);
	} else {
		console.log("BLOCKCHAIN ERROR", data);
		resolve(null);
	}
};

export default ethereumClient; 