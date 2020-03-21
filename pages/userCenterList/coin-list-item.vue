<template>
	<view class="list_container ">
		<view class="content_wapper flex_column">
			<text class="txt">{{item.source}}</text>
			<text class="title_txt">{{moment(item.time)}}</text>
		</view>
		<view class="u-count_wrap">
			<view style="flex:1;"><text class="u-focus_txt">+{{item.count}}</text></view>
		</view>
	</view>
</template>

<script>
	import moment from 'moment';
	export default {
		data() {
			return {
				
			};
		},
		props: {
			item: Object
		},
		created() {
			this.theme = uni.getStorageSync('markTheme') || 'greenUp';
		},
		methods: {
			moment(time){
				return moment(time).format('YYYY-MM-DD');
			}
		}
	}
</script>

<style lang="scss">
.list_container{
	@include flexRow;
	background-color: #fff;
	padding: 0 $space-lg;
	border-width: 0upx;
	border-bottom-width: 2upx;
	border-color: #f9f9f9;
	border-style: solid;
}
.content_wapper{
	flex: 4;
	padding: 20upx 0upx;
}
.title_txt {
	@include txt;
}
.u-focus_txt{
	@include txt(30upx,$mainColor);
	font-weight: 600;
}
.txt{
	color: #000000;
	font-size: 30upx;
	line-height: 50upx;
}
.u-count_wrap{
	@include flex-center($justify: flex-end)
}
</style>
