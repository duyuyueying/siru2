<template>
	<view class="flex flex_row list_item" @click="onClick">
		<view class="flex5 flex_column">
			<view class="flex_row center"><text class="list_item_black_title_sm heavy right_space_base">{{item.name}}</text><text class="normal_txt">/{{item.unit}}</text></view>
			<text class="normal_txt">{{item.exChange}}</text>
		</view>
		<view class="flex6 flex_column">
			<text class="list_item_black_title_sm heavy">&yen;{{item.cnyPrice}}</text>
			<text class="normal_txt">={{item.price}}USDT</text>
		</view>
		<view class="flex4">
			<view class="btn" :style="{backgroundColor: theme != null ? theme.txt: '#ccc'}"><text class="list_item_black_title_sm btn_txt">{{isUp>0?'+':'-'}}{{item.rate}}%</text></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				theme: null,
			};
		},
		props:{
			item: Object
		},
		created() {
			// 计算币的涨跌颜色
			this.theme = this.color(this.item.startPrice, this.item.endPrice);
		},
		methods:{
			// 这个方法本来封装出去的，但这个组件引用不了，奇怪
			color(start, end) {
				let colors = {
					greenUp: {txt: '#39b54a', bg: '#d7f0db'},
					greenDown: {txt: '#e54d42', bg: '#fadbd9'}
				}
				let theme = uni.getStorageSync('markTheme');
				if(!theme) {
					uni.setStorageSync('markTheme', 'greenUp');
					theme = 'greenUp'
				}
				let isUp = end - start > 0;
				if(isUp) {
					if(theme == 'greenUp'){
						return colors.greenUp
					} else {
						return colors.greenDown
					}
				} else {
					if(theme == 'greenUp'){
						return colors.greenDown
					} else {
						return colors.greenUp
					}
				}
			},
			onClick(){
				this.$emit('click');
				
			}
		},
		computed:{
			isUp(){
				return this.item.startPrice - this.item.endPrice < 0
			}
		}
	}
</script>

<style lang="scss">
	.list_item{
		padding: $space-lg;
		background-color: $whiteColor;
		border: 0 solid $borderColor;
		border-bottom-width: 2upx;
	}
	.center{
		
	}
	.btn{
		padding: $space-sm $space-base;
		border-radius: 6upx;
		text-align: center;
	}
	.btn_txt{
		color: #fff;
	}
</style>
