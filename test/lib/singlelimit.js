var singleLimitTests = function() {

	describe("Request with 1 limit hit", function() {

		beforeEach(function(done) {

			this.timeout(AVERAGE_TIMEOUT*2);

			// Clean all recordings
			redisClient.flushdb(function(err, res) {
				if (res === "OK") {

					blockedRequests = [];
					allowedRequests = [];

					// Make 101 requests
					for (var i = 0; i < 101; i++) {
						fitbit.request('123456', allow, block);
					}

					setTimeout(function() {
						done();
					}, AVERAGE_TIMEOUT);	
				}
			});

		});


		it("1 request should not be allowed", function() {

			expect(blockedRequests.length).to.equal(1);

		});
	});

};

module.exports = singleLimitTests;