var constant = require('../utils/const.js');

var redis = require("redis");
var redisClient = redis.createClient({
    	host: constant.redis.host,
    	port: constant.redis.port,
    });

redisClient.on("error", function (err) {
    console.log("Error " + err);
});

module.exports = redisClient;