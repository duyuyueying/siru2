<template>
	<view class="flex flex_row list_item" @click="onClick">
		<view class="flex2 center">
			<text class="blod_black_txt">{{item.rank}}</text>
		</view>
		<view class="flex1 flex_column ">
			<image class="logo_img" style="width: 50upx;height: 50upx;margin-right: 8upx" :src="item.logo"></image>
		</view>
		<view class="flex4 flex_column ">
			<text class="blod_black_txt">{{item.name}}</text>
			<text class="normal_txt">{{item.fullname}}</text>
		</view>
		<view class="flex7 flex_column">
			<text class="blod_black_txt">&yen;{{unitConvert(item.market_value)}}</text>
			<text class="normal_txt">24h:&yen;{{unitConvert(item.vol)}}</text>
		</view>
		<view class="flex6 flex_column">
			<text class="blod_black_txt" :style="{color:item.change_percent>0 ? upTheme.txt: downTheme.txt}">&yen;{{item.current_price}}</text>
			<text class="normal_txt" :style="{color: item.change_percent>0 ? upTheme.txt : downTheme.txt}">{{item.change_percent>0?'+':''}}{{item.change_percent}}%</text>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex';
	import { unitConvert } from '@/common/util.js';
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
		mixins:[unitConvert],
		created() {
			// 计算币的涨跌颜色
			this.theme = this.color(this.item.startPrice, this.item.endPrice);
		},
		computed: mapState(['upTheme','downTheme']),
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
