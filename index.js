var GLOBAL_DAILY_LIMIT = 50000;
var GLOBAL_HOURLY_LIMIT = 10000;
var USER_DAILY_LIMIT = 500;
var USER_HOURLY_LIMIT = 3;

var RateLimiter = require('./ratelimiter');

var rl = new RateLimiter("fitbit", GLOBAL_DAILY_LIMIT, GLOBAL_HOURLY_LIMIT, USER_DAILY_LIMIT, USER_HOURLY_LIMIT);

var blocked = function(limits) {
	// Add the request to retry scheduler or something
	console.log("LIMIT REACHED! Type: " + limits);
};

var allowed = function(uid) {
	// Let the request go through
	console.log("REQUEST ALLOWED for user: " + uid);
};

rl.call('123456', allowed, blocked);
