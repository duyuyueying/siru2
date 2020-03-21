<template>
	<view class="page-news">
		<mix-pulldown-refresh ref="mixPulldownRefresh" class="panel-content" :top="90" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll">
			<scroll-view
				class="panel-scroll-box" 
				:scroll-y="enableScroll" 
				@scrolltolower="loadMore"
				>
				<view v-if="type === 'coin'">
					<view class="u-head_coins">
						<text class="u-head_coins_title">我的金币</text>
						<text class="u-head_coins_Count">{{coinsCount}}</text>
					</view>
					<uni-title title="金币记录"></uni-title>
				</view>
				<view v-for="(item, index) in dataList" :key="index">
					<!-- 邀请好友列表 -->
					<invite-list-item :item="item" v-if="type == 'invite'"></invite-list-item>
					<!-- 我的关注 -->
					<person-list-item v-else-if="type == 'focus' || type == 'fans'" :item="item" showIdentification showDetail></person-list-item>                
					<!-- 金币记录 -->
					<coin-list-item :item="item" v-else-if="type == 'coin'"></coin-list-item>
					<news-item :newsItem="item" v-else></news-item>
				</view>
			</scroll-view>
		</mix-pulldown-refresh>
	</view>
</template>

<script>
	import {
		friendlyDate
	} from '@/common/util.js';
	import {userCenterConfig} from '@/common/config.js';
	import uniTitle from '@/components/uni-title.vue';
	import newsItem from '@/components/list-item/news-item.vue';
	import inviteListItem from '@/pages/userCenterList/uni-invite-list-item.vue';
	import personListItem from '@/components/list-item/person-list-item.vue';
	import coinListItem from '@/pages/userCenterList/coin-list-item.vue';
	import {newsList} from '@/service/getData.js';
	import {loadMore} from '@/common/util.js';
	import {focusAuthors, tags, newsItems, goldList} from '@/mock/data';

	export default {
		components: {
			newsItem,
			personListItem,
			uniTitle,
			coinListItem,
			inviteListItem
		},
		props: {
			nid: {
				type: [Number, String],
				default: ''
			},
			pageName: {
				type: String,
				default: '',
			}
		},
		mixins:[friendlyDate, loadMore],
		data() {
			return {
				dataList: [],
				type: '', //保存列表类型
				coinsCount: '5',
				refreshing: false, // 刷新状态
				isFocus: false, // 是否被关注
			}
		},
		onLoad(e) {
			this.type = e.type;
			this.loadList('add');
			uni.setNavigationBarTitle({
				title: userCenterConfig[e.type].name
			});
		},
		methods: {
			//列表
			loadList(type){
				// let tabItem = this.tabBars[this.currTab];
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
					let list;
					if(this.type === 'coin') {
						list = goldList;
					}
					if(this.type == 'invite') {
						list = focusAuthors;
					}
					if(this.type === 'focus'){
						let temp = [].concat(focusAuthors);
						list = temp.map((item)=>{return Object.assign({},item, {isFocus: true})});
					
					}
					if(this.type === 'fans' || this.type == 'replyMe' || this.type == 'likeMe' || this.type == 'focusMe' || this.type == 'focusMe' || this.type == 'systemMessage') {
						list = focusAuthors;
					}
					if(this.type === 'myCollect' || this.type === 'history') {
						list = newsItems;
					}
					console.log(this.type);
					list.sort((a,b)=>{
						return Math.random() > .5 ? -1 : 1; //静态数据打乱顺序
					})
					if(type === 'refresh'){
						// 刷新前清空数组
						this.dataList = [];
					}
					let tempArr = [];
					list.forEach(item=>{
						item.id = parseInt(Math.random() * 10000);
						tempArr.push(item);
					});
					this.dataList.push(...tempArr);
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
						this.loadMoreStatus = this.dataList.length > 40 ? 2: 0;
					}
				}, 600)
			},
			
			goDetail(detail) {
				if (this.navigateFlag) {
					return;
				}
				this.navigateFlag = true;
				uni.navigateTo({
					url: '/pages/detail/detail?query=' + encodeURIComponent(JSON.stringify(detail))
				});
				setTimeout(() => {
					this.navigateFlag = false;
				}, 200)
			},
		}
	}
</script>

<style scoped lang="scss">
	.no-data {
		flex: 1;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 10;
	}

	.page-news {
		height: 100%;
	}
	.panel-scroll-box{
		height: 675px;
	}
	.refresh {
		justify-content: center;
	}

	.loading-icon {
		width: 28px;
		height: 28px;
		margin-right: 5px;
		color: gray;
	}

	.loading-text {
		margin-left: 2px;
		font-size: 16px;
		color: #999999;
	}

	.loading-more {
		align-items: center;
		justify-content: center;
		padding-top: 14px;
		padding-bottom: 14px;
		text-align: center;
	}

	.loading-more-text {
		font-size: 28upx;
		color: #999;
	}
	
	.main_news_section{
		width: 750upx;
		background-color: #f9f9f9;
	}
	.banner_item{
		width: 720upx !important;
		padding: 0upx;
		left: 15upx;
		padding: 0 5upx;
	}
	.card-swiper {
		height: 344upx !important;
	}
	.card-swiper swiper-item .swiper-item{
		border-radius: 0upx;
		transform: none;
	}
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
	}
	.import_item_head {
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		
	}
	.import_item_title{
		font-weight: 600;
		color: $mainColor;
	}
	.import_item_time {
		color: #999;
		font-size: 20upx
	}
	
	// .import_item_content{
		
		
	// }
	.import_item_content_txt{
		font-size: 24upx;
		// line-height: 1.4;
		color: #000;
		@include more_line_ellipsis;
	}
	.media-item-line {
		position: absolute;
		top: 30upx;
		left: 50%;
		bottom: 0;
		width: 2upx;
		height: 106upx;
		background-color: #ebebeb;
	}
		
	.import_news_list_wrapper {
		background-color: #fff;
		margin-bottom: 12upx;
		// height: 300upx;
	}
	.u-head_coins{
		height: 235upx;
		@include flex-center(column);
	}
	.u-head_coins_title{
		@include txt($color:#000);
	}
	.u-head_coins_Count{
		@include txt(50upx, #000);
		font-weight: 600;
	}
</style>
