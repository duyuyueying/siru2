<template>
	<view class="container">
		<view class="bg_wrapper">
			<view :style="{ height: (iStatusBarHeight+44)+ 'px'}">
			  <!-- 这里是状态栏 /44的navbar-->
			</view>
			<view class="section">
				<text class="txt">#{{data.name}}#</text>
				<view class="btn" @click="focus"><text class="desc_txt" :style="{color: isFocus ? '#a0a0a0' : '#000'}">{{isFocus ? '已关注' : '+ 关注'}}</text></view>
			</view>
		</view>
		<mix-pulldown-refresh ref="mixPulldownRefresh" class="panel-content" :top="0" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll">
			<scroll-view
				class="panel-scroll-box" 
				:scroll-y="enableScrollY" 
				@scrolltolower="loadMore"
				>
				<news-item :newsItem="item" v-for="(item, index) in dataList" :key="index"></news-item>
				<!-- 上滑加载更多组件 -->
				<mix-load-more :status="loadMoreStatus"></mix-load-more>
			</scroll-view>
		</mix-pulldown-refresh>
	</view>
</template>

<script>
	import {focusAuthor, newItem, newsItems} from '@/mock/data.js';
	import newsItem from '@/components/list-item/news-item.vue';
	import {loadMore} from '@/common/util.js';
	export default {
		data() {
			return {
				data: focusAuthor,
				iStatusBarHeight: 0,
				dataList: [],
				loadMoreStatus:  0, //加载更多 0加载前，1加载中，2没有更多了
				refreshing: false, // 刷新状态
				isFocus: false, // 是否被关注
				enableScrollY: false,
				scrollViewOffset: 0,
			}
		},
		mixins:[loadMore],
		components:{
			newsItem
		},
		onLoad() {
			this.iStatusBarHeight  = uni.getSystemInfoSync().statusBarHeight;
			this.loadList('add');
			uni.setNavigationBarTitle({
				title: `#${this.data.name}#`
			})
		},
		onPageScroll(e) {
			if(Math.ceil(e.scrollTop) + 20 > this.scrollViewOffset ) {
				this.enableScrollY = true;
			} else {
				this.enableScrollY = false;
			}
		},
		mounted() {
			this.getElSize();
		},
		methods:{
			//列表
			loadList(type){
				// let tabItem = this.tabBars[this.currTab];
				//type add 加载更多 refresh下拉刷新
				console.log(this.loadMoreStatus);
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
					let list = newsItems;
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
			//获得元素的size
			getElSize() { 
				let el = uni.createSelectorQuery().select('.panel-scroll-box');
				el.fields({
					size: true,
					scrollOffset: true,
					rect: true
				}, (data) => {
					this.scrollViewOffset = data.top;
				}).exec();
			},
			
			focus() {
				let id = this.data.id;
				this.isFocus = !this.isFocus
			}
		}
	}
</script>

<style lang="scss">
	page,.container{
		height: 100%;
		// overflow: hidden;
	}
	.panel-scroll-box{
		height: 100%;
	}
	.bg_wrapper{
		position: relative;
		z-index: 2;
		height: 400upx;
		align-items: center;
		justify-content: center;
		background-image: radial-gradient(farthest-corner at 100% 100%, #1e0900,#bf7101 , #b25900);
	}
	.txt{
		// line-height: 56upx;
		@include txt(32upx, #fff);
	}
	.desc_txt{
		@include txt(28upx, #000);
		text-align: center;
	}
	.section{
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 50upx;
		height: 300upx;
		flex: 1;
	}
	.btn{
		width: 140upx;
		height: 56upx;
		border-radius: 30upx;
		background-color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 20upx;
	}
</style>
