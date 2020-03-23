<template>
	<view class="container">
		<view class="flex_row bg_wrapper">
			<view class="img_wrapper mr20">
				<image class="image-list1" src="../../static/temp/avatar.jpeg"></image>
			</view>
			<view class="flex_column flex3 space_between">
				<view class="flex_row mt20">
					<text class="list_item_black_title_sm heavy mr20 white_color">{{data.name}}</text>
					<text class="list_item_black_title_sm heavy mr20 focus_color" >ER{{data.ERange}}</text>
					<view @click="showTips"><icons type="question" color="#ffb100"></icons></view>
				</view>
				<view class="flex_column">
					<text class="list_item_black_title_base white_color">{{data.oneDayDeal}}亿</text>
					<text class="normal_txt">24H成交额</text>
				</view>
			</view>
			<view class="flex_column flex2 space_between">
				<view class="flex_row mt20 range_box">
					<text class="range_focus_txt">全球排名</text>
					<view class="range_txt_box">
						<text class="range_txt">第{{data.globalRange}}名</text>
					</view>
				</view>
				<view class="flex_column">
					<text class="list_item_black_title_base white_color">{{data.changeDouble}}亿</text>
					<text class="normal_txt">交易对</text>
				</view>
			</view>
		</view>
		<tabs :tabs="['主页','行情','资讯','公告']" @changeTab="changeTab" :defaultTab="currTab"></tabs>
		<swiper :current="currTab" @change="changeTab" class="swiper">
			<swiper-item>
				<scroll-view :scroll-y="enableScrollY" :style="{height: swiperHeight+'px'}">
					<view>
						<view class="flex_row_center main_coins_wrap">
							<view class="flex1 flex_column">
								<text class="blod_black_txt">BTC/TUSD</text>
								<text class="list_item_black_title_base" :style="{color:downTheme != null ? downTheme.txt : '#999'}">5230.02</text>
								<text class="normal_txt" :style="{color:downTheme != null ? downTheme.txt : '#999'}">-3.61%</text>
							</view>
							<view class="flex1 flex_column">
								<text class="blod_black_txt">BTC/TUSD</text>
								<text class="list_item_black_title_base" :style="{color:downTheme != null ? downTheme.txt : '#999'}">5230.02</text>
								<text class="normal_txt" :style="{color:downTheme != null ? downTheme.txt : '#999'}">-3.61%</text>
							</view>
							<view class="flex1 flex_column">
								<text class="blod_black_txt">BTC/TUSD</text>
								<text class="list_item_black_title_base" :style="{color:upTheme != null ? upTheme.txt : '#999'}">5230.02</text>
								<text class="normal_txt" :style="{color:upTheme != null ? upTheme.txt : '#999'}">+3.61%</text>
							</view>
						</view>
						<view class="mt10">
							<uni-title title="24H成交额" :height="65" :isBold="false" @click="gotoMore('24h')">
								<text class="normal_txt">更多</text>
							</uni-title>
						</view>
						<divide-table-cell-head :items="['名称','最新价(CNY)','24H成交额']"></divide-table-cell-head>
						<divide-table-cell v-for="(item, index) in coins" :item="item" :key="index" type="24h"></divide-table-cell>
						<view class="mt10">
							<uni-title title="涨幅榜" :height="65" :isBold="false" @click="gotoMore('rise')">
								<text class="normal_txt">更多</text>
							</uni-title>
						</view>
						<divide-table-cell-head :items="['名称','最新价','24H涨幅']"></divide-table-cell-head>
<!-- 						<divide-table-cell v-for="(item, index) in coins" :item="item" :key="index" type="riseAndFall"></divide-table-cell>
 -->						<view class="mt10">
							<uni-title title="跌幅榜" :height="65" :isBold="false" @click="gotoMore('fall')">
								<text class="normal_txt">更多</text>
							</uni-title>
						</view>
						<divide-table-cell-head :items="['名称','最新价','24H跌幅']"></divide-table-cell-head>
<!-- 						<divide-table-cell v-for="(item, index) in coins" :item="item" :key="index" type="riseAndFall"></divide-table-cell>
 -->						<view class="mt10">
							<uni-title title="基本信息" :height="65" :isBold="false">
							</uni-title>
						</view>
						<base-info-label name="官网" isLink link_url="www.baidu.com" value="www.baidu.com"></base-info-label>
						<base-info-label name="国家"  value="英国"></base-info-label>
						<base-info-label name="成立时间"  value="2019-2"></base-info-label>
						<base-info-label name="交易模式"  value="现货交易 场外交易"></base-info-label>
						<base-info-label name="社交帐号" isLink link_url="www.baidu.com" value="微博"></base-info-label>
						<base-info-label name="简介" value="我是简介啦啦啦啦, 我是简介啦啦啦啦,我是简介啦啦啦啦 ,我是简介啦啦啦啦,我是简介啦啦啦啦,我是简介啦啦啦啦,我是简介啦啦啦啦,我是简介啦啦啦啦,我是简介啦啦啦啦,我是简介啦啦啦啦,我是简介啦啦啦啦"></base-info-label>
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item>
				<mix-pulldown-refresh ref="mixPulldownRefresh1" class="panel-content" :top="90" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll">
					<scroll-view id="tab-bar" class="tab-bar" scroll-x scroll-with-animation :scroll-left="scrollLeft" :show-scrollbar="false">
						<view 
							v-for="(item,index) in tradeTabBar" :key="index"
							class="tab-bar-item"
							:class="{current: index === tradeTabCurrentIndex}"
							:id="'tab'+index"
							@click="changeTabBar(index)"
						><text>{{item.name}}</text></view>
					</scroll-view>
					<scroll-view
						class="panel-scroll-box" 
						:scroll-y="enableScrollY" 
						@scrolltolower="loadMore"
						:style="{height: (swiperHeight-22)+'px'}"
						>
						<uni-self-dish-table-head>
							<view class="edit_cell"><text class="normal_txt">名称/成交量</text></view>
						</uni-self-dish-table-head>
						<uni-self-dish-table-cell v-for="(item, index) in tabBars[1].newsList" :key="index" :item="item" type="exchange"></uni-self-dish-table-cell>
						<mix-load-more :status="tabBars[1].loadMoreStatus"></mix-load-more>
					</scroll-view>
				</mix-pulldown-refresh>
			</swiper-item>
			<swiper-item>
				<mix-pulldown-refresh ref="mixPulldownRefresh2" class="panel-content" :top="90" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll">
					<scroll-view
						class="panel-scroll-box" 
						:scroll-y="enableScrollY" 
						@scrolltolower="loadMore"
						:style="{height: swiperHeight+'px'}"
						>
						<news-item :newsItem="item" v-for="(item, index) in tabBars[2].newsList" :key="index"></news-item>
						<!-- 上滑加载更多组件 -->
						<mix-load-more :status="tabBars[2].loadMoreStatus"></mix-load-more>
					</scroll-view>
				</mix-pulldown-refresh>
			</swiper-item>
			<swiper-item>
			我是公共
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
	import {loadMore} from '@/common/util.js';
	import divideTableCellHead from '@/pages/exchange/divide_table_cell_head.vue';
	import divideTableCell from '@/pages/exchange/divide_talbe_cell.vue';
	import uniSelfDishTableHead from '@/components/list-item/uni-self-dish-table-head.vue';
	import uniSelfDishTableCell from '@/components/list-item/uni-self-dish-table-cell.vue'
	import baseInfoLabel from '@/pages/exchange/base-info-label.vue';
	import {mapState} from 'vuex';
	import {uniPopup} from '@dcloudio/uni-ui';
	let windowWidth = 0, scrollTimer = false, tabBar, scrollTimer1 = false;
	export default {
		data() {
			return {
				data: {
					name: 'HitBTC',
					ERange: 6,
					oneDayDeal: 2.93,
					changeDouble: 619,
					globalRange: 25,
				},
				identification: null,
				currTab: 0,
				dataList: [],
				loadMoreStatus:  0, //加载更多 0加载前，1加载中，2没有更多了
				refreshing: false, // 刷新状态
				isFocus: false, // 是否被关注
				tabBars: [{name:'主页'},{name: '行情'},{name: '资讯'},{name:'公告'}],
				coins: coins,
				tradeTabBar: [{name:'全部'},{name:'BTC'},{name:'ETH'},{name: 'EOS'},{name:'BCH'},{name:'EURS'},{name:'USDT'},{name:'ETH'},{name: 'EOS'},{name:'BCH'},{name:'EURS'},{name:'USDT'}],
				tradeTabCurrentIndex: 0, // 行情标签下tab的索引
				scrollLeft: 0, // 顶部选项卡左滑距离
				enableScrollY: false, // scrollview是否可以华东
				headScrollTop: 0,
				swiperHeight: 0,
			}
		},
		mixins:[loadMore],
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
			uniPopup
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
			this.tabBars = this.initTab(this.tabBars);
			uni.setNavigationBarTitle({
				title: e.exChangeName
			});
		},
		mounted() {
			this.getElSize();
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
		computed:mapState(['upTheme', 'downTheme']),
		methods: {
			//列表
			loadList(type){
				let tabItem = this.tabBars[this.currTab];
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
					let list= [];
					if(tabItem.name == '行情') {
						list = coins;
					} else {
						list = newsItems;
					}
					list.sort((a,b)=>{
						return Math.random() > .5 ? -1 : 1; //静态数据打乱顺序
					})
					if(type === 'refresh'){
						// 刷新前清空数组
						tabItem.newsList = [];
					}
					let tempArr = [];
					list.forEach(item=>{
						item.id = parseInt(Math.random() * 10000);
						tempArr.push(item);
					});
					tabItem.newsList = [...tabItem.newsList, ...tempArr];
					//下拉刷新 关闭刷新动画
					if(type === 'refresh'){
						let keyName = 'mixPulldownRefresh'+this.currTab
						this.$refs[keyName] && this.$refs[keyName].endPulldownRefresh();
						// #ifdef APP-PLUS
						tabItem.refreshing = false;
						// #endif
						tabItem.loadMoreStatus = 0;
					}
					//上滑加载 处理状态
					if(type === 'add'){
						// 这里解决深拷贝问题，
						this.tabBars = Object.assign({}, this.tabBars);
						tabItem.loadMoreStatus = tabItem.newsList.length > 40 ? 2: 0;
					}
				}, 600)
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
						this.loadList('add');
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
					tabBar = await this.getElSize("tab-bar")
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
					this.tradeTabCurrentIndex = index; 
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
						this.loadList('add');
					// 	tabItem.loaded = true;
					// }
				}, 300)
			},
			
			getElSize(id) {
				let el = uni.createSelectorQuery().select('.swiper');
				el.fields({
					size: true,
					scrollOffset: true,
					rect: true
				}, (data) => {
					this.headScrollTop = data.top;
				}).exec();
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
</style>
