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
							<uni-tag :text="item.name" :type="item.number > 49 ?'default': 'selected'" @click="confirm({value: item.name}, 'changeKeyWord')"></uni-tag>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view v-else style="height:100vh">
			<uni-tab-swiper :tabBars="tabBars" ref="tabSwiper"></uni-tab-swiper>
		</view>
	</view>
</template>

<script>
	import {uniStatusBar } from '@dcloudio/uni-ui';
	import uniTabSwiper from '@/components/uni-tab-swiper/uni-tab-swiper'
	import searchListPage from '@/pages/search/search-list-page.vue';
	import uniTitle from '@/components/uni-title.vue';
	import uniTag from '@/components/uni-tag.vue';
	import icons from '@/components/icons/icons.vue';
	import {loadMore, getElSize} from '@/common/util.js';
	
	let scrollTimer = false, tabBar;
	let HISTORY_LIST = 'HISTORY_LIST'; // 存放历史数据的keyName
	export default {
		data() {
			return {
				tabCurrentIndex: 0, //当前选项卡索引
				historyList: [], // 历史搜索
				hotList: [], // 热门
				keyWord: '', // 搜索关键字
				showInit: true, // 展示默认页面
			
				searchType: 'article',
			}
		},
		components:{
			uniTitle,
			uniTag,
			uniStatusBar,
			icons,
			uniTabSwiper
		},
		mixins:[loadMore,getElSize],
		computed: {
			tabBars(){
				return [{
					name: '文章',
					component: searchListPage,
					data: {
						id: 2,
						enCode: 'article',
						type: 'article',
						name: '文章',
						keyWord: this.keyWord
					}
				}, {
					name: '快讯',
					component: searchListPage,
					data:{
						id: 3,
						name: '快讯',
						enCode: 'fastNews',
						type: 'news',
						keyWord: this.keyWord
					}
				}, {
					name: '币种',
					component: searchListPage,
					data: {
						id: 4,
						name: '币种',
						enCode: 'coinType',
						type: 'coin',
						keyWord: this.keyWord
					}
				}, {
					id: 5,
					name: '交易所',
					enCode: 'exchange',
					component: searchListPage,
					data: {
						id: 5,
						name: '交易所',
						enCode: 'exchange',
						keyWord: this.keyWord
					}
				}]
			}
		},
		onLoad() {
			this.loadHistoryListData();
			this.loadHotWords();
		},
		mounted() {
			this.getElSize('.statusBar');
		},
		methods: {
			// 获得热词
			loadHotWords(){
				this.$api.hot_words().then(data => {
					if (data && data.code === 200) {
						this.hotList = data.result;
						// this.specialList = data.result;
					} else {
					}
				})
			},
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
					// 如果tabswiper存在就进行搜索
					let tabSwiperComp = this.$refs.tabSwiper;
					if(tabSwiperComp){
						tabSwiperComp.onPulldownReresh()
					}
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
