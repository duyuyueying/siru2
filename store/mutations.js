
const COLOR_THEME = 'COLOR_THEME'; // 存储币涨跌颜色状态。
const USER_ID = 'USER_ID'; // 存储登录着的userid
const USER_INFO = 'USER_INFO'; // 存储登录者的info信息
const API_TOKEN = 'API_TOKEN'; // 存储登录的token信息
const PRICE_POSITION = 'PRICE_POSITION'; // 存储cny和usd哪个在上面显示
const FRONT_IMG = 'FRONT_IMG'; // 证件正面照
const BACK_IMG = 'BACK_IMG'; // 证件反面照

export default {
	[COLOR_THEME](state, colorTheme) {
		state.colorTheme = colorTheme;
		if(colorTheme == 'greenUp') {
			state.upTheme = {txt: '#39b54a', bg: '#d7f0db'};
			state.downTheme = {txt: '#e54d42', bg: '#fadbd9'};
		} else {
			state.upTheme = {txt: '#e54d42', bg: '#fadbd9'};
			state.downTheme = {txt: '#39b54a', bg: '#d7f0db'};
		}
	},
	[PRICE_POSITION](state, position) {
		state.pricePosition = position;
	},
	[USER_ID](state, userId) {
		state.userId = userId;
	},
	[USER_INFO](state, info) {
		state.userInfo = info;
	},
	[API_TOKEN](state, token) {
		state.apiToken = token;
	},
	[FRONT_IMG](state, url) {
		state.frontImg = url;
	},
	[BACK_IMG](state, url) {
		state.backImg = url;
	},
}