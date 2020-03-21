
<template>
	<view @click="gotoPage">
		<!-- 24H成交额 -->
		<view class="flex flex_row list_item" v-if="type =='24h'">
			<view class="flex2 flex_column">
				<view class="flex_row center"><text class="list_item_black_title_sm heavy right_space_base">{{item.name}}</text><text class="normal_txt">/{{item.unit}}</text></view>
			</view>
			<view class="flex2">
				<text class="list_item_black_title_sm heavy" :style="{color: isUp ? upTheme.txt: downTheme.txt}">&yen;{{item.cnyPrice}}</text>
			</view>
			<view class="flex1">
				<text class="list_item_black_title_sm heavy right_space_base">{{item.oneDay}}</text>
			</view>
		</view>
		<!-- 涨幅榜 -->
		<view class="flex flex_row list_item" v-else>
			<view class="flex2 center">
				<view class="flex_row center"><text class="list_item_black_title_sm heavy right_space_base">{{item.name}}</text><text class="normal_txt">/{{item.unit}}</text></view>
			</view>
			<view class="flex2 center">
				<text class="list_item_black_title_sm heavy">&yen;{{item.cnyPrice}}</text>
			</view>
			<view class="flex1">
				<view class="btn" :style="{backgroundColor: isUp ? upTheme.txt: downTheme.txt}"><text class="list_item_black_title_sm btn_txt">{{isUp>0?'+':'-'}}{{item.rate}}%</text></view>
			</view>
		</view>
	</view>
	
</template>

<script>
	import {mapState} from 'vuex';
	export default {
		data() {
			return {
				theme: null,
			};
		},
		props:{
			item: Object,
			type: String, //那种类型的cell： 24h|riseAndFall
		},
		methods:{
		
			gotoPage(symbol, exChangeName){
				uni.navigateTo({
					url: '/pages/quotations/coinDetail?symbol='+symbol+'&exChangeName='+exChangeName,
				});
			}
		},
		computed:{
			...mapState(['upTheme','downTheme']),
			isUp(){
				return this.item.startPrice - this.item.endPrice < 0
			}
		}
	}
</script>

<style lang="scss">
	.list_item{
		padding: $space-base $space-lg;
		background-color: $whiteColor;
		border: 0 solid $borderColor;
		border-bottom-width: 2upx;
	}
	.center{
		align-items: center;
		@extend .flex;
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
