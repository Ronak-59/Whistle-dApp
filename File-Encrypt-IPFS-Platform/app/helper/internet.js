import axios from "axios";
import * as constant from "./constant";

export const etherRPC = axios.create({
	baseURL: constant.configServer.blockchainNode.url,
	timeout: 60000,
	headers: {
		"Content-Type": "application/json",
		"Accept": "application/json",
	}
});

export const platform = axios.create({
	baseURL: constant.configServer.platform.notifyUrl,
	timeout: 60000,
	headers: {
		"Content-Type": "application/json",
		"Accept": "application/json",
		"Authorization": constant.configServer.utils.authKey
	}
});

export const makePlatformRequest = (methodName, methodType = "get", body = {}) => {
	return new Promise(async (resolve, reject) => {
		let options = {
			...body
		};

		// make request now
		platform[methodType](`/${methodName}`, options)
			.then(res => {
				if (res.status == 200) {
					resolve(res.data);
				} else {
					resolve(null);
				}
			}).catch(exe => {
				resolve(null);
			});
	});
};

export const makeNodeRequest = (params, jsonMethod, id = constant.configServer.blockchainNode.chainId, jsonrpc = "2.0") => {
	
	return new Promise(async (resolve, reject) => {
		let options = {
			jsonrpc: jsonrpc,
			method: jsonMethod,
			id: id,
			params: params,
		};

		// make request now
		etherRPC.post("", options)
			.then(res => {
				if (res && res.data) {
					resolve(res.data);
				} else {
					
					resolve(null);
				}
			}).catch(exe => {
				resolve(null);
			});
	});
};