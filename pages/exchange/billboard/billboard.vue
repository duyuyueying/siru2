<template>
	<view style="height: 100%;">
		<mix-pulldown-refresh ref="mixPulldownRefresh" class="panel-content" :top="90" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll">
			<scroll-view
				class="panel-scroll-box" 
				:scroll-y="enableScroll" 
				@scrolltolower="loadMore"
				>
				<view v-if="type=='24h'">
						<divide-table-cell-head :items="['名称','最新价(CNY)','24H成交额']"></divide-table-cell-head>
					<divide-table-cell v-for="(item, index) in dataList" :item="item" :key="index" :type="type"></divide-table-cell>
				</view>
				<view v-if="type=='rise'">
					<divide-table-cell-head :items="['名称','最新价','24H涨幅']"></divide-table-cell-head>
					<divide-table-cell v-for="(item, index) in dataList" :item="item" :key="index" :type="type"></divide-table-cell>
				</view>
				<view v-if="type=='fall'">
					<divide-table-cell-head :items="['名称','最新价','24H跌幅']"></divide-table-cell-head>
					<divide-table-cell v-for="(item, index) in dataList" :item="item" :key="index" type="riseAndFall"></divide-table-cell>
				</view>
				<mix-load-more :status="loadMoreStatus"></mix-load-more>
			</scroll-view>
		</mix-pulldown-refresh>
	</view>
</template>

<script>
	import divideTableCellHead from '@/pages/exchange/divide_table_cell_head.vue';
	import divideTableCell from '@/pages/exchange/divide_talbe_cell.vue';
	import {loadMore} from '@/common/util.js';
	import {coins} from '@/mock/data.js';
	export default {
		data() {
			return {
				type: '', // 那种类型的榜单
				dataList: [],
				loadMoreStatus:  0, //加载更多 0加载前，1加载中，2没有更多了
				refreshing: false, // 刷新状态
			}
		},
		mixins:[loadMore],
		onLoad(e){
			this.type = e.type;
			if(e.type === '24h') {
				uni.setNavigationBarTitle({
					title: '24H成交额'
				})
			} else if(e.type == 'fall') {
				uni.setNavigationBarTitle({
					title: '跌幅榜'
				})
			} else if (e.type == 'rise') {
				uni.setNavigationBarTitle({
					title: '涨幅榜'
				})
			}
			this.loadList('add');
		},
		components:{
			divideTableCellHead,
			divideTableCell,
		},
		methods: {
			//列表
			loadList(type){
				// let tabItem = this.tabBars[this.currTab];
				//type add 加载更多 refresh下拉刷新
				
				if(type === 'add'){
					if(this.loadMoreStatus === 2){
						return;
					}
					this.loadMoreStatus = 1;
				}
				// #ifdef APP-PLUS
				else if(type === 'refresh'){
					this.refreshing = true;
				}
				// #endif
				
				//setTimeout模拟异步请求数据
				setTimeout(()=>{
					let list = coins;
					list.sort((a,b)=>{
						return Math.random() > .5 ? -1 : 1; //静态数据打乱顺序
					})
					if(type === 'refresh'){
						// 刷新前清空数组
						this.dataList = [];
					}
					let tempArr = [];
					list.forEach(item=>{
						item.id = parseInt(Math.random() * 10000);
						tempArr.push(item);
					});
					this.dataList.push(...tempArr);
					//下拉刷新 关闭刷新动画
					if(type === 'refresh'){
						this.$refs.mixPulldownRefresh && this.$refs.mixPulldownRefresh.endPulldownRefresh();
						// #ifdef APP-PLUS
						this.refreshing = false;
						// #endif
						this.loadMoreStatus = 0;
					}
					//上滑加载 处理状态
					if(type === 'add'){
						this.loadMoreStatus = this.dataList.length > 40 ? 2: 0;
					}
				}, 600)
			},
		}
	}
</script>

<style>
.panel-scroll-box{
	height: 660px;
}
</style>
