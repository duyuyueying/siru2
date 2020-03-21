<template>
	<view class="page-news">
		<!-- #ifdef MP-QQ -->
		<scroll-view class="listview" style="flex: 1;" enableBackToTop="true" scroll-y @scrolltolower="loadMore()">
			<view v-for="(item, index) in dataList" :key="item.id">
				<news-item :newsItem="item" @close="closeItem(index)"></news-item>
			</view>
			<view class="loading-more" v-if="isLoading || dataList.length > 4">
				<text class="loading-more-text">{{loadingText}}</text>
			</view>
		</scroll-view>
		<!-- #endif -->
		<!-- #ifndef MP-QQ -->
		<uni-list class="listview" :enableBackToTop="true" :scroll-y="true" @scrolltolower="loadMore()">
            <uni-refresh class="refresh" @refresh="onrefresh" @pullingdown="onpullingdown" :display="refreshing ? 'show' : 'hide'">
                <div class="refresh-view">
                    <image class="refresh-icon" :src="refreshIcon" :style="{width: (refreshing || pulling) ? 0: '32px'}"
                        :class="{'refresh-icon-active': refreshFlag}"></image>
                    <uni-load-more v-if="refreshing" class="loading-icon" status="loading" :contentText="loadingMoreText"></uni-load-more>
                    <text class="loading-text">{{refreshText}}</text>
                </div>
            </uni-refresh>
            <uni-cell v-for="(item, index) in dataList" :key="index">
				<view class="u-item_wrap">
					<view class="u-item_head_wrap">
						<uni-title :title="item.name" size="34" height="90">
							<view class="m-head_left" :style="{height:'90upx'}" >
								<text class="m-head_left_text">共</text>
								<text class="m-head_left_focus_text">{{item.total}}</text>
							<text class="m-head_left_text">条</text>
							</view>
						</uni-title>
					</view>
					<!-- 专栏 -->
					<view class="u_item_list" v-if="item.enCode == 'specialColumn'">
						<person-list-item v-for="(subItem, i) in item.list" :item="subItem" :key="i" showLine>
							<view class="flex_row">
								<view class="flex_row mr20"><text class="m-head_left_text">文章  </text><text class="m-head_left_text" style="color:#000">111</text></view>
								<view  class="flex_row"><text class="m-head_left_text">粉丝  </text><text class="m-head_left_text" style="color:#000">222</text></view>
							</view>
						</person-list-item>
					</view>
					<!-- 直播 -->
					<view class="u_item_list" v-if="item.enCode == 'live'">
						<live-item v-for="(subItem, i) in item.list" :item="subItem" :key="i" ></live-item>
					</view>
					<!-- 文章 -->
					<view class="u_item_list" v-if="item.enCode == 'article'">
						<news-item v-for="(subItem, i) in item.list" :newsItem="subItem" :key="i" ></news-item>
					</view>
					<!-- 快讯 -->
					<view class="u_item_list" v-if="item.enCode == 'fastNews'">
						<news-item v-for="(subItem, i) in item.list" :newsItem="subItem" :key="i" :showImg="false" :showTag="false" :showSource="false" :showAuthor="false" :showCoins="false"></news-item>
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
				
				
            </uni-cell>
            <uni-cell v-if="isLoading || dataList.length > 4">
                <view class="loading-more">
                    <text class="loading-more-text">{{loadingText}}</text>
                </view>
            </uni-cell>
        </uni-list>
		<!-- #endif -->
		<no-data class="no-data" v-if="isNoData" @retry="loadMore"></no-data>
	</view>
</template>

<script>
	import {
		friendlyDate
	} from '@/common/util.js';

	import uniList from '@/components/uni-list.vue';
	import uniCell from '@/components/uni-cell.vue';
	import uniRefresh from '@/components/uni-refresh.vue';
	import uniLoadMore from '@/components/uni-load-more.vue';
	import noData from '@/components/nodata.nvue';
	import newsItem from '@/pages/home/news-item.nvue';
	import personListItem from '@/pages/home/person-list-item.vue';
	import {newsList} from '../../service/getData.js';
	import {searchList} from '../../mock/data';
	import uniTitle from '@/components/uni-title.vue';
	import liveItem from '@/components/uni-live-list-item.vue';
	import uniCoinsItem from '@/components/uni-coins-item.vue';
	import uniExChangeItem from '@/components/uni-exchange-item.vue';

	export default {
		components: {
			uniList,
			uniCell,
			uniRefresh,
			uniLoadMore,
			noData,
			newsItem,
			personListItem,
			uniTitle,
			liveItem,
			uniCoinsItem,
			uniExChangeItem
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
		mixins:[friendlyDate],
		data() {
			return {
				dataList: [],
				navigateFlag: false,
				pulling: false,
				refreshing: false,
				refreshFlag: false,
				refreshText: "",
				isLoading: false,
				loadingText: '加载中...',
				isNoData: false,
				pulling: false,
				angle: 0,
				loadingMoreText: {
					contentdown: '',
					contentrefresh: '',
					contentnomore: ''
				},
				importNewsListData: [],
				cardCur: 0,
				dotStyle: false,
				importNews: new Array(2),
				refreshIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAB5QTFRFcHBw3Nzct7e39vb2ycnJioqK7e3tpqam29vb////D8oK7wAAAAp0Uk5T////////////ALLMLM8AAABxSURBVHja7JVBDoAgDASrjqj//7CJBi90iyYeOHTPMwmFZrHjYyyFYYUy1bwUZqtJIYVxhf1a6u0R7iUvWsCcrEtwJHp8MwMdvh2amHduiZD3rpWId9+BgPd7Cc2LIkPyqvlQvKxKBJ//Qwq/CacAAwDUv0a0YuKhzgAAAABJRU5ErkJggg=="
			}
		},
		// onLoad() {
		// 	this.importNews.fill(newItem);
		// 	console.log(this.importNews);
		// },
		created() {
	
		},
		methods: {
			async loadData(refresh) {		
				if (this.isLoading) {
					return;
				}
				this.isLoading = true;
				this.isNoData = false;
				this.requestParams = {};

				var startTime = new Date();
				// TODO:添加测试数据
				this.dataList = searchList;
				this.requestParams.minId = 0;
			// TODO:请求接口暂时屏蔽
		// 		try{
		// 			const result = await newsList(this.requestParams);
		// 			var endTime = new Date();
		// 			const data = result.data;
		// 			this.isNoData = (data.length <= 0);
					
		
		// 			if (refresh) {
		// 				// TODO:添加测试数据
		// 				this.dataList = searchList;
		// 				this.requestParams.minId = 0;
		// 			} 
		// 		} catch(e) {
		// 			if (this.dataList.length == 0) {
		// 				this.isNoData = true;
		// 			}
		// 		}
				this.isLoading = false;
				if (refresh) {
					this.refreshing = false;
					this.refreshFlag = false;
					this.refreshText = "已刷新";
					if (this.pullTimer) {
						clearTimeout(this.pullTimer);
					}
					this.pullTimer = setTimeout(() => {
						this.pulling = false;
					}, 1000);
				}			
			},
			loadMore(e) {
				// this.loadData();
			},
			clear() {
				this.dataList.length = 0;
				this.requestParams.minId = 0;
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
			closeItem(index) {
				uni.showModal({
					content: '不感兴趣？',
					success: (res) => {
						if (res.confirm) {
							this.dataList.splice(index, 1);
						}
					}
				})
			},
			refreshData() {
				if (this.isLoading) {
					return;
				}
				this.pulling = true;
				this.refreshing = true;
				this.refreshText = "正在刷新...";
				console.log(this.pageName)
				this.loadData(true);
			},
			onrefresh(e) {
				this.refreshData();
			},
			onpullingdown(e) {
				if (this.refreshing) {
					return;
				}

				// var angle = (e.pullingDistance) / e.viewHeight * 180;
				// if (angle > 180) {
				// 	angle = 180;
				// }
				// tab.angle = angle;

				this.pulling = false;
				if (Math.abs(e.pullingDistance) > Math.abs(e.viewHeight)) {
					this.refreshFlag = true;
					this.refreshText = "释放立即刷新";
				} else {
					this.refreshFlag = false;
					this.refreshText = "下拉可以刷新";
				}
			},
			newGuid() {
				let s4 = function() {
					return (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
				}
				return (s4() + s4() + "-" + s4() + "-4" + s4().substr(0, 3) + "-" + s4() + "-" + s4() + s4() + s4()).toUpperCase();
			},
			DotStyle(e) {
				// this.dotStyle = e.detail.value
			},
			// cardSwiper
			cardSwiper(e) {
				// this.cardCur = e.detail.current
			},
		}
	}
</script>

<style scoped lang="scss">
	@import '../../common/common.scss';
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
		flex: 1;
		flex-direction: column;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		// background: red;
	}

	.listview {
		position: absolute; 
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background-color: #fff;
		/* #ifndef APP-NVUE 
		display: flex;
		flex-direction: column;
		/* #endif */
		/* #ifndef MP-ALIPAY */
		flex-direction: column;
		/* #endif */
	}

	.refresh {
		justify-content: center;
	}

	.refresh-view {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		width: 750rpx;
		height: 64px;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
	}

	.refresh-icon {
		width: 32px;
		height: 32px;
		transition-duration: .5s;
		transition-property: transform;
		transform: rotate(0deg);
		transform-origin: 15px 15px;
	}

	.refresh-icon-active {
		transform: rotate(180deg);
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
		font-weight: bold;
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
	.m-head_left{
		width: 150upx;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		// background-color: red;
	}
	.m-head_left_focus_text{
		@include txt($color: $mainColor);
		margin: 0 $space-sm;
	}
	.m-head_left_text{
		@include txt;
	}
	.u-item_head_wrap{
		border-style: solid;
		border-bottom-width: 2upx;
		border-bottom-color: $borderColor;
	}
</style>
