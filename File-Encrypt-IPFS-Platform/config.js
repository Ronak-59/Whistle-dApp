const configServer = {
	port: process.env.PORT || 3000,
	host: process.env.HOST || "127.0.0.1",
	mongoConfig: {
		uri: "mongodb://ether:ether@ds255347.mlab.com:55347/ether"
	},
	mongoOptions: {

	},
	web3Config: {
		localUrl: "http://0.0.0.0:8000",
		infuraRopstenUrl: "https://ropsten.infura.io/Jy5YYgH6Xcj9sCLegGbH",
		infuraRinkebyUrl: "https://rinkeby.infura.io/Jy5YYgH6Xcj9sCLegGbH",
		infureMainUrl: "https://mainnet.infura.io/Jy5YYgH6Xcj9sCLegGbH",
	},
	kueConfig: {
		redis: {
			host: "127.0.0.1",
			port: "6379",

		},
	},
	redisConfig: {
		host: "127.0.0.1",
		port: "6379",
	},
	accounts: {
		transaferAccountPublicKey: '',
		transferAccountPrivateKey: '',
		coldAccountPublicKey: '',
	},
	utils: {
		walletSalt: "6296661279",

		etherDataDirectory: "/home/mcd-50/Personal/Important/private-chain/data",

		bugSnagApiKey: "b8f93f422a233a482ac6e549e325c9f1",

		etherScanApiKey: "M81XFGHSD359SKMC917D5YM467NRM6QAE6",
		etherScanUrl: "http://api.etherscan.io/api?module=account&action=txlist&sort=asc&apikey=M81XFGHSD359SKMC917D5YM467NRM6QAE6",

		withdrawBackoff: 20000,
		depositBackoff: 20000,

		balanceFactor: 1.18,
		failFactor: 0.02,
		gasFactor: 1.12,


		chainId: 12,
		depositConfirmation: 40,

		depositAttempt: 3,
		withdrawAttempt: 3,
		sweepAttempt: 5,
		notifyAttempt: 10,

		transferAccountBalanceLimit: 50,

		depositDiscoverInterval: '30 */2 * * * *',
		depositConfirmationInterval: '* * * * *',
		withdrawDiscoverInterval: '30 */3 * * * *',

		apiPrefix: '/api/ether',

		depositFreezed: 'deposit_freezed',
		withdrawFreezed: 'withdraw_freezed'
	},
};


export default configServer;