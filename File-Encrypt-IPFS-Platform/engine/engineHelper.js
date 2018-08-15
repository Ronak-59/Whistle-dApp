const fs = require("fs");
import * as collection from "../app/helper/collection.js";
import * as constant from "../app/helper/constant.js";
import * as authorize from "../middleware/authorize.js";

//impoprt all .js files in current folder and ignores index.js and any folder
const engineImport = (app, folder_path, isRoute = false) => {
	fs.readdirSync(folder_path)
		.filter(x => !x.includes("index.js") && !x.includes("engineHelper.js"))
		.filter(x => x.includes(".js"))
		.map((file) => {
			const file_path = collection.getFileUrl(folder_path, file);
			if (!require("fs").statSync(file_path).isDirectory()) {
				if (isRoute) {
					const routes = require(file_path).routes;

					const basePath = require(require(file_path).routePath);
					if (routes && routes.length > 0) {
						routes.map(x => {
							const parts = x.endPoint.split("@");
							console.log(`${constant.configServer.utils.apiPrefix}/${parts[1]}`);
							if (x.middleware) {
								app[x.method](`${constant.configServer.utils.apiPrefix}/${parts[1]}`, basePath[parts[0]]);
							} else {
								app[x.method](`${constant.configServer.utils.apiPrefix}/${parts[1]}`, basePath[parts[0]]);
							}
						});
					}
				} else {
					require(file_path).default(app);
				}
			}
		});
};

export default engineImport;