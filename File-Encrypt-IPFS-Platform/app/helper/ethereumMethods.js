export default {
	newAccount: "personal_newAccount", // create new account
	getBalance: "eth_getBalance", // get balance
	getAccounts: "eth_accounts", // get all accounts
	getBlock: "eth_getBlockByNumber", // get block info
	getTransaction: "eth_getTransactionByHash", // get transaction info
	getBlockNumber: "eth_blockNumber", // get lastest block
	getBlockTransactionCount: "eth_getBlockTransactionCountByNumber", // block transaction count
	getTransactionCount: "eth_getTransactionCount", // trnsaction count of a user
	getSyncing: "eth_syncing", // is node syncing
	estimateGas: "eth_estimateGas", // estimating the gas
	getGasPrice: "eth_gasPrice", // get gas price for each gas
	getTransactionReceipt: "eth_getTransactionReceipt", // trnsaction receipt
	sendRawTransaction: "eth_sendRawTransaction", // for sending the transaction
	unlockAccount: "personal_unlockAccount", // unlock an account
	newFilter: "eth_newFilter",
	newPendingTransactionFilter: "eth_newPendingTransactionFilter",
	getLogs: "eth_getLogs",
	addDocument: "addDocument",
	setLastSeen: "setLastSeen",
};
