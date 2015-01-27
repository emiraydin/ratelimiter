// Dispatches requests based on total number of calls
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

var dispatchers = {

	singleUser: singleUser

};

module.exports = dispatchers;