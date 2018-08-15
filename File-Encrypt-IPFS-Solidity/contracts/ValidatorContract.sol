pragma solidity ^0.4.17;

contract ValidatorContract {

	// current item id increments on every upload object
	uint currentId = 1;
	struct UploadObject {
		address customerAddress;

		string fileHash;
		string alias1;
		string alias2;
		string policyId;
		string capsule;
		string signedPublicKey;
		string alicePubKey;
	}

	//user will have multiple upload items
	mapping (address => uint[]) public userAddressToUploadObjectIds;
	mapping (address => string) public userLastSeenMap;

	// each item will have a user
	mapping (uint => UploadObject) public uploadObjectIdToData;

	// add new entry
	function addDocument(address _from, string fileHash, string alias1, string alias2, string policyId, string capsule, string signedPublicKey, string alicePubKey) public returns(uint) {
		uploadObjectIdToData[currentId].customerAddress = _from;
		uploadObjectIdToData[currentId].fileHash = fileHash;
		uploadObjectIdToData[currentId].alias1 = alias1;
		uploadObjectIdToData[currentId].alias2 = alias2;
		uploadObjectIdToData[currentId].policyId = policyId;
		uploadObjectIdToData[currentId].capsule = capsule;
		uploadObjectIdToData[currentId].signedPublicKey = signedPublicKey;
		uploadObjectIdToData[currentId].alicePubKey = alicePubKey;

		// now settle relationships
		userAddressToUploadObjectIds[_from].push(currentId);

		currentId = currentId + 1;
		return currentId;
	}

	// get existing documents
	function getDocumentIds(address _address) public constant returns(uint[]) {
		return userAddressToUploadObjectIds[_address];
	}

	// get document data from document id
	function getDocument(uint id) public constant returns(string, string, string, string, string, string, string) {
			return (uploadObjectIdToData[id].fileHash, uploadObjectIdToData[id].alias1, uploadObjectIdToData[id].alias2, 
				uploadObjectIdToData[id].policyId, uploadObjectIdToData[id].capsule, uploadObjectIdToData[id].signedPublicKey, uploadObjectIdToData[id].alicePubKey);
	}
	
	function setLastSeen(address _address, string value) {
		userLastSeenMap[_address] = value;
	}

	function getLastSeen(address _address) public constant returns(string) {
		return userLastSeenMap[_address]; 	
	}

	// get document data from document id
	function getCustomerAddressByPolicyId(string policyId) public constant returns(address) {
		// traverse all items and get _from address 
		address customerAddress;
		for (uint index = 1; index <= currentId; index++) {
			if(keccak256(uploadObjectIdToData[index].policyId) == keccak256(policyId)) {
				customerAddress = uploadObjectIdToData[index].customerAddress;
			}
		}

		return customerAddress;
	}

	function getAliasesByPolicyId(string policyId) public constant returns(string, string) {
		// traverse all items and get _from address 
		string alias1;
		string alias2;
		for (uint index = 1; index <= currentId; index++) {
			if(keccak256(uploadObjectIdToData[index].policyId) == keccak256(policyId)) {
				alias1 = uploadObjectIdToData[index].alias1;
				alias2 = uploadObjectIdToData[index].alias2;
			}
		}

		return (alias1, alias2);
	}

	function getCurrentId() public constant returns(uint) {
		return currentId;
	}
}