var express = require('express');
var router = express.Router();
var _ = require('lodash');

var utils = require('../utils/utils.js');
var masterdata = require('../utils/masterdata.js');
var redisClient = require('../utils/redisClient.js');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/tips', function(req, res, next){
	var itemApiPath = utils.getItemApiPath(req.app.get('env'));

	
	var data = req.body;
	var singerId = data.singerId;
	var songId = data.songId;
	var giftId = data.giftId;
	var uid = data.uid;

	var filterGiftArray = _.filter(masterdata.gifts, function(o) { return o.id == giftId; });
	if (filterGiftArray == null || filterGiftArray.length == 0) {
		var err = new Error('Not Found');
		next(err);
		return;
	}
	var point = filterGiftArray[0].point;

	var args = [ 'singer' + singerId ];
	args = _.concat(args, [point, uid]);
	console.log(args);
	redisClient.zadd(args, function (err, response) {
		if (err) throw err;
    	console.log('added '+response+' items.');
	});

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
