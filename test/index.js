var REDIS_PORT = 6379,
	REDIS_HOST = "127.0.0.1";

expect = require('chai').expect,
redis = require('redis'),
redisClient = redis.createClient(REDIS_PORT, REDIS_HOST),
RateLimiter = require('../lib/ratelimiter'),
limits = require('./data');

// Initialize two different rate limiters with different limits
fitbit = new RateLimiter("fitbit", limits[0], redisClient);
jawbone = new RateLimiter("jawbone", limits[1], redisClient);

// Allowed and blocked requests will be stored in these arrays
blockedRequests = [],
allowedRequests = [];

// These are the callbacks for block and allow request
block = function(uid, limits) {
	blockedRequests.push(limits);
};

allow = function(uid) {
	allowedRequests.push(uid);
};

// Set average timeout for tests
AVERAGE_TIMEOUT = 1000;

// Run all the tests
var singleLimitTests = require('./lib/singlelimit'),
	multiLimitTests = require('./lib/multilimit'),
	expireTests = require('./lib/expire');

describe("Single limit tests", function() {
	singleLimitTests();
})

describe("Multi limit tests", function() {
	multiLimitTests();
});

describe("Expire tests", function() {
	expireTests();
});
