var redis = require('redis'),
	client = redis.createClient();

var RateLimiter = function(sourceName, globalDailyLimit, globalHourlyLimit, userDailyLimit, userHourlyLimit) {

	// Initialize instance variables
	this.sourceName = sourceName || "undefinedSource";
	this.globalDailyLimit = globalDailyLimit || Number.MAX_VALUE;
	this.globalHourlyLimit = globalHourlyLimit || Number.MAX_VALUE;
	this.userDailyLimit = userDailyLimit || Number.MAX_VALUE;
	this.userHourlyLimit = userHourlyLimit || Number.MAX_VALUE;

	// Initialize key names
	var globalDailyKey = sourceName + ":global:daily";
	var globalHourlyKey = sourceName + ":global:hourly";
	var userDailyKey = sourceName + ":" + userID + ":daily";
	var userHourlyKey = sourceName + ":" + userID + ":hourly";

	// Handles requests coming into rate limiter
	// If the request with userID is allowed, callback_allowed is called
	// Otherwise callback_blocked is called
	this.request = function(userID, callback_allowed, callback_blocked) {

		// Increment the rate limiter count
		this.increment(userID);

	};

	// Increments Redis bucket counters for given userID
	this.increment = function(userID) {

		// Start multi for atomicity
		var multi = client.multi();

		// Initialize key names
		var globalDailyKey = this.sourceName + ":global:daily";
		var globalHourlyKey = this.sourceName + ":global:hourly";
		var userDailyKey = this.sourceName + ":" + userID + ":daily";
		var userHourlyKey = this.sourceName + ":" + userID + ":hourly";

		// Increment global daily key
		multi.setnx(globalDailyKey, 0)
			.incr(globalDailyKey)
			.ttl(globalDailyKey, function(err, res) {
				if (res < 0)
					client.expire(globalDailyKey, 86400);
			});

		// Increment global hourly key
		multi.setnx(globalHourlyKey, 0)
			.incr(globalHourlyKey)
			.ttl(globalHourlyKey, function(err, res) {
				if (res < 0)
					client.expire(globalHourlyKey, 3600);
			});

		// Increment user daily key
		multi.setnx(userDailyKey, 0)
			.incr(userDailyKey)
			.ttl(userDailyKey, function(err, res) {
				if (res < 0)
					client.expire(userDailyKey, 86400);
			});

		// Increment user hourly key
		multi.setnx(userHourlyKey, 0)
			.incr(userHourlyKey)
			.ttl(userHourlyKey, function(err, res) {
				if (res < 0)
					client.expire(userHourlyKey, 3600);
			});

		// Execute multi
		multi.exec(function(err, res) {
			// console.log('call recorded for user ' + userID);
			});


	};


};

module.exports = RateLimiter;