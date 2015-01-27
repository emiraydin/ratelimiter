// Dispatches requests for given number of calls and users, then calls the final callback
var requestDispatcher = function(i, NUMBER_OF_CALLS, NUMBER_OF_USERS, rateLimiter, finalCallback) {
	if (i < NUMBER_OF_CALLS) {
		var userID = "user-" + (i % NUMBER_OF_USERS);
		rateLimiter.request(userID, function(err, res) {
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
			requestDispatcher(i+1, NUMBER_OF_CALLS, NUMBER_OF_USERS, rateLimiter, finalCallback);
		});
	}
};

module.exports = requestDispatcher;
