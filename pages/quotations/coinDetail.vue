<template>
	<view class="detail_wrap">
		<view class="head_wrap space_between flex_row" v-if="detail != null">
			<view class="flex2 space_between flex_column">
				<text class="bold_txt" :style="{color: detail.change_percent > 0 ? upTheme.txt : downTheme.txt}">&yen;{{detail.price_cny}}</text>
				<text class="sm_txt" :style="{color: detail.change_percent > 0 ? upTheme.txt : downTheme.txt}">={{detail.price}}&nbsp;&nbsp;({{detail.change_percent}}%)</text>
				<text class="sm_txt" :style="{color: detail.change_percent > 0 ? upTheme.txt : downTheme.txt}">市值：{{unitConvert(detail.marketcap)}}</text>
			</view>
			<view class="flex1 flex_column">
				<text class="mini_txt">最高 {{detail.high}}</text>
				<text class="mini_txt">最低  {{detail.low}}</text>
				<text class="mini_txt">24H量  {{unitConvert(detail.vol_btc)}}</text>
				<text class="mini_txt">24H额  {{unitConvert(detail.vol)}}</text>
				<text class="mini_txt">24H换手率  {{detail.turn_over}}</text>
			</view>
		</view>
		<k-lines :code="code"></k-lines>
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
					<view class="table_head">
						<view class="flex flex_row">
							<view class="flex5"><text class="normal_txt">交易对</text></view>
							<view class="flex6"><text class="normal_txt">最新价($)</text></view>
							<view class="flex6"><text class="normal_txt">24额</text></view>
							<view class="flex4"><text class="normal_txt">成交额占比</text></view>
						</view>
					</view>
				</view>
				<mix-pulldown-refresh ref="mixPulldownRefresh" class="panel-content" :top="90" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll">
					<scroll-view
						class="panel-scroll-box"
						:scroll-y="enableScrollY"
						@scrolltolower="loadMore"
						:style="{height: swiperHeight+'px'}"
						>
						<uni-coins-detail-table-cell v-for="(item, index) in dataList" :key="index" :isSelect="index == 0" :item="item" hasCollect @collect="collect"></uni-coins-detail-table-cell>
						<!-- 上滑加载更多组件 -->
						<mix-load-more :status="loadMoreStatus"></mix-load-more>
					</scroll-view>
				</mix-pulldown-refresh>
			</swiper-item>
			<swiper-item>
				<view class="profile_wrap flex_column" v-if="currTab == 1" v-html="detail.coindesc">
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
	import uniCoinsDetailTableCell from '@/components/list-item/uni-coins-detail-table-cell.vue';
	import kLines from '@/pages/quotations/kLine.vue';
	import {loadMore, unitConvert} from '@/common/util.js';
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
				code: '',
				pageNum: 1,
				pageSize: 15,
				total: 0,
				lastPage: 1,
				detail: null
			};
		},
		mixins:[loadMore, unitConvert],
		components:{
			tabs,
			uniSelfDishTableHead,
			uniCoinsDetailTableCell,
			kLines,
			loadMore
		},
		onLoad(query){
			uni.setNavigationBarTitle({
				title: query.symbol+'/USDT('+(query.exChangeName == '' ? '全球均价' : query.exChangeName)+')'
			});
			this.symbol = query.symbol;
			this.exChangeName = '';
			this.code = query.code;
			this.startPrice = 2;
			this.endPrice =1;
			this.init();
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
			init() {
				this.getDetail();
				// this.getMarket();
			},
			async getDetail() {
				let data = await this.$api.coins_detail(this.code);
				if (data && data.code === 200) {
					this.detail = data.result.data;
					console.log(this.detail);
				}
			},
			// async getMarket() {
			// 	let detail = await this.$api.coins_markets(this.code);
			// },
			async loadList(action){
				//action= add上拉加载 refresh下拉刷新
				if (action=='refresh') {
					this.dataList = [];
					this.pageNum = 1;
					this.loadMoreStatus = 0;
				}
				
				console.log("status:"+this.loadMoreStatus)
				if (this.loadMoreStatus==0) {
					this.loadMoreStatus = 1;
					let data = await this.$api.coins_markets(this.code,{
						pageNum: this.pageNum,
						pageSize: this.pageSize,
					});
						if (data && data.code === 200) {
							console.log(this.pageNum)
				
							const result = data.result.data.markets
							this.total = data.result.total_count
							this.lastPage = data.result.total_pages
							this.dataList.push(...result);
							this.$refs.mixPulldownRefresh && this.$refs.mixPulldownRefresh.endPulldownRefresh();
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
					// })
				}
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
			async collect(exchange_code) {
				if(exchange_code == this.exchange_code) {
					this.isSelect = !this.isSelect;
				}
				let data = await this.$api.coins_add(this.code, {exchange_code: exchange_code}); 
				if (data && data.code === 200) {
					let tempArr = []
					this.dataList.forEach((item, index)=>{
						let newObj = Object.assign({},item);
						if( item.exchange_code == exchange_code) {
							newObj.is_follow = data.result;
						}
						tempArr.push(newObj);
					})
					this.dataList = tempArr;
				} else {
					this.$message({icon: 'none', title: data.msg})
				}
			}
		}
	}
</script>

<style lang="scss">
	@import '@/common/quotations.scss';
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
	.mini_txt{
		font-size: 20upx;
		color: #fff;
		// line-height: 52upx;
	}
	.desc_txt{
		font-size: 26upx;
		color: #959595;
		line-height: 40upx;
	}
	.profile_wrap{
		padding: 0 $space-lg;
	}
	/deep/ .profile_wrap p{
		margin: $space-base 0;
		color: #29293b;
		font-size: 28upx;
		line-height: 48upx;
		word-break: break-word;
	}
	/deep/ .profile_wrap img{
		display: block;
		width: 100%;
		margin: 0 auto;
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
	.table_head{
		height: 32px;
		background-color: $bgColor;
		justify-content: center;
		padding: 0 $space-lg;
	}
</style>
