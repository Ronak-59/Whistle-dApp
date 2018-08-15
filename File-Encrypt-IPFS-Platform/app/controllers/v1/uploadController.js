import * as collection from "../../helper/collection";
import * as constant from "../../helper/constant";
import * as ipfsNode from "../../client/ipfsNode";
import * as securityClient from "../../client/securityClient";
import mailClient from "../../client/mailClient";
const _mailClient = new mailClient();

import moment from "moment";

import contractHelper from "../../helper/contractHelper";


export const uploadDocument = async (req, res) => {
	
	if (req.files && req.files.file && req.body.walletAddress && req.body.password && req.body.alias1 && req.body.alias2) {
		const ipfs = await ipfsNode.getNode();


		const data = await req.app.redisHelper.hget(constant.REDIS_CUSTOMER_MAP, req.body.walletAddress);
		if (data && req.body.password != data) {
			return res.status(400).json(collection.getErrorResponse("Something went wrong"));
		}

		let fileformat = null;
		const file = req.files.file;

		if (file.mimetype && file.mimetype.split("/").length > 1) {
			fileformat = file.mimetype.split("/")[1];
		}

		if (fileformat == null) {
			return res.status(400).json(collection.getErrorResponse("File type not supported"));
		}

		const files = [{ path: file.name, content: file.data }];

		//now code to upload to ipfs
		ipfs.files.add(files, async (err, files) => {
			if (err) {
				throw err;
			}

			if (files.length > 0) {
				// call nucypher
				const ecyptedDataPayload = await securityClient.encrypt(files[0].hash);
				// call smart contract service

				const payload = {
					walletAddress: req.body.walletAddress,
					fileHash: ecyptedDataPayload.ciphertext,
					alias1: req.body.alias1,
					alias2: req.body.alias2,
					policyId: ecyptedDataPayload.policy_id,
					capsule: ecyptedDataPayload.capsule,
					signedPublicKey: ecyptedDataPayload.alice_signing_pubkey,
					alicePubKey: ecyptedDataPayload.alice_pubkey
				};

				const contractInstance = await getInstance(req.app);
				const _payload = contractInstance.methods.addDocument(payload.walletAddress, payload.fileHash, payload.alias1, payload.alias2, payload.policyId, payload.capsule, payload.signedPublicKey, payload.alicePubKey).encodeABI();
				const trxPayload = {
					from: constant.configServer.wallet.transferWalletAccountAddress,
					to: "0x24461e8e0ce02adc5567f9aaad5f8a39eb2bc5dd",
					value: _payload,
					privateKey: constant.configServer.wallet.transferWalletAccountKey,
				};

				await req.app.web3Helper.sendRawErcTransaction(contractInstance, trxPayload);
				contractInstance.methods.getCurrentId()
					.call()
					.then(res => {
						//const ids = Object.keys(res).map(key => res[key]);
						console.log(res);
					}).catch(exe => {
						console.log(exe);
					});
				return res.status(200).json({ result: true });
			} else {
				return res.status(400).json(collection.getErrorResponse("Something went wrong"));
			}
		});

	} else {
		return res.status(400).json(collection.getErrorResponse("Something went wrong"));
	}
};

export const isAlive = async (req, res) => {
	if (req.params && req.params.policyId) {
		// get smart contract lastSeen func
		const contractInstance = await getInstance(req.app);
		contractInstance.methods.getCustomerAddressByPolicyId(req.params.policyId)
			.call()
			.then(address => {
				// now get new date
				if (address) {
					contractInstance.methods.getLastSeen(String(address))
						.call()
						.then(_res => {
							if (_res.length < 1) {
								_res = 0;
							}

							// now get new date
							const nowTime = moment().valueOf();
							console.log(_res, nowTime);
							if (nowTime > Number(_res)) {
								return res.status(400).json({ result: false });
							} else {
								return res.status(200).json({ result: true });
							}
						}).catch(exe => {
							console.log(exe);
							return res.status(400).json(collection.getErrorResponse("Something went wrong"));
						});
				} else {
					return res.status(400).json(collection.getErrorResponse("Something went wrong"));
				}
			}).catch(exe => {
				console.log(exe);
				return res.status(400).json(collection.getErrorResponse("Something went wrong"));
			});
	} else {
		return res.status(400).json(collection.getErrorResponse("Something went wrong"));
	}
};

export const register = async (req, res) => {
	const payload = req.body;
	if (payload && payload.password) {
		// first get address from web3
		const walletAddress = await req.app.web3Helper.newAccount(payload.password);
		await req.app.redisHelper.hmset(constant.REDIS_CUSTOMER_MAP, walletAddress, payload.password);
		return res.status(200).json({ result: walletAddress });
	} else {
		// send the from hash
		return res.status(400).json(collection.getErrorResponse("Something went wrong"));
	}
};


export const runCron = (app) => {
	setInterval(async () => {
		// get all customers
		let accounts = await app.redisHelper.hgetall(constant.REDIS_CUSTOMER_MAP);
		if (accounts) {
			accounts = Object.keys(accounts).map(key => key).filter(x => x != "undefined");
		} else {
			accounts = [];
		}

		if (accounts.length > 0) {
			// call each account one by one
			accounts.map(async walletAddress => {
				const contractInstance = await getInstance(app);
				contractInstance.methods.getDocumentIds(walletAddress)
					.call()
					.then(res => {
						res.map(id => {
							contractInstance.methods.getDocument(Number(id))
								.call()
								.then(async documentData => {
									const dataArray = Object.keys(documentData).map(key => documentData[key]);
									if (dataArray[0].length > 0) {
										const payload = {
											"ciphertext": dataArray[0],
											"policy_id": dataArray[3],
											"capsule": dataArray[4],
											"alice_signing_pubkey": dataArray[5],
											"alice_pubkey": dataArray[6],
										};
										await securityClient.decrypt(payload);
									}
								});
						});
					}).catch(exe => {
						console.log(exe);
					});
			});
		}
	}, 30000);
};

export const mail = async (req, res) => {
	const payload = req.params;
	if (payload && payload.hash && payload.policyId) {
		// get alias by policyId

		const contractInstance = await getInstance(req.app);
		contractInstance.methods.getAliasesByPolicyId(String(payload.policyId))
			.call()
			.then(res => {
				const aliases = Object.keys(res).map(key => res[key]);
				aliases.map(async email => {
					if (String(email).length > 0) {
						const exists = await req.app.redisHelper.get(email);
						console.log(exists, payload.policyId);
						if (!exists || (exists && exists != payload.policyId)) {
							await req.app.redisHelper.set(email, payload.policyId);
							_mailClient.sendVanillaMail({ email: email, description: `https://ipfs.io/ipfs/${payload.hash}` });
						}
					}
				});
			}).catch(exe => {
				console.log(exe);
			});
		return res.status(200).json({ result: true });
	} else {
		return res.status(400).json(collection.getErrorResponse("Something went wrong"));
	}
};

export const getHeartbeat = async (req, res) => {
	const payload = req.body;
	if (payload && payload.walletAddress && payload.password) {
		const data = await req.app.redisHelper.hget(constant.REDIS_CUSTOMER_MAP, payload.walletAddress);
		if (data && payload.password == data) {
			const contractInstance = await getInstance(req.app);
			contractInstance.methods.getLastSeen(payload.walletAddress)
				.call()
				.then(async _res => {
					// now get new date
					const nextTime = moment().valueOf() + 59;

					const _payload = contractInstance.methods.setLastSeen(payload.walletAddress, String(nextTime)).encodeABI();
					const trxPayload = {
						from: constant.configServer.wallet.transferWalletAccountAddress,
						to: "0x24461e8e0ce02adc5567f9aaad5f8a39eb2bc5dd",
						value: _payload,
						privateKey: constant.configServer.wallet.transferWalletAccountKey,
					};

					await req.app.web3Helper.sendRawErcTransaction(contractInstance, trxPayload);
					return res.status(200).json({ result: String(_res), newDate: String(nextTime) });
				}).catch(exe => {
					console.log(exe);
				});
		} else {
			return res.status(400).json(collection.getErrorResponse("Something went wrong"));
		}
	} else {
		// send de from hash
		return res.status(400).json(collection.getErrorResponse("Something went wrong"));
	}
};

const getInstance = async (app) => {
	return new Promise(async (resole, reject) => {
		let contractInstance = null;
		if (!contractHelper.contract["VLD"]) {
			contractInstance = await app.web3Helper.initializeContract(constant.CONTRACT_ADDRESS, constant.BINARY_ABI);
			contractHelper.addContract("VLD", contractInstance);
		} else {
			contractInstance = contractHelper.contract["VLD"];
		}
		resole(contractInstance);
	});
};


export const ping = async (req, res) => {
	return res.status(200).json({ result: true });
};