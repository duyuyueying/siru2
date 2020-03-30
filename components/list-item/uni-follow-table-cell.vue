<template>
	<view class="flex flex_row list_item" @click="onClick" :class="{isSelect: isSelect}">
		<view class="flex5 flex_column">
			<view class="flex_row"><text class="list_item_black_title_sm heavy right_space_base">{{item.symbol}}</text></view>
			<text class="normal_txt">市值：{{unitConvert(item.marketCapUsd)}}</text>
		</view>
		<view class="flex6">
			<view class="flex_column">
				<text class="list_item_black_title_sm heavy">{{Number(item.priceUsd).toFixed(2)}}USDT</text>
				<text class="normal_txt">成交量：{{unitConvert(item.volumeUsd24Hr)}}</text>
			</view>
		</view>
		<view class="flex4 flex_row">
			<view class="btn" :style="{backgroundColor: item.changePercent24Hr > 0 ? upTheme.txt: downTheme.txt}">
				<text class="list_item_black_title_sm btn_txt" style="color:#fff">{{item.changePercent24Hr > 0 ?'+':''}}{{Number(item.changePercent24Hr).toFixed(2)}}%</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex';
	import icons from '@/components/icons/icons.vue';
	import { unitConvert } from '@/common/util.js';
	export default {
		data(){
			return {
				isCollect: false
			}
		},
		props:{
			item: Object,
			hasCollect: {
				type: Boolean,
				default: false
			},
			isSelect: {
				type: Boolean,
				default: false
			},
			type: {
				type: String,
				default: 'quotations'
			}
		},
		mixins:[unitConvert],
		components:{
			icons
		},	
		created() {
			// this.isCollect = this.item.isCollect || false;
			console.log(this.isSelect,this.item);
		},
		methods:{
			onClick(){
				let symbol = this.item.symbol;
				let exChangeName = this.item.exChangeName
				uni.navigateTo({
					url: '/pages/quotations/coinDetail?symbol='+symbol+'&exChangeName='+exChangeName
				});
				// this.$emit('click');
			},
			// 自选
			collect() {
				this.$emit('collect', this.item.id);
			}
		},
		computed:{
			...mapState(['upTheme', 'downTheme', 'pricePosition']),
			isUp(){
				return this.item.startPrice - this.item.endPrice < 0
			}
		},
		watch:{
			item(e) {
				console.log(e)
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
		align-items: center;
	}
	.btn{
		padding: $space-sm $space-base;
		border-radius: 6upx;
		text-align: center;
	}
	.collect_btn_wrap{
		margin-left: $space-sm;
		// line-height: ;
	},
	.isSelect{
		background-color: #f5f5f5;
	}
</style>
