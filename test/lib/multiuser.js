var multiUserTests = function() {

	describe("Simultaneous requests for 2 users", function() {

		var blockedRequestsAfterFirstCall = 0;

		beforeEach(function(done) {

			// Clean all recordings
			redisClient.flushdb(function(err, res) {
				if (res === "OK") {

					blockedRequests = [];
					allowedRequests = [];

					// Make 201 requests
					requestDispatcher(0, 201, 2, fitbit, function() {
						blockedRequestsAfterFirstCall = blockedRequests.length;
						requestDispatcher(0, 801, 2, fitbit, function() {
							done();
						});
					});

				}
			});

		});

		it("One user hits per user hourly limit", function() {
			expect(blockedRequestsAfterFirstCall).to.equal(1);
		});

		it("One user hits per user hourly and daily limit", function() {
			expect(blockedRequests[blockedRequests.length-1].length).to.equal(2);
		});

	});

	describe("Simultaneous requests for 3 users", function() {

		var blockedRequestsAfterFirstCall = 0;

		beforeEach(function(done) {

			// Clean all recordings
			redisClient.flushdb(function(err, res) {
				if (res === "OK") {

					blockedRequests = [];
					allowedRequests = [];

					// Make 201 requests
					requestDispatcher(0, 301, 3, fitbit, function() {
						blockedRequestsAfterFirstCall = blockedRequests.length;
						requestDispatcher(0, 1700, 3, fitbit, function() {
							done();
						});
					});

				}
			});

		});

		it("One user hits per user hourly limit", function() {
			expect(blockedRequestsAfterFirstCall).to.equal(1);
		});

		it("Users hit global limit, per user hourly and per user daily limit", function() {
			expect(blockedRequests[blockedRequests.length-1].length).to.equal(3);
		});

	});
	
};

module.exports = multiUserTests;
