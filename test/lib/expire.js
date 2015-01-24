var expireTests = function() {

	describe("Request with limit TTL = 1 second", function() {

		beforeEach(function(done) {

			this.timeout(3000);

			// Clean all recordings
			redisClient.flushdb(function(err, res) {
				if (res === "OK") {

					blockedRequests = [];
					allowedRequests = [];

					// Make 10 requests
					for (var i = 0; i < 10; i++) {
						jawbone.request('123456', allow, block);
					}

					// Make 10 requests, exactly 1.5 seconds after that
					setTimeout(function() {
						for (var i = 0; i < 10; i++) {
							jawbone.request('123456', allow, block);
						}
					}, 1500)

					// Finish test
					setTimeout(function() {
						done();
					}, 2500);	
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

			this.timeout(5000);

			// Clean all recordings
			redisClient.flushdb(function(err, res) {
				if (res === "OK") {

					blockedRequests = [];
					allowedRequests = [];

					// Make 501 requests
					for (var i = 0; i < 501; i++) {
						jawbone.request('123456', allow, block);
					}

					setTimeout(function() {
						blockedRequestsInFirstCall = blockedRequests.length;
					}, 2000);

					// Make 10 requests, exactly 1 second after expiration
					setTimeout(function() {
						for (var i = 0; i < 5; i++) {
							jawbone.request('123456', allow, block);
						}
					}, 4000);

					// Finish test
					setTimeout(function() {
						blockedRequestsInSecondCall = blockedRequests.length;
						done();
					}, 4500);
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