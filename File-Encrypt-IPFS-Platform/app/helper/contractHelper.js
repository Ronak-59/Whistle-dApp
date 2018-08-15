const contract = {};
export const addContract = (key, value) => {
	if (value) {
		contract[key] = value;
	}
};

export const removeContract = (key) => {
	if(key){
		delete contract[key];
	}
};

export default { contract, addContract, removeContract };