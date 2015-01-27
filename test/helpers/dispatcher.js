// Dispatches requests based on total number of calls
var singleUser = function(i, NUMBER_OF_CALLS, rateLimiter, finalCallback) {
	if (i < NUMBER_OF_CALLS) {
		rateLimiter.request('123456', function(err, res) {
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