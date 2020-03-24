<template>
	<view class="container home_container">
		<view style="background-color: #fff;" class="fixed_navbar">
			<uni-status-bar />
			<view class="navbar_header">
				<view class="flex1 radius search_wrap">
					<input type="text" class="input_search" placeholder="PAYDEX" confirm-type="search" @input="inputFun" @confirm="confirm" v-model="keyWord">
					<view class="search_icon_box">
						<icons type="search" color="#999"></icons>
					</view>
					<view class="clear_icon_box" @click="clearInput" v-if="keyWord.length>0">
						<icons type="cancel" color="#999"></icons>
					</view>
				</view>
				<view class="cancel_btn_box" @click="goBack">
					<text class="cancel_btn_txt">取消</text>
				</view>
			</view>
		</view>
		<view class="uni-navbar__placeholder">
			<uni-status-bar class="statusBar" />
			<view class="uni-navbar__placeholder-view" />
		</view>
		<view v-if="showInit">
			<scroll-view scroll-y="true">
				<view>
					<uni-title title="搜索历史" size="34" height="90" v-if="historyList.length > 0">
						<view class="m-head_left" :style="{height:'90upx'}" @tap="clearAllHistory" ><text class="m-head_left_text">全部清除</text></view>
					</uni-title>
					<view class="u-wrap">
						<view class="spacing-row-sm tag_item" v-for="(item, index) in historyList" :key="index">
							<uni-tag :text="item" rightBtn @click-right="deleteTag(index)" @click="confirm({value: item}, 'changeKeyWord')"></uni-tag>
						</view>
					</view>
					<uni-title title="今日热词" size="34" height="90">
					</uni-title>
					<view class="u-wrap">
						<view class="spacing-row-sm tag_item" v-for="(item, index) in hotList" :key="index">
							<uni-tag :text="item" :type="index !=0 ?'default': 'selected'" @click="confirm({value: item}, 'changeKeyWord')"></uni-tag>
						</view>
					</view>
				</view>
			</scroll-view>
			
		</view>
		<view v-else>
			<!-- 顶部选项卡 -->
			<!-- 搜索页面分类不多，没有scrollview，后续tab多起来，该换scrollview -->
			<!-- <scroll-view id="nav-bar" class="nav-bar" scroll-x scroll-with-animation :scroll-left="scrollLeft"> -->
				<view class="flex_row nav-bar fixed_tabbar" :style="{top: (elSize.height + 44)+'px'}">
					<view
						v-for="(item,index) in tabBars" :key="index"
						class="nav-item"
						:class="{current: index === tabCurrentIndex}"
						:id="'tab'+index"
						@click="changeTab(index)"
					>{{item.name}}</view>
				</view>
				<view >
					<view class="uni-tabbar__placeholder-view" />
				</view>
			<!-- </scroll-view> -->
			<!-- 下拉刷新组件 -->
			<view>
				<mix-pulldown-refresh ref="mixPulldownRefresh" class="panel-content" :top="90" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll">
					<!-- 内容部分 -->
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
								v-if="index != 0"
								>
								<view v-for="(item, index) in tabItem.newsList" :key="index" class="news-item" @click="navToDetails(item)">
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
								<!-- 上滑加载更多组件 -->
								<mix-load-more :status="tabItem.loadMoreStatus"></mix-load-more>
							</scroll-view>
							<scroll-view
								class="panel-scroll-box" 
								:scroll-y="enableScroll" 
								@scrolltolower="loadMore"
								:style="{height: swiperHeight+'px'}"
								v-else
								>
								<view v-for="(item, index) in tabItem.newsList" :key="index">
									<view class="u-item_wrap">
										<view class="u-item_head_wrap">
											<uni-title :title="item.name" size="34" height="90" @click="switchTab(item)">
												<view class="m-head_left" :style="{height:'90upx'}" >
													<text class="m-head_left_text">共</text>
													<text class="m-head_left_focus_text">{{item.total}}</text>
													<text class="m-head_left_text">条</text>
													<icons type="right" color="#999" size="12"></icons>
												</view>
											</uni-title>
										</view>
										<!-- 专栏 -->
										<view class="u_item_list" v-if="item.enCode == 'specialColumn'">
											<person-list-item v-for="(subItem, i) in item.list" :item="subItem" :key="i" showLine>
												<view class="flex_row">
													<view class="flex_row_center mr20"><text class="m-head_left_text" style="marginRight: 10upx;">文章  </text><text class="m-head_left_text" style="color:#000">111</text></view>
													<view  class="flex_row_center"><text class="m-head_left_text" style="marginRight: 10upx;">粉丝  </text><text class="m-head_left_text" style="color:#000">222</text></view>
												</view>
											</person-list-item>
										</view>
										<!-- 文章 -->
										<view class="u_item_list" v-if="item.enCode == 'article'">
											<news-item v-for="(subItem, i) in item.list" :newsItem="subItem" :key="i" ></news-item>
										</view>
										<!-- 快讯 -->
										<view class="u_item_list" v-if="item.enCode == 'fastNews'">
											<fast-news-item v-for="(subItem, i) in item.list" :newsItem="subItem" :key="i"></fast-news-item>
										</view>
										<!-- 你想找 -->
										<view class="u_item_list" v-if="item.enCode == 'coinType'">
											<uni-coins-item v-for="(subItem, i) in item.list" :item="subItem" :key="i" ></uni-coins-item>
										</view>
										<!-- 交易所 -->
										<view class="u_item_list" v-if="item.enCode == 'exChange'">
											<uni-ex-change-item v-for="(subItem, i) in item.list" :item="subItem" :key="i" ></uni-ex-change-item>
										</view>
									</view>
								</view>
								<!-- 上滑加载更多组件 -->
								<mix-load-more :status="tabItem.loadMoreStatus"></mix-load-more>
							</scroll-view>
						</swiper-item>
					</swiper>
				</mix-pulldown-refresh>
			</view>
			
		</view>
		
	</view>
</template>

<script>
	import {uniStatusBar } from '@dcloudio/uni-ui';
	import uniTitle from '@/components/uni-title.vue';
	import uniTag from '@/components/uni-tag.vue';
	import newsItem from '@/components/list-item/news-item.vue';
	import fastNewsItem from '@/components/list-item/fast-news-item.vue';
	import personListItem from '@/components/list-item/person-list-item.vue';
	import {newsList} from '@/service/getData.js';
	import liveItem from '@/components/list-item/uni-video-list-item.vue';
	import uniCoinsItem from '@/components/list-item/uni-coins-item.vue';
	import uniExChangeItem from '@/components/list-item/uni-exchange-item.vue';
	import icons from '@/components/icons/icons.vue';
	import {loadMore, getElSize} from '@/common/util.js';
	import {newItem, searchTab, searchList, newsItems, focusAuthors, tags, coins} from '@/mock/data';
	
	let scrollTimer = false, tabBar;
	let HISTORY_LIST = 'HISTORY_LIST'; // 存放历史数据的keyName
	export default {
		data() {
			return {
				tabCurrentIndex: 0, //当前选项卡索引
				historyList: [], // 历史搜索
				hotList: ['BT','BTC','王晓宇','BT','BTC','王晓宇','BT','BTC','王晓宇'], // 热门
				keyWord: '', // 搜索关键字
				showInit: true, // 展示默认页面
				tabBars: [], // tab数据
				enableScroll: true,
				swiperHeight: 0, // scrollView的高度
			}
		},
		components:{
			uniTitle,
			uniTag,
			newsItem,
			uniCoinsItem,
			uniExChangeItem,
			personListItem,
			liveItem,
			uniStatusBar,
			icons,
			fastNewsItem
		},
		mixins:[loadMore,getElSize],
		onLoad() {
			this.tabBars = this.initTab(searchTab);
			this.loadList('add');
			this.loadHistoryListData();
		},
		onReady() {
			let _this = this;
			uni.getSystemInfo({
				success: function(e) {
					// 44为标题的高度
					_this.swiperHeight = e.windowHeight - 44;
				}
			})
		},
		mounted() {
			this.getElSize('.statusBar');
		},
		methods: {
			// 获取存放在本地的历史数据
			loadHistoryListData() {
				let _this = this;
				uni.getStorage({
					key: HISTORY_LIST,
					success: function(e){
						_this.historyList = e.data;
					}
				});
			},
			//新闻列表
			loadList(type){
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
					if(tabItem.name == '专栏') {
						list = focusAuthors;
					} else if(tabItem.name == '最新'){
						list = newsItems;
					}else if(tabItem.name == '全部'){
						list = searchList;
					} else if(tabItem.name == '币种' ||tabItem.name == '交易所'){
						list = coins;
					} else {
						list = newsItems
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
				if(typeof e === 'number'){
					//点击切换时先切换再滚动tabbar，避免同时切换视觉错位
					this.tabCurrentIndex = index; 
				}
				//延迟300ms,等待swiper动画结束再修改tabbar
				scrollTimer = setTimeout(()=>{
					if(typeof e === 'object'){
						this.tabCurrentIndex = index; 
					}
					this.tabCurrentIndex = index; 
					//第一次切换tab，动画结束后需要加载数据
					let tabItem = this.tabBars[this.tabCurrentIndex];
					if(this.tabCurrentIndex !== 0 && tabItem.loaded !== true){
						this.loadList('add');
						tabItem.loaded = true;
					}
				}, 300)
			},
			// 清除搜索历史
			clearAllHistory() {
				this.historyList = [];
				this.setHistoryListData(this.historyList);
			},
			// 删除单个搜索历史
			deleteTag(index) {
				this.historyList.splice(index,1);
				this.setHistoryListData(this.historyList);
			},
			// 直播列表页面
			gotoLiveList(){
				uni.navigateTo({
					url: '../livelist/livelist'
				})
			},
			/**
			 * 提交搜索
			 * @param {Object} e:必须类型有{value:'xxxx'}
			 * @param {Object} fromTag:从tag点击进行搜索需要传入这个值进行判断，好设置keyWord的值
			 */
			confirm(e, fromTag) {
				uni.hideKeyboard();
				if(fromTag){
					this.keyWord = e.value;
				}
				if(e.value != ''){
					this.showInit = false;
					if(this.historyList.includes(this.keyWord)){
						return;
					} else {
						this.historyList.push(this.keyWord);
						this.setHistoryListData(this.historyList);
					}
				}
			},
			// 将数据存入storge中
			setHistoryListData(listData) {
				uni.setStorageSync(HISTORY_LIST, listData);
			},
			// input框输入的回调
			inputFun(e){
				// 当从tag点击进来时候，e.detail == undefined
				let detail = e.detail
				if(!detail) {
					return;
				}
				this.keyWord = detail.value;
				if((!this.showInit && detail.value == '')){
					this.showInit = true
				}
			},
			// 转换tab，获得当前点击title的index，然后再进行changeTab
			switchTab(item) {
				let tabName = item.name;
				if(tabName == '你想找的是'){
					tabName = '币种'
				}
				let tabIndex = 0;
				for(let i = 0, len = this.tabBars.length; i < len; i++) {
					if(tabName == this.tabBars[i].name) {
						tabIndex = i;
						break;
					}
				}
				if(tabIndex != 0) {
					this.changeTab(tabIndex)
				}
			},
			// 返回上一页
			goBack(){
				uni.navigateBack()
			},
			// 清楚输入内容
			clearInput() {
				this.keyWord = '';
			},
		}
	}
</script>

<style lang="scss">
	/* #ifndef APP-PLUS */
	page {
		width: 100%;
		min-height: 100%;
	}
	/* #endif */
	.panel-scroll-box, .swiper-box{
		height: 100%;
	}
	.home_container{
		height: 100%;
		overflow: hidden;
	}
	.navbar_header{
		height: 44px;
		line-height: 44px;
		@extend .flex_row;
		@extend .space_between;
		@include sideBorder;
		padding: 0 $space-lg;
		background-color: $whiteColor;
		.search_icon_box{
			position: absolute;
			left: 15px;
			top: 0px;
		}
		.clear_icon_box{
			position: absolute;
			right: 20px;
			top: 0px;
		}
		.search_wrap{
			@extend .flex;
			align-items: center;
			position: relative;
		}
		.input_search{
			flex: 1;
			height: 38px;
			padding: 0 70upx;
			margin-right: $space-lg;
			background-color: $bgColor;
			border-radius: 4upx;
			overflow: hidden;
			color: #333;
			font-size: 26upx;
		}
		.cancel_btn_box{
			// padding: 0 $space-base
		}
		.cancel_btn_txt{
			font-size: 30upx;
			color: $mainColor;
		}
	}
	
	.u-wrap{
		@include flex-center(row, flex-start,$flex-wrap: wrap);
		margin-bottom: $space-sm;
		background-color: $whiteColor;
	}
	.tag_item{
		margin-bottom: $space-sm;
	}
	.swiper-item {
		flex: 1;
		flex-direction: column;
	}
	.m-head_left{
		width: 150upx;
		@include flex-center($justify:flex-end);
	}
	.m-head_left_text{
		@include txt;
	}
	.m-head_left_focus_text{
		@include txt($color: $mainColor);
		margin: 0 $space-sm;
	}
	
	.u-item_head_wrap{
		border: 0 solid $borderColor;
		// border-style: solid;
		border-bottom-width: 2upx;
		// border-bottom-color: $borderColor;
	}
	/* 顶部tabbar */
	.nav-bar{
		// position: relative;
		z-index: 10;
		// height: 90upx;
		white-space: nowrap;
		box-shadow: 0 2upx 8upx rgba(0,0,0,.06);
		background-color: #fff;
		display: flex;
		flex: 1;
		.nav-item{
			display: inline-block;
			// width: 150upx;
			flex: 1;
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
			// &:after{
			// 	width: 50%;
			// }
		}
	}
	
</style>
