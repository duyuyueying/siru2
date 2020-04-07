<template>
	<view>
		<view v-for="(item, index) in dataList" :key="index" class="news-item" @click="navToDetails(item)">
			<!-- 直播 -->
			<uni-vedio-list-item :item="item" v-if="tabItem.name == '视频'"></uni-vedio-list-item >
			<!-- 专栏 -->
			<person-list-item :item="item" v-else-if="tabItem.name == '专栏'">
				<view class="flex_row">
					<view class="flex_row mr20"><text class="m-head_left_text" style="marginRight: 10upx">文章  </text><text class="m-head_left_text" style="color:#000">111</text></view>
					<view  class="flex_row"><text class="m-head_left_text">粉丝  </text><text class="m-head_left_text" style="color:#000">222</text></view>
				</view>
			</person-list-item>
			<!-- 币种 -->
			<uni-coins-item :item="item" v-else-if="tabItem.name == '币种'"></uni-coins-item>
			<!-- 交易所 -->
			<uni-ex-change-item :item="item" v-else-if="tabItem.name == '交易所'"></uni-ex-change-item>
			<!-- 快讯 -->
			<fast-news-item :newsItem="item" v-else-if="tabItem.name == '快讯'"></fast-news-item>
			<!-- 文章 -->
			<news-item :newsItem="item" v-else></news-item>
		</view>
	</view>
</template>

<script>
	import {uniStatusBar } from '@dcloudio/uni-ui';
	import uniTabSwiper from '@/components/uni-tab-swiper/uni-tab-swiper'
	import newsItem from '@/components/list-item/news-item.vue';
	import fastNewsItem from '@/components/list-item/fast-news-item.vue';
	import personListItem from '@/components/list-item/person-list-item.vue';
	import liveItem from '@/components/list-item/uni-video-list-item.vue';
	import uniCoinsItem from '@/components/list-item/uni-coins-item.vue';
	import uniExChangeItem from '@/components/list-item/uni-exchange-item.vue';
	import {loadMore, getElSize} from '@/common/util.js';
	
	let scrollTimer = false, tabBar;
	let HISTORY_LIST = 'HISTORY_LIST'; // 存放历史数据的keyName
	export default {
		name:'search-list-page',
		props: {
			data: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				tabItem: this.data,
				pageSize: 15,
				dataList: [],
				loadMoreStatus: 0,
				pageNum: 1,
				total: 0,
				pageSize: 15,
				lastPage: 1,
			}
		},
		computed: {
			keyWord(){
				return this.data.keyWord
			}
		},
		components:{
			newsItem,
			uniCoinsItem,
			uniExChangeItem,
			personListItem,
			liveItem,
			fastNewsItem,
			uniTabSwiper
		},
	
		methods: {
			initData(){
        this.loadList('refresh')
      },
      loadMore(){
        this.loadList('add')
      },
			//搜索列表
			async loadList(action){
				//action= add上拉加载 refresh下拉刷新
				if (action=='refresh') {
					this.dataList = [];
					this.pageNum = 1;
					this.loadMoreStatus = 0;
					 this.$emit('changeLoadStatus', 0)
				}
				if (this.loadMoreStatus==0) {
					this.loadMoreStatus = 1;
					 this.$emit('changeLoadStatus', 1)
					// 自盘
					let data = [];
					if(this.tabItem.name == '文章') {
						data = await this.$api.search_articles({
							type: [1,3],
							keyword: this.keyWord,
							pageNum: this.pageNum,
							pageSize: this.pageSize,
						});
					} else if(this.tabItem.name == '快讯'){
						data = await this.$api.search_articles({
							type: 2,
							keyword: this.keyWord,
							pageNum: this.pageNum,
							pageSize: this.pageSize,
						});
					} else if(this.tabItem.name == '币种' ||this.tabItem.name == '交易所'){
						data = await this.$api.search_coins({
							keyword: this.keyWord,
							pageNum: this.pageNum,
							exhangePage: this.pageNum,
							pageSize: this.pageSize,
						});
					}
					
					if (data && data.code == 200) {
						let result = [];
						if(this.tabItem.name == '币种') {
							if(data.result.code == 200){
								result = data.result.coinlist || [];
								this.lastPage = data.result.coin_maxpage
							}
						} else if(this.tabItem.name == '交易所'){
							if(data.result.code == 200){
								result = data.result.exchangelist || [];
								this.lastPage = data.result.exchange_maxpage
							}
						}else {
							result = data.result.data || [];
							this.lastPage = data.result.last_page
						}
						this.dataList.push(...result);
						this.$emit('changeRefreshStatus', false);
						if (this.pageNum==this.lastPage) {
							this.loadMoreStatus = 2;
							 this.$emit('changeLoadStatus', 2)
						}else{
							this.loadMoreStatus = 0;
							 this.$emit('changeLoadStatus', 0)
						}
						this.pageNum += 1;
					} else {
						this.$message(data.msg)
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	.m-head_left_text{
		@include txt;
	}	
</style>
