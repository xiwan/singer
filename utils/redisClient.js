var redis = require("redis"),
    redisClient = redis.createClient({
    	host: '118.89.146.97',
    	port: 6379,
    });

redisClient.on("error", function (err) {
    console.log("Error " + err);
});

module.exports = redisClient;