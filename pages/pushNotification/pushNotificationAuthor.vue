<template>
	<view class="container">
		<uni-title title="接受关注作者更新通知" :isBold="false" :height="120">
			<switch checked color="#34c759" style="transform:scale(0.8)" @change="switchChange($event, 'masterSwitch')"/>
		</uni-title>
<!-- 		<push-notification-item title="接受关注作者更新通知" @switchChange="switchChange($event, 'masterSwitch')"></push-notification-item>
 -->		<view>
			<text class="normal_txt">
				开启通知后，您关注的做有新文章会推送提醒您
			</text>
		</view>
		<view v-if="masterSwitch">
			<view class="flex_row item_wrap list" v-for="(item, index) in dataList" :key="index">
				<view class="flex_row_center">
					<image src="/static/temp/avatar.jpeg" mode="aspectFit" class="avatar"></image>
					<text class="item_title">{{item.name}}</text>
				</view>
				<switch :checked="item.isSelect" color="#34c759" style="transform:scale(0.8)" @change="switchChange"/>
			</view>
		</view>
	</view>
</template>

<script>
	import uniTitle from '@/components/uni-title.vue';
	import pushNotificationItem from '@/pages/pushNotification/pushNotification_item.vue';
	export default {
		data() {
			return {
				masterSwitch: true, // 表示总开关
				dataList: [],
			}
		},
		components:{
			pushNotificationItem,
			uniTitle
		},
		onLoad() {
			this.initData();
		},
		methods: {
			initData() {
				this.dataList = [{
					img_url: '/static/temp/avatar.jpeg',
					name: '币圈二御姐儿',
					isSelect: true,
				}]
			},
			switchChange(e, keyName) {
				let value = e.detail.value;
				this[keyName] = value;
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
	width: 100%;
	padding: $space-base;
	box-sizing: border-box;
	justify-content: space-between;
	align-items: center;
	background-color: #fff;
}
.item_title{
	font-size: 30upx;
}
.avatar{
	@include circle(60upx);
	margin-right: 20upx;
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
