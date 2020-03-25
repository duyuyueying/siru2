<template>
	<view class="timeline">
		<mix-pulldown-refresh ref="mixPulldownRefresh" class="panel-content" :top="0" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll">
			<scroll-view
				class="panel-scroll-box" 
				:scroll-y="enableScroll" 
				@scrolltolower="loadMore"
				>
			<view class="timeline_item" v-for="(item, index) in dataList" :key="index" :style="{marginBottom: (index+1) == dataList.length ? '40upx': '0upx'}">
				<view class="line"></view>
				<view class="block"></view>
				<view class="time_wrapper">
					<text class="time_txt">{{timeFun(item.create_time)}}</text>
				</view>
				<view>
					<view class="head_wrapper" @click="goPage(item.id)"><text class="head_txt">{{item.name}}</text></view>
					<view class="desc_wrapper"><text class="content_txt" v-html="item.content"></text></view>
					<view v-if="item.coins && item.coins.length > 0" class="flex_row coin_wrapper">
						<view v-for="(subItem, index) in item.coins" :key="index" class="mark_wrapper" :style="{width:markViewWidth}">
							<mark-view
								:end="subItem.endPrice"
								:start="subItem.startPrice"
								:item = "subItem"
								></mark-view >
						</view>
					</view>
					<view class="border flex_column" @click="goCoinDetailPage('ETH', '')" v-if="false">
						<text style="line-height: 50upx;font-size: 30upx;">ETH</text>
						<text style="line-height: 50upx;font-size: 30upx;">$198.14</text>
						<text class="time_txt">2MIN涨幅</text>
						<text style="font-weight: bold;" :class="theme ==='greenUp' ? 'greenColor' : 'redColor'">+1.65%</text>
					</view>
					<operation-btns :goodCount="item.good" :badCount="item.bad" :commentCount="item.comments_count" @share="doShare" @gotoCommet="goPage(item.id)"></operation-btns>
				</view>
			</view>
			<!-- 上滑加载更多组件 -->
			<mix-load-more :status="loadMoreStatus" @click.native="loadMore"></mix-load-more>
		</scroll-view>
		</mix-pulldown-refresh>
	</view>
</template>

<script>
	import {identification} from '@/common/config.js';
	import moment from 'moment';
	import markView from '@/components/markView.vue';
	import operationBtns from '@/components/operationBtns.vue';
	import {loadMore} from '@/common/util.js';
	import {oneNews} from '@/mock/data.js';

	export default {
		data() {
			return {
				screenWidth: 0,
				loadMoreStatus:  0, //加载更多 0加载前，1加载中，2没有更多了
				refreshing: false, // 刷新状态
				dataList: [],
				pageNum: 1,
				pageSize: 15,
				total: 0,
				lastPage: 1,
				// itemWatchFlag: false, // 用来监听
			}
		},
		mixins:[loadMore],
		components:{
			markView,
			operationBtns
		},
		onShow() {
			this.theme = uni.getStorageSync('markTheme') || 'greenUp';
			let _this = this;
			uni.getSystemInfo({
				success(res) {
					_this.screenWidth = res.screenWidth;
				}
			});
			this.loadList('add');
		},
		methods:{
			//列表
			loadList(action){
				//action= add上拉加载 refresh下拉刷新
				if (action=='refresh') {
					this.dataList = [];
					this.pageNum = 1;
					this.loadMoreStatus = 0;
				}

				console.log("status:"+this.loadMoreStatus)
				if (this.loadMoreStatus==0) {
					this.loadMoreStatus = 1;
					this.$api.articles({
						type: 2,
						pageNum: this.pageNum,
						pageSize: this.pageSize,
					}).then(data => {
						if (data && data.code === 200) {
							console.log(this.pageNum)

							const result = data.result.data
							this.total = data.result.total
							this.lastPage = data.result.last_page
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
					})
				}
			},
			loadList2(type){
				// let tabItem = this.tabBars[this.currTab];
				//type add 加载更多 refresh下拉刷新
				if(type === 'add'){
					if(this.loadMoreStatus === 2){
						return;
					}
					this.loadMoreStatus = 1;
				}
				else if(type === 'refresh'){
					this.refreshing = true;
					// 刷新前清空数组
					this.dataList = [];
				}

				this.$api.articles({
					type: 2,
					pageNum: this.pageNum,
					pageSize: this.pageSize,
				}).then(data => {
					if (data && data.code === 200) {
						const result = data.result.data;
						const total = data.result.total;
						// consol
						this.dataList.push(...result);
						if(type === 'refresh'){
							this.$refs.mixPulldownRefresh && this.$refs.mixPulldownRefresh.endPulldownRefresh();
							// #ifdef APP-PLUS
							this.refreshing = false;
							// #endif
							this.loadMoreStatus = 0;
						}
						//上滑加载 处理状态
						if(type === 'add'){
							this.pageNum++;
							this.loadMoreStatus = this.dataList.length >= total ? 2: 0;
						}
						// console.log(data);
						// const nodes = htmlParser(data.result.content);
						// // #ifdef APP-PLUS-NVUE
						// parseImgs(nodes)
						// // #endif
						// this.content = nodes;
						// this.detail = data.result;
					} else {
						this.$message(data.msg, function () {
							// uni.navigateBack({
							// 	delta: 1
							// });
						})
					}
				})
				
				//setTimeout模拟异步请求数据
				// setTimeout(()=>{
				// 	let list = new Array(20);
				// 	list.fill(oneNews);
				// 	list.sort((a,b)=>{
				// 		return Math.random() > .5 ? -1 : 1; //静态数据打乱顺序
				// 	})
				// 	if(type === 'refresh'){
				// 		// 刷新前清空数组
				// 		this.dataList = [];
				// 	}
				// 	let tempArr = [];
				// 	list.forEach(item=>{
				// 		item.id = parseInt(Math.random() * 10000);
				// 		tempArr.push(item);
				// 	});
				// 	this.dataList.push(...tempArr);
				// 	//下拉刷新 关闭刷新动画
				// 	if(type === 'refresh'){
				// 		this.$refs.mixPulldownRefresh && this.$refs.mixPulldownRefresh.endPulldownRefresh();
				// 		// #ifdef APP-PLUS
				// 		this.refreshing = false;
				// 		// #endif
				// 		this.loadMoreStatus = 0;
				// 	}
				// 	//上滑加载 处理状态
				// 	if(type === 'add'){
				// 		this.loadMoreStatus = this.dataList.length > 40 ? 2: 0;
				// 	}
				// }, 600)
			},
			identificationFun(data) {
				return identification[data];
			},
			timeFun(time) {
				return moment(time).format('YYYY/MM/DD HH:mm:ss');
			},
			doShare() {
				uni.showToast({
					icon:'none',
					title: '去分享'
				})
			},
			goPage(id) {
				uni.navigateTo({
					url: '/pages/details/fastNewsDetail?id='+id
				})
			},
			goCoinDetailPage(symbol, exChangeName){
				uni.navigateTo({
					url: '/pages/quotations/coinDetail?symbol='+symbol+'&exChangeName='+exChangeName
				});
			}
		},
		computed:{
			markViewWidth(){
				return (this.screenWidth - 70)/2
			}
		}
	}
</script>

<style lang="scss">
	.timeline{
		height: 100%;
	}
	.panel-scroll-box{
		height: 100%;
	}
	.timeline_item{
		padding: 40upx 30upx 0upx 64upx;
		position: relative;
	}
	/deep/ .timeline_item p{
		margin: $space-lg 0;
		color: #29293b;
		line-height: 58upx;
		word-break: break-word;
	}
	/deep/ .timeline_item img{
		display: block;
		width: 100%;
		margin: 0 auto;
	}
	.block{
		width: 12upx;
		height: 12upx;
		position: absolute;
		top: 56upx;
		left: 32upx;
		z-index: 11;
		background-color: $mainColor;
	}
		
	.line{
		width: 2upx;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 38upx;
		z-index: 10;
		background-color: #f5f5f5;
	}
	.coin_wrapper{
		flex-wrap: wrap;
		justify-content: space-between;
	}
	.mark_wrapper{
		margin-bottom: $space-base;
		width: 45%;
	}
	.time_txt{
		@include txt(26upx);
	}
	.con_txt{
		@include txt(30upx, #000);
		line-height: 50upx;
	}
	.content_wrapper{
		margin-top: 10upx;
		margin-bottom: 10upx;
		padding-right: 20upx;
	}
	.title_txt{
		@include txt(24upx, #000);
	}
	.indenfication_txt{
		font-size: 24upx;
	}
	.image-list1{
		width: 32upx;
		height: 32upx;
	}
	.sort_btn{
		background-color: #f5f5f5;
		width: 110upx;
		height: 40upx;
		position: absolute;
		right: 30upx;
		top: -30upx;
		align-items: center;
		justify-content: center;
	}
	.sort_txt{
		@include txt(20upx, #333);
	}
	.desc_wrapper{
		margin-bottom: 10upx;
	}
	.content_txt{
		@include txt(30upx, #797979);
		line-height: 44upx;
	}
	.head_txt{
		@include txt(34upx, #000);
		font-weight: 600;
		line-height: 50upx;
	}
	.border{
		border: 1upx solid $borderColor;
		padding: $space-base;
		box-sizing:border-box;
		margin-top: 10upx;
		width: 45%;
	},
	.greenBg {
		background-color: #d7f0db;
	}
	.greenColor {
		color: #39b54a;
	}
	.redBg{
		background-color: #fadbd9
	}
	.redColor {
		color: #e54d42
	}
	.time_wrapper{
		margin-bottom: 10upx;
	}
</style>
