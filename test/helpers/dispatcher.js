// Dispatches requests for a single user
var singleUser = function(i, NUMBER_OF_CALLS, rateLimiter, finalCallback) {
	if (i < NUMBER_OF_CALLS) {
		rateLimiter.request('user1', function(err, res) {
			// If requests are blocked add them to the blockedRequests array
			// Otherwise add the uid to allowedRequests array
			if (err)
				blockedRequests.push(err.reachedLimits);
			else
				allowedRequests.push(res.uid);

			// If this is the last request, call the finalCallback
			if (i == NUMBER_OF_CALLS - 1)
				finalCallback();
			// Send the next request
			singleUser(i+1, NUMBER_OF_CALLS, rateLimiter, finalCallback);
		});
	}
};

// Dispatches requests for two users simultaneously
var twoUsers = function(i, NUMBER_OF_CALLS, rateLimiter, finalCallback) {
	if (i < NUMBER_OF_CALLS) {
		// If i is even, make the request for user1, make it for user2 otherwise
		if (i % 2 == 0) {

			rateLimiter.request('user1', function(err, res) {
				// If requests are blocked add them to the blockedRequests array
				// Otherwise add the uid to allowedRequests array
				if (err)
					blockedRequests.push(err.reachedLimits);
				else
					allowedRequests.push(res.uid);

				// If this is the last request, call the finalCallback
				if (i == NUMBER_OF_CALLS - 1)
					finalCallback();
				// Send the next request
				twoUsers(i+1, NUMBER_OF_CALLS, rateLimiter, finalCallback);
			});

		} else {

			rateLimiter.request('user2', function(err, res) {
				// If requests are blocked add them to the blockedRequests array
				// Otherwise add the uid to allowedRequests array
				if (err)
					blockedRequests.push(err.reachedLimits);
				else
					allowedRequests.push(res.uid);

				// If this is the last request, call the finalCallback
				if (i == NUMBER_OF_CALLS - 1)
					finalCallback();
				// Send the next request
				twoUsers(i+1, NUMBER_OF_CALLS, rateLimiter, finalCallback);
			});


		}
	}
};

// Dispatches requests for three users simultaneously
var threeUsers = function(i, NUMBER_OF_CALLS, rateLimiter, finalCallback) {
	if (i < NUMBER_OF_CALLS) {
		// If i is even, make the request for user1, make it for user2 otherwise
		if (i % 3 == 0) {

			rateLimiter.request('user1', function(err, res) {
				// If requests are blocked add them to the blockedRequests array
				// Otherwise add the uid to allowedRequests array
				if (err)
					blockedRequests.push(err.reachedLimits);
				else
					allowedRequests.push(res.uid);

				// If this is the last request, call the finalCallback
				if (i == NUMBER_OF_CALLS - 1)
					finalCallback();
				// Send the next request
				threeUsers(i+1, NUMBER_OF_CALLS, rateLimiter, finalCallback);
			});

		} else if (i % 3 == 1) {

			rateLimiter.request('user2', function(err, res) {
				// If requests are blocked add them to the blockedRequests array
				// Otherwise add the uid to allowedRequests array
				if (err)
					blockedRequests.push(err.reachedLimits);
				else
					allowedRequests.push(res.uid);

				// If this is the last request, call the finalCallback
				if (i == NUMBER_OF_CALLS - 1)
					finalCallback();
				// Send the next request
				threeUsers(i+1, NUMBER_OF_CALLS, rateLimiter, finalCallback);
			});

		} else { // i % 3 == 2

			rateLimiter.request('user3', function(err, res) {
				// If requests are blocked add them to the blockedRequests array
				// Otherwise add the uid to allowedRequests array
				if (err)
					blockedRequests.push(err.reachedLimits);
				else
					allowedRequests.push(res.uid);

				// If this is the last request, call the finalCallback
				if (i == NUMBER_OF_CALLS - 1)
					finalCallback();
				// Send the next request
				threeUsers(i+1, NUMBER_OF_CALLS, rateLimiter, finalCallback);
			});

		}
	}
};

var dispatchers = {
	singleUser: singleUser,
	twoUsers: twoUsers,
	threeUsers: threeUsers
};

module.exports = dispatchers;
