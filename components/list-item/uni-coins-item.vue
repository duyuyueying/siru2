<template>
	<view class="list_container " @click="goPage">
		<view class="icon_wrapper">
			<image class="image-list1" src="../../static/temp/avatar.jpeg"></image>
		</view>
		<view class="content_wapper">
			<text class="list_item_black_title_sm heavy">{{item.name}}</text>
			<text class="title_txt">{{item.nikeName}}</text>
		</view>
		<view class="content_wapper" style="align-items: flex-end;">
			<text class="list_item_black_title_sm heavy">${{item.price}}</text>
			<text class="title_txt" :style="{color: isUp > 0 ? upTheme.txt : downTheme.txt}">{{isUp > 0 ? '+' : '-'}} {{item.change}} %</text>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex';
	export default {
		data() {
			return {
				
			};
		},
		props: {
			item: Object
		},
		mounted() {
			console.log(this)
		},
		methods:{
			goPage() {
				let symbol = this.item.name;
				let exChangeName = this.item.exChangeName || '';
				uni.navigateTo({
					url: '/pages/quotations/coinDetail?symbol='+symbol+'&exChangeName='+exChangeName
				});
			}
		},
		computed: {
			...mapState(['upTheme', 'downTheme']),
			isUp(){
				return (this.item.start - this.item.end) > 0;
			}
		}
	}
</script>

<style lang="scss">
.list_container{
	@include flexRow;
	background-color: #fff;
	padding: 0 $space-lg;
	
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
	flex: 1;
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
	.greenBg {
		background-color: #d7f0db;
	}
	.greenColor {
		color: #39b54a;
	}
	.redBg{
		background-color: #fadbd9
	}
	.redColor {
		color: #e54d42
	}
</style>
