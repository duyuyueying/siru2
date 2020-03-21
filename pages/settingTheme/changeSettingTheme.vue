<template>
	<view>
		<view class="list" v-for="(list,list_i) in severList" :key="list_i">
			<uni-title :title="list.name" :isBold="false" :height="120" @click="changeTheme(list.code, list_i)" :color="list.isSelect ? '#ffb100' : '#333'">
				<view><icons type="right" :color="list.isSelect ? '#ffb100' : '#ddd'"></icons></view>
			</uni-title>
		</view>
		<view v-if="type=='price'" class="preview_box">
			<uni-title title="预览" ></uni-title>
			<uni-self-dish-table-head @headClick="goEditPage">
				<view class="edit_cell"><text class="normal_txt">名称</text></view>
			</uni-self-dish-table-head>
			<uni-self-dish-table-cell :item="coin"></uni-self-dish-table-cell>
		</view>
	</view>
</template>

<script>
	import uniTitle from '@/components/uni-title.vue';
	import icons from '@/components/icons/icons.vue';
	import {mapState, mapMutations} from 'vuex';
	import uniSelfDishTableHead from '@/components/list-item/uni-self-dish-table-head.vue';
	import uniSelfDishTableCell from '@/components/list-item/uni-self-dish-table-cell.vue';
	const SETTING_COLORS= [{
		name: '绿涨红跌',
		code: 'greenUp'
	}, {
		name: '红涨绿跌',
		code: 'greenDown'
	}];
	const PRICE_SETTING= [{
		name: 'CNY价格',
		code: 'CNYUP',
	}, {
		name: 'USDT价格',
		code: 'CNYDOWN',
	}];
	export default {
		data() {
			return {
				severList:[],
				type: '', // 表示设置颜色，还是设置价格
				coin: {
					rank: 1,
					icon_url: 'xxx',
					name: 'BZ',
					nikeName: '比特币',
					price: '5388.08',
					cnyPrice: '37780.17',
					change: 3.53,
					startPrice: 131,
					endPrice:452,
					exChange: '火币全球站',
					rate: '3.25',
					unit: 'USDT', // USDT是单位？
					oneDay: '4388.08',
					total: '15388.08',
					icon_url: 'xxx',
					exRangk: 7,
					name: 'BZ',
					eosAndEth: '110',
					sale: 2084.76,
					totalPrice: 14800
				}
			}
		},
		components:{
			uniTitle,
			uniSelfDishTableHead,
			uniSelfDishTableCell
		},
		computed: mapState(['colorTheme', 'pricePosition']),
		onLoad(e) {
			this.type = e.type;
			if(e.type === 'color') {
				this.initState(this.colorTheme, SETTING_COLORS);
			} else {
				this.initState(this.pricePosition, PRICE_SETTING);
			}
		},
		methods: {
			...mapMutations(['COLOR_THEME', 'PRICE_POSITION']),
			changeTheme(theme, index) {
				if(this.type == 'color' && theme != this.colorTheme) {
					this.initState(theme, SETTING_COLORS);
					this.COLOR_THEME(theme);
					uni.setStorage({
						key: 'COLOR_THEME',
						data: theme
					});
				}
				if(this.type === 'price' && theme != this.pricePosition) {
					this.initState(theme, PRICE_SETTING);
					this.PRICE_POSITION(theme);
					uni.setStorage({
						key: 'PRICE_POSITION',
						data: theme
					});
				}
			},
			// 初始化statecolor的值
			initState(currTheme,dataSource) {
				let tempArr = [];
				dataSource.forEach(item=>{
					let newItem = Object.assign({}, item);
					if(newItem.code == currTheme) {
						newItem.isSelect = true;
					}
					tempArr.push(newItem);
				})
				this.severList = tempArr;
			}
		}
	}
</script>

<style lang="scss">
.list{
	@include sideBorder;
}
.preview_box{
	padding: 50upx;
}
</style>
