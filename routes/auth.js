var express = require('express');
var router = express.Router();

var utils = require('../utils/utils.js');
var connstant = require('../utils/const.js');
var masterdata = require('../utils/masterdata.js');
var redisClient = require('../utils/redisClient.js');

/* GET home page. */
router.get('/login', function(req, res, next) {
  var authApiPath = utils.getAuthApiPath(req.app.get('env'));

  var uri = '/openapi' + authApiPath.substr(authApiPath.lastIndexOf('/'));
  var params = [
  {'key': 'appid', 'value': connstant.app.id}, 
  {'key': 'gameid', 'value': connstant.game.id}, 
  {'key': 'openkey', 'value': ''},
  {'key': 'openid', 'value': ''},
  {'key': 'ts', 'value': Math.floor(new Date() / 1000)},
  {'key': 'rnd', 'value': Math.floor(new Date() / 1000)}
  ];

  var sig = utils.sigGenerator('POST', uri, params, connstant.app.key);

  res.render('index', { title: 'Express' });
});

module.exports = router;