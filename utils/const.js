module.exports = {
	auth: {
		require: false,
		getAuthApiPath: function(flag, env) {
			if (!flag) return null;
	return env === 'development' ? 
  'http://openapi-test.hudong.qq.com/openapi/apollo_verify_openid_openkey':
  'https://openapi.hudong.qq.com/openapi/apollo_verify_openid_openkey';
		},
		getItemApiPath: function(flag, env) {
			if (!flag) return null;
	return env === 'development' ? 
  'http://openapi-test.hudong.qq.com/openapi/apollo_game_item_proxy':
  'https://openapi.hudong.qq.com/openapi/apollo_game_item_proxy';
		}
	},
	app: {
		id: 1106677492,
		key: 'CnMxAxJ765esw1ip'
	},
	game: {
		id: 123456
	}
}