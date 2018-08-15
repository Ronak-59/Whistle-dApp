//get root folder
const enginePath = require("path").join(__dirname, "");
import engineImport  from "./engineHelper";

const initRouteAndSchema = (app) => {
	engineImport(app, enginePath);
};

export default initRouteAndSchema;