<template>
	<view class="container">
		<view class="flex_row bg_wrapper" v-if="exchange != null">
			<view class="img_wrapper mr20">
				<image class="image-list1" :src="exchange.logo"></image>
			</view>
			<view class="flex_column flex3 space_between">
				<view class="flex_row mt20" style="align-items: center;">
					<text class="list_item_black_title_sm heavy mr20 white_color">{{exchange.platform_name}}</text>
					<text class="list_item_black_title_sm heavy mr20 focus_color" >ER{{exchange.exrank}}</text>
					<view @click="showTips"><icons type="question" color="#ffb100"></icons></view>
				</view>
				<view class="flex_column">
					<text class="list_item_black_title_base white_color">{{unitConvert(exchange.volume_day_usd)}}</text>
					<text class="normal_txt">24H成交额</text>
				</view>
			</view>
			<view class="flex_column flex2 space_between">
				<view class="flex_row mt20 range_box">
					<text class="range_focus_txt">全球排名</text>
					<view class="range_txt_box">
						<text class="range_txt">第{{exchange.rank}}名</text>
					</view>
				</view>
				<view class="flex_column">
					<text class="list_item_black_title_base white_color">{{exchange.pairnum}}亿</text>
					<text class="normal_txt">交易对</text>
				</view>
			</view>
		</view>
		<tabs :tabs="['主页','行情','公告']" @changeTab="changeTab" :defaultTab="currTab"></tabs>
		<swiper :current="currTab" @change="changeTab" class="swiper">
			<swiper-item>
				<scroll-view :scroll-y="enableScrollY" :style="{height: swiperHeight+'px'}">
					<view>
						<view class="" v-if="exchange.exchange_coincode!=''">
							<uni-title title="平台币"></uni-title>
							<view class="flex1 flex_row" @click="toDetail" style="padding: 0upx 30upx;margin-bottom: 20upx;">
								<view class="flex3 flex_row">
									<view class="img_wrapper mr20">
										<image class="image-list1" :src="exchange.logo"></image>
									</view>
									<view>
										<view><text class="blod_black_txt">{{exchange.exchange_coinsymbol}}</text><text class="normal_txt">全球指数</text></view>
										<text class="normal_txt">24H额 ${{unitConvert(exchange.exchange_coinvolume)}}</text>
									</view>
								</view>
								<view class="flex2 flex_column">
									<text class="list_item_black_title_base">&yen;{{exchange.curprice_cny}}</text>
									<text class="normal_txt">${{exchange.curprice_usd}}</text>

								</view>
								<view class="flex1 flex_row_center">
									<text class="normal_txt heavy" :style="{color:exchange.changerate>0 ? upTheme.txt : downTheme.txt}">{{exchange.changerate>0?'+':''}}{{exchange.changerate}}%</text>
								</view>
							</view>
							<!-- <view class="flex1 flex_column">
								<text class="blod_black_txt">BTC/TUSD</text>
								<text class="list_item_black_title_base" :style="{color:downTheme != null ? downTheme.txt : '#999'}">5230.02</text>
								<text class="normal_txt" :style="{color:downTheme != null ? downTheme.txt : '#999'}">-3.61%</text>
							</view>
							<view class="flex1 flex_column">
								<text class="blod_black_txt">BTC/TUSD</text>
								<text class="list_item_black_title_base" :style="{color:upTheme != null ? upTheme.txt : '#999'}">5230.02</text>
								<text class="normal_txt" :style="{color:upTheme != null ? upTheme.txt : '#999'}">+3.61%</text>
							</view> -->
						</view>
						<!--<view class="mt10">
							<uni-title title="24H成交额" :height="65" :isBold="false" @click="gotoMore('24h')">
								<text class="normal_txt">更多</text>
							</uni-title>
						</view>
 						<divide-table-cell-head :items="['名称','最新价(CNY)','24H成交额']"></divide-table-cell-head>
						<divide-table-cell v-for="(item, index) in coins" :item="item" :key="index" type="24h"></divide-table-cell>
 -->						<!-- <view class="mt10">
							<uni-title title="涨幅榜" :height="65" :isBold="false" @click="gotoMore('rise')">
								<text class="normal_txt">更多</text>
							</uni-title>
						</view> -->
						<!-- <divide-table-cell-head :items="['名称','最新价','24H涨幅']"></divide-table-cell-head>
							<view class="mt10">
								<uni-title title="跌幅榜" :height="65" :isBold="false" @click="gotoMore('fall')">
								<text class="normal_txt">更多</text>
							</uni-title>
						</view> -->
						<!-- <divide-table-cell-head :items="['名称','最新价','24H跌幅']"></divide-table-cell-head>
							<view class="mt10">
								<uni-title title="基本信息" :height="65" :isBold="false">
							</uni-title>
						</view> -->
						<uni-title title="基本信息"></uni-title>
						<base-info-label name="官网" isLink :value="[{name:exchange.platform_name, url: exchange.official_url}]"></base-info-label>
						<base-info-label name="国家"  :value="exchange.country"></base-info-label>
						<base-info-label name="成立时间"  :value="exchange.launchedtime"></base-info-label>
						<base-info-label name="交易模式"  :value="exchange.labels"></base-info-label>
						<base-info-label name="社交帐号" isLink  :value="[{name:'Facebook', url:exchange.facebook_url},{name:'微搏',url:exchange.weibo_url},{name:'twitter',url:exchange.twitter_url}]"></base-info-label>
						<base-info-label name="简介" :value="exchange.desc" isHtml></base-info-label>
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item>
				<mix-pulldown-refresh ref="mixPulldownRefresh1" class="panel-content" :top="0" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll">
					<!-- <scroll-view id="tab-bar" class="tab-bar" scroll-x scroll-with-animation :scroll-left="scrollLeft" :show-scrollbar="false">
						<view
							v-for="(item,index) in tradeTabBar" :key="index"
							class="tab-bar-item 'tab'"
							:class="{current: index === tradeTabCurrentIndex}"
							:id="'tab'+index"
							@click="changeTabBar(index)"
						><text>{{item.name}}</text></view>
					</scroll-view> -->
					<scroll-view
						class="panel-scroll-box"
						:scroll-y="enableScrollY"
						@scrolltolower="loadMore"
						:style="{height: (swiperHeight-22)+'px'}"
						>
						<view class="table_head">
							<view class="flex flex_row">
								<view class="flex7"><text class="normal_txt">交易对</text></view>
								<view class="flex4"><text class="normal_txt">最新价($)</text></view>
								<view class="flex4"><text class="normal_txt">24额</text></view>
								<view class="flex4"><text class="normal_txt">成交额占比</text></view>
							</view>
						</view>
						<uni-coins-detail-table-cell @click="toCoinsDetail" v-for="(item, index) in tabBars[1].newsList" :key="index" :exchange_code="exchange.platform" :item="item"></uni-coins-detail-table-cell>

						<!-- <uni-self-dish-table-cell :key="index" :item="item" type="exchange"></uni-self-dish-table-cell> -->
						<mix-load-more :status="loadMoreStatus"></mix-load-more>
					</scroll-view>
				</mix-pulldown-refresh>
			</swiper-item>
			<!-- <swiper-item>
				<mix-pulldown-refresh ref="mixPulldownRefresh2" class="panel-content" :top="0" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll">
					<scroll-view
						class="panel-scroll-box"
						:scroll-y="enableScrollY"
						@scrolltolower="loadMore"
						:style="{height: swiperHeight+'px'}"
						>
						<news-item :newsItem="item" v-for="(item, index) in tabBars[2].newsList" :key="index"></news-item>

						<mix-load-more :status="tabBars[2].loadMoreStatus"></mix-load-more>
					</scroll-view>
				</mix-pulldown-refresh>
			</swiper-item> -->
			<swiper-item>
				<mix-pulldown-refresh ref="mixPulldownRefresh2" class="panel-content" :top="0" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll">
					<scroll-view
						class="panel-scroll-box"
						:scroll-y="enableScrollY"
						@scrolltolower="loadMore"
						:style="{height: swiperHeight+'px'}"
						>
						<announce-item :newsItem="item" v-for="(item, index) in tabBars[2].newsList" :key="index"></announce-item>
						<!-- <news-item :newsItem="item" v-for="(item, index) in tabBars[2].newsList" :key="index"></news-item> -->
						<!-- 上滑加载更多组件 -->
						<mix-load-more :status="loadMoreStatus"></mix-load-more>
					</scroll-view>
				</mix-pulldown-refresh>
			</swiper-item>
		</swiper>
		<uni-popup ref="tips">
			<view class="tips_box">
				<view><text class="list_item_black_title_base">ExRank说明</text></view>

				<view class="tips_content_box">
					<text class="list_item_black_title_sm">全球交易所综合排行榜(exChange Rank)，检测ExRank，是衡量数字货币交易所综合性的指标，对交易所不同维度的数据进行分析得出的综合分数。</text>
				</view>
				<view class="close_btn" @click="close">
					<text class="close_btn_txt">确定</text>
				</view>
			</view>
		</uni-popup>
	</view>
</template>
<script>
	import {focusAuthor, newsItems, coins} from '@/mock/data.js';
	import  {identification} from '@/common/config.js';
	import tabs from '@/components/tabs.vue';
	import uniTitle from '@/components/uni-title.vue';
	import newsItem from '@/components/list-item/news-item.vue';
	import icons from '@/components/icons/icons.vue';
	import {loadMore, unitConvert} from '@/common/util.js';
	import divideTableCellHead from '@/pages/exchange/divide_table_cell_head.vue';
	import divideTableCell from '@/pages/exchange/divide_talbe_cell.vue';
	import uniSelfDishTableHead from '@/components/list-item/uni-self-dish-table-head.vue';
	import uniSelfDishTableCell from '@/components/list-item/uni-self-dish-table-cell.vue'
	import baseInfoLabel from '@/pages/exchange/base-info-label.vue';
	import announceItem from '@/components/list-item/announce-item.vue';
	import {mapState} from 'vuex';
	import {uniPopup} from '@dcloudio/uni-ui';
	import uniCoinsDetailTableCell from '@/components/list-item/uni-coins-detail-table-cell.vue';

	let windowWidth = 0, scrollTimer = false, tabBar, scrollTimer1 = false;
	export default {
		data() {
			return {
				exchange:{},
				data: null,
				identification: null,
				currTab: 0,
				dataList: [],
				loadMoreStatus:  0, //加载更多 0加载前，1加载中，2没有更多了
				refreshing: false, // 刷新状态
				isFocus: false, // 是否被关注
				tabBars: [{name:'主页'},{name: '行情'},{name:'公告'}],
				coins: coins,
				tradeTabBar: [{name:'全部'},{name:'BTC'},{name:'ETH'},{name: 'EOS'},{name:'BCH'},{name:'EURS'},{name:'USDT'},{name:'ETH'},{name: 'EOS'},{name:'BCH'},{name:'EURS'},{name:'USDT'}],
				tradeTabCurrentIndex: 0, // 行情标签下tab的索引
				scrollLeft: 0, // 顶部选项卡左滑距离
				enableScrollY: false, // scrollview是否可以华东
				headScrollTop: 0,
				swiperHeight: 0,
				exChangeName: '',
				pageNum: 1,
				pageSize: 15,
			}
		},
		mixins:[loadMore, unitConvert],
		components:{
			tabs,
			uniTitle,
			newsItem,
			icons,
			divideTableCellHead,
			divideTableCell,
			baseInfoLabel,
			uniSelfDishTableHead,
			uniSelfDishTableCell,
			uniPopup,
			announceItem,
			uniCoinsDetailTableCell
		},
		onReady() {
			let _this = this;
			uni.getSystemInfo({
				success: function(e) {
					// 44为标题的高度
					_this.swiperHeight = e.windowHeight;
				}
			})
		},
		onLoad(e) {
			// 获取屏幕宽度
			windowWidth = uni.getSystemInfoSync().windowWidth;
			this.tabBars = this.initTab(this.tabBars);
			this.exChangeName = e.exChangeName;
			this.init();
			uni.setNavigationBarTitle({
				title: e.exChangeName
			});
		},
		mounted() {
			// this.getElSize('.swiper');
		},
		onPageScroll(e) {
			if(Math.ceil(e.scrollTop) + 20 > this.headScrollTop ) {
				this.enableScrollY = true;
			} else {
				this.enableScrollY = false;
			}
		},
		onShareAppMessage() {
			console.log('分享...');
		},
		onNavigationBarButtonTap(e) {
			console.log(e);
		},
		computed:mapState(['upTheme', 'downTheme', 'userInfo']),
		methods: {
			toDetail(){
				let symbol = this.exchange.exchange_coinsymbol;
				let code = this.exchange.exchange_coincode;
				uni.navigateTo({
					url: '/pages/quotations/coinDetail?code='+code+'&symbol='+symbol+'&exChangeName='+this.exchange.platform
				});
				// this.$emit('click');
			},
			//
			toCoinsDetail(item) {
				let symbol = item.symbol;
				let code = item.coincode;
				uni.navigateTo({
					url: '/pages/quotations/coinDetail?code='+code+'&symbol='+symbol+'&exChangeName='+this.exchange.platform
				});
			},

			// 获得详情
			async init() {
				let data = await this.$api.coins_exhange_detail(this.exChangeName);
				if (data && data.code === 200) {
					if(data.result.code == 200) {
						this.exchange = data.result.data;
					}
				} else {
					this.$message({icon: 'none', title: data.msg})
				}
			},
			//列表
			async loadList(action){
				let tabItem = this.tabBars[this.currTab];
				//action= add上拉加载 refresh下拉刷新
				if (action=='refresh') {
					tabItem.newsList = [];
					this.pageNum = 1;
					this.loadMoreStatus = 0;
				}
				if (this.loadMoreStatus==0) {
					this.loadMoreStatus = 1;
					let data = 0;
					// 行情
					if(this.currTab == 1){
						data = await this.$api.coins_exhange_markets(this.exChangeName, {
							pageNum: this.pageNum,
							pageSize: this.pageSize,
						});
					}
					// 公告
					if(this.currTab == 2) {
						data = await this.$api.coins_exhange_news(this.exChangeName, {
							page: this.pageNum,
							pageSize: this.pageSize,
						});
					}

					if (data && data.code === 200) {
						if(data.result.code == 200) {
							let result = [];
							if(this.currTab == 2){
								result = data.result.data.list || [];
								this.lastPage = data.result.total_pages
							} else{
								result = data.result.data || [];
								this.lastPage = data.result.maxpage
							}
							tabItem.newsList.push(...result);
							this.$refs['mixPulldownRefresh'+this.currTab] && this.$refs['mixPulldownRefresh'+this.currTab].endPulldownRefresh();
							this.refreshing = false;
							if (this.pageNum==this.lastPage) {
								this.loadMoreStatus = 2;
							}else{
								this.loadMoreStatus = 0;
							}
							this.pageNum += 1;
						}
					} else {
						this.$message(data.msg)
					}
					this.isTap = false;
					// })
				}
			},
			changeTab(e) {
				if(scrollTimer1){
					//多次切换只执行最后一次
					clearTimeout(scrollTimer1);
					scrollTimer1 = false;
				}
				let index = e;
				//e=number为点击切换，e=object为swiper滑动切换
				if(typeof e === 'object'){
					index = e.detail.current
				}

				if(typeof e === 'number'){
					//点击切换时先切换再滚动tabbar，避免同时切换视觉错位
					this.currTab = index;
				}
				//延迟300ms,等待swiper动画结束再修改tabbar
				scrollTimer1 = setTimeout(()=>{
					if(typeof e === 'object'){
						this.currTab = index;
					}
					this.currTab = index;

					//第一次切换tab，动画结束后需要加载数据
					// 重置
					let tabItem = this.tabBars[this.currTab];
					if(tabItem.loaded !== true){
						if(this.currTab != 0){
							this.loadList('refresh');
						}
						tabItem.loaded = true;
					}
				}, 300)
			},
			showQrCode() {
				console.log("showQrCode");
			},
			gotoMore(type) {
				uni.navigateTo({
					url:'/pages/exchange/billboard/billboard?type='+type
				})
			},
			// 改变行情栏目下的tabcurr值
			async changeTabBar(e, item) {
				console.log(e,item);
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
					tabBar = await this.getElSize(".tab-bar", 'scrollLeft')
				}
				//计算宽度相关
				let tabBarScrollLeft = tabBar.scrollLeft;
				let width = 0;
				let nowWidth = 0;
				//获取可滑动总宽度
				for (let i = 0; i <= index; i++) {
					let result = await this.getElSize('#tab' + i, 'scrollLeft');
					width += result.width;
					if(i === index){
						nowWidth = result.width;
					}
				}
				if(typeof e === 'number'){
					//点击切换时先切换再滚动tabbar，避免同时切换视觉错位
					this.tradeTabCurrentIndex = index;
				}
				//延迟300ms,等待swiper动画结束再修改tabbar
				scrollTimer = setTimeout(()=>{
					if (width - nowWidth/2 > windowWidth / 2) {
						//如果当前项越过中心点，将其放在屏幕中心
						this.scrollLeft = width - nowWidth/2 -  windowWidth / 2;
					}else{
						this.scrollLeft = 0;
					}
					if(typeof e === 'object'){
						this.tradeTabCurrentIndex = index;
					}
					this.tradeTabCurrentIndex = index;

					//第一次切换tab，动画结束后需要加载数据
					// 重置
					this.tabBars[this.currTab].newsList = [];
					this.tabBars[this.currTab].loadMoreStatus = 0;
					this.tabBars[this.currTab].refreshing = 0;
					let tabItem = this.tabBars[this.currTab];
					// if(tabItem.loaded !== true){
						this.loadList('refresh');
					// 	tabItem.loaded = true;
					// }
				}, 300)
			},

			getElSize(selector, type) {
				return new Promise((res, rej) => {
					let el = uni.createSelectorQuery().select(selector);
					el.fields({
						size: true,
						scrollOffset: true,
						rect: true
					}, (data) => {
						this.headScrollTop = data.top;
						if(type) {
							res(data);
						}
					}).exec();
				});
			},
			showTips() {
				this.$refs.tips.open();
			},
			close() {
				this.$refs.tips.close();
			}
		}
	}
</script>

<style lang="scss">
	@import '@/common/quotations.scss';
	page,.container,{
		height: 100%;
		background-color: $bgColor;
		// overflow: hidden;
	}
	.swiper, .panel-scroll-box{
		height: 100%;
		background-color: #fff;
	}
	.bg_wrapper{
		height: 200upx;
		padding: 50upx $space-base;
		background-color: #202028;
		// align-items: center;
	}
	.img_wrapper {
		width: 80upx;
		height: 80upx;
		position: relative;
		z-index: 10;
	}
	.image-list1 {
	    @include circle(80upx);
	}
	.icon_v{
		@include circle(36upx);
		@include center;
		font-size: 20upx;
		color: #fff;
		position: absolute;
		bottom: 0upx;
		right: 0upx;
		z-index: 11;
		background-color: $mainColor;
	}
	.txt{
		line-height: 56upx;
		@include txt(30upx, $mainColor);
	}
	.white{
		color: #fff
	}
	.desc_txt{
		@include txt(30upx, #000);
		line-height: 38upx;
	}
	.brBot{
		@include sideBorder;
		padding-bottom: 30upx;
	}
	.qrCode_wrap{
		padding: 0 $space-sm;
	}
	.list_container{
		@include flexRow;
		background-color: #fff;
	}
	.icon_wrapper1 {
		width: 80upx;
		padding-top: 20upx;
	}
	.image-list2{
		@include circle(50upx);
	}
	.border_bottom{
		@include sideBorder;
		flex: 1;
		padding: 20upx 0upx;
	}
	.white_color{
		color: #fff;
	}
	.mt20{
		margin-top: 20upx;
	}
	.range_box{
		border: 2upx solid $mainColor;
		border-radius: 16upx;
		padding: 6upx 12upx;
		position: relative;
	}
	.range_txt_box{
		background-color: $mainColor;
		border-radius: 14upx;
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		left: 50%;
		@extend  .flex;
		align-items: center;
		justify-content: center;
		text-align: center;
	}
	.main_coins_wrap{
		padding: $space-sm $space-lg;
		background-color: #fff;
	}
	.mt10{
		margin-top: 10upx;
	}
	.mb20{
		margin-bottom: 20upx;
	}
	/* 顶部tabbar */
	.tab-bar{
		position: relative;
		z-index: 10;
		height: 70upx;
		white-space: nowrap;
		box-shadow: 0 2upx 8upx rgba(0,0,0,.06);
		background-color: #fff;
		.tab-bar-item{
			display: inline-block;
			/* width: 150upx; */
			padding: 0 20upx;
			height: 70upx;
			text-align: center;
			line-height: 70upx;
			font-size: 26upx;
			color: #303133;
			position: relative;
			border: 2upx solid $borderColor;
			border-left-width: 0upx;
			border-bottom-width: 0upx;
		}
		.current{
			background-color: $mainColor;
			color: #FFF;
			border-color: $mainColor;
		}
	}
	.range_txt{
		@include txt($color: #fff);
	}
	.range_focus_txt{
		@include txt($color: $mainColor);
	}
	.tips_box{
		width: 300px;
		padding-top: $space-lg;
		background-color: #fff;
		@extend .flex_column;
		align-items: center;
		border-radius: 8upx;
	}
	.tips_content_box{
		padding: $space-lg;
	}
	.close_btn{
		width: 100%;
		height: 44px;
		@include sideBorder(top);
		text-align: center;
		line-height: 44px;
		.close_btn_txt{
			@include txt(30upx, #489aff)
		}
	}
	.table_head{
		height: 32px;
		background-color: $bgColor;
		justify-content: center;
		padding: 0 $space-lg;
	}
</style>
