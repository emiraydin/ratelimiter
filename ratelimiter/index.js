var redis = require('redis'),
	client = redis.createClient();

var RateLimiter = function(sourceName, globalDailyLimit, globalHourlyLimit, userDailyLimit, userHourlyLimit) {

	// Initialize instance variables
	this.sourceName = sourceName || "undefinedSource";
	this.globalDailyLimit = globalDailyLimit || Number.MAX_VALUE;
	this.globalHourlyLimit = globalHourlyLimit || Number.MAX_VALUE;
	this.userDailyLimit = userDailyLimit || Number.MAX_VALUE;
	this.userHourlyLimit = userHourlyLimit || Number.MAX_VALUE;

	// Keep track of reached limits
	this.reachedLimits = new Array();

	// Handles requests coming into rate limiter
	// Increments rate limit counters at once atomically, checks within the same call
	// If the request with userID is allowed, callback_allowed is called
	// Otherwise callback_blocked is called
	// this.request = function(userID, callback_allowed, callback_blocked) {
	this.request = function(userID, callback_allowed, callback_blocked) {

		// Start multi for atomicity
		var multi = client.multi();

		// Initialize key names
		var globalDailyKey = this.sourceName + ":global:daily";
		var globalHourlyKey = this.sourceName + ":global:hourly";
		var userDailyKey = this.sourceName + ":" + userID + ":daily";
		var userHourlyKey = this.sourceName + ":" + userID + ":hourly";

		// Increment global daily key
		multi.incr(globalDailyKey)
			.ttl(globalDailyKey, function(err, res) {
				if (res < 0)
					client.expire(globalDailyKey, 86400);
		});

		// Increment global hourly key
		multi.incr(globalHourlyKey)
			.ttl(globalHourlyKey, function(err, res) {
				if (res < 0)
					client.expire(globalHourlyKey, 3600);
		});

		// Increment user daily key
		multi.incr(userDailyKey)
			.ttl(userDailyKey, function(err, res) {
				if (res < 0)
					client.expire(userDailyKey, 86400);
		});

		// Increment user hourly key
		multi.incr(userHourlyKey)
			.ttl(userHourlyKey, function(err, res) {
				if (res < 0)
					client.expire(userHourlyKey, 3600);
		});

		// List all the limits with their keys
		var limits = [
					[globalDailyKey, this.globalDailyLimit],
					[globalHourlyKey, this.globalHourlyLimit],
					[userDailyKey, this.userDailyLimit],
					[userHourlyKey, this.userHourlyLimit]
					 ];
		var _this = this;

		// Execute multi
		multi.exec(function(err, res) {

			if (err)
				console.log('An error occured. Request not recorded.');

			// Check all limits
			for (var i = 0; i < 4; i++) {
				if (res[i*2] > limits[i][1]) {
					// add to limits if not already added
					if (_this.reachedLimits.indexOf(limits[i][0]) < 0)
						_this.reachedLimits.push(limits[i][0]);
				}
			}

			// If there are some reached limits, then block the call, otherwise allow
			if (_this.reachedLimits.length)
				callback_blocked(_this.reachedLimits);
			else
				callback_allowed(userID);
		});

	};


};

module.exports = RateLimiter;
