// List all imports
var RateLimiter = require('./lib/ratelimiter'),
	Limit = require('./lib/limit'),
	redis = require('redis');

// Create new limits
// l1 = daily limit of 50,000 calls across all users
// l2 = hourly limit of 10,000 calls across all users
// l3 = daily limit of 500 calls per user
// l4 = hourly limit of 100 calls per user
var l1 = new Limit("{sourceName}:global:daily", 86400, 50000),
	l2 = new Limit("{sourceName}:global:hourly", 3600, 200),
	l3 = new Limit("{sourceName}:{userID}:daily", 86400, 500),
	l4 = new Limit("{sourceName}:{userID}:hourly", 3600, 100);

// Create a client for Redis
var REDIS_PORT = 6379,
	REDIS_HOST = "127.0.0.1",
	redisClient = redis.createClient(REDIS_PORT, REDIS_HOST);

// Create a rate limiter and give as input the created limits and Redis client
var rl = new RateLimiter("fitbit", [l1,l2,l3,l4], redisClient);

// Send requests one after another for a single user
var requestDispatcher = function(i, NUMBER_OF_CALLS) {
	if (i < NUMBER_OF_CALLS) {
		rl.request('123456', function(err, res) {
			if (err)
				console.log("REQUEST NOT ALLOWED for user: " +
					err.uid + " | LIMIT(s) REACHED: " + err.reachedLimits);
			else
				console.log("REQUEST ALLOWED for user: " + res.uid);
			// Send the next request
			requestDispatcher(i+1, NUMBER_OF_CALLS);
		});
	}
};

// Send requests for two users one after another
var simultaneousRequestDispatcher = function(i, NUMBER_OF_CALLS) {

	if (i < NUMBER_OF_CALLS) {
		// If i is even, send request as user1, send it as user2 otherwise
		if (i % 2 == 0) {
			rl.request('user1', function(err, res) {
				if (err)
					console.log("REQUEST #" + (i+1) + " IS NOT ALLOWED for user: " +
						err.uid + " | LIMIT(s) REACHED: " + err.reachedLimits);
				else
					console.log("REQUEST #" + (i+1) + " IS ALLOWED for user: " + res.uid);
			});
		} else {
			rl.request('user2', function(err, res) {
				if (err)
					console.log("REQUEST #" + (i+1) + " IS NOT ALLOWED for user: " +
						err.uid + " | LIMIT(s) REACHED: " + err.reachedLimits);
				else
					console.log("REQUEST #"+ (i+1) + " IS ALLOWED for user: " + res.uid);				
			});
		}
		// Send the next request
		simultaneousRequestDispatcher(i+1, NUMBER_OF_CALLS);
	}

};

// Start sending the requests
// requestDispatcher(0, 201);

simultaneousRequestDispatcher(0, 201);
