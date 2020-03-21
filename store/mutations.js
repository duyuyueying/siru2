
const COLOR_THEME = 'COLOR_THEME'; // 存储币涨跌颜色状态。
const USER_ID = 'USER_ID'; // 存储登录着的userid
const PRICE_POSITION = 'PRICE_POSITION'; // 存储cny和usd哪个在上面显示

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
	
}