<template>
	<view class="wrap">
		<view style="background-color: #fff;" class="fixed_navbar">
			<uni-status-bar />
			<view class="navbar_header flex_row">
				<view class="flex2"><tabs :tabs="['自选','大盘']" @changeTab="changeTab($event, 'currTab')" :defaultTab="currTab"></tabs></view>
				 <view @click="goSearch">
					<uni-icons type="search" v-slot="right"></uni-icons>
				 </view>
			</view>
		</view>
		<view class="uni-navbar__placeholder">
			<uni-status-bar />
			<view class="uni-navbar__placeholder-view" />
		</view>
		<!-- 下拉刷新组件 -->
		<!--  -->
			<swiper 
				id="swiper"
				class="swiper" 
				:duration="300" 
				:current="currTab"
				@change="changeTab($event, 'currTab')"
				:style="{height: swiperHeight+'px'}"
			>
				<!-- 自盘 -->
				<swiper-item>
				<view class="relative_section">
					<uni-self-dish-table-head @headClick="goEditPage">
						<view class="edit_cell"><icons type="edit"></icons>  <text class="black_txt">编辑</text></view>
					</uni-self-dish-table-head>
				</view>
				<!-- <view class="fixed_self_placeholder"></view> -->
					<mix-pulldown-refresh ref="mixPulldownRefresh0" class="panel-content" :top="90" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll">
						<scroll-view
							class="panel-scroll-box"
							:scroll-y="enableScrollY"
							@scrolltolower="loadMore"
							:style="{height: (swiperHeight-30)+'px'}"
							>
							<view class="list_wrap" v-if="apiToken == null">
								<uni-self-dish-table-cell v-for="(item, index) in swiperItems[0].newsList" :key="index" :item="item" @click="goPage(item.name, '', item.code)"></uni-self-dish-table-cell>
							</view>
							<view class="list_wrap" v-else>
								<uni-follow-table-cell v-for="(item, index) in swiperItems[0].newsList" :key="index" :item="item" @click="goPage(item.name, '', item.id)"></uni-follow-table-cell>
							</view>
							<!-- 上滑加载更多组件 -->
							
							<mix-load-more :status="loadMoreStatus" @click.native="loadMore" :isShow=" loadMoreStatus == 1"></mix-load-more>
							<view :style="{textAlign: 'center', marginTop: swiperItems[0].newsList.length > 0 ? '0upx': '<10></10>0upx'}">
								<view class="btn_collect" @click="goSearch">
									<icons type="add" color="#333"></icons>添加自选
								</view>
							</view>
						</scroll-view>
					</mix-pulldown-refresh>
				</swiper-item>
				<swiper-item>
					<!-- 大盘 -->
					<view class="list_wrap">
						<view class="progress_box" v-if="false">
							<progress percent="80" :activeColor="upTheme.txt" stroke-width="8" :backgroundColor="downTheme.txt"/>
							<view class="flex_row space_between">
								<text class="normal_txt progress_txt" :style="{color:upTheme.txt}">涨 123 个币种</text>
								<text class="normal_txt progress_txt" :style="{color:downTheme.txt}">跌 123 个币种</text>
							</view>
						</view>
						<tabs :tabs="['市值榜','涨幅榜', '跌幅榜']" @changeTab="changeTab($event,'currSubTab')" :defaultTab="currSubTab"></tabs>
						<swiper class="swiper"
							:current="currSubTab"
							@change="changeTab($event, 'currSubTab')"
							@transition = "transition"
							
							 >
							<swiper-item>
								<view class="relative_section">
									<uni-big-dish-table-head></uni-big-dish-table-head>
								</view>
								<mix-pulldown-refresh ref="mixPulldownRefresh1" class="panel-content" :top="90" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll">
									<scroll-view
										class="panel-scroll-box"
										:scroll-y="enableScrollY"
										@scrolltolower="loadMore"
										:style="{height: (swiperHeight-62)+'px'}"
										>
										<uni-big-dish-table-cell v-for="(item, index) in swiperItems[1].newsList" :key="index" :item="item" @click="goPage(item.name, '', item.code)"></uni-big-dish-table-cell>
										<!-- 上滑加载更多组件 -->
										<mix-load-more :status="loadMoreStatus" @click.native="loadMore"></mix-load-more>
										
									</scroll-view>
								</mix-pulldown-refresh>
							</swiper-item>
							<swiper-item>
								<!-- 涨幅榜 -->
								<view class="relative_section">
									<uni-big-dish-table-head></uni-big-dish-table-head>
								</view>
								<mix-pulldown-refresh ref="mixPulldownRefresh2" class="panel-content" :top="90" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll">
									<scroll-view
										class="panel-scroll-box"
										@scrolltolower="loadMore"
										:scroll-y="enableScrollY"
										:style="{height: (swiperHeight-62)+'px'}"
										>
										<uni-big-dish-chg-table-cell v-for="(item, index) in swiperItems[2].newsList" :rank="index+1" :key="index" :item="item" @click="goPage(item.name, '',item.code)"></uni-big-dish-chg-table-cell>
										<!-- <uni-big-dish-table-cell></uni-big-dish-table-cell> -->
										<!-- 上滑加载更多组件 -->
										<mix-load-more :status="loadMoreStatus" @click.native="loadMore"></mix-load-more>
									</scroll-view>
								</mix-pulldown-refresh>
							</swiper-item>
							<swiper-item>
								<!-- 跌幅榜 -->
								<view class="relative_section">
									<uni-big-dish-table-head></uni-big-dish-table-head>
								</view>
								<mix-pulldown-refresh ref="mixPulldownRefresh3" class="panel-content" :top="90" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll">
									<scroll-view
										class="panel-scroll-box"
										:scroll-y="enableScrollY"
										@scrolltolower="loadMore"
										:style="{height: (swiperHeight-62)+'px'}"
										>
										<uni-big-dish-chg-table-cell v-for="(item, index) in swiperItems[3].newsList" :rank="index+1"  :key="index" :item="item" @click="goPage(item.name, '', item.code)"></uni-big-dish-chg-table-cell>
										<!-- 上滑加载更多组件 -->
										<mix-load-more :status="loadMoreStatus" @click.native="loadMore"></mix-load-more>
									</scroll-view>
								</mix-pulldown-refresh>
							</swiper-item>
						</swiper>
					</view>
				</swiper-item>
			</swiper>
		<!-- </mix-pulldown-refresh> -->
	</view>
</template>

<script>
	import tabs from '@/components/tabs.vue';
	import {uniIcons, uniStatusBar} from '@dcloudio/uni-ui';
	import uniSelfDishTableHead from '@/components/list-item/uni-self-dish-table-head.vue';
	import uniSelfDishTableCell from '@/components/list-item/uni-self-dish-table-cell.vue';
	import uniFollowTableCell from '@/components/list-item/uni-follow-table-cell.vue';
	import uniBigDishTableHead from '@/components/list-item/uni-big-dish-table-head.vue';
	import uniBigDishTableCell from '@/components/list-item/uni-big-dish-table-cell.vue';
	import uniBigDishChgTableCell from '@/components/list-item/uni-big-dish-chg-table-cell.vue';
	import uniTitle from '@/components/uni-title.vue';
	import { loadMore} from '@/common/util.js';
	import {coins} from '@/mock/data.js';
	import {mapState} from 'vuex';
	const swiperItem = [{name:'自盘'},{name:'市值榜'},{name:'涨幅榜'},{name:'跌幅榜'}];
	let windowWidth = 0, scrollTimer = false, tabBar;
	export default {
		data() {
			return {
				currSubTab: 0, // 大盘页面swiper的tabIndex
				coins: [],
				currTab: 0,// 默认tab
				scrollLeft: 0, //顶部选项卡左滑距离
				enableScroll: true,
				swiperItems: [], // 缓存所有swiper加载和刷新相关的数据
				swiperHeight: 0,


				dataList:[],
				loadMoreStatus:  0, //加载更多 0加载前，1加载中，2没有更多了
				enableScrollY: true,
				refreshing: false, // 刷新状态
				pageNum: 1,
				total: 0,
				pageSize: 20,
				lastPage: 1,
				isTap: false,
			}
		},
		mixins:[loadMore],
		components:{
			tabs,
			uniSelfDishTableHead,
			uniSelfDishTableCell,
			uniBigDishTableHead,
			uniBigDishTableCell,
			uniTitle,
			uniIcons,
			uniStatusBar,
			uniBigDishChgTableCell,
			uniFollowTableCell
		},
		created() {
			this.swiperItems = this.initTab(swiperItem);
			this.loadList('refresh');
		},
		onReady() {
			let _this = this;
			uni.getSystemInfo({
				success: function(e) {
					// 44为标题的高度
					_this.swiperHeight = e.windowHeight - 66;
				}
			})
		},
		computed: mapState(['upTheme', 'downTheme', 'apiToken']),
		methods: {
			async loadList(action){
				let currTab = this.caclcurrTab()
				let tabItem = this.swiperItems[currTab];
				//action= add上拉加载 refresh下拉刷新
				console.log(action);
				if (action=='refresh') {
					tabItem.newsList = [];
					this.pageNum = 1;
					this.loadMoreStatus = 0;
				}
				if (this.loadMoreStatus==0) {
					this.loadMoreStatus = 1;
					// 自盘？
					let data = 0;
					if(this.currTab == 0){
						if(this.apiToken != null ) {
							data = await this.$api.coins_focus_list({
								page: this.pageNum,
								pageSize: this.pageSize,
							});
						} else {
							data = await this.$api.coins({
								page: 1,
								pageSize: 8,
							});
						}
					}
					// 市值榜
					if(this.currTab == 1 && this.currSubTab == 0) {
						data = await this.$api.coins({
							page: this.pageNum,
							pageSize: this.pageSize,
						});
					}
					// 涨幅榜
					if(this.currTab == 1 && this.currSubTab == 1) {
						data = await this.$api.coinsChg({
							isup: 1
						});
					}
					// 跌幅榜
					if(this.currTab == 1 && this.currSubTab == 2) {
						data = await this.$api.coinsChg({
							isup: 0
						});
					}
					if (data && data.code === 200) {
						const result = data.result.data || [];
						
						if(this.currTab == 0 && this.apiToken == null) {
							// 当没有登录时候，默认只显示8条市值榜数据，并没有下拉加载
							this.lastPage = 1
						} else if(this.currTab == 1 && (this.currSubTab == 1 || this.currSubTab == 2 )) {
							// 涨幅榜和跌幅榜只有30条数据，故没有下拉
							this.lastPage = 1
						} else {
							this.lastPage = data.result.maxpage
						}
						tabItem.newsList.push(...result);
						this.$refs['mixPulldownRefresh'+currTab] && this.$refs['mixPulldownRefresh'+currTab].endPulldownRefresh();
						this.refreshing = false;
						if (this.pageNum==this.lastPage) {
							this.loadMoreStatus = 2;
						}else{
							this.loadMoreStatus = 0;
						}
						this.pageNum += 1;
					} else {
						this.$message(data.msg)
					}
					this.isTap = false;
					// })
				}
				//type add 加载更多 refresh下拉刷新
				// if(type === 'add'){
				// 	if(tabItem.loadMoreStatus === 2){
				// 		return;
				// 	}
				// 	tabItem.loadMoreStatus = 1;
				// }
				// // #ifdef APP-PLUS
				// else if(type === 'refresh'){
				// 	tabItem.refreshing = true;
				// }
				// // #endif
				// //setTimeout模拟异步请求数据
				// setTimeout(()=>{
				// 	let list = coins;
				// 	// TODO:删除
				// 	list.sort((a,b)=>{
				// 		return Math.random() > .5 ? -1 : 1; // 静态数据打乱顺序
				// 	})
				// 	// TODO:END
				// 	if(type === 'refresh'){
				// 		tabItem.newsList = []; //刷新前清空数组
				// 	}
				// 	list.forEach(item=>{
				// 		// TODO:删除
				// 		item.id = parseInt(Math.random() * 10000);
				// 		// TODO:END
				// 		tabItem.newsList.push(item);
				// 	})
				// 	//下拉刷新 关闭刷新动画
				// 	if(type === 'refresh'){
				// 		this.$refs['mixPulldownRefresh'+currTab] && this.$refs['mixPulldownRefresh'+currTab].endPulldownRefresh();
				// 		// #ifdef APP-PLUS
				// 		tabItem.refreshing = false;
				// 		// #endif
				// 		tabItem.loadMoreStatus = 0;
				// 		tabItem.page = 0;
				// 	}
				// 	//上滑加载 处理状态
				// 	if(type === 'add'){
				// 		tabItem.page++;
				// 		tabItem.loadMoreStatus = tabItem.newsList.length > 40 ? 2: 0;
				// 	}
				// 	console.log(this.swiperItems);
				// }, 600)
			},
			// 计算对应于swiperItem的currtTab
			caclcurrTab(){
				if(this.currTab == 0) {
					return this.currTab;
				} else {
					return this.currSubTab + 1;
				}
			},
			//tab切换
			async changeTab(e, keyName){
				if(this.isTap){
					return;
				}
				this.isTap = true;
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
					this[keyName] = index;
				}
				setTimeout(()=>{
					if(typeof e === 'object'){
						this[keyName] = index;
					}
					let currtTab = this.caclcurrTab();
					this.loadList('refresh');
				}, 100)
				
				
			},
			transition(e) {
				let dx = e.detail.dx;
				// if(this.currTab != 0 && this.currSubTab == 0 && dx < 0){
				// 	if(dx < -150 && dx > -300){
				// 		this.currTab = 0;
				// 	}
				// }
			},
			animationfinish(e) {
				console.log('animationend==', e);
			},
			// 去详情页面
			goPage(symbol, exChangeName, code) {
				uni.navigateTo({
					url: '/pages/quotations/coinDetail?symbol='+symbol+'&exChangeName='+exChangeName+'&code='+code
				});
			},
			// 去编辑页面
			goEditPage() {
				if(this.apiToken == null) {
					this.$message({icon: 'none', title:'请前去登录！'});
					return;
				}
				uni.navigateTo({
					url: '/pages/quotations/editCoins'
				});
			},
			goSearch() {
				uni.navigateTo({
					url: '/pages/search/searchCoins'
				});
			}
		},
	}
</script>

<style lang="scss">
	.swiper{
		position: relative;
	}
	page, .wrap,.swiper, .list_wrap, .panel-content{
		height: 100%;
	}
	.relative_section{
		position: relative;
		z-index: 2;
	}
	.panel-scroll-box{
		height: 100%;
		
	}
	.progress_box{
		margin-top: 10px;
		height: 40px;
		padding: 0 $space-lg;
	}
	.space_between{
		justify-content: space-between;
	}
	.progress_txt{
		line-height: 60upx;
	}
	.edit_cell{
		@include flex-center($justify:flex-start);
		height: 64upx;
		text{
			margin-left: $space-sm;
		}
	}
	.fixed_self_dish{
		position: fixed;
		width: 100%;
		top: 0;
		height: 32px;
		z-index: 999;
		background-color: red;
	}
	.fixed_self_placeholder{
		height: 32px;
		width: 100%;
	}
	.btn_collect{
		display: inline-block;
		padding: $space-sm $space-lg;
		background-color: #fff;
		color: #333;
		font-size: 28upx;
		border: 1upx solid #fafafa;
		box-shadow: 0 0 10upx rgba(0,0,0,.3);
		border-radius: 50upx;
		margin: $space-lg auto;
	}
</style>
