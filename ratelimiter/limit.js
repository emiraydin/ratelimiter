var Limit = function(keyName, ttl, maxLimit) {

	// {sourceName} inside the key name will be replaced by actual source name
	// {userID} inside the key name will be replaced by actual user ID
	if (keyName)
		this.keyName = keyName;
	else
		throw new Error("You have to set a key name for this limit!");
	// Time to live, in seconds
	if (ttl)
		this.ttl = ttl;
	else
		throw new Error("You have to set a TTL for " + keyName);
	// Maximum count for this limit
	if (maxLimit)
		this.maxLimit = maxLimit;
	else
		throw new Error ("You have to set a max limit for " + keyName);
	
};

module.exports = Limit;
