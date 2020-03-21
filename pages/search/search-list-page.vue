<template>
	<view class="page-news">
		<!-- #ifdef MP-QQ -->
		<scroll-view class="listview" style="flex: 1;" enableBackToTop="true" scroll-y @scrolltolower="loadMore()">
			<view v-for="(item, index) in dataList" :key="item.id">
				<news-item :newsItem="item" @close="closeItem(index)" @click="goDetail(item)"></news-item>
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
			<uni-cell v-if="pageName === '最新'">
			<view class="main_news_section">
				<view class="banner_wrapper">
					<swiper-canlendar :swiperList="swiperList" :autoplay="true"></swiper-canlendar>
				</view>
				<view class="import_news_wrapper">
					<view class="import_item">
						<view class="import_item_head">
							<text class="import_item_title">新闻早八点</text>
							<text class="import_item_time">{{importNews[0].time}}</text>
						</view>
						<view class="import_item_content">
							<text class="import_item_content_txt">{{importNews[0].detail}}</text>
						</view>
					</view>
					<view class="import_item">
						<view class="import_item_head">
							<text class="import_item_title">专题</text>
							<text class="import_item_time">{{importNews[0].time}}</text>
						</view>
						<view class="import_item_content">
							<text class="import_item_content_txt">{{importNews[0].detail}}</text>
						</view>
					</view>
					<view class="media-item-line"></view>
				</view>
				<view class="import_news_list_wrapper">
					<news-item :newsItem="item" @click="goDetail(item)" v-for="(item, index) in importNewsListData" :key="index"></news-item>
				</view>
				<view class="canlendar_wrapper"></view>
				<view class="fast_news_wrapper"></view>
				<view class="banner_wrapper" style="margin-bottom: 5px;">
					<swiper-canlendar :swiperList="swiperList" :autoplay="false" cornerMark="专题"></swiper-canlendar>
				</view>
			</view>
			</uni-cell>
            <uni-cell v-for="(item, index) in dataList" :key="index">
				<!-- 专栏 -->
				<person-list-item :item="item" showLine v-if="pageName == '专栏'">
					<view class="flex_row">
						<view class="flex_row mr20"><text class="m-head_left_text">文章  </text><text class="m-head_left_text" style="color:#000">111</text></view>
						<view  class="flex_row"><text class="m-head_left_text">粉丝  </text><text class="m-head_left_text" style="color:#000">222</text></view>
					</view>
				</person-list-item>
				<!-- 直播 -->
				<live-item :item="item" v-if="pageName == '直播'"></live-item>
				<!-- 快讯 -->
				<news-item :newsItem="item" @click="goDetail(item)" v-if="pageName == '快讯'" :showImg="false" :showTag="false" :showSource="false" :showAuthor="false" :showCoins="false"></news-item>
                <!-- 交易所 -->
				<uni-ex-change-item :item="item" v-if="pageName == '交易所'"></uni-ex-change-item>
				<!-- 币种 -->
                <uni-coins-item :item="item" v-if="pageName == '币种'"></uni-coins-item>
                
				<!-- 文章 -->
				<news-item :newsItem="item" @click="goDetail(item)" v-if="pageName == '文章'"></news-item>
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
	import swiperCanlendar from '@/components/swaper-canlendar.vue'
	import newsItem from '@/pages/home/news-item.nvue';
	import personListItem from '@/pages/home/person-list-item.vue';
	import TagListItem from '@/pages/home/tag_list_item.vue';
	import {newsList} from '../../service/getData.js';
	import liveItem from '@/components/uni-live-list-item.vue';
	import uniCoinsItem from '@/components/uni-coins-item.vue';
	import uniExChangeItem from '@/components/uni-exchange-item.vue';
	import {focusAuthors, tags, newItem, coins} from '../../mock/data';
	

	export default {
		components: {
			uniList,
			uniCell,
			uniRefresh,
			uniLoadMore,
			noData,
			newsItem,
			personListItem,
			TagListItem,
			swiperCanlendar,
			liveItem,
			uniExChangeItem,
			uniCoinsItem
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
				swiperList: [{
					id: 0,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
				}, {
					id: 1,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big37006.jpg',
				}, {
					id: 2,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
				}, {
					id: 3,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
				}, {
					id: 4,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
				}, {
					id: 5,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21016.jpg'
				}, {
					id: 6,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'
				}],
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
			this.pullTimer = null;
			// 设计图750
			// this.bannerImgWidth = uni.getSystemInfoSync().screenWidth *2
			// console.log(this.pageName)
			this.importNews.fill({
				source: '新华社', // 来源/require
				time: '08:08', // 时间/require
				author_name: '王大仙', // 作者，非必须
				live: false, // 是否直播类型资讯
				recommend: false, // 是否是推广类资讯
				onlyOne: false, // 是否是独家资讯
				depth: false, // 是否是深度类型资讯
				coins: [{
					startPrice: '1000',
					endPrice: '1035',
				}],
				detail: '面对这一场世所罕见、突如其来、异常凶猛的新冠肺炎疫情，习近平总书记始终把人民生命安全和身体健康放在第一位，带领全党全军全国人民沉着应对危机、果断处置危机、科学防控危机，忧人民之所忧、想人民之所想，及时制定疫情防控战略策略，凝聚起全中国人民奋起抗疫的磅礴力量。'
			});
			// console.log(this.importNews);
			this.requestParams = {
				columnId: 23,
				minId: 0,
				pageSize: 10,
				column: 'id,post_id,title,author_name,cover,published_at,comments_count'
			};
			this.importNewsListData = newItem;
			
		},
		methods: {
			async loadData(refresh) {
				console.log('loadData===',this.pageName);
				if(this.pageName === '文章') {
					// this.dataList = focusAuthors;
					this.dataList = newItem;
					// 这里为满足tag页面多列需求，需要转换为二维数组
					// let tempArr = [];
					// for (let i = 0, j = 0, tagsLen = tags.length; i < tagsLen; i += 2, j++) {
					// 	tempArr[j] = tags.splice(0, 2)
					//  }
					//  this.dataList = tempArr
					return;
				}
				if(this.pageName === '快讯') {
					this.dataList = newItem;
					return
				}
				if(this.pageName === '直播') {
					this.dataList = newItem;
					return
				}
				if(this.pageName === '专栏') {
					this.dataList = focusAuthors;
					return
				}
				if(this.pageName === '币种') {
					this.dataList = coins;
					return
				}
				if(this.pageName === '交易所') {
					this.dataList = coins;
					return
				}
				
				if (this.isLoading) {
					return;
				}
				this.isLoading = true;
				this.isNoData = false;
				this.requestParams.time = new Date().getTime() + '';

				var startTime = new Date();
				try{
					const result = await newsList(this.requestParams);
					var endTime = new Date();
					const data = result.data;
					this.isNoData = (data.length <= 0);
		
					const data_list = data.map((news) => {
						return {
							id: this.newGuid() + news.id,
							newsid: news.id,
							article_type: 1,
							datetime: (new Date(news.published_at.replace(/\-/g,
								'/')).getTime()),
							title: news.title,
							image_url: news.cover,
							author_name: news.author_name,
							source: '来源', 
							comment_count: news.comments_count,
							post_id: news.post_id
						};
					});
		
					if (refresh) {
						this.dataList = data_list;
						this.requestParams.minId = 0;
					} else {
						this.dataList = this.dataList.concat(data_list);
						this.requestParams.minId = data[data.length - 1].id;
					}
				} catch(e) {
					if (this.dataList.length == 0) {
						this.isNoData = true;
					}
				}
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
				console.log(this.pageName);
				this.loadData();
				
				
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
	.m-head_left_text{
		@include txt;
	}
</style>
