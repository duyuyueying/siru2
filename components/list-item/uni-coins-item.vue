<template>
	<view class="list_container " @click="goPage">
		<view class="icon_wrapper">
			<image class="image-list1" :src="item.coinlogo"></image>
		</view>
		<view class="content_wapper">
			<text class="list_item_black_title_sm heavy">{{item.symbol}}</text>
			<text class="title_txt">{{item.native_name}}</text>
		</view>
		<view class="content_wapper" style="align-items: flex-end;">
			<text class="list_item_black_title_sm heavy">${{item.price}}</text>
			<text class="title_txt" :style="{color: item.change_percent > 0 ? upTheme.txt : downTheme.txt}">{{item.change_percent > 0 ? '+' : ''}} {{item.change_percent}} %</text>
		</view>
		<view @click.stop="collect" class="collect_btn_wrap center" v-if="hasCollect">
			<icons type="collect" :color="item.isCollect ? '#ffb100' : '#a0a0a0'"></icons>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex';
	import icons from '@/components/icons/icons.vue';
	
	export default {
		data() {
			return {
				
			};
		},
		props: {
			item: Object,
			hasCollect:{
				type: Boolean,
				default: false,
			}
		},
		components:{
			icons
		},
		mounted() {
			console.log(this)
		},
		methods:{
			goPage() {
				let symbol = this.item.symbol;
				let exChangeName = this.item.exChangeName || '';
				let code  = this.item.coincode
				uni.navigateTo({
					url: '/pages/quotations/coinDetail?symbol='+symbol+'&exChangeName='+exChangeName+'&code='+code
					
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
	.collect_btn_wrap{
		width: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
