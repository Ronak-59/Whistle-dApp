const telegramNode = require("node-telegram-bot-api");
import * as constant from "../helper/constant";

const telegramClient = (app) => {
	let telegram = null;
	const redisHelper = app.redisHelper;

	if (process.env.NODE_ENV === "production") {
		const telegram = new telegramNode(constant.configServer.telegram.key);
		telegram.setWebHook(process.env.HEROKU_URL + constant.configServer.telegram.key);
	}
	else {
		telegram = new telegramNode(constant.configServer.telegram.key, { polling: true });
	}

	if (telegram) {
		telegram.on("message", async (msg) => {
			await redisHelper.set(constant.REDIS_CHAT_ID, msg.chat.id);
		});
	}

	return {
		notify: (app, payload) => notify(telegram, app, payload)
	};
};


const notify = async (telegram, app, payload) => {
	const redisHelper = app.redisHelper;
	const chatId = await redisHelper.get(constant.REDIS_CHAT_ID);
	if (chatId) {
		payload = JSON.stringify(payload) + "\n" + ` env = ${constant.configServer.environment}`;
		telegram.sendMessage(chatId, payload);
	}
};

export default telegramClient;