var Limit = function(keyName, ttl, maxLimit) {

	// {sourceName} inside the key name will be replaced by actual source name
	// {userID} inside the key name will be replaced by actual user ID
	this.keyName = keyName || "undefinedKey";
	// Time to live, in seconds
	this.ttl = ttl;
	// Maximum count for this limit
	this.maxLimit = maxLimit;
	
};

module.exports = Limit;
