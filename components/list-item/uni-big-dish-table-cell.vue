<template>
	<view class="flex flex_row list_item" @click="onClick">
		<view class="flex3 center">
			<text class="blod_black_txt">{{item.rank}}</text>
		</view>
		<view class="flex4 flex_column">
			<text class="blod_black_txt">{{item.name}}</text>
			<text class="normal_txt">{{item.nikeName}}</text>
		</view>
		<view class="flex7 flex_column">
			<text class="blod_black_txt">&yen;{{item.total}}亿</text>
			<text class="normal_txt">24h:&yen;{{item.oneDay}}亿</text>
		</view>
		<view class="flex6 flex_column">
			<text class="blod_black_txt" :style="{color: theme != null ? theme.txt: '#ccc'}">&yen;{{item.price}}</text>
			<text class="normal_txt" :style="{color: theme != null ? theme.txt: '#ccc'}">{{isUp>0?'+':'-'}}{{item.rate}}%</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'tableCell',
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
	@import '@/common/quotations.scss';
	.center{
		justify-content: center;
	}
	.list_item{
		padding: $space-lg;
		background-color: $whiteColor;
		@include sideBorder(top);
	}
</style>
