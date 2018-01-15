var express = require('express');
var router = express.Router();


var utils = require('../utils/utils.js');
var connstant = require('../utils/const.js');
var masterdata = require('../utils/masterdata.js');
var redisClient = require('../utils/redisClient.js');

/* GET home page. */
router.post('/login', function(req, res, next) {
  var openkey = req.body.openkey;
  var openid = req.body.openid;
  console.log(openkey, openid);
 
  var authApiPath = utils.getAuthApiPath(req.app.get('env'));
  var params = [
	  {'key': 'appid', 'value': connstant.app.id}, 
	  {'key': 'gameid', 'value': connstant.game.id}, 
	  {'key': 'openkey', 'value': openkey},
	  {'key': 'openid', 'value': openid},
	  {'key': 'ts', 'value': Math.floor(new Date() / 1000)},
	  {'key': 'rnd', 'value': Math.floor(new Date() / 1000)}
  ];

  var sig = utils.sigGenerator('POST', authApiPath, params, connstant.app.key);
  if (sig && authApiPath) {
  	  utils.verifyOpenIdAndKey(authApiPath, params, sig, function(data){
  	  	res.send(data);
  	  });
  }
  res.send({"ret":0,"data":{},"msg":""});

});

module.exports = router;