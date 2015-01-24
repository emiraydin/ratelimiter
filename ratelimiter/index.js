var redis = require('redis'),
	client = redis.createClient(),
	async = require('async');

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
	// If the request with userID is allowed, callback_allowed is called
	// Otherwise callback_blocked is called
	this.request = function(userID, callback_allowed, callback_blocked) {

		// Increment the rate limiter count
		this.increment(userID);

		// Initialize key names
		var globalDailyKey = sourceName + ":global:daily";
		var globalHourlyKey = sourceName + ":global:hourly";
		var userDailyKey = sourceName + ":" + userID + ":daily";
		var userHourlyKey = sourceName + ":" + userID + ":hourly";

		var _this = this;

		var checkUserHourlyKey = function(callback) {
			client.get(userHourlyKey, function(err, res) {
				if (res > _this.userHourlyLimit) {
					if (_this.reachedLimits.indexOf(userHourlyKey) < 0)
						_this.reachedLimits.push(userHourlyKey);
				}
				callback();
			});		
		};

		var checkGlobalHourlyKey = function(callback) {
			client.get(globalHourlyKey, function(err, res) {
				if (res > _this.globalHourlyLimit) {
					if (_this.reachedLimits.indexOf(globalHourlyKey) < 0)
						_this.reachedLimits.push(globalHourlyKey);
				}
				callback();
			});
		};

		var checkUserDailyKey = function(callback) {
			client.get(userDailyKey, function(err, res) {
				if (res > _this.userDailyLimit) {
					if (_this.reachedLimits.indexOf(userDailyKey) < 0)
						_this.reachedLimits.push(userDailyKey);
				}
				callback();
			});		
		};

		var checkGlobalDailyKey = function(callback) {
			client.get(globalDailyKey, function(err, res) {
				if (res > _this.globalDailyLimit) {
					if (_this.reachedLimits.indexOf(globalDailyKey) < 0)
						_this.reachedLimits.push(globalDailyKey);
				}
				callback();
			});		
		};		

		async.parallel([checkUserHourlyKey, checkGlobalHourlyKey, checkUserDailyKey, checkGlobalDailyKey],
			function() {

				if (_this.reachedLimits.length > 0) {
					callback_blocked(_this.reachedLimits);
				} else {
					callback_allowed(userID);
				}

		});

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

		// Execute multi
		multi.exec(function(err, res) {

			if (err)
				console.log('An error occured. Request not recorded.');

		});

	};


};

module.exports = RateLimiter;
