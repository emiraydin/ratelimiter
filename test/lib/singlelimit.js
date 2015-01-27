var singleLimitTests = function() {

	describe("Request with 1 limit hit", function() {

		beforeEach(function(done) {

			// Clean all recordings
			redisClient.flushdb(function(err, res) {
				if (res === "OK") {

					blockedRequests = [];
					allowedRequests = [];

					// Make 101 requests
					dispatcher.singleUser(0, 101, fitbit, function() {
						done();
					});
				}
			});

		});


		it("1 request should not be allowed", function() {

			expect(blockedRequests.length).to.equal(1);

		});
	});

};

module.exports = singleLimitTests;