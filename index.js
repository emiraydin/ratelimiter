var RateLimiter = require('./ratelimiter');
var Limit = require('./ratelimiter/limit');

// Create new limits
var l1 = new Limit("{sourceName}:global:daily", 86400, 50000);
var l2 = new Limit("{sourceName}:global:hourly", 3600, 10000);
var l3 = new Limit("{sourceName}:{userID}:daily", 86400, 500);
var l4 = new Limit("{sourceName}:{userID}:hourly", 3600, 100);

// Create a rate limiter and give as input the created limits
var rl = new RateLimiter("fitbit", [l1,l2,l3,l4]);

// This function will be called if the rate limiter blocks the request
var blocked = function(uid, limits) {
	// Add the request to retry scheduler or something
	console.log("REQUEST NOT ALLOWED for user: " + uid + " | LIMIT(s) REACHED: " + limits);
};

// This function will be called if rate limiter allows the request
var allowed = function(uid) {
	// Let the request go through
	console.log("REQUEST ALLOWED for user: " + uid);
};

// Send some requests to the rate limiter
rl.request('123456', allowed, blocked);
rl.request('123456', allowed, blocked);
rl.request('123456', allowed, blocked);
rl.request('123456', allowed, blocked);
rl.request('123456', allowed, blocked);
