var multiLimitTests = function() {

describe("Request with 1 limit hit", function() {

	beforeEach(function(done) {

		this.timeout(2000);

		// Clean all recordings
		redisClient.flushdb(function(err, res) {
			if (res === "OK") {

				blockedRequests = [];
				allowedRequests = [];

				// Make 101 requests
				for (var i = 0; i < 101; i++) {
					fitbit.request('123456', allow, block);
				};

				setTimeout(function() {
					done();
				}, 1000);	
			}
		});

	});


	it("1 request should not be allowed", function() {

		expect(blockedRequests.length).to.equal(1);

	});
});

describe("Request with 2 limit hits", function() {

	beforeEach(function(done) {

		this.timeout(3000);

		// Clean all recordings
		redisClient.flushdb(function(err, res) {
			if (res === "OK") {

				blockedRequests = [];
				allowedRequests = [];

				// Make 501 requests
				for (var i = 0; i < 501; i++) {
					fitbit.request('123456', allow, block);
				};

				setTimeout(function() {
					done();
				}, 2000);	
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

		this.timeout(5000);

		// Clean all recordings
		redisClient.flushdb(function(err, res) {
			if (res === "OK") {

				blockedRequests = [];
				allowedRequests = [];

				// Make 10001 requests
				for (var i = 0; i < 2001; i++) {
					fitbit.request('123456', allow, block);
				};

				setTimeout(function() {
					done();
				}, 4000);	
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