// 首页tab测试数据
let homeTab = [
	{
		id: "tab333",
		name: '关注',
		newsid: 1
	},
	{
		id: "tab01",
		name: '最新',
		newsid: 0
	}, {
		id: "tab01",
		name: '视频',
		newsid: 23
	},{
		id: "tab02",
		name: '大公司',
		newsid: 23
	}, {
		id: "tab03",
		name: '内容',
		newsid: 223
	}, {
		id: "tab04",
		name: '消费',
		newsid: 221
	}, {
		id: "tab05",
		name: '娱乐',
		newsid: 225
	}, {
		id: "tab06",
		name: '区块链',
		newsid: 208
	},{
		name: '关注',
		id: 0,
		icon_name: false
	},
	{
		name: '头条',
		id: 223,
		icon_name: false
	},
	{
		name: '政策',
		id: 4,
		icon_name: false
	},
	{
		name: '行情',
		id: 4,
		icon_name: false
	},
	{
		name: '直播',
		id: 4,
		icon_name: false
	},
	{
		name: '矿业',
		id: 4,
		icon_name: false
	},
	{
		name: '专栏',
		id: 4,
		icon_name: false
	},
	{
		name: '直播',
		id: 4,
		icon_name: false
	},
	{
		name: '公告/新闻',
		id: 4,
		icon_name: false
	},
	{
		name: '奖励/减产',
		id: 4,
		icon_name: false
	},
	{
		name: '会议/AMA',
		id: 4,
		icon_name: 'hot'
	},
	{
		name: '直播',
		id: 4,
		icon_name: false
	},
	{
		name: '热搜榜',
		id: 4,
		icon_name: false
	},
]

// search页面
let searchTab = [{
	id: 1,
	name: '全部',
	enCode: 'all'
}, {
	id: 2,
	name: '文章',
	enCode: 'article'
}, {
	id: 3,
	name: '快讯',
	enCode: 'fastNews'
}, {
	id: 4,
	name: '币种',
	enCode: 'coinType'
}, {
	id: 5,
	name: '交易所',
	enCode: 'exChange'
},
{
	id: 5,
	name: '专栏',
	enCode: 'specialColumn'
}
]	

// 资讯测试数据
let oneNews = {
	source: '新华社', // 来源/require
	time: 1583485013000, // 时间/require
	author_name: '王大仙', // 作者，非必须
	live: false, // 是否直播类型资讯
	recommend: false, // 是否是推广类资讯
	onlyOne: false, // 是否是独家资讯
	depth: false, // 是否是深度类型资讯
	goodCount: 44, // 利多
	badCount: 20, // 利空
	coins:[{
		startPrice: '1000',
		endPrice: '1035',
		id: 123,
		name: 'BRE'
	},{
		startPrice: '1050',
		endPrice: '1035',
		id: 123,
		name: 'AE'
	},{
		startPrice: '1050',
		endPrice: '1035',
		id: 123,
		name: 'AE'
	}],
	title: '新闻周刊丨BTC算力创新高、PlusToken资金外移、印度取消加密货币禁令',
	image_url: 'https://img.36krcdn.com/20200307/v2_945dcd5d78514102a1e83a016bfbb2a6_img_000',
	detail: '面对这一场世所罕见、突如其来、异常凶猛的新冠肺炎疫情，习近平总书记始终把人民生命安全和身体健康放在第一位，带领全党全军全国人民沉着应对危机、果断处置危机、科学防控危机，忧人民之所忧、想人民之所想，及时制定疫情防控战略策略，凝聚起全中国人民奋起抗疫的磅礴力量。',
	type: 'normal',
	hot: 97650,
	author: {
		id: 1,
		name: '币圈御姐儿',
		description: '个人介绍-每日提供比特币，以太坊，柚子等数字货币合约交易策略等',
		gongzhonghaoName: '币圈御姐儿', // 
		wechatAccount: 'PL12345678',
		fans: 123,
		focus: 3,
		identification: 'company',// 认证：分为金色认证（金色）jingse，企业认证（蓝色）company，个人认证（绿色）personal
		qrcode: 'http://src.onlinedown.net/images/xcs/10/2017-09-18_59bf6a2170092.jpg',
		avatar: 'http://b-ssl.duitang.com/uploads/item/201802/20/20180220165946_RiGPS.thumb.700_0.jpeg',
		vip:'company',//
		isFocus: false
	},
	comment: 5,
	like: 1,
	goodFlag: true
}

let newItem = [{
	source: '新华社', // 来源/require
	time: 1583485013000, // 时间/require
	author_name: '王大仙', // 作者，非必须
	live: false, // 是否直播类型资讯
	recommend: false, // 是否是推广类资讯
	onlyOne: false, // 是否是独家资讯
	depth: false, // 是否是深度类型资讯
	coins: [{
		startPrice: '1000',
		endPrice: '1035',
		id: 123,
		name: 'BRE'
	},{
		startPrice: '1050',
		endPrice: '1035',
		id: 123,
		name: 'AE'
	}],
	title: '德国流行病学家：原以为中国的数字不可能是真的',
	image_url: 'https://img.36krcdn.com/20200307/v2_945dcd5d78514102a1e83a016bfbb2a6_img_000',
	detail: '面对这一场世所罕见、突如其来、异常凶猛的新冠肺炎疫情，习近平总书记始终把人民生命安全和身体健康放在第一位，带领全党全军全国人民沉着应对危机、果断处置危机、科学防控危机，忧人民之所忧、想人民之所想，及时制定疫情防控战略策略，凝聚起全中国人民奋起抗疫的磅礴力量。',
	type: 'normal'
},
{
	source: '新华社1', // 来源/require
	time: 1581076464000, // 时间/require
	author_name: '王大仙1', // 作者，非必须
	live: true, // 是否直播类型资讯
	recommend: false, // 是否是推广类资讯
	onlyOne: false, // 是否是独家资讯
	depth: false, // 是否是深度类型资讯
	coins: [],
	title: '德国流行病学家：原以为中国的数字不可能是真的',
	image_url: 'https://img.36krcdn.com/20200307/v2_945dcd5d78514102a1e83a016bfbb2a6_img_000',
	detail: '面对这一场世所罕见、突如其来、异常凶猛的新冠肺炎疫情，习近平总书记始终把人民生命安全和身体健康放在第一位，带领全党全军全国人民沉着应对危机、果断处置危机、科学防控危机，忧人民之所忧、想人民之所想，及时制定疫情防控战略策略，凝聚起全中国人民奋起抗疫的磅礴力量。',
	type: 'specialTopic'
},
{
	source: '新华社2', // 来源/require
	time: 1583455013000, // 时间/require
	live: false, // 是否直播类型资讯
	recommend: true, // 是否是推广类资讯
	onlyOne: false, // 是否是独家资讯
	depth: false, // 是否是深度类型资讯
	coins: [{
		startPrice: '1000',
		endPrice: '1035',
		id: 123,
		name: 'ETZ'
	}],
	title: '德国流行病学家：原以为中国的数字不可能是真的',
	image_url: 'https://img.36krcdn.com/20200307/v2_945dcd5d78514102a1e83a016bfbb2a6_img_000',
	detail: '面对这一场世所罕见、突如其来、异常凶猛的新冠肺炎疫情，习近平总书记始终把人民生命安全和身体健康放在第一位，带领全党全军全国人民沉着应对危机、果断处置危机、科学防控危机，忧人民之所忧、想人民之所想，及时制定疫情防控战略策略，凝聚起全中国人民奋起抗疫的磅礴力量。',
	type: 'fastNews'
},
{
	source: '新华社3', // 来源/require
	time: 1583455013000, // 时间/require
	live: false, // 是否直播类型资讯
	recommend: false, // 是否是推广类资讯
	onlyOne: true, // 是否是独家资讯
	depth: false, // 是否是深度类型资讯
	coins: [{
		startPrice: '1050',
		endPrice: '1035',
		id: 123,
		name: 'AE'
	}],
	title: '德国流行病学家：原以为中国的数字不可能是真的',
	image_url: 'https://img.36krcdn.com/20200307/v2_945dcd5d78514102a1e83a016bfbb2a6_img_000',
	detail: '面对这一场世所罕见、突如其来、异常凶猛的新冠肺炎疫情，习近平总书记始终把人民生命安全和身体健康放在第一位，带领全党全军全国人民沉着应对危机、果断处置危机、科学防控危机，忧人民之所忧、想人民之所想，及时制定疫情防控战略策略，凝聚起全中国人民奋起抗疫的磅礴力量。',
	type: 'specialTopic'
},
{
	source: '新华社3', // 来源/require
	time: 1583455013000, // 时间/require
	live: false, // 是否直播类型资讯
	recommend: false, // 是否是推广类资讯
	onlyOne: false, // 是否是独家资讯
	depth: true, // 是否是深度类型资讯
	coins: [],
	title: '德国流行病学家：原以为中国的数字不可能是真的',
	image_url: 'https://img.36krcdn.com/20200307/v2_945dcd5d78514102a1e83a016bfbb2a6_img_000',
	detail: '面对这一场世所罕见、突如其来、异常凶猛的新冠肺炎疫情，习近平总书记始终把人民生命安全和身体健康放在第一位，带领全党全军全国人民沉着应对危机、果断处置危机、科学防控危机，忧人民之所忧、想人民之所想，及时制定疫情防控战略策略，凝聚起全中国人民奋起抗疫的磅礴力量。',
	type: 'specialTopic'
},
]
let newsItems = new Array(20)
 newsItems.fill(oneNews)
 
// 关注作者列表
let focusAuthor = {
	id: 1,
	name: '币圈御姐儿',
	description: '个人介绍-每日提供比特币，以太坊，柚子等数字货币合约交易策略等',
	gongzhonghaoName: '币圈御姐儿', // 
	wechatAccount: 'PL12345678',
	fans: 123,
	focus: 3,
	identification: 'company',
	qrcode: 'http://src.onlinedown.net/images/xcs/10/2017-09-18_59bf6a2170092.jpg',
	avatar: 'http://b-ssl.duitang.com/uploads/item/201802/20/20180220165946_RiGPS.thumb.700_0.jpeg',
	time: 1583455013000,
}
let focusAuthors = new Array(20);
focusAuthors.fill(focusAuthor);

// 标签列表
let tag = {
	id: 1,
	name: '物联网',
	isHot: false
}
let tags = new Array(20);
tags.fill(tag);

// 评论列表
let comment = [{
	id: '123',
	comment_user_id: '114',
	comment_user: '王麻子',
	comment_user_avatar: '',
	comment: '我是评论，挺好的！',
	like: 3,
	time: 1581076464000,
	reply: []
},{
	id: '124',
	comment_user_id: '114',
	comment_user: '王麻子',
	comment_user_avatar: '',
	comment: '我是评论，挺好的！',
	like: 0,
	time: 1581076464000,
	reply: []
},
{
	id: '123',
	comment_user_id: '114',
	comment_user: '王麻子',
	comment_user_avatar: '',
	comment: '我是评论，挺好的！',
	like: 3,
	time: 1581076464000,
	reply: []
},{
	id: '124',
	comment_user_id: '114',
	comment_user: '王麻子',
	comment_user_avatar: '',
	comment: '我是评论，挺好的！',
	like: 0,
	time: 1581076464000,
	reply: []
},
{
	id: '123',
	comment_user_id: '114',
	comment_user: '王麻子',
	comment_user_avatar: '',
	comment: '我是评论，挺好的！',
	like: 3,
	time: 1581076464000,
	reply: []
},{
	id: '124',
	comment_user_id: '114',
	comment_user: '王麻子',
	comment_user_avatar: '',
	comment: '我是评论，挺好的！',
	like: 0,
	time: 1581076464000,
	reply: []
},

{
	id: '123',
	comment_user_id: '114',
	comment_user: '王麻子',
	comment_user_avatar: '',
	comment: '我是评论，挺好的！',
	like: 3,
	time: 1581076464000,
	reply: []
},{
	id: '124',
	comment_user_id: '114',
	comment_user: '王麻子',
	comment_user_avatar: '',
	comment: '我是评论，挺好的！',
	like: 0,
	time: 1581076464000,
	reply: []
},
{
	id: '123',
	comment_user_id: '114',
	comment_user: '王麻子',
	comment_user_avatar: '',
	comment: '我是评论，挺好的！',
	like: 3,
	time: 1581076464000,
	reply: []
},{
	id: '124',
	comment_user_id: '114',
	comment_user: '王麻子',
	comment_user_avatar: '',
	comment: '我是评论，挺好的！',
	like: 0,
	time: 1581076464000,
	reply: []
},
{
	id: '123',
	comment_user_id: '114',
	comment_user: '王麻子',
	comment_user_avatar: '',
	comment: '我是评论，挺好的！',
	like: 3,
	time: 1581076464000,
	reply: []
},{
	id: '124',
	comment_user_id: '114',
	comment_user: '王麻子',
	comment_user_avatar: '',
	comment: '我是评论，挺好的！',
	like: 0,
	time: 1581076464000,
	reply: []
},
{
	id: '123',
	comment_user_id: '114',
	comment_user: '王麻子',
	comment_user_avatar: '',
	comment: '我是评论，挺好的！',
	like: 3,
	time: 1581076464000,
	reply: []
},{
	id: '124',
	comment_user_id: '114',
	comment_user: '王麻子',
	comment_user_avatar: '',
	comment: '我是评论，挺好的！',
	like: 0,
	time: 1581076464000,
	reply: []
},
{
	id: '124',
	comment_user_id: '111',
	comment_user: '王麻子',
	comment_user_avatar: '',
	comment: '我是评论，挺好的！',
	like: 0,
	time: 1581076464000,
	reply: [{
	id: '124',
	comment_user_id: '114',
	comment_user: '张山',
	reply_user_name: '王麻子',
	comment_user_avatar: '',
	comment: '我是评论，挺好的！',
	like: 0,
	time: 1581076464000,
	reply: []
},{
	id: '124',
	comment_user_id: '114',
	comment_user: '张山',
	reply_user_name: '王麻子',
	comment_user_avatar: '',
	comment: '我是回复，挺好的！',
	like: 0,
	time: 1581076464000,
	reply: []
}]
},]

// 直播详情
let liveDetail = {
	status: '已结束',
	title: '德国流行病学家：原以为中国的数字不可能是真的',
	detail: '面对这一场世所罕见、突如其来、异常凶猛的新冠肺炎疫情，习近平总书记始终把人民生命安全和身体健康放在第一位，带领全党全军全国人民沉着应对危机、果断处置危机、科学防控危机，忧人民之所忧、想人民之所想，及时制定疫情防控战略策略，凝聚起全中国人民奋起抗疫的磅礴力量。',
	sponsor: '头条',
	support: '支付宝',
	time: 1583455013000,
	host: [{
		avatar_url: '',
		name: '谁谁谁',
		position: '公开课主持人'
	},
	{
		avatar_url: '',
		name: '谁谁谁',
		position: '公开课主持人'
	}],
	guest: [
		{
			avatar_url: '',
			name: '谁谁谁',
			position: '公开课主持人'
		},
		{
			name: '谁谁谁',
			position: '公开课主持人'
		},
		{
			name: '谁谁谁',
			position: '哪个地区的负责人'
		},
		{
			name: '谁谁谁',
			position: '总监'
		},
		{
			name: '谁谁谁',
			position: '公开课主持人'
		}],
		live: [{
			time: 1583455013000,
			content: '1币信副总裁Frank Ling：BTC是算力+能源的原生产物，也是最适合 虚拟世界最大的大宗商品——算力的结算凭证。今天我们对于矿场的投资，对于算力 的投入，应该还处于非常初级的阶段。',
			speaker:{
				avatar_url: '',
				name: '谁谁谁',
				position: '公开课主持人',
				identification: 'personal'
			}
		},
		{
			time: 1583455013000,
			content: '币信副总裁Frank Ling：BTC是算力+能源的原生产物，也是最适合 虚拟世界最大的大宗商品——算力的结算凭证。今天我们对于矿场的投资，对于算力 的投入，应该还处于非常初级的阶段。',
			speaker:{
				avatar_url: '',
				name: '谁谁谁',
				position: '公开课主持人',
				identification: 'company'
			}
		},
		{
			time: 1583455013000,
			content: '币信副总裁Frank Ling：BTC是算力+能源的原生产物，也是最适合 虚拟世界最大的大宗商品——算力的结算凭证。今天我们对于矿场的投资，对于算力 的投入，应该还处于非常初级的阶段。',
			speaker:{
				avatar_url: '',
				name: '谁谁谁',
				position: '公开课主持人',
				identification: 'jingse'
			}
		},
		{
			time: 1583455013000,
			content: '币信副总裁Frank Ling：BTC是算力+能源的原生产物，也是最适合 虚拟世界最大的大宗商品——算力的结算凭证。今天我们对于矿场的投资，对于算力 的投入，应该还处于非常初级的阶段。',
			speaker:{
				avatar_url: '',
				name: '谁谁谁',
				position: '公开课主持人',
				identification: 'company'
			}
		},
		{
			time: 1583455013000,
			content: '币信副总裁Frank Ling：BTC是算力+能源的原生产物，也是最适合 虚拟世界最大的大宗商品——算力的结算凭证。今天我们对于矿场的投资，对于算力 的投入，应该还处于非常初级的阶段。',
			speaker:{
				avatar_url: '',
				name: '谁谁谁',
				position: '公开课主持人',
				identification: 'company'
			}
		},
		{
			time: 1583455013000,
			content: '币信副总裁Frank Ling：BTC是算力+能源的原生产物，也是最适合 虚拟世界最大的大宗商品——算力的结算凭证。今天我们对于矿场的投资，对于算力 的投入，应该还处于非常初级的阶段。',
			speaker:{
				avatar_url: '',
				name: '谁谁谁',
				position: '公开课主持人',
				identification: 'company'
			}
		},
		{
			time: 1583455013000,
			content: '20币信副总裁Frank Ling：BTC是算力+能源的原生产物，也是最适合 虚拟世界最大的大宗商品——算力的结算凭证。今天我们对于矿场的投资，对于算力 的投入，应该还处于非常初级的阶段。',
			speaker:{
				avatar_url: '',
				name: '谁谁谁',
				position: '公开课主持人',
				identification: 'company'
			}
		}]
}
let searchList = [
	{
		name: '你想找的是',
		enCode: 'coinType',
		total: 23,
		list: [{
			icon_url: 'xxx',
			name: 'BZ',
			nikeName: '比特币',
			price: '0.0153',
			change: 3.53,
			start: 123,
			end:452,
		},{
			icon_url: 'xxx',
			name: 'BZ',
			nikeName: '比特币',
			price: '0.0153',
			change: 3.53,
			start: 555,
			end:452,
		},
		{
			icon_url: 'xxx',
			name: 'BZ',
			nikeName: '比特币',
			price: '0.0153',
			change: 3.53,
			start: 555,
			end:666,
		}]
	},
	{
		name: '交易所',
		total: 12,
		enCode: 'exChange',
		list: [{
			icon_url: 'xxx',
			exRangk: 7,
			name: 'BZ',
			eosAndEth: '110',
			sale: 2084.76,
			totalPrice: 14800
		},{
			icon_url: 'xxx',
			exRangk: 7,
			name: 'BZ',
			eosAndEth: '110',
			sale: 2084.76,
			totalPrice: 14800
		},
		{
			icon_url: 'xxx',
			exRangk: 7,
			name: 'BZ',
			eosAndEth: '110',
			sale: 2084.76,
			totalPrice: 14800
		},]
	},
	{
		name: '专栏',
		total: 2,
		enCode: 'specialColumn',
		list: [{
		id: 1,
		name: '币圈御姐儿',
		description: '个人介绍-每日提供比特币，以太坊，柚子等数字货币合约交易策略等',
		gongzhonghaoName: '币圈御姐儿', // 
		wechatAccount: 'PL12345678',
		fans: 123,
		focus: 3,
		identification: 'company',
		qrcode: 'http://src.onlinedown.net/images/xcs/10/2017-09-18_59bf6a2170092.jpg',
		avatar: 'http://b-ssl.duitang.com/uploads/item/201802/20/20180220165946_RiGPS.thumb.700_0.jpeg',
	},
	{
		id: 1,
		name: '币圈御姐儿',
		description: '个人介绍-每日提供比特币，以太坊，柚子等数字货币合约交易策略等',
		gongzhonghaoName: '币圈御姐儿', // 
		wechatAccount: 'PL12345678',
		fans: 123,
		focus: 3,
		identification: 'company',
		qrcode: 'http://src.onlinedown.net/images/xcs/10/2017-09-18_59bf6a2170092.jpg',
		avatar: 'http://b-ssl.duitang.com/uploads/item/201802/20/20180220165946_RiGPS.thumb.700_0.jpeg',
	}]
	},
	{
		name: '文章',
		total: 10,
		enCode:'article',
		list: newItem
	},
	{
		name: '快讯',
		total: 10,
		enCode: 'fastNews',
		list: [
			oneNews,oneNews,oneNews
		]
	},
]

// 个人中心-金币记录
let goldList = [{
	source: '每日签到',
	time: 1583455013000,
	count:1
},{
	source: '文章评论',
	time: 1583455013000,
	count: 3
}]

// 头条的banner
let banner = [{
					id: 0,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
					}, {
					id: 1,
					type: 'specialTopic',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big37006.jpg',
					}, {
					id: 2,
					type: 'specialTopic',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
					}, {
					id: 3,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
					}, {
					id: 4,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
					}, {
					id: 5,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21016.jpg'
					}, {
					id: 6,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'
				}];

let coin = {
	rank: 1,
		icon_url: 'xxx',
		name: 'BZ',
		nikeName: '比特币',
		price: '5388.08',
		cnyPrice: '37780.17',
		change: 3.53,
		startPrice: 131,
		endPrice:452,
		exChange: '火币全球站',
		rate: '3.25',
		unit: 'USDT', // USDT是单位？
		oneDay: '4388.08',
		total: '15388.08',
		exRangk: 7,
		eosAndEth: '110',
		sale: 2084.76,
		totalPrice: 14800
		}
let coins = new Array(20);
coins.fill(coin);
export {
	homeTab,
	oneNews,
	newItem,
	newsItems,
	focusAuthor,
	focusAuthors,
	tags,
	tag,
	comment,
	liveDetail,
	searchTab,
	searchList,
	goldList,
	banner,
	coins
};