

const express = require("express");

const bodyParser = require("body-parser");
let cors = require("cors");
const web3 = require("web3");
const redis = require("redis");
const fileUpload = require("express-fileupload");

import loggerClient from "./app/client/loggerClient";
import redisHelper from "./app/helper/redisHelper";
import * as uploadController from "./app/controllers/v1/uploadController";
import blockchainClient from "./app/client/blockchainClient";
import * as constant from "./app/helper/constant";
import * as contractHelper from "./app/helper/contractHelper";


global.__base = __dirname;

const app = express();
const server = require("http").createServer(app);

app.web3Client = null;
app.redisClient = null;
app.loggerClient = null;
app.telegramClient = null;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload({
	limits: { fileSize: constant.FILE_UPLOAD_LIMIT },
	safeFileNames: true,
	abortOnLimit: true
}));


// setup logger
app.loggerClient = loggerClient;

//setup redis
const redisClient = redis.createClient(constant.configServer.redisConfig);
redisClient.on("error", err => console.log(err));
redisClient.on("ready", async () => {


	// init redis
	app.redisClient = redisClient;
	app.redisHelper = redisHelper(redisClient);


	// init notifier
	//app.telegramClient = telegramClient(app);

	//init web3
	const provider = new web3.providers.HttpProvider(constant.configServer.blockchainNode.url);
	const web3Client = new web3(provider);
	if (await web3Client.eth.net.isListening()) {
		app.web3Client = web3Client;
		app.loggerClient("WEB3", "Initialized web3");
	} else {
		app.loggerClient("WEB3", "Unable to initialized web3");
		return null;
	}

	app.web3Helper = blockchainClient(web3Client);
	
	// init contract
	const contractInstance = await app.web3Helper.initializeContract(constant.CONTRACT_ADDRESS, constant.BINARY_ABI);
	contractHelper.addContract("VLD", contractInstance);
	
	setTimeout(()=> {
		uploadController.runCron(app);
	},5000);
	process.on("unhandledRejection", (reason, promise) => {
		console.error("Uncaught error in", promise, reason);
	});
});

require("./engine").default(app);
server.listen(constant.configServer.port);
app.loggerClient("SERVER", "Running on port " + constant.configServer.port);
