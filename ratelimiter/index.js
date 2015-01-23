var RateLimiter = function(sourceName, globalDailyLimit, globalHourlyLimit, userDailyLimit, userHourlyLimit) {

	// Initialize instance variables
	this.sourceName = sourceName || "undefinedSource";
	this.globalDailyLimit = globalDailyLimit || Number.MAX_VALUE;
	this.globalHourlyLimit = globalHourlyLimit || Number.MAX_VALUE;
	this.userDailyLimit = userDailyLimit || Number.MAX_VALUE;
	this.userHourlyLimit = userHourlyLimit || Number.MAX_VALUE;

	// Handles requests coming into rate limiter
	// If the request with userID is allowed, callback_allowed is called
	// Otherwise callback_blocked is called
	this.request = function(userID, callback_allowed, callback_blocked) {

	};

	// Increments Redis bucket counters for given userID
	this.increment = function(userID) {

	};


};

module.exports = RateLimiter;