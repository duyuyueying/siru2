// 个人认证部分配置
const identification = {
	personal: {
		name: '个人实名认证',
		color: '#03c800'
	},
	company:{
		name: '企业认证',
		color: '#3c80f7'
	},
	jingse: {
		name: '金色认证',
		color: '#ffb100'
	}
}

const detailText = {
	hepler: ['了解更多区块链一线报道，与作者、读者更深入探讨、交流，进入[金色财经读者交流群]，欢迎添加小助手微信：','jinsecaijing666'],
	announce1: '声明：本文系金色财经原创稿件，版权属金色财经所有，未经授权不得转载，已经协议授权的媒体下载使用时须注明"稿件来源：金色财经"，违者将依法追究责任。',
    announce2: '免责声明: 金色财经作为开放的资讯分享平台，所提供的所有资讯仅代表作者个人观点，与金色财经平台立场无关，且不构成任何投资理财建议。',
	announce3: '投资有风险，入市须谨慎。本资讯不作为投资理财建议。',
	announce4: '本活动最终解释权归财金拥有',
	announce5: '根据《互联网用户公众账号信息服务管理规定》,有信息发布需求的用户需要进行实名认证'
}

const rules = [
	'好友注册并7日内打卡三次即可成为“有效邀请”；',
	'每增加1位“有效邀请”增加10金币，无上限；'
]

const platform = [
	{name: '微信',icon_url:'wechat.png'},
	{name: '朋友圈', icon_url: 'friend.png'},
	{name: 'QQ',icon_url:'QQ.png'},
	{name: 'QQ空间', icon_url: 'zone.png'},
	{name: '新浪微博',icon_url:'sina.png'},
	{name: '复制链接', icon_url: 'link.png'},
	]
	
	
const userCenterConfig = {
	'invite': {
		name: '邀请好友',
		noData: '还没有邀请好友'
	},
	'coin': {
		name: '金币记录'
	},
	'focus': {
		name:'我的关注',
		noData: '暂无关注',
		goPage: {
			route: '',
			linkTxt: '去关注'
		},
	},
	'fans': {
		name: '关注我的',
		noData: '暂无关注',
	},
	'replyMe': {
		name: '回复我的',
		noData: '暂无数据',
	},
	'likeMe':{
		name: '赞过我的',
		noData: '暂无数据',
	},
	'focusMe':{
		name: '关注我的',
		noData: '暂无数据',
	},
	'systemMessage':{
		name: '系统消息',
		noData: '没有新的消息',
	},
	'myCollect':{
		name: '我的收藏',
		noData:'暂无内容'
	},
	'myArtical': {
		name: '我的文章'
	},
	'history': {
		name: '浏览历史'
	}
}

export {
	identification,
	detailText,
	platform,
	rules,
	userCenterConfig
}