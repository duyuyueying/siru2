<template>
	<view class="flex flex_row list_item" @click="onClick" :class="{isSelect: isSelect}">
		<view class="flex5 flex_column" v-if="type === 'exchange'">
			<view class="flex_row"><text class="list_item_black_title_sm heavy right_space_base">ONT</text><text class="normal_txt">/BTC</text></view>
			<text class="normal_txt">1942233.1</text>
		</view>
		<view class="flex5 flex_column" v-else>
			<view class="flex_row"><text class="list_item_black_title_sm heavy right_space_base">{{item.name}}</text><text class="normal_txt">/{{item.code}}</text></view>
			<text class="normal_txt">{{item.fullname}}</text>
		</view>
		<view class="flex6" v-if="type != 'search'">
			<view class="flex_column" v-if="pricePosition == 'CNYUP'">
				<text class="list_item_black_title_sm heavy">&yen;{{item.current_price}}</text>
				<text class="normal_txt">={{item.current_price_usd}}USDT</text>
			</view>
			<view class="flex_column" v-else-if="pricePosition == 'CNYUP'">
				<text class="list_item_black_title_sm heavy">${{item.current_price_usd}}</text>
				<text class="normal_txt">={{item.current_price}}CNY</text>
			</view>
		</view>
		<view class="flex6" v-else></view>
		<view class="flex4 flex_row">
			<view class="btn" :style="{backgroundColor: item.change_percent > 0 ? upTheme.txt: downTheme.txt}" v-if="type !='search'">
				<text class="list_item_black_title_sm btn_txt" style="color:#fff">{{item.change_percent}}%</text>
			</view>
			<view style="width: 100upx;" v-else></view>
			<view @click.stop="collect" class="collect_btn_wrap flex center" v-if="hasCollect">
				<icons type="collect" :color="item.isCollect ? '#ffb100' : '#a0a0a0'"></icons>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex';
	import icons from '@/components/icons/icons.vue';
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
