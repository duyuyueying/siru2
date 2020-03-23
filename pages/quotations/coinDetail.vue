<template>
	<view class="detail_wrap">
		<view class="head_wrap space_between flex_row">
			<view class="flex2 space_between flex_column">
				<text class="bold_txt" :style="{color: isUp > 0 ? upTheme.txt : downTheme.txt}">&yen;5431.78</text>
				<text class="sm_txt" :style="{color: isUp > 0 ? upTheme.txt : downTheme.txt}">=5431.78</text>
				<text class="sm_txt" :style="{color: isUp > 0 ? upTheme.txt : downTheme.txt}">-5431.78%</text>
			</view>
			<view class="flex1 flex_column">
				<text class="sm_txt">24h最高价    11111</text>
				<text class="sm_txt">24h最低价    11111</text>
				<text class="sm_txt">24h成交量    11111</text>
			</view>
		</view>
		<k-lines></k-lines>
		<tabs :tabs="['报价','简介']" @changeTab="changeTab" :defaultTab="currTab"></tabs>
		<swiper
			id="swiper"
			class="swiper" 
			:duration="300" 
			:current="currTab"
			@change="changeTab"
			ref="test"
		>
			<swiper-item>
				<view class="relative_section">
					<uni-self-dish-table-head>
						<view class="edit_cell"><text class="normal_txt">交易所</text></view>
					</uni-self-dish-table-head>
				</view>
				<mix-pulldown-refresh ref="mixPulldownRefresh" class="panel-content" :top="90" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll">
					<scroll-view
						class="panel-scroll-box"
						:scroll-y="enableScrollY"
						@scrolltolower="loadMore"
						:style="{height: swiperHeight+'px'}"
						>
						<uni-self-dish-table-cell v-for="(item, index) in dataList" :key="index" :isSelect="index == 0" :item="item" hasCollect @collect="collect"></uni-self-dish-table-cell>
						<!-- 上滑加载更多组件 -->
						<mix-load-more :status="loadMoreStatus"></mix-load-more>
					</scroll-view>
				</mix-pulldown-refresh>
			</swiper-item>
			<swiper-item>
				<view class="profile_wrap flex_column" v-if="currTab == 1">
					<text class="desc_txt">比特币（英语：Bitcoin，缩写：BTC或XBT）是一种基于去中心化，采用点对点网路与共识主动性，开放原始码，以区块链作为底层技术的加密货币，比特币由中本聪（Satoshi Nakamoto）于2008年10月31日发表论文，
					2009年1月3日，创世区块诞生。在某些国家则将比特币视为虚拟商品，并非货币。</text>
					<text class="desc_txt"> 流通总量   222222亿</text>
					<text class="desc_txt"> 发行总量   222222亿</text>
					<text class="desc_txt"> 发行时间   222222亿</text>
				</view>
			</swiper-item>
		</swiper>
		<view class="fixed_bottom flex_row">
			<view class="flex1 center btn_share" @click="share">
				<icons type="share"></icons>
				分享
			</view>
			<view class="flex1 center noSelect" :class="{isCollect: isSelect}" @click="collect(id)">
				<icons type="collect" :color="isSelect ? '#FFB100':'#FFF'"></icons>
				{{isSelect ? '已添加': '加自选'}}
			</view>
		</view>
	</view>
</template>

<script>
	import tabs from '@/components/tabs.vue';
	import uniSelfDishTableHead from '@/components/list-item/uni-self-dish-table-head.vue';
	import uniSelfDishTableCell from '@/components/list-item/uni-self-dish-table-cell.vue';
	import kLines from '@/pages/quotations/kLine.vue';
	import {loadMore} from '@/common/util.js';
	import {coins} from '@/mock/data.js';
	import {mapState} from 'vuex';
	export default {
		data() {
			return {
				symbol: '',
				currTab: 0,
				coins: coins,
				dataList: [],
				loadMoreStatus: 0,  //加载更多 0加载前，1加载中，2没有更多了
				refreshing: 0,// 刷新
				page: 0 ,// 加载的页数
				startPrice: 0, // 开盘价
				endPrice: 0, // 收盘价
				headScrollTop: 0,
				enableScrollY: false,
				isSelect: false, // 是否被加入了自选列表
				id: 123,
				swiperHeight: 0,
			};
		},
		mixins:[loadMore],
		components:{
			tabs,
			uniSelfDishTableHead,
			uniSelfDishTableCell,
			kLines,
			loadMore
		},
		onLoad(query){
			uni.setNavigationBarTitle({
				title: query.symbol+'/USDT('+(query.exChangeName == '' ? '全球均价' : query.exChangeName)+')'
			});
			this.startPrice = 2;
			this.endPrice =1;
			this.loadList('add');
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
		mounted() {
			this.getElSize();
		},
		computed:{
			...mapState(['upTheme','downTheme']),
			isUp(){
				return this.startPrice < this.endPrice;
			}
		},
		onPageScroll(e) {
			if(Math.ceil(e.scrollTop) + 20 > this.headScrollTop ) {
				this.enableScrollY = true;
			} else {
				this.enableScrollY = false;
			}
		},
		methods:{
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
					let list = coins;
					// TODO:删除
					list.sort((a,b)=>{
						return Math.random() > .5 ? -1 : 1; //静态数据打乱顺序
					})
					// TODO:END
					if(type === 'refresh'){
						this.dataList = []; //刷新前清空数组
					}
					let tempArr = []
					list.forEach(item=>{
						// TODO:删除
						item.id = parseInt(Math.random() * 10000);
						// TODO:END
						tempArr.push(item);
					})
					this.dataList.push(...tempArr);
					//下拉刷新 关闭刷新动画
					if(type === 'refresh'){
						this.$refs.mixPulldownRefresh && this.$refs.mixPulldownRefresh.endPulldownRefresh();
						// #ifdef APP-PLUS
						this.refreshing = false;
						// #endif
						this.loadMoreStatus = 0;
						this.page = 0;
					}
					//上滑加载 处理状态
					if(type === 'add'){
						this.page++;
						this.loadMoreStatus = this.dataList.length > 40 ? 2: 0;
					}
				}, 600)
			},
			changeTab(e){
				let index;
				if(typeof e === 'object'){
					index = e.detail.current
				}
				if(typeof e === 'number'){
					index = e;
				}
				this.currTab = index;
			},
			//获得元素的size
			getElSize(id) { 
				let el = uni.createSelectorQuery().select('.relative_section');
				el.fields({
					size: true,
					scrollOffset: true,
					rect: true
				}, (data) => {
					this.headScrollTop = data.top;
				}).exec();
			},
			share() {
				uni.showToast({
					icons: 'none',
					title: '去分享'
				})
			},
			// 自选切换
			collect(id) {
				console.log(id);
				if(id == this.id) {
					this.isSelect = !this.isSelect;
				}
				let tempArr = []
				this.dataList.forEach((item, index)=>{
					let newObj = Object.assign({},item);
					if( index == 0) {
						newObj.isCollect = !newObj.isCollect
					}
					tempArr.push(newObj);
				})
				this.dataList = tempArr;
			}
		}
	}
</script>

<style lang="scss">
	page, .detail_wrap, .swiper{
		height: 100%;
	}
	.relative_section{
		position: relative;
		z-index: 2;
	}
	.head_wrap{
		background-color: #131e31;
		padding: $space-base $space-lg;
	}
	.space_between{
		justify-content: space-between;
	}
	.bold_txt{
		font-size: 42upx;
		color: #fff;
		font-weight: bold;
	}
	.sm_txt{
		font-size: 24upx;
		color: #fff;
		line-height: 52upx;
	}
	.desc_txt{
		font-size: 26upx;
		color: #959595;
		line-height: 40upx;
	}
	.profile_wrap{
		padding: 0 $space-lg;
	}
	.fixed_bottom{
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		height: 44px;
		background-color: #fff;
		box-shadow: 0 4upx 5px rgba(0,0,0,.3);
	}
	.center{
		@extend .flex;
		justify-content: center;
		align-items: center;
		font-size: 30upx;
	}
	.isCollect{
		color: $mainColor !important;
		background-color: #fff !important;
		border-color: #a0a0a0 !important;
	},
	.noSelect{
		color: #fff;
		background-color: $mainColor;
		border-color: #a0a0a0;
		@include sideBorder(left, $color: $mainColor)
	}
</style>
