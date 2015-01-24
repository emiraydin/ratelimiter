var multiLimitTests = function() {

	describe("Request with 2 limit hits", function() {

		beforeEach(function(done) {

			this.timeout(AVERAGE_TIMEOUT*3);

			// Clean all recordings
			redisClient.flushdb(function(err, res) {
				if (res === "OK") {

					blockedRequests = [];
					allowedRequests = [];

					// Make 501 requests
					for (var i = 0; i < 501; i++) {
						fitbit.request('123456', allow, block);
					}

					setTimeout(function() {
						done();
					}, AVERAGE_TIMEOUT*2);	
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

			this.timeout(AVERAGE_TIMEOUT*5);

			// Clean all recordings
			redisClient.flushdb(function(err, res) {
				if (res === "OK") {

					blockedRequests = [];
					allowedRequests = [];

					// Make 10001 requests
					for (var i = 0; i < 2001; i++) {
						fitbit.request('123456', allow, block);
					}

					setTimeout(function() {
						done();
					}, AVERAGE_TIMEOUT*4);	
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