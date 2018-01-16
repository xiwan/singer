var express = require('express');
var router = express.Router();
var _ = require('lodash');

var utils = require('../utils/utils.js');
var connstant = require('../utils/const.js');
var masterdata = require('../utils/masterdata.js');
var redisClient = require('../utils/redisClient.js');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/tips', function(req, res, next){
	var data = req.body;
	var singerId = data.singerId;
	var songId = data.songId;
	var giftId = data.giftId;
	var openkey = data.openkey;
	var openid = data.openid;
	console.log(req.app.get('env'));
	var itemApiPath = utils.getItemApiPath(req.app.get('env'));
	var cmd =  1;
	var mask = 1;
	var params = [
	  	  {'key': 'cmd', 'value': cmd}, 
	  	  {'key': 'mask', 'value': mask}, 
		  {'key': 'appid', 'value': connstant.app.id}, 
		  {'key': 'gameid', 'value': connstant.game.id}, 
		  {'key': 'openkey', 'value': openkey},
		  {'key': 'openid', 'value': openid},
		  {'key': 'ts', 'value': Math.floor(new Date() / 1000)},
		  {'key': 'rnd', 'value': Math.floor(new Date() / 1000)}
	];

	var sig = utils.sigGenerator('POST', itemApiPath, params, connstant.app.key);
	if (sig && itemApiPath) {
	  	utils.itemProxy(itemApiPath, params, sig, function(data){
	  	  	res.send(data);
	  	});
	}

	var uid = openid;
	if (!uid) {
		var err = new Error('not-valid-user');
		next(err);
		return;
	}

	var filterSingerArray = _.filter(masterdata.singers, function(o) { return o.id == singerId; });
	if (filterSingerArray == null || filterSingerArray.length == 0) {
		var err = new Error('not-found-singer');
		next(err);
		return;
	}

	var filterSongArray = _.filter(masterdata.songs, function(o) { return o.id == songId; });
	if (filterSongArray == null || filterSongArray.length == 0) {
		var err = new Error('not-found-song');
		next(err);
		return;
	}

	var filterGiftArray = _.filter(masterdata.gifts, function(o) { return o.id == giftId; });
	if (filterGiftArray == null || filterGiftArray.length == 0) {
		var err = new Error('not-found-gift');
		next(err);
		return;
	}
	var point = filterGiftArray[0].point;

	var args = [ 'singer' + singerId ];
	args = _.concat(args, [point, uid]);
	redisClient.zincrby(args, function(err, response) {
		if (err) throw err;
    	console.log('added '+response+' items.');
	})

	res.send(data);

});

router.post('/score', function(req, res, next){
	var data = req.body;
	var singerId = data.singerId;
	var songId = data.songId;
	var score = data.score;
	var uid = data.uid;
	res.send(data);

});


module.exports = router;
