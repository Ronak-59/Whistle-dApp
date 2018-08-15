export const sleep = (_time) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => resolve(null), _time);
	});
};