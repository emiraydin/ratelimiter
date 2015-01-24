var Limit = require('../../ratelimiter/limit');

var l1 = new Limit("{sourceName}:global:daily", 86400, 4000);
var l2 = new Limit("{sourceName}:global:hourly", 3600, 2000);
var l3 = new Limit("{sourceName}:{userID}:daily", 86400, 500);
var l4 = new Limit("{sourceName}:{userID}:hourly", 3600, 100);

var limits = [l1,l2,l3,l4];

module.exports = limits;