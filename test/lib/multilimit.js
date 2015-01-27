var multiLimitTests = function() {

	describe("Request with 2 limit hits", function() {

		beforeEach(function(done) {

			// Clean all recordings
			redisClient.flushdb(function(err, res) {
				if (res === "OK") {

					blockedRequests = [];
					allowedRequests = [];

					// Make 501 requests
					requestDispatcher(0, 501, 1, fitbit, function() {
						done();
					});

				}
			});

		});

		it("401 requests should not be allowed", function() {

			expect(blockedRequests.length).to.equal(401);

		});

		it("Last request should have two limit hits", function() {

			expect(blockedRequests[blockedRequests.length-1].length).to.equal(2);

		});
	});

	describe("Request with 3 limit hits", function() {

		beforeEach(function(done) {

			// Clean all recordings
			redisClient.flushdb(function(err, res) {
				if (res === "OK") {

					blockedRequests = [];
					allowedRequests = [];

					// Make 2001 requests
					requestDispatcher(0, 2001, 1, fitbit, function() {
						done();
					});
				}
			});

		});

		it("1901 requests should not be allowed", function() {

			expect(blockedRequests.length).to.equal(1901);

		});

		it("501 to 2000th requests should have two limit hits", function() {

			expect(blockedRequests[501].length).to.equal(2);

		});

		it("Last request should have three limit hits", function() {

			expect(blockedRequests[blockedRequests.length-1].length).to.equal(3);

		});
	});

};

module.exports = multiLimitTests;