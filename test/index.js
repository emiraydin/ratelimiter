expect = require('chai').expect,
redis = require('redis'),
redisClient = redis.createClient(),
RateLimiter = require('../ratelimiter'),
limits = require('./data');

fitbit = new RateLimiter("fitbit", limits[0], redisClient);
jawbone = new RateLimiter("jawbone", limits[1], redisClient);

blockedRequests = [],
allowedRequests = [];

// These are the callbacks for block and allow request
block = function(uid, limits) {
	blockedRequests.push(limits);
};

allow = function(uid) {
	allowedRequests.push(uid);
};

var multiLimitTests = require('./lib/multilimit');

describe("Multi limit tests", function() {
	multiLimitTests();
});
