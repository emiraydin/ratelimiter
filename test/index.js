var REDIS_PORT = 6379,
	REDIS_HOST = "127.0.0.1";

expect = require('chai').expect,
assert = require('chai').assert,
Limit = require('../lib/limit'),
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

requestDispatcher = require('./helpers/dispatcher');

// Run all the tests
var singleLimitTests = require('./lib/singlelimit'),
	multiLimitTests = require('./lib/multilimit'),
	expireTests = require('./lib/expire'),
	multiUserTests = require('./lib/multiuser'),
  errorHandlingTests = require('./lib/errorhandling');

describe("Single limit tests", function() {
	singleLimitTests();
})

describe("Multi limit tests", function() {
	multiLimitTests();
});

describe("Expire tests", function() {
	expireTests();
});

describe("Multi user tests", function() {
	multiUserTests();
});

describe("Error handling tests", function() {
  errorHandlingTests();
})
