<template>
	<view class="container home_container">
		<view style="background-color: #fff; position: relative; z-index: 2;">
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
		<view v-else :style="{height: swiperHeight+'px'}">
			<view style="height: 100%;">
				<mix-pulldown-refresh ref="mixPulldownRefresh" class="panel-content" :top="90" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll">
					<scroll-view
						class="panel-scroll-box" 
						:scroll-y="enableScroll" 
						@scrolltolower="loadMore"
						>
						<view class="list_wrap">
							<uni-self-dish-table-cell v-for="(item, index) in listData" :key="index" :item="item" type="search" hasCollect @collect="collect(id)"></uni-self-dish-table-cell>
						</view>
						<!-- 上滑加载更多组件 -->
						<mix-load-more :status="loadMoreStatus"></mix-load-more>
					</scroll-view>
				</mix-pulldown-refresh>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {uniIcons, uniStatusBar } from '@dcloudio/uni-ui';
	import uniTitle from '@/components/uni-title.vue';
	import uniTag from '@/components/uni-tag.vue';
	import {newsList} from '../../service/getData.js';
	import {loadMore} from '@/common/util.js';
	import uniSelfDishTableCell from '@/components/list-item/uni-self-dish-table-cell.vue';
	import icons from '@/components/icons/icons.vue';
	import {coins} from '@/mock/data';
	
	// 存放历史数据的keyName
	let HISTORY_LIST = 'HISTORY_LIST'; 
	export default {
		data() {
			return {
				historyList: [],// 搜索历史
				hotList: ['BT','BTC','王晓宇','BT','BTC','王晓宇','BT','BTC','王晓宇'], // 热词
				listData: [], // 搜索列表
				keyWord: '', // 搜索关键字
				showInit: true, // 展示默认页面
				enableScroll: true,
				swiperHeight: 0, // scroll-view的高度
				loadMoreStatus:  0, //加载更多 0加载前，1加载中，2没有更多了
				refreshing: false, // 刷新状态
			}
		},
		components:{
			uniTitle,
			uniStatusBar,
			uniSelfDishTableCell,
			uniIcons,
			uniTag,
			icons
		},
		mixins:[loadMore],
		onLoad() {
			this.loadList('add');
			this.loadHistoryListData();
		},
		onReady() {
			let _this = this;
			uni.getSystemInfo({
				success: function(e) {
					console.log(e.windowTop,e.windowBottom,e.statusBarHeight);
					_this.swiperHeight = e.windowHeight - 44;
				}
			})
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
			//列表
			loadList(type){
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
					let list = coins
					
					list.sort((a,b)=>{
						return Math.random() > .5 ? -1 : 1; //静态数据打乱顺序
					})
					if(type === 'refresh'){
						this.listData = []; //刷新前清空数组
					}
					let tempArr = [];
					list.forEach(item=>{
						item.id = parseInt(Math.random() * 10000);
						tempArr.push(item);
					})
					this.listData.push(...tempArr);
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
						this.loadMoreStatus = this.listData.length > 40 ? 2: 0;
					}
				}, 600)
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
			 * 提交搜索,并存入storage中
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
				this.keyWord = e.detail.value;
				if(!this.showInit && e.detail.value == ''){
					this.showInit = true
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
			// 自选切换
			collect(id) {
				let tempArr = []
				this.listData.forEach((item, index)=>{
					let newObj = Object.assign({},item);
					if( index == 0) {
						newObj.isCollect = !newObj.isCollect
					}
					tempArr.push(newObj);
				})
				this.listData = tempArr;
			}
		},
	}
</script>

<style lang="scss">
	/* #ifndef APP-PLUS */
	page {
		width: 100%;
		min-height: 100%;
	}
	/* #endif */
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
			left: 5px;
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
			height: 28px;
			padding: 0 50upx;
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
	.m-head_left_text{
		@include txt;
	}
	.m-head_left{
		width: 150upx;
		@include flex-center($justify:flex-end);
	}
	.panel-scroll-box{
		height: 100%;
	}
</style>
