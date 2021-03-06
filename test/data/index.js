var Limit = require('../../lib/limit');

// First limit set for single, multi limit and multi user tests
var l1 = new Limit("{sourceName}:global:daily", 86400, 4000),
	l2 = new Limit("{sourceName}:global:hourly", 3600, 2000),
	l3 = new Limit("{sourceName}:{userID}:daily", 86400, 500),
	l4 = new Limit("{sourceName}:{userID}:hourly", 3600, 100);

// Second limit set for expire tests
var l5 = new Limit("{sourceName}:global:5second", 5, 2000),
	l6 = new Limit("{sourceName}:global:3second", 3, 500),
	l7 = new Limit("{sourceName}:{userID}:3second", 3, 100),
	l8 = new Limit("{sourceName}:{userID}:1second", 1, 10);

var limits = [[l1,l2,l3,l4],[l5,l6,l7,l8]];

module.exports = limits;