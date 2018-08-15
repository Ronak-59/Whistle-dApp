const fs = require("fs");
//get root folder
const routePath = require("path").join(__dirname, "../route");
import engineImport from "./engineHelper";

const route = (app) => {
	fs.readdirSync(routePath)
		.map(folder => {
			engineImport(app, `${routePath}/${folder}`, true);
		});
};

export default route;