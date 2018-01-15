'use strict'
var urlencode = require('urlencode');
var _ = require('lodash');
var crypto = require('crypto');

var utils = {};

utils.getAuthApiPath = function (env) {
	return env === 'development' ? 
  'http://openapi-test.hudong.qq.com/openapi/apollo_verify_openid_openkey':
  'https://openapi.hudong.qq.com/openapi/apollo_verify_openid_openkey';
};

utils.getItemApiPath = function(env) {
	return env === 'development' ? 
  'http://openapi-test.hudong.qq.com/openapi/apollo_game_item_proxy':
  'https://openapi.hudong.qq.com/openapi/apollo_game_item_proxy';
}

utils.sigGenerator = function(method, uri, params, appKey) {
	var encodeUri = urlencode(uri);
	console.log(encodeUri);
	params = _.sortBy(params, ['key']);
	var paramArr = [];
	_.each(params, function(item){
		paramArr.push(item.key + "=" +item.value); 
	});
	console.log(paramArr);
	var encodeParam = urlencode(paramArr.join('&'));
	console.log(encodeParam);
	var sourceStr = method + '&' + encodeUri + '&' +encodeParam;
	console.log(sourceStr);
	var secretKey = appKey + '&';
	console.log(secretKey);
	var hash = crypto.createHmac('sha1', secretKey).update(sourceStr).digest('base64');
	console.log(hash);
	return hash;
}

module.exports = utils;