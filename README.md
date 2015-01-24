# Rate Limiter for Outgoing Requests
This is a rate limiter application built for outgoing requests to API services.
It is built with Node.js and Redis.

* **Author:** Emir Aydin
* **Email:** emir@emiraydin.com
* **github**: [emiraydin](http://github.com/emiraydin)

## Before Starting
1. Please make sure you have [Node.js](http://nodejs.org/download/) installed on your development environment.
2. Please make sure you have a [Redis client](http://redis.io/download) installed on your development environment.
3. Once you clone this repository, run `npm install` on your command line to get all the dependencies.

## How to Run this Application
If you look at `index.js` in the root of the repository, you will see sample code for this application.
To run the application with this sample code, navigate to the repository root and run `node index` in your command line.

## Customizing the Application
In a nutshell, you have to create new instances of `Limit` object for each of your rate limits and then pass these limits as a list to an instance of `RateLimiter` object along with a Redis client. Each class is explained in detail below.

### 1. Limit (keyName, ttl, maxCalls)
* **keyName** is the name of the keys that will be stored in Redis. Inside your key name, you can use two placeholders:
    1. `{sourceName}`: This will be replaced with the actual source name later on during the execution.
    2. `{userID}`: This will be replaced with the actual user ID for that call later on during the execution.
* **TTL** is the time to live for the limit in seconds. i.e. 3600 four hourly, 86400 for daily limits
* **maxCalls** is the maximum number of calls allowed for the limit.

**Example:** A daily rate limit (TTL=86400 seconds) with 500 calls per user.
`var l = new Limit("{sourceName}:{userID}:daily", 86400, 500);`

### 2. RateLimiter (sourceName, limits, redisClient)
* **sourceName** is the name of the source. i.e. Fitbit
* **limits** is an array of `Limit` object instances
* **redisClient** is an instance of a redis client

## How Does It Work
1. When a request comes into the rate limiter for the first time, a key is created with given TTL and a counter that is also incremented.
2. Any request that comes into the rate limiter after that will only increment the existing key's value. Within the same call, rate limiter will also check the incremented value if it exceeds the provided limit. If so, it calls the given callback that might in return add the request into retry scheduler. If it doesn't exceed the provided limit, it will then call the given callback which will allow the request.
3. After given TTL, each key will expire and new ones will be created only if another request is made after the initial key expired. So this minimizes number of information we have to store.

## Design Decisions Made
I had to take a few important things into account when building this application:

**1. Response time should be as fast as possible**
* I chose an in-memory database, Redis, to ensure faster I/O.
* I minimized number of trips to Redis using a single pipelined call and getting increment value with the same call. So there is only one trip made to Redis for each call to the rate limiter.

**2. The amount of data that is stored should be minimum**
* This was especially important considering we're using an in-memory database.
* When a request is sent to rate limiter for the first time, it will create a key for it with an expiration time. Once the key expires, there won't be any key stored for that user, unless she makes another call.

**3. Request data should be saved atomically and be persistent**
* Redis provides different ranges of persistence options.
* I pipelined calls to Redis using `multi/exec` in order to execute only one atomic transaction per each call.

**4. Be able to live in a distributed environment**
* Decision above (#3) also influenced this one.
* Redis can be used to avoid race conditions by using locks and atomic increment operations which also return the result of the increment after the same call.
* Redis supports partioning.
* There can be different instances of the RateLimiter object running, but they will all have access to the same traffic info.

**5. Number and type of limits should be flexible**
* Users can create limits as they wish providing different time ranges and maximum calls.
* So there is no fixed hierarchy: Limits per X seconds, minutes, hours, days, all are  possible.
