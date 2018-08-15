const redisHelper = (redisClient) => {
	return {
		hmset: (hash, key, jsonString) => hmset(redisClient, hash, key, jsonString),
		hmget: (hash, key) => hmget(redisClient, hash, key),
		hdel: (hash, key) => hdel(redisClient, hash, key),
		hget: (hash, key) => hget(redisClient, hash, key),
		hgetall: (hash) => hgetall(redisClient, hash),
		set: (key, value) => set(redisClient, key, value),
		setnx: (key, value) => setnx(redisClient, key, value),
		get: (key) => get(redisClient, key),
		del: (key) => del(redisClient, key),
		expire: (key, time) => expire(redisClient, key, time),
		rpush: (key, value) => rpush(redisClient, key, value),
		lpop: (key) => lpop(redisClient, key),
		lrange: (key, start = 0, end = -1) => lrange(redisClient, key, start, end)
	};
};

const hmset = (redisClient, hash, key, jsonString) => {
	return new Promise((resolve, reject) => {
		redisClient.hmset(hash, key, jsonString, (err, res) => callback(err, res, resolve));
	});
};

const hmget = (redisClient, hash, key) => {
	return new Promise((resolve, reject) => {
		redisClient.hmget(hash, key, (err, res) => callback(err, res, resolve));
	});
};

const hdel = (redisClient, hash, key) => {
	return new Promise((resolve, reject) => {
		redisClient.hdel(hash, key, (err, res) => callback(err, res, resolve));
	});
};

const hget = (redisClient, hash, key) => {
	return new Promise((resolve, reject) => {
		redisClient.hget(hash, key, (err, res) => callback(err, res, resolve));
	});
};

const hgetall = (redisClient, hash) => {
	return new Promise((resolve, reject) => {
		redisClient.hgetall(hash, (err, res) => callback(err, res, resolve));
	});
};

const set = (redisClient, key, value) => {
	return new Promise((resolve, reject) => {
		redisClient.set(key, value, (err, res) => callback(err, res, resolve));
	});
};

const setnx = (redisClient, key, value) => {
	return new Promise((resolve, reject) => {
		redisClient.setnx(key, value, (err, res) => callback(err, res, resolve));
	});
};

const get = (redisClient, key) => {
	return new Promise((resolve, reject) => {
		redisClient.get(key, (err, res) => callback(err, res, resolve));
	});
};

const del = (redisClient, key) => {
	return new Promise((resolve, reject) => {
		redisClient.del(key, (err, res) => callback(err, res, resolve));
	});
};

const expire = (redisClient, key, time) => {
	return new Promise((resolve, reject) => {
		redisClient.expire(key, time, (err, res) => callback(err, res, resolve));
	});
};

const rpush = (redisClient, key, value) => {
	return new Promise((resolve, reject) => {
		redisClient.rpush(key, value, (err, res) => callback(err, res, resolve));
	});
};

const lpop = (redisClient, key) => {
	return new Promise((resolve, reject) => {
		redisClient.lpop(key, (err, res) => callback(err, res, resolve));
	});
};

const lrange = (redisClient, key, start, end) => {
	return new Promise((resolve, reject) => {
		redisClient.lrange(key, start, end, (err, res) => callback(err, res, resolve));
	});
};

// helper callback
const callback = (err, res, resolve) => {
	if (err) {
		resolve(null);
	} else {
		resolve(res);
	}
};

export default redisHelper;
