import * as constant from "../helper/constant";
const nodemailer = require("nodemailer");


class mailClient {
	constructor() {
		this.transporter = this.createTransporter();
	}

	createTransporter() {
		try {
			return nodemailer.createTransport({
				service: "gmail",
				auth: {
					user: constant.configServer.utils.supportEmailAddress,
					pass: constant.configServer.utils.supportEmailPassword,
				},
			});
		} catch (exe) {
			return null;
		}
	}

	// email from customer
	async sendVanillaMail(payload) {
		if (!this.transporter) {
			return null;
		}

		let mailOptions = {
			from: constant.configServer.utils.supportEmailAddress,
			to: payload.email,
			subject: "Verification",
			text: payload.description
		};

		console.log(mailOptions);

		try {
			// send mail with defined transport object
			this.transporter.sendMail(mailOptions, (err, info) => {
				if (err) {
					return null;
				}
				return 1;
			});
		} catch (exe) {
			return null;
		}

	}
}

export default mailClient;