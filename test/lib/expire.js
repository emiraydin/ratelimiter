var expireTests = function() {

	describe("Request with limit TTL = 1 second", function() {

		beforeEach(function(done) {

			// Clean all recordings
			redisClient.flushdb(function(err, res) {
				if (res === "OK") {

					blockedRequests = [];
					allowedRequests = [];

					// Make 10 requests
					dispatcher.singleUser(0, 10, jawbone, function() {

						// Make 10 requests exactly 1 second after that
						setTimeout(function() {
							dispatcher.singleUser(0, 10, jawbone, function() {
								done();
							}, 1000);
						});

					});

				}
			});

		});


		it("All requests should be allowed", function() {

			expect(blockedRequests.length).to.equal(0);

		});
	});


	describe("Request with limit TTL = 3 seconds", function() {

		var blockedRequestsInFirstCall = 0,
			blockedRequestsInSecondCall = 0;

		// Alter the rate limiter slightly, removing strict limits
		jawbone = new RateLimiter("jawbone", [limits[1][0], limits[1][1]], redisClient);

		beforeEach(function(done) {

			this.timeout(4000);

			// Clean all recordings
			redisClient.flushdb(function(err, res) {
				if (res === "OK") {

					blockedRequests = [];
					allowedRequests = [];

					// Make 501 requests
					dispatcher.singleUser(0, 501, jawbone, function() {
						blockedRequestsInFirstCall = blockedRequests.length;
						// Make 5 requests, 3 seconds after the first one
						setTimeout(function() {
							dispatcher.singleUser(0, 5, jawbone, function() {
								blockedRequestsInSecondCall = blockedRequests.length;
								done();
							})
						}, 3000);
					});

				}
			});

		});


		it("One request should be blocked in first call", function() {

			expect(blockedRequestsInFirstCall).to.equal(1);

		});

		it("All requests should be allowed in second call", function() {

			expect(blockedRequestsInSecondCall).to.equal(blockedRequestsInFirstCall);

		});
	});

	
};

module.exports = expireTests;
