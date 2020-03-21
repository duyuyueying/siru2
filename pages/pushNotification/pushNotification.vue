<template>
	<view class="container">
		<push-notification-item title="接受新消息通知" @switchChange="switchChange($event, 'masterSwitch')"></push-notification-item>
		<view v-if="masterSwitch">
			<view class="mb20">
				<push-notification-item title="免打扰" :checked="false" @switchChange="switchChange($event, 'timeSwitch')"></push-notification-item>
				<view class="flex_row modify_time_box" v-if="timeSwitch">
					<view class="flex1 flex_column center modify_time">
						<text class="normal_txt">开始时间</text>
						<text class="list_item_black_title_sm">{{startTime}}</text>
						<text class="normal_txt" :style="{color: '#489aff'}">点击修改</text>
						<picker mode="time" class="time_picker" @change="switchChange($event, 'startTime')"></picker>
					</view>
					<view class="flex1 flex_column center modify_time">
						<text class="normal_txt">开始时间</text>
						<text class="list_item_black_title_sm">{{endTime}}</text>
						<text class="normal_txt" :style="{color: '#489aff'}">点击修改</text>
						<picker mode="time" class="time_picker" @change="switchChange($event, 'endTime')"></picker>
					</view>
				</view>
			</view>
			<push-notification-item title="文章消息通知" showIcon @switchChange="switchChange($event, 'essayMessage')" @showMask="showMask('essay')"></push-notification-item>
			<push-notification-item title="快讯消息通知" showIcon @switchChange="switchChange($event, 'newsMessage')" @showMask="showMask('news')"></push-notification-item>
			<view class="mb20">
				<push-notification-item title="行情消息通知" showIcon @switchChange="switchChange($event, 'tradeMessage')" @showMask="showMask('trade')"></push-notification-item>
			</view>
			<uni-title title="关注作者更新通知" :isBold="false" :height="120" @click="onClick('logoff')">
				<view>
					<icons type="right" color='#ddd'></icons>
				</view>
			</uni-title>
			
		</view>
		<view v-else class="pad30">
			<text class="normal_txt">
				开启通知后可进一步设置接受不同分类的消息
			</text>
		</view>
		<uni-popup :maskClass="maskClass" ref="example" showPopup>
			<view class="flex_column">
				<view style="text-align: center;"><text class="blod_black_txt">{{example.name}}消息通知样例</text></view>
				<view class="message_box">
					<view class="flex_row space_between" style="margin-bottom: 20upx;">
						<image src="/static/logo.png" class="logo_img"></image>
						<text class="content">1小时前</text>
					</view>
					<view class="flex_column">
						<text class="blod_black_txt title" v-if="example.title">{{example.title}}</text>
						<text class="normal_txt content">{{example.desc}}</text>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniTitle from '@/components/uni-title.vue';
	import icons from '@/components/icons/icons.vue';
	import pushNotificationItem from '@/pages/pushNotification/pushNotification_item.vue';
	import {uniPopup} from '@dcloudio/uni-ui';
	const EXAMPLE = {
		essay: {
			name: '文章',
			title: '清华教授何平：比特币缺乏黄金那样的价值支撑 不是真正的数字黄金',
			desc: '对于不断出现的新型数字资产，何平指出，未来数字资产可能获得实体经济支撑，但监管部门仍需重视数字资产发行过程中的道德风险'
		},
		news: {
			name:'快讯',
			desc: '【纽约再现加密货币犯罪大案 价值100完美元以太坊被盗】嫌疑人涉嫌盗窃超过180万美元的以太坊加密货币'
		},
		trade: {
			name: '行情',
			desc: '【行情】当前Bithumb-比特币价格：¥120859.99，五分钟内变化超过¥2802，请密切关注行情势头，做好风险控制'
		},
		
	}
	export default {
		data() {
			return {
				severList:[
					{name:'接受新消息通知',checked:true},
					{name:'免打扰',checked:true},
					{name:'文章消息通知',checked:true},
					{name:'接受新消息通知',checked:true},
					{name:'接受新消息通知',checked:true},
					{name:'接受新消息通知',checked:true},
					{name:'微信',icon:'quan.png',nikeName: 'account'},
					{name:'注销账号',icon:'momey.png',nikeName: 'setting'},
					{name:'账号密码',icon:'point.png',nikeName: 'pushNotification'},
				],
				masterSwitch: true, // 表示总开关
				timeSwitch: false, // 免打扰开关
				startTime: '00:00',
				endTime: '07:00',
				maskClass:{
					'position': 'fixed',
					'bottom': 0,
					'top': 0,
					'left': 0,
					'right': 0,
					'backgroundColor': '#f5f5f5'
				},
				example: {}
			}
		},
		components:{
			uniTitle,
			icons,
			pushNotificationItem,
			uniPopup
		},
		mounted() {
			this.$refs.example.maskClass.backgroundColor = '#fff';
		},
		methods: {
			//用户点击列表项
			toPage(type){
				let url = '/pages/pushNotification/pushNotificationAuthor';
				uni.navigateTo({
					url
				});
			},
			onClick(type) {
				this.toPage(type);
			},
			switchChange(e, keyName) {
				let value = e.detail.value;
				this[keyName] = value;
			},
			showMask(type) {
				this.example = EXAMPLE[type];
				this.$refs.example.open()
			}
		}
	}
</script>

<style lang="scss">
page, .container{
	background-color: #f5f5f5;
	height: 100%;
}
.list{
	@include sideBorder;
}
.item_wrap{
	width: 500upx;
	justify-content: space-between;
	align-items: center;
}
.mb20{
	margin-bottom: 20upx;
}
.center{
	align-items: center;
}
.modify_time_box{
	padding: $space-base;
	background-color: #fff;
	line-height: 40upx;
}
.modify_time{
	position: relative;
}
.time_picker{
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	top: 0;
	z-index: 2;
}
.logo_img{
	width: 120upx;
	height: 44upx;
}
.message_box{
	background-color: #fff;
	margin: $space-base;
	padding: $space-base;
	border-radius: 8upx;
	box-shadow: 0 0 20upx rgba(0,0,0,.2);
}
.title{
	@include more_line_ellipsis(1);
	margin-top: $space-sm;
}
.content {
	font-size: 26upx;
	color: #333;
}
</style>
