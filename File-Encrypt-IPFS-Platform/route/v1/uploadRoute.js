//import target resolver path
export const routePath = require("path").join(__dirname, "../../app/controllers/v1/uploadController");

export const routes = [
	{ method: "post", endPoint: "uploadDocument@uploadDocument" },
	{ method: "get", endPoint: "isAlive@isAlive/:policyId" },
	{ method: "post", endPoint: "getHeartbeat@getHeartbeat" },
	{ method: "post", endPoint: "register@register" },
	{ method: "get", endPoint: "mail@mail/:hash/:policyId" },
	{ method: "get", endPoint: "ping@ping" },
];