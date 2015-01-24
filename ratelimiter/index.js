var RateLimiter = function(sourceName, limits, redisClient) {

	// Initialize instance variables
	this.sourceName = sourceName || "undefinedSource";

	// Keep track of reached limits
	this.reachedLimits = new Array();

	// Handles requests coming into rate limiter
	// Increments rate limit counters at once atomically, checks within the same call
	// If the request with userID is allowed, callbackAllow is called
	// Otherwise callbackBlock is called
	// this.request = function(userID, callbackAllow, callbackBlock) {
	this.request = function(userID, callbackAllow, callbackBlock) {

		var _this = this;

		// Start multi for an atomic transaction
		var multi = redisClient.multi();

		limits.forEach(function(limit) {

			// Replace the source name and user ID with actual values in the key name
			limit.keyName = limit.keyName.replace('{sourceName}', _this.sourceName)
									.replace('{userID}', userID);

			// Increment the counter and get TTL (set if it doesn't exist)
			multi.incr(limit.keyName)
				.ttl(limit.keyName, function(err,res) {
					// Set expire value if it isn't set
					if (res < 0)
						redisClient.expire(limit.keyName, limit.ttl);
				})

		});

		// Execute multi
		multi.exec(function(err, res) {

			if (err)
				console.log('An error occured. Request was not recorded.');

			// Check all limits
			for (var i = 0; i < limits.length; i++) {
				// Response has indices of multiples of 2
				// This is because of 2 multi calls per limit (incr and ttl)
				if (res[i*2] > limits[i].maxCalls) {
					// add to limits if not already added
					if (_this.reachedLimits.indexOf(limits[i].keyName) < 0)
						_this.reachedLimits.push(limits[i].keyName);
				}
			}

			// Call the given callback functions depending on whether there is a reached limit
			if (_this.reachedLimits.length)
				callbackBlock(userID, _this.reachedLimits);
			else
				callbackAllow(userID);

			// Clear reached limits
			_this.reachedLimits = new Array();
		});

	};


};

module.exports = RateLimiter;
