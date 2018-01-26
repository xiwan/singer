var express = require('express');
var router = express.Router();
var _ = require('lodash');
var async = require('async');

var utils = require('../utils/utils.js');
var constant = require('../utils/const.js');
var masterdata = require('../utils/masterdata.js');
var redisClient = require('../utils/redisClient.js');

module.exports = router;
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/tips', function(req, res, next){
	utils.protectBlock(function(req, res, next){
		var data = req.body;
		var songId = data.songId;
		var singerId = utils.validateParam(data.singerId);
		var giftId = utils.validateParam(data.giftId);
		var openkey = utils.validateParam(data.openkey);
		var openid = utils.validateParam(data.openid);

		var itemApiPath = utils.getItemApiPath(req.app.get('env'));
		var cmd =  1;
		var mask = 1;
		var params = [
		  	  {'key': 'cmd', 'value': cmd}, 
		  	  {'key': 'mask', 'value': mask}, 
			  {'key': 'appid', 'value': constant.app.id}, 
			  {'key': 'gameid', 'value': constant.game.id}, 
			  {'key': 'openkey', 'value': openkey},
			  {'key': 'openid', 'value': openid},
			  {'key': 'ts', 'value': Math.floor(new Date() / 1000)},
			  {'key': 'rnd', 'value': Math.floor(new Date() / 1000)}
		];

		var sig = utils.sigGenerator('POST', itemApiPath, params, constant.app.key);
		if (sig && itemApiPath) {
		  	utils.itemProxy(itemApiPath, params, sig, function(data){
		  	  	res.send(data);
		  	});
		}

		var uid = openid;

		var filterSingerArray = utils.validateParam(
			_.filter(masterdata.singers, function(o) { return o.id == singerId; }));

		var filterGiftArray = utils.validateParam(
			_.filter(masterdata.gifts, function(o) { return o.id == giftId; }));
		var point = filterGiftArray[0].point;

		// should use async parallel
		async.parallel([
		    function(callback) {
				var singerBoardName = 'SingersRanking';
				var singerArgs = _.concat([singerBoardName], [point, singerId]);
				redisClient.zincrby(singerArgs, callback);
		    },
		    function(callback) {
				var userBoardName = 'Contribution' + utils.yearWeek();
				var userArgs = _.concat([userBoardName], [point, uid]);
				redisClient.zincrby(userArgs, callback);
		    }
		],
		// optional callback
		function(err, results) {
		    if (err) throw err;
		    console.log(results);

		    res.send(JSON.stringify(data));
		});

	}, arguments, next);

});

router.post('/score', function(req, res, next){
	var data = req.body;
	var singerId = data.singerId;
	var songId = data.songId;
	var score = data.score;
	var uid = data.uid;
	res.send(data);

});
