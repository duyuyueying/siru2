<template>
	<view class="container">
		<scroll-view
			class="panel-scroll-box" 
			:scroll-y="enableScroll" 
			@scrolltolower="loadMore"
			>
		<view class="bg_wrapper" :style="{backgroundImage: 'url('+data.image_url+')'}">
			<view class="section">
				<text class="title">{{data.title}}</text>
			</view>
			<view class="guide_wrap" :style="{height: height+'px'}">
				<view class="guide_content_wrap">
					<view class="guide_inner">
						<text class="list_item_black_title_base heavy">导读:</text>
						<text class="list_item_black_title_base">{{data.guide}}</text>
					</view>
				</view>
				<view class="unfold" @click="toggleHieght">
					<text class="list_item_black_title_base" style="color: #489aff;">展开</text>
				</view>
			</view>
		</view>
		<view style="margin-top: 230upx;">
<!-- 			<mix-pulldown-refresh ref="mixPulldownRefresh" class="panel-content" :top="90" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll">
 -->				
					<news-item :newsItem="item" v-for="(item, index) in dataList" :key="index"></news-item>
					<!-- 上滑加载更多组件 -->
					<mix-load-more :status="loadMoreStatus"></mix-load-more>
				
			<!-- </mix-pulldown-refresh> -->
		</view>
		</scroll-view>
	</view>
</template>

<script>
	import {focusAuthor, newItem, newsItems} from '@/mock/data.js';
	import newsItem from '@/components/list-item/news-item.vue';
	import {loadMore} from '@/common/util.js';
	export default {
		data() {
			return {
				data: {
					image_url: '/static/temp/banner.png',
					title: 'ETC减产 旷工会如何布局？',
					guide: '在四川省新型冠状病毒肺炎疫情防控工作第15场新闻发布会上。四川大学华西公共卫生学院教授张建新介绍，这12种情况可以不佩戴口罩：在田间地头、森林滩涂、牧场草原等农林牧副渔等户外劳动的时候；在自己的单位，包括公司日常工作，如果员工都没有发热、干咳等异常的症状的时候；在户外空旷的地方，比如公园、绿道、景区、大街等' 
				},
				dataList: [],
				loadMoreStatus:  0, //加载更多 0加载前，1加载中，2没有更多了
				refreshing: false, // 刷新状态
				isFocus: false, // 是否被关注
				height: 130, // 导读的默认高度
			}
		},
		mixins:[loadMore],
		components:{
			newsItem
		},
		onLoad() {
			this.loadList('add');
			
		},
		mounted() {
			this.toggleFlag = true; // 展开状态开关
			this.calcHeight();
		},
		methods:{
			//列表
			loadList(type){
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
			focus() {
				let id = this.data.id;
				this.isFocus = !this.isFocus
			},
			calcHeight() {
				let view = uni.createSelectorQuery().in(this).select(".guide_inner");
				view.fields({
				  size: true,
				  scrollOffset: true
				}, data => {
					this.trueHeight = data.height
				}).exec();
			},
			toggleHieght() {
				if(this.toggleFlag) {
					if(this.trueHeight > this.height){
						this.height = this.trueHeight;
					}
				} else {
					this.height = 130;
				}
				this.toggleFlag = !this.toggleFlag;
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
	}
	.title{
		@include txt(44upx, #fff);
	}
	.txt{
		@include txt(32upx, #fff);
	}
	.desc_txt{
		@include txt(28upx, #000);
		text-align: center;
	}
	.section{
		display: flex;
		justify-content: center;
		align-items: center;
		flex: 1;
		padding-top: 120upx;
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
	.guide_wrap{
		position: absolute;
		left: $space-lg;
		right: $space-lg;
		top: 330upx;
		padding: $space-base;
		background-color: #fff;
		overflow: hidden;
		border-radius: 8upx;
		z-index: 14;
		transition: height .5s;
		box-shadow: 0 10upx 50upx rgba(0,0,0, .2);
	}
	.guide_content_wrap{
		height: 100%;
		overflow: hidden;
	}
	.unfold{
		position: absolute;
		right: $space-base;
		bottom: $space-base;
		padding: 0 $space-sm;
		background-color: #fff;
		box-shadow: 0 0 50upx #fff;
	}
</style>
