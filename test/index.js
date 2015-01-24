expect = require('chai').expect,
redis = require('redis'),
redisClient = redis.createClient(),
RateLimiter = require('../ratelimiter'),
limits = require('./data');

rateLimiter = new RateLimiter("fitbit", limits, redisClient);

blockedRequests = [],
	allowedRequests = [];

block = function(uid, limits) {
	blockedRequests.push(limits);
};

allow = function(uid) {
	allowedRequests.push(uid);
};

var multiLimitTests = require('./lib/multilimit');

multiLimitTests();
