var express = require('express');
var router = express.Router();
var _ = require('lodash');

var utils = require('../utils/utils.js');
var constant = require('../utils/const.js');
var masterdata = require('../utils/masterdata.js');
var redisClient = require('../utils/redisClient.js');


module.exports = router;

router.get('/contribution/week', function(req, res, next){
	try {
		var week = utils.validateParam(req.query.week, utils.yearWeek());
		var user = utils.validateParam(req.query.user, ''); // default empty
		var singerId = utils.validateParam(req.query.singerId, '');// default empty

		var userBoardName = 'Contribution' + week;
		var userArgs = _.concat([userBoardName], ['0', '+inf', 'WITHSCORES', 'LIMIT', '0', '9']);
		redisClient.zrangebyscore(userArgs, function(err, results){
			if (err) next(err);
			var userArray = [];
			for (var i = 0; i< results.length; i+=2) {
				var userObj = {};
				userObj.openId = results[i];
				userObj.point = results[i+1];
				userArray.push(userObj);
			}
			res.send(JSON.stringify(userArray));
			
		});

	} catch (err) {
		next(err);
	}


});

router.get('/popularity', function(req, res, next){

});



