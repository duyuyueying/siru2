<template>
	<view class="content">
		<!--
		* 广告组件
		* timedown 倒计时时间
		* imageUrl 背景图
		* url 跳转链接
		*  -->
		<!-- #ifndef MP -->
		<!-- <mix-advert 
			ref="mixAdvert" 
			:timedown="8" 
			imageUrl="/static/advert.jpg"
			:url="advertNavUrl"
		></mix-advert> -->
		<!-- #endif -->
		<!-- 头部 -->
		<view style="background-color: #fff;" class="fixed_navbar">
			<uni-status-bar />
			<view class="navbar_header">
				<view class="logo_wrap">
					<image src="/static/logo.png" mode="aspectFit" class="logo"></image>
				</view>
				<view class="flex1 radius search_wrap">
					<view class="input_search" @click="gotoSearchPage">
						<text class="input_search_txt">搜索你关注的内容</text>
						<uni-icons type="search" color="#999"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-navbar__placeholder">
			<uni-status-bar />
			<view class="uni-navbar__placeholder-view" />
		</view>
		<!-- 顶部选项卡 -->
		<scroll-view id="nav-bar" class="nav-bar" scroll-x scroll-with-animation :scroll-left="scrollLeft" :show-scrollbar="false">
			<view 
				v-for="(item,index) in tabBars" :key="index"
				class="nav-item"
				:class="{current: index === tabCurrentIndex}"
				:id="'tab'+index"
				@click="changeTab(index)"
			>{{item.name}}</view>
		</scroll-view>
		<!-- 下拉刷新组件 -->
		<mix-pulldown-refresh ref="mixPulldownRefresh" class="panel-content" :top="90" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll">
			<swiper 
				id="swiper"
				class="swiper-box" 
				:duration="300" 
				:current="tabCurrentIndex" 
				@change="changeTab"
			>
				<swiper-item v-for="(tabItem, index) in tabBars" :key="index">
					<scroll-view 
						class="panel-scroll-box" 
						:scroll-y="enableScroll" 
						@scrolltolower="loadMore"
						>
						<!-- 最新tab内容 -->
						<view class="main_news_section" v-if="tabItem.name == '最新'">
							<view class="banner_wrapper">
								<swiper-banner :swiperList="bannerList" :autoplay="true"></swiper-banner>
							</view>
							<view class="import_news_wrapper" v-if="importNews.length > 0">
								<view class="import_item" v-for="(item, index) in importNews" :key="index" @click="toPage(item.id, item.type)">
									<view class="import_item_head">
										<text class="import_item_title">{{index == 0 ? '新闻早八点' :'专题'}}</text>
										<text class="import_item_time">{{item.time}}</text>
									</view>
									<view class="import_item_content">
										<text class="import_item_content_txt">{{item.detail}}</text>
									</view>
									<view class="media-item-line" v-if="index==0"></view>
								</view>
							</view>
							<view class="import_news_list_wrapper">
								<news-item :newsItem="item" v-for="(item, index) in importNewsListData" :key="index"></news-item>
							</view>
							<view class="banner_wrapper" style="margin-bottom: 5px;">
								<swiper-banner :swiperList="specialList" :autoplay="false" cornerMark="专题"></swiper-banner>
							</view>
						</view>
						<!-- 关注头部 -->
						<view v-if="tabItem.name == '关注'" class="row_wrap focus_head_tab_wrap">
							<view class="flex_row_center">
								<view class="text_wrap" @click="changeFocusTabCurr(0, index)">
									<text class="list_item_normal_txt" :class="{focus_color: focusTabCurr == 0}">作者</text>
								</view>
								<view class="text_wrap" @click="changeFocusTabCurr(1, index)">
									<text class="list_item_normal_txt" :class="{focus_color: focusTabCurr == 1}">标签</text>
								</view>
							</view>
							<view class="text_wrap" @click="gotoSubscribe">
								<text class="list_item_more_black_txt">+订阅</text>
							</view>
						</view>
						<!-- 
							* 新闻列表 
							* 和nvue的区别只是需要把uni标签转为weex标签而已
							* class 和 style的绑定限制了一些语法，其他并没有不同
						-->
							<view v-for="(item, index) in tabItem.newsList" :key="index" class="news-item">
								<uni-vedio-list-item :item="item" v-if="tabItem.name == '视频'"></uni-vedio-list-item >
								<tag-list-item :items="item" v-else-if="tabItem.name == '关注' && focusTabCurr == 1"></tag-list-item>
								<person-list-item :item="item" v-else-if="tabItem.name == '关注' && focusTabCurr == 0" showDetail></person-list-item>
								<news-item :newsItem="item" v-else></news-item>
							</view>
						<!-- 上滑加载更多组件 -->
						<mix-load-more :status="tabItem.loadMoreStatus"></mix-load-more>
					</scroll-view>
				</swiper-item>
			</swiper>
		</mix-pulldown-refresh>
	</view>
</template>

<script>
	import mixAdvert from '@/components/mix-advert/vue/mix-advert';
	import mixPulldownRefresh from '@/components/mix-pulldown-refresh/mix-pulldown-refresh';
	import mixLoadMore from '@/components/mix-load-more/mix-load-more';
	import uniVedioListItem from '@/components/list-item/uni-video-list-item.vue';
	import newsItem from '@/components/list-item/news-item.vue';
	import personListItem from '@/components/list-item/person-list-item.vue';
	import TagListItem from '@/components/list-item/tag_list_item.vue';
	import swiperBanner from '@/components/swaper-banner.vue';
	import { uniStatusBar,uniIcons } from '@dcloudio/uni-ui';
	import icons from '@/components/icons/icons.vue'
	import {homeTab, newsItems, focusAuthors, tags, banner, newItem} from '@/mock/data.js';
	import json from '@/json'
	let windowWidth = 0, scrollTimer = false, tabBar;
	export default {
		components: {
			mixPulldownRefresh,
			mixLoadMore,
			mixAdvert,
			newsItem,
			personListItem,
			TagListItem,
			uniVedioListItem,
			swiperBanner,
			uniStatusBar,
			uniIcons
		},
		data() {
			return {
				tabCurrentIndex: 1, //当前选项卡索引
				scrollLeft: 0, //顶部选项卡左滑距离
				enableScroll: true,
				tabBars: [],
				importNewsListData: [], // 存放专题和新闻早八点之间的5条新闻
				specialList: [], // 专栏图片
				bannerList: [], // banner图片
				importNews: [], // 存放新闻早八点、专题的两条新闻 
				focusTabCurr: 0, // 存放关注页面【作者|标签】的tab
			}
		},
		computed: {
			advertNavUrl(){
				let data = {
					title: '测试跳转新闻详情',
					author: '测试作者',
					time: '2019-04-26 21:21'
				}
				return `/pages/details/details?data=${JSON.stringify(data)}`;
			} 
		},
		async onLoad() {
			// 获取屏幕宽度
			windowWidth = uni.getSystemInfoSync().windowWidth;
			this.loadTabbars();
		},
		onReady(){
			/**
			 * 启动页广告 使用文档（滑稽）
			 * 1. 引入组件并注册 
			 * 		import mixAdvert from '@/components/mix-advert/vue/mix-advert';
			 *      components: {mixAdvert},
					 <!-- #ifndef MP -->
						<mix-advert 
							ref="mixAdvert" 
							:timedown="8" 
							imageUrl="/static/advert.jpg"
							:url="advertNavUrl"
						></mix-advert>
					<!-- #endif -->
			 * 	2. 调用组件的initAdvert()方法进行初始化
			 * 
			 *  初始化的时机应该是在splash关闭时，否则会造成在app端广告显示了数秒后首屏才渲染出来
			 */
			// #ifndef MP
			// this.$refs.mixAdvert.initAdvert();
			// #endif
		},
		methods: {
			/**
			 * 数据处理方法在vue和nvue中通用，可以直接用mixin混合
			 * 这里直接写的
			 * mixin使用方法看index.nuve
			 */
			//获取分类
			loadTabbars(){
				let tabList = homeTab;
				tabList.forEach(item=>{
					item.newsList = [];
					item.loadMoreStatus = 0;  //加载更多 0加载前，1加载中，2没有更多了
					item.refreshing = 0;
				})
				this.tabBars = tabList;
				this.loadNewsList('add');
			},
			//新闻列表
			loadNewsList(type){
				let tabItem = this.tabBars[this.tabCurrentIndex];
				
				//type add 加载更多 refresh下拉刷新
				if(type === 'add'){
					if(tabItem.loadMoreStatus === 2){
						return;
					}
					tabItem.loadMoreStatus = 1;
				}
				// #ifdef APP-PLUS
				else if(type === 'refresh'){
					tabItem.refreshing = true;
				}
				// #endif
				
				//setTimeout模拟异步请求数据
				setTimeout(()=>{
					let list = [];
					if(tabItem.name == '关注') {
						if(this.focusTabCurr == 0) {
							// 构造是否关注的数据
							list = focusAuthors.map(item=>Object(item, {isFocus: false}));
						} else {
							let tempTags = [].concat(tags);
							let tempArr = [];
							for (let i = 0, j = 0, tagsLen = tempTags.length; i < tagsLen; i += 2, j++) {
								tempArr[j] = tempTags.splice(0, 2)
							 }
							list = tempArr;
						}
					} else if(tabItem.name == '最新'){
						this.specialList = banner;
						this.bannerList = banner;
						this.importNewsListData = newItem;
						this.importNews=[{
							source: '新华社', // 来源/require
							time: '08:08', // 时间/require
							author_name: '王大仙', // 作者，非必须
							live: false, // 是否直播类型资讯
							recommend: false, // 是否是推广类资讯
							onlyOne: false, // 是否是独家资讯
							depth: false, // 是否是深度类型资讯
							coins: [{
								startPrice: '1000',
								endPrice: '1035',
							}],
							detail: '面对这一场世所罕见、突如其来、异常凶猛的新冠肺炎疫情，习近平总书记始终把人民生命安全和身体健康放在第一位，带领全党全军全国人民沉着应对危机、果断处置危机、科学防控危机，忧人民之所忧、想人民之所想，及时制定疫情防控战略策略，凝聚起全中国人民奋起抗疫的磅礴力量。'
						}, {
							source: '新华社', // 来源/require
							time: '08:08', // 时间/require
							author_name: '王大仙', // 作者，非必须
							live: false, // 是否直播类型资讯
							recommend: false, // 是否是推广类资讯
							onlyOne: false, // 是否是独家资讯
							depth: false, // 是否是深度类型资讯
							coins: [{
								startPrice: '1000',
								endPrice: '1035',
							}],
							type: 'specialTopic',
							detail: '面对这一场世所罕见、突如其来、异常凶猛的新冠肺炎疫情，习近平总书记始终把人民生命安全和身体健康放在第一位，带领全党全军全国人民沉着应对危机、果断处置危机、科学防控危机，忧人民之所忧、想人民之所想，及时制定疫情防控战略策略，凝聚起全中国人民奋起抗疫的磅礴力量。'
						}];
						list = newsItems;
					}else{
						list = newsItems;
					}
					list.sort((a,b)=>{
						return Math.random() > .5 ? -1 : 1; //静态数据打乱顺序
					})
					if(type === 'refresh'){
						tabItem.newsList = []; //刷新前清空数组
					}
					list.forEach(item=>{
						item.id = parseInt(Math.random() * 10000);
						tabItem.newsList.push(item);
					})
					//下拉刷新 关闭刷新动画
					if(type === 'refresh'){
						this.$refs.mixPulldownRefresh && this.$refs.mixPulldownRefresh.endPulldownRefresh();
						// #ifdef APP-PLUS
						tabItem.refreshing = false;
						// #endif
						tabItem.loadMoreStatus = 0;
					}
					//上滑加载 处理状态
					if(type === 'add'){
						tabItem.loadMoreStatus = tabItem.newsList.length > 40 ? 2: 0;
					}
				}, 600)
			
			},
			// 新闻详情
			navToDetails(item){
				let data = {
					id: item.id,
					title: item.title,
					author: item.author,
					time: item.time
				}
				let url = item.videoSrc ? 'videoDetails' : 'details'; 

				uni.navigateTo({
					url: `/pages/details/${url}?data=${JSON.stringify(data)}`
				})
			},
			// 下拉刷新
			onPulldownReresh(){
				this.loadNewsList('refresh');
			},
			//上滑加载
			loadMore(){
				this.loadNewsList('add');
			},
			//设置scroll-view是否允许滚动，在小程序里下拉刷新时避免列表可以滑动
			setEnableScroll(enable){
				if(this.enableScroll !== enable){
					this.enableScroll = enable;
				}
			},
			//tab切换
			async changeTab(e){
				if(scrollTimer){
					//多次切换只执行最后一次
					clearTimeout(scrollTimer);
					scrollTimer = false;
				}
				let index = e;
				//e=number为点击切换，e=object为swiper滑动切换
				if(typeof e === 'object'){
					index = e.detail.current
				}
				if(typeof tabBar !== 'object'){
					tabBar = await this.getElSize("nav-bar")
				}
				//计算宽度相关
				let tabBarScrollLeft = tabBar.scrollLeft;
				let width = 0; 
				let nowWidth = 0;
				//获取可滑动总宽度
				for (let i = 0; i <= index; i++) {
					let result = await this.getElSize('tab' + i);
					width += result.width;
					if(i === index){
						nowWidth = result.width;
					}
				}
				if(typeof e === 'number'){
					//点击切换时先切换再滚动tabbar，避免同时切换视觉错位
					this.tabCurrentIndex = index; 
				}
				//延迟300ms,等待swiper动画结束再修改tabbar
				scrollTimer = setTimeout(()=>{
					if (width - nowWidth/2 > windowWidth / 2) {
						//如果当前项越过中心点，将其放在屏幕中心
						this.scrollLeft = width - nowWidth/2 - windowWidth / 2;
					}else{
						this.scrollLeft = 0;
					}
					if(typeof e === 'object'){
						this.tabCurrentIndex = index; 
					}
					this.tabCurrentIndex = index; 
					
					//第一次切换tab，动画结束后需要加载数据
					let tabItem = this.tabBars[this.tabCurrentIndex];
					if(tabItem.loaded !== true){
						this.loadNewsList('add');
						tabItem.loaded = true;
					}
				}, 300)
				
			},
			//获得元素的size
			getElSize(id) { 
				return new Promise((res, rej) => {
					let el = uni.createSelectorQuery().select('#' + id);
					el.fields({
						size: true,
						scrollOffset: true,
						rect: true
					}, (data) => {
						res(data);
					}).exec();
				});
			},
			// 跳转到搜索页面
			gotoSearchPage() {
				uni.navigateTo({
					url: '../search/search'
				})
			},
			// 跳转到详情页
			toPage(id, type) {
				if(type === 'specialTopic') {
					uni.navigateTo({
						url:'/pages/specialTopic/specialTopic?id='+id
					})
				} else {
					uni.navigateTo({
						url:'/pages/details/details?id='+id
					})
				}
			},
			// 关注页面tablIST切换
			changeFocusTabCurr(focusTabindex, tabItemIndex) {
				if( focusTabindex == this.focusTabCurr){
					return;
				}
				this.focusTabCurr = focusTabindex;
				// 清空之前缓存的newsList避免样式污染
				if(this.tabBars[tabItemIndex] && this.tabBars[tabItemIndex].newsList.length > 0){
					this.tabBars[tabItemIndex].newsList = []
				}
				this.loadNewsList('refresh');
			},
			// 去订阅页面
			gotoSubscribe() {
				uni.navigateTo({
					url: "/pages/subscribe/subscribe"
				})
			}
		}
	}
</script>

<style lang='scss'>
	page, .content{
		background-color: #f8f8f8;
		height: 100%;
		overflow: hidden;
	}
	.navbar_header{
		height: 44px;
		line-height: 44px;
		@extend .flex_row;
		@extend .space_between;
		padding: 0 $space-lg;
		background-color: $whiteColor;
		.logo{
			width: 120px;
			height: 22px;
		}
		.logo_wrap{
			width: 120px;
			margin-right: $space-lg;
			@extend .flex;
			align-items: center;
		}
		.search_wrap{
			@extend .flex;
			align-items: center;
		}
	}
	/* 顶部tabbar */
	.nav-bar{
		position: relative;
		z-index: 10;
		height: 90upx;
		white-space: nowrap;
		box-shadow: 0 2upx 8upx rgba(0,0,0,.06);
		background-color: #fff;
		.nav-item{
			display: inline-block;
			/* width: 150upx; */
			padding: 0 20upx;
			height: 90upx;
			text-align: center;
			line-height: 90upx;
			font-size: 30upx;
			color: #303133;
			position: relative;
			&:after{
				content: '';
				width: 0;
				height: 0;
				border-bottom: 4upx solid #007aff;
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translateX(-50%);
				transition: .3s;
			}
		}
		.current{
			color: $mainColor;
			/* &:after{
				width: 50%;
			} */
		}
	}

	.swiper-box{
		height: 100%;
	}
	.panel-scroll-box{
		height: calc(100% - 44px - var(--status-bar-height));
	}
	/* 新闻列表  emmm 仅供参考 */
	.news-item{
		background-color: #fff; 
	}
	/* 头部样式 */
	.header{
		height: 85upx;
		padding: 10upx 15upx;
		display: flex;
		align-items: center;
		background-color:#fff;
		flex-direction: row;
		justify-content: space-between;
	}
	.input_search{
		background-color: #f5f5f5;
		border-radius: 6upx;
		height: 55upx;
		padding: 0upx 20upx;
		justify-content: space-between;
		display: flex;
		align-items: center;
		flex-direction: row;
		flex: 1;
	}
	.input_search_txt {
		color: #999;
		font-size: 25upx
	}
	/* 新闻早八点|专题 */
	.import_news_wrapper {
		height: 166upx;
		margin-bottom: 12upx;
		background-color: #fff;
		display: flex;
		flex-direction: row;
		overflow: hidden;
		position: relative;
	}
	.import_item {
		flex: 1;
		padding: 20upx;
		justify-content: space-between;
		position: relative;
	}
	.import_item_head {
		@extend .flex_row;
		/* flex-direction: row; */
		justify-content: space-between;
		align-items: center;
	}
	.import_item_title{
		font-weight: bold;
		color: $mainColor;
	}
	.import_item_time {
		color: #999;
		font-size: 20upx
	}
	.import_item_content_txt{
		font-size: 28upx;
		// line-height: 1.4;
		color: #000;
		@include more_line_ellipsis;
	}
	.media-item-line {
		position: absolute;
		top: 30upx;
		right:0;
		bottom: 0;
		width: 2upx;
		height: 106upx;
		background-color: $borderColor;
	}
	.import_news_list_wrapper {
		background-color: #fff;
		margin-bottom: 12upx;
	}
	/* 关注头部 */
	.focus_head_tab_wrap{
		height: 75upx;
		justify-content: space-between;
	}
	.text_wrap{
		width: 100upx;
		line-height: 75upx;
	}
	
</style>
