//const cryptoJs = require("crypto-js");
import keythereum from "keythereum";
import * as constant from "../helper/constant";


// export const encryptKey = (seed) => {
// 	return cryptoJs.AES.encrypt(seed, configServer.utils.walletSalt).toString();
// };

// export const decryptKey = (cipherText) => {
// 	return cryptoJs.AES.decrypt(cipherText, configServer.utils.walletSalt).toString(cryptoJs.enc.Utf8);
// };

/* eslint-disable */
// export const getPrivateKey = (app, address, password) => {
// 	return new Promise((resolve, reject) => {
// 		makeRequest(config.dev.keys.keyUrl + "/get_key", "POST", null, { address, password })
// 			.then(res => {
// 				resolve(res.data && res.data.privateKey && res.data.privateKey.data);
// 			}).catch(rej => {
// 				resolve(null);
// 			});
// 	});
// };
/* eslint-disable */

export const getLocalPrivateKey = (app, address, password) => {
	let privateKey = null;
	try {
		const datadir = constant.configServer.utils.etherDataDirectory;
		const keyObject = keythereum.importFromFile(address, datadir);
		privateKey = keythereum.recover(password, keyObject);
		privateKey = privateKey.toString("hex");
	}
	catch (exe) {
		app.loggerClient("KEYTHEREUM", exe.toString());
	}
	return privateKey;
};
