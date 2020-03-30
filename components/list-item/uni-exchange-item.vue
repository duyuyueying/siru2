<template>
	<view class="list_item_wrap list_container" @click="goPage">
		<view class="icon_wrapper">
			<image class="image-list1" :src="item.platform_logo"></image>
		</view>
		<view class="content_wapper">
			<text class="list_item_black_title_sm heavy">{{item.platform_name}}</text>
			<text class="normal_txt">交易对&nbsp;{{item.pairs}}</text>
		</view>
		<view class="content_wapper">
			<text class="list_item_black_title_sm heavy">{{unitConvert(item.volum_24h)}}</text>
			<text class="list_item_black_txt">24H交易额</text>
		</view>
		<view class="content_wapper u-progress_wrap">
			<view style="flex:3" class="mr20"><progress stroke-width="8" activeColor="#ffb100" :percent="item.exrank*10"></progress></view>
			<view style="flex:1;"><text class="title_txt">{{item.exrank}}</text></view>
		</view>
	</view>
</template>

<script>
	import {unitConvert} from '@/common/util.js';
	export default {
		data() {
			return {
				
			};
		},
		props: {
			item: Object
		},
		mixins:[unitConvert],
		created() {
			this.theme = uni.getStorageSync('markTheme') || 'greenUp';
		},
		methods:{
			goPage() {
				let exChangeName = this.item.exChangeName || 'HitBTC';
				uni.navigateTo({
					url: '/pages/exchange/exchange?exChangeName='+exChangeName
				});
			}
		},
		computed: {
			isUp(){
				return (this.item.start - this.item.end) > 0;
			}
		}
	}
</script>

<style lang="scss">
.list_container{
	// @include flexRow;
	// background-color: #fff;
	padding: 0 $space-lg;
	// border-width: 0upx;
	// border-bottom-width: 2upx;
	// border-color: #f9f9f9;
	// border-style: solid;
}
.icon_wrapper {
	width: 80upx;
	padding-top: 20upx;
}
.image-list1{
	width: 50upx;
	height: 50upx;
}
.content_wapper{
	@extend .flex_column;
	flex: 2;
	padding: 20upx 0upx;
}
.title_txt {
	color: #858585;
	font-size: 24upx;
}
.txt{
	color: #000000;
	font-size: 30upx;
	font-weight: bold;
}
.u-progress_wrap{
	flex: 1;
	@include flex-center
}
</style>
