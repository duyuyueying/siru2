

<template>
	<view>
		<view class="table_head">
			<view class="flex flex_row">
				<view class="flex4"><text class="normal_txt">取消自选</text></view>
				<view class="flex2"><text class="normal_txt">置顶</text></view>
				<view class="flex1"><text class="normal_txt">拖动</text></view>
			</view>
		</view>
		<view class="flex flex_row list_item" v-for="(item, index) in coins" :key="item.id">
			<view class="flex4">
				<view class="flex_row" @click="toggleCollect(item.id, index)">
					<icons type="collect" :color="item.isCollect ? '#ffb011' : '#a0a0a0'"></icons>
					<view class="flex_column ml20">
						<text class="blod_black_txt">{{item.name}}</text>
						<text class="normal_txt">{{item.exChange}}</text>
					</view>
				</view>
			</view>
			<view class="flex2">
				<icons type="sort" color="#a0a0a0" @click="top(item.id, index)"></icons>
			</view>
			<view class="flex1">
				<icons type="menu" color="#a0a0a0"></icons>
			</view>
		</view>
	</view>
</template>

<script>
	import icons from '@/components/icons/icons.vue';
	import {coins} from '@/mock/data.js';
	export default {
		data() {
			return {
				coins: [{
					id: 1,
					name: 'BTCP',
					exChange: '全球均价',
					isCollect: true,
					
				},
				{
					id: 2,
					name: 'BTC',
					exChange: '全球均价',
					isCollect: true,
				},{
					id: 3,
					name: 'TC',
					exChange: '全球均价',
					isCollect: true,
				}]
			}
		},
		components:{
			icons
		},
		onNavigationBarButtonTap(e) {
			if(e.text == '添加') {
				uni.navigateTo({
					url: '../search/search'
				});
			}
		},
		created() {
		
		},
		methods: {
			// 切换自选状态
			toggleCollect(id, index){
				let newArray = [...this.coins];
				newArray[index].isCollect = !newArray[index].isCollect;
				this.coins = newArray;
			},
			// 置顶
			top(id, index) {
				let currItem = this.coins.splice(index, 1);
				this.coins.unshift(...currItem);
			}
		}
	}
</script>

<style lang="scss">
	@import '@/common/quotations.scss';
.table_head{
		height: 64upx;
		background-color: $bgColor;
		justify-content: center;
		padding: 0 $space-lg;
	}
	.list_item{
		padding: $space-lg;
		background-color: $whiteColor;
		@include sideBorder(top);
	}
</style>
