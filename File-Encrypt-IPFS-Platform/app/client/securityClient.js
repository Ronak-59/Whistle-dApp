import * as internet from "../helper/internet";

export const encrypt = async (hash) => {
	return new Promise(async (resolve, reject) => {
		const encyptedHashPayload = await internet.makePlatformRequest("encrypt", "post", { hash });
		resolve(encyptedHashPayload);
	});
};

export const decrypt = async (payload) => {
	return new Promise(async (resolve, reject) => {
		const decryptedHash = await internet.makePlatformRequest("decrypt", "post", { ...payload });
		resolve(decryptedHash);
	});
};