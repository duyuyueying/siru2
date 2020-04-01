<template>
	<view class="page-news">
		<mix-pulldown-refresh ref="mixPulldownRefresh" class="panel-content" :top="0" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll">
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
					<!-- 回复我的 -->
					<message-item :item="item" v-else-if="type == 'replyMe'" @goPage="goOneCommet(item)">
						<text style="fontSize: 26upx;color: #999">{{item.content}}</text>
					</message-item>
					<!-- 赞过我的 -->
					<message-item :item="item" v-else-if="type == 'likeMe'" @goPage="goOneCommet(item)">
						<view>
							<icons type="good" color="#ffb100"></icons><text style="fontSize: 26upx;color: #999;margin-left:10upx;">{{item.content}}</text>
						</view>
					</message-item>
					<!-- 关注我的 -->
					<message-item :item="item" v-else-if="type == 'focusMe'" :showContent="false" @goPage="goPerson(item.id)">
						<text style="fontSize: 26upx;color: #ccc;margin-top:10upx;margin-bottom: 10upx;">成为了你的粉丝</text>
					</message-item>
					<!-- 系统消息 -->
					<message-server-item :item="item" v-else-if="type == 'systemMessage'"></message-server-item>
					<!-- 浏览历史 -->
					<news-item :newsItem="item" v-else-if="type=='history'" timeStyle="update_time"></news-item>
					<news-item :newsItem="item" v-else></news-item>
				</view>
				<!-- 上滑加载更多组件 -->
				<mix-load-more :status="loadMoreStatus"></mix-load-more>
				
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
	import messageItem from '@/components/list-item/message-item.vue';
	import messageServerItem from '@/components/list-item/message-server-item.vue';
	import {newsList} from '@/service/getData.js';
	import {loadMore} from '@/common/util.js';
	import {focusAuthors, tags, newsItems, goldList} from '@/mock/data';

	export default {
		components: {
			newsItem,
			personListItem,
			uniTitle,
			coinListItem,
			inviteListItem,
			messageItem,
			messageServerItem,
			
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
				swiperHeight: 0,
				loadMoreStatus: 0,
				pageNum: 1,
				pageSize: 15,
				total: 0,
				lastPage: 1,
			}
		},
		onLoad(e) {
			this.type = e.type;
			this.loadList('add');
			uni.setNavigationBarTitle({
				title: userCenterConfig[e.type].name
			});
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
		methods: {
			//列表
			async loadList(action){
				
				if (action=='refresh') {
					this.dataList = [];
					this.pageNum = 1;
					this.loadMoreStatus = 0;
				}
				
				console.log("status:"+this.loadMoreStatus)
				if (this.loadMoreStatus==0) {
					this.loadMoreStatus = 1;
					let options = {
						pageNum: this.pageNum,
						pageSize: this.pageSize,
					};
					let data = null;
					switch(this.type) {
							//我的收藏
						case 'myCollect':
							data = await this.$api.get_collection(options);
							break;
							//浏览历史
						case 'history':
							data = await this.$api.get_history(options);
							break;
							//我的粉丝
						case 'fans':
							data = await this.$api.get_fans(options);
							break;
							//我的关注
						case 'focus':
							data = await this.$api.get_follows(options);
							break;
							//我的邀请
						case 'invite':
							//金币记录
						case 'coin':
							// setTimeout(()=>{
							// 	this.dataList = goldList;
							// },300)
							this.loadMoreStatus = 2;
							return
							break;
							//系统消息
						case "systemMessage":
							data = await this.$api.notices(options);
							break;
							//回复我的
						case 'replyMe':
							data = await this.$api.comments_reply_msg(options);
							break;
							//赞过我的
						case 'likeMe':
							data = await this.$api.comments_zan_msg(options);
							break;
							//关注我的
						case 'focusMe':
							data = await this.$api.get_fans(options);
							break;
					}

					if (data && data.code === 200) {
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
					} else if (data){
						this.$message(data.msg)
					}
				}
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
			goOneCommet(item) {
				let commentId = item.reply_id==0 ? item.id: item.reply_id
				uni.navigateTo({
					url: '/pages/comment/one_comment?commentId='+commentId+'&articleId='+item.article_id
				});
			},
			goPerson(id) {
				uni.navigateTo({
					url: '/pages/author/author?id=' + id
				});
			}
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
		height: 100vh;
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
