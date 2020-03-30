<template>
	<view class="flex flex_row list_item" @click="onClick" :class="{isSelect: isSelect}">
		<view class="flex5 flex_column">
			<view class="flex_row"><text class="list_item_black_title_sm heavy right_space_base">{{item.name}}</text></view>
			<text class="normal_txt">{{item.pair1}}/{{item.pair2}}</text>
		</view>
		<view class="flex6 vertical_center">
			<view class="flex_column">
				<text class="list_item_black_title_sm heavy">&yen;{{item.price}}</text>
			</view>
		</view>
		<view class="flex6 vertical_center">
			<view class="flex_column">
				<text class="list_item_black_title_sm heavy">{{unitConvert(item.volume)}}</text>
			</view>
		</view>
		<view class="flex4 flex_row vertical_center">
			<view v-if="type !='search'">
				<text class="list_item_black_title_sm heavy btn_txt">{{item.accounting}}%</text>
			</view>
			<view style="width: 100upx;" v-else></view>
			<view @click.stop="collect" class="collect_btn_wrap flex center" v-if="hasCollect">
				<icons type="collect" :color="item.is_follow ? '#ffb100' : '#a0a0a0'"></icons>
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
				this.$emit('collect', this.item.exchange_code);
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
	.vertical_center{
		display: flex;
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
