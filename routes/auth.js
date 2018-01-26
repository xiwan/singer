var express = require('express');
var router = express.Router();


var utils = require('../utils/utils.js');
var constant = require('../utils/const.js');
var masterdata = require('../utils/masterdata.js');
var redisClient = require('../utils/redisClient.js');

module.exports = router;

/* GET home page. */
router.post('/login', function(req, res, next) {
  utils.protectBlock(function(req, res, next){

    var openkey = utils.validateParam(req.body.openkey, '1');
    var openid = utils.validateParam(req.body.openid, '2');
   
    var authApiPath = utils.getAuthApiPath(req.app.get('env'));
    var params = [
      {'key': 'appid', 'value': constant.app.id}, 
      {'key': 'gameid', 'value': constant.game.id}, 
      {'key': 'openkey', 'value': openkey},
      {'key': 'openid', 'value': openid},
      {'key': 'ts', 'value': Math.floor(new Date() / 1000)},
      {'key': 'rnd', 'value': Math.floor(new Date() / 1000)}
    ];

    var sig = utils.sigGenerator('POST', authApiPath, params, constant.app.key);
    if (sig && authApiPath) {
        utils.verifyOpenIdAndKey(authApiPath, params, sig, function(data){
          res.send(data);
        });
    }
    res.send({"ret":0,"data":{},"msg":""});    

  }, arguments, next);


});
