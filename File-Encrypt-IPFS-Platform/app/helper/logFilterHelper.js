import * as internet from "./internet";
import ethereumMethods from "./ethereumMethods";

export const watchLogFilters = (web3Client, fromBlock, toBlock, contract, contractAddress) => {
	return new Promise(async (resolve, reject) => {
		const TransferEvent = contract.events.Transfer();
		const params = [{
			fromBlock: web3Client.utils.toHex(fromBlock),
			toBlock: web3Client.utils.toHex(toBlock),
			address: web3Client.utils.toHex(contractAddress),
			topics: TransferEvent.arguments[0].topics
		}];

		const data = await internet.makeNodeRequest(params, ethereumMethods.getLogs);
		if (data) {
			resolve(data);
		} else {
			console.log("FILTER", "ERC LOG FILTER ERROR");
			resolve(null);
		}
	});
};