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
	this.request = function(userID, callback) {

		var _this = this;

		// Start multi for an atomic transaction
		var multi = redisClient.multi();

		var requestKeyNames = [];

		limits.forEach(function(limit) {

			// Replace the source name and user ID with actual values in the key name
			var key = limit.keyName.replace('{sourceName}', _this.sourceName)
									.replace('{userID}', userID);
			requestKeyNames.push(key);

			// Increment the counter and get TTL (set if it doesn't exist)
			multi.incr(key)
				.ttl(key, function(err,res) {
					// Set expire value if it isn't set
					if (res < 0)
						redisClient.expire(key, limit.ttl);
				})

		});

		// Execute multi
		multi.exec(function(err, res) {

			if (err)
				throw new Error("An error occured. Request was not recorded.");

			// Check all limits
			for (var i = 0; i < limits.length; i++) {
				// Response has indices of multiples of 2
				// This is because of 2 multi calls per limit (incr and ttl)
				if (res[i*2] > limits[i].maxCalls) {
					// add to limits if not already added
					if (_this.reachedLimits.indexOf(requestKeyNames[i]) < 0)
						_this.reachedLimits.push(requestKeyNames[i]);
				}
			}

			// Call the given callback functions depending on whether there is a reached limit
			if (_this.reachedLimits.length) {
				var err = {
					message: "Limit(s) reached! Request not allowed.",
					uid: userID,
					reachedLimits: _this.reachedLimits
				};
				callback(err, false);
			} else {
				var res = {
					message: "Request allowed.",
					uid: userID
				};
				callback(false, res);
			}

			// Clear reached limits
			_this.reachedLimits = new Array();
		});

	};


};

module.exports = RateLimiter;
