'use strict'
var urlencode = require('urlencode');
var _ = require('lodash');
var crypto = require('crypto');
var connstant = require('../utils/const.js');
var request = require('request');

var utils = {};

utils.protectBlock = function(handler, params, next){
	try {
		handler.apply(null, params);
	} catch (err) {
		console.log(err);
		next(err);
	}
};

utils.validateParam = function(oldValue, defaultValue) {
	
	if (!_.isNil(defaultValue)) {
		if (oldValue == null || oldValue == '') {
			oldValue = defaultValue+''; // default type string
		}
	}else {
		if (_.isNil(oldValue)) {
			var err = new Error('validate failed');
			throw err;
		}else if (_.isString(oldValue) || _.isNumber(oldValue)) {
			if (_.isNil(oldValue)) {
				var err = new Error('validate failed');
				throw err;
			}
		}else if (_.isArray(oldValue)) {
			if (_.isEmpty(oldValue)) {
				var err = new Error('validate failed');
				throw err;
			}
		} 
	}
	return oldValue;
};

utils.yearWeek = function() {
	var weekNum = (((new Date())-(new Date("2017-01-01")))/(24*60*60*7*1000)|0) + 1;
	return (new Date()).getFullYear() + '' + ((weekNum < 10) ? '0' + weekNum : weekNum);
};

utils.getAuthApiPath = function (env) {
	return connstant.auth.getAuthApiPath(connstant.auth.require, env);
};

utils.getItemApiPath = function(env) {
	return connstant.auth.getItemApiPath(connstant.auth.require, env);
};

utils.sigGenerator = function(method, authApiPath, params, appKey) {
	if (authApiPath == null) return null;
	var uri = '/openapi' + authApiPath.substr(authApiPath.lastIndexOf('/'));
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
};

utils.verifyOpenIdAndKey = function(path, params, sig, callback){
	var jsonParams = {};
	_.each(params, function(item){
		jsonParams[item.key] = item.value; 
	});
	jsonParams.sig = sig;
	console.log(jsonParams);
	request({
		url: path,
		method: 'POST',
		json:  true,
		body: params,
	}, function(error, response, body){
		if (!error && response.statusCode == 200) {
            callback(body);
        }
	});
};

utils.itemProxy = function(path, params, sig, callback){
	var jsonParams = {};
	_.each(params, function(item){
		jsonParams[item.key] = item.value; 
	});
	jsonParams.sig = sig;
	console.log(jsonParams);
	request({
		url: path,
		method: 'POST',
		json:  true,
		body: params,
	}, function(error, response, body){
		if (!error && response.statusCode == 200) {
            callback(body);
        }
	});
};

module.exports = utils;