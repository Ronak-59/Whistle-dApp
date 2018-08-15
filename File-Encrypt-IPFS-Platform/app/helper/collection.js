import didYouMean from "didyoumean";
import randomstring from "randomstring";


export const getSuccesResponse = (res, isArray) => {
	if (isArray) {
		res.data = res.data.map(x => parseItem(x.toObject()));
		return res;
	}
	return parseItem(res);
};

export const getSeed = (length = 32, charset = "hex") => {
	return randomstring.generate({
		length: length,
		charset: charset,
		capitalization: "uppercase"
	});
};

export const appendHexPrefix = (value, prefix = "0") => {
	if (value.startsWith("0x") || value.startsWith("1x")) {
		return value;
	}
	return `${prefix}x${value}`;
};

// for shift
export const toBase = (text) => {
	let bufferData = new Buffer(text);
	return bufferData.toString("base64");
};

export const fromBase = (text) => {
	let bufferData = new Buffer(text, "base64");
	return bufferData.toString("ascii");
};

export const getErrorResponse = (error = "Something went wrong.", errors = []) => {
	return { error, errors };
};

/* eslint-disable */
export const validateEmail = (mail) => {
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
		return true;
	}
	return false;
};

export const getJsonFromString = (jsonString) => {
	try {
		jsonString = passJsonCheck(jsonString);
		return JSON.parse(jsonString);
	} catch (exe) {
		//logMessage("JSON PARSE", exe);
	}
	return jsonString;
};

export const passJsonCheck = (jsonString) => {
	try {
		jsonString = jsonString.replace(/(^')|('$)/g, "");
		jsonString = jsonString.replace(/(^")|("$)/g, "");
		return jsonString;
	}
	catch (exe) {
		return jsonString;
	}
};

/* eslint-disable */

export const verifyOtp = (otp, success) => {
	const currentTimeStamp = new Date();
	const otpTimeStamp = new Date(success.otpExpires);
	if (otp == success.otpToken && currentTimeStamp < otpTimeStamp) {
		return true;
	}
	return false;
};

export const getDates = (startDate, stopDate) => {
	let dateArray = [];
	let currentDate = startDate;
	while (currentDate <= stopDate) {
		dateArray.push(getDateFromMongoDate(currentDate));
		currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
	}
	return dateArray;
};

export const geneareRandomNumber = ()=>{
	return Math.floor((Math.random() * 5000) + 1000);
}

export const getDateFromMongoDate = (mongoDate) => {
	if (mongoDate) {
		const date = new Date(mongoDate);
		let month = parseInt(date.getMonth() + 1).toString();
		if (month.length < 2) {
			month = "0" + month;
		}
		return date.getFullYear() + "-" + month + "-" + date.getDate();
	}
	return "";
};

export const parseItem = (item) => {
	return Object.keys(item).reduce((result, key, index) => {
		if (key == "start" || key == "date" || key == "expiry" || key == "createdAt" || key == "updatedAt") {
			result[key] = getDateFromMongoDate(item[key]) || getDateFromMongoDate(Date.now());
		} else if (key != "password") {
			result[key] = item[key];
		}
		return result;
	}, {});
};

export const getAddressFromLongString = (longAddress) => {
	return longAddress.slice(-40);
};

export const getConvertedItem = (items, item) => {
	items.push(item);
	return items;
};

export const getFileUrl = (...args) => {
	return args.length > 1 ? args.join("/") : "./" + args;
};

export const methodFromText = (key) => {
	return key.split("_").map((x, index) => index > 0 ? capitalize(x) : x).join("").trim();
};

export const generateToken = () => {
	const token = randomstring.generate({
		length: 40,
		charset: "alphanumeric",
		capitalization: "lowercase"
	});

	return token;
};

export const uint8arrayToString = (data) => {
	return String.fromCharCode.apply(null, data);
};

export const generateSearchFilter = (searchObj) => {
	let filter = {};
	if (searchObj.hasOwnProperty("startDate") || searchObj.hasOwnProperty("endDate")) {
		if (searchObj.startDate === "" || searchObj.endDate === "") {
			return filter;
		}

		filter["$and"] = [];
		let startQuery = {
			start: {}
		};
		let endQuery = {
			expiry: {}
		};

		let startDate = new Date(searchObj.startDate);
		let endDate = new Date(searchObj.endDate);

		startQuery["start"]["$gte"] = startDate.toISOString();
		endQuery["expiry"]["$lte"] = endDate.toISOString();

		filter["$and"]["push"](startQuery);
		filter["$and"]["push"](endQuery);
	} else {
		for (let key in searchObj) {
			if (searchObj[key] !== null && searchObj[key] !== undefined) {
				filter[key] = searchObj[key];
			}
		}
	}
	return filter;
};

export const generateFilter = (body, keys) => {
	let filters = {};
	if (body) {
		filters.limit = body.limit && parseInt(body.limit, null) || 15;
		filters.search = body.search && generateSearchFilter(body.search) || {};
		filters.page = body.page || 1;
		filters.keys = body.keys || keys;
		filters["sort"] = { "_id": parseInt("+1") };
		if (body.sortBy && body.sortBy.value) {
			filters["sort"] = {};
			filters["sort"][body.sortBy.key] = parseInt(body.sortBy.value);
		}
	}
	return filters;
};

export const capitalize = (str) => {
	var pieces = str.split(" ");
	for (var i = 0; i < pieces.length; i++) {
		pieces[i] = pieces[i].charAt(0).toUpperCase() + pieces[i].substr(1);
	}
	return pieces.join(" ");
};

export const getClosestMatch = (value, _array, key, r_first_match = false, threshold = 50) => {
	const result = _getClosestMatch(value, _array, key, r_first_match, threshold);
	if (result && typeof (result) != "obj") {
		return _array.filter(x => x[key] === result)[0] || null;
	} else if (result) {
		return result;
	}
	return null;
};

const _getClosestMatch = (value, _array, key, r_first_match, threshold) => {
	didYouMean.caseSensitive = false;
	didYouMean.threshold = null;
	didYouMean.returnFirstMatch = r_first_match;
	didYouMean.thresholdAbsolute = threshold;
	return didYouMean(value, _array, key);
};

export const removeDuplicates = (keyFn, array) => {
	let set = new Set();
	return array.filter((x) => {
		let key = keyFn(x), isNew = !set.has(key);
		if (isNew) set.add(key);
		return isNew;
	});
};

export const getSafeFloat = (amount) => {
	if (amount) {
		return Number(amount);
	}
	return 0;
};