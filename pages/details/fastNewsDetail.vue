<template>
	<view class="detail_page container">
		<view class="banner" auto-focus>
			<view class="title-area">
				<text class="title-text">{{detail.name}}</text>
			</view>
		</view>
		<view class="txt_wrapper flex_row">
			<text class="txt mr20">{{friendlyDate(date2tamp(detail.create_time))}}</text>
			<uni-rate disabled size="15" value="4.5"></uni-rate>
		</view>

		<view v-if="detail.coins && detail.coins.length > 0" class="flex_row coin_wrapper">
			<view v-for="(item, index) in detail.coins" :key="index" class="mark_wrapper">
				<mark-view
					:end="item.endPrice"
					:start="item.startPrice"
					:item = "item"
					></mark-view >
			</view>
		</view>
		<view class="article-content">
			<rich-text :nodes="content" class="content"></rich-text>
		</view>
		<view class="announce_wrapper">
			<text class="txt">{{helper.announce3}}</text>
		</view>
		<view style="padding: 20upx">
			<operation-btns
					:goodCount="detail.good"
					:badCount="detail.bad"
					:commentCount="detail.comments_count"
					@gotoCommet="showReply(detail.id)"
					@doGood="doGood(detail)"
					@doBad="doBad(detail)"
					@share="share">
			</operation-btns>
		</view>
		<view class="relative_section">
			<section-head title="评论">
				<view @click="loadList('refresh')"><text class="normal_txt">刷新</text></view>
			</section-head>
		</view>
		
		<view class="comment-wrap">
			<mix-pulldown-refresh ref="mixPulldownRefresh" class="panel-content" :top="0" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll">
				<scroll-view
					class="panel-scroll-box" 
					:scroll-y="enableScrollY" 
					@scrolltolower="loadMore"
					style="height: 100vh"
					>
					<comment-item v-for="(item, index) in commentList" :key="index" :item="item"></comment-item>
					<!-- 上滑加载更多组件 -->
					<mix-load-more :status="loadMoreStatus" @click.native="loadMore"></mix-load-more>
				</scroll-view>
			</mix-pulldown-refresh>
		</view>
		<view class="fixed">
			<uni-bottom-comment :options="options" @buttonClick="showReply(detail.id)" @clickItem="onClick"></uni-bottom-comment>
		</view>
		<uni-popup ref="popup" type="bottom">
			<uni-title title="分享到" :isBold="false"></uni-title>
			<view class="popShare_wrapper flex_row">
				<view v-for="(item, index) in sharePlatform" :key="index" @click="share(item.name)" class="popShare_item">
					<image :src="'../../static/social/'+item.icon_url" mode="aspectFill" class="popShare_icon_social"></image>
					<text class="list_item_black_txt">{{item.name}}</text>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {uniRate} from '@dcloudio/uni-ui'
	import htmlParser from '@/common/html-parser';
	import {getNormalNewsDetail} from '@/service/getData.js';
	import newsItem from '@/components/list-item/news-item.vue';
	import sectionHead from '@/components/sectionHead.vue';
	import commentItem from '@/pages/comment/comment_item.vue';
	import {friendlyDate, date2tamp, loadMore} from '@/common/util.js';
	import markView from '@/components/markView.vue';
	import {oneNews,newItem,comment} from '@/mock/data.js';
	import {detailText, platform} from  '@/common/config.js';
	import operationBtns from '@/components/operationBtns.vue';
	import {uniPopup} from "@dcloudio/uni-ui";
	import uniBottomComment from '@/components/uni-bottom-comment.vue';
	import uniTitle from '@/components/uni-title.vue';

	const FAIL_CONTENT = '<p>获取信息失败1</p>';
	let OPTIONS = [{
						icon: 'share',
					}];


	export default {
		data() {
			return {
				id: '', // 文章id
				banner: {},
				content: [],
				detail: {},
				helper: detailText ,// 声明，及帮助文档
				sharePlatform: platform, // 分享平台
				listData: [], // 相关阅读列表
				commentList: [], //评论列表
				screenWidth: 0,
				options: OPTIONS,
				loadMoreStatus:  0, //加载更多 0加载前，1加载中，2没有更多了
				refreshing: false, // 刷新状态
				enableScrollY: true,
				pageNum: 1,
				total: 0,
				pageSize: 15,
				lastPage: 1,
			}
		},
		mixins:[friendlyDate, date2tamp, loadMore],
		components:{
			markView,
			sectionHead,
			newsItem,
			commentItem,
			operationBtns,
			uniRate,
			uniBottomComment,
			uniPopup,
			uniTitle
		},
		onShareAppMessage() {
			return {
				title: this.banner.title,
				path: '/pages/detail/detail?query=' + JSON.stringify(this.banner)
			}
		},
		onShow(){
			this.loadList('refresh');			
		},
		onLoad(event) {
			this.id = event.id;
			this.getDetail();
			// this.getListData();
			// this.loadList('add');
			let _this = this;
			uni.getSystemInfo({
				success(res) {
					_this.screenWidth = res.screenWidth;
				}
			});
		},
		methods: {
			async getDetail() {
				let content = FAIL_CONTENT
				try{
					this.$api.article_info(this.id).then(data => {
						if (data && data.code === 200) {
							const nodes = htmlParser(data.result.content);
							this.content = nodes;
							this.detail = data.result;
						} else {
							this.$message(data.msg, function () {
								// uni.navigateBack({
								// 	delta: 1
								// });
							})
						}
					})
				} catch (e){

				}
			},
			getListData(){
				this.listData = newItem;
			},
			loadList(action) {
				
				//action= add上拉加载 refresh下拉刷新
				if (action=='refresh') {
					this.commentList = [];
					this.pageNum = 1;
					this.loadMoreStatus = 0;
				}
				
				console.log("status:"+this.loadMoreStatus)
				if (this.loadMoreStatus==0) {
					this.loadMoreStatus = 1;
					this.$api.comments(this.id,{
						pageNum: this.pageNum,
						pageSize: this.pageSize,
					}).then(data => {
						if (data && data.code === 200) {
							console.log(this.pageNum)
				
							const result = data.result.data
							this.total = data.result.total
							this.lastPage = data.result.last_page
							this.commentList.push(...result);
							this.$refs.mixPulldownRefresh && this.$refs.mixPulldownRefresh.endPulldownRefresh();
							this.refreshing = false;
							if (this.pageNum==this.lastPage) {
								this.loadMoreStatus = 2;
							}else{
								this.loadMoreStatus = 0;
							}
							this.pageNum += 1;
						} else {
							this.commentList = [];
							this.$message(data.msg)
						}
					})
				}
				// this.commentList = comment;
				// this.$api.comments(this.id).then(data => {
				// 	if (data && data.code === 200) {
				// 		this.commentList = data.result;
				// 	} else {
				// 		this.commentList = [];
				// 	}
				// })
			},

			share() {
				this.$refs.popup.open();
			},
			// 去回复页面
			showReply(id){
				uni.navigateTo({
					url:'/pages/details/reply?article_id='+id
				});
			},
			onClick(index, item) {
				if(item.icon == 'share'){
					this.$refs.popup.open();
				}
			},
			doGood(item) {
				this.$api.articles_good(item.id).then(data => {
					if (data && data.code === 200) {
						item.good = data.result.good
						item.is_good = data.result.is_good
					}
				})
			},
			doBad(item) {
				this.$api.articles_bad(item.id).then(data => {
					if (data && data.code === 200) {
						item.bad = data.result.bad
						item.is_bad = data.result.is_bad
					}
				})
			},
		},
	}
</script>

<style lang="scss">

	/* #ifndef APP-PLUS */
	page {
		min-height: 100%;
	}
	.detail_page{
		position: relative;
		margin-bottom: 100upx;
	}
	/* #endif */
	.detail_page{
		margin-bottom: 50px;
	}
	.flex_row{
		@include flexRow;
	}
	.coin_wrapper{
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 0 $space-lg $space-base $space-lg;
		background-color: #fff;
	}
	.mark_wrapper{
		width: 45%;
		margin-bottom:$space-base;
	}
	.banner{
		padding: 0upx 30upx;
		background-color: #fff;
	},
	.content{
		font-size: 34upx;
		color: #333;
		line-height: 50upx;
	}
	.title-text {
		font-size: 40upx;
		font-weight: bold;
		line-height: 58upx;
		color: #000;
	}
	.txt_wrapper {
		justify-content: space-between;
		padding: 0 30upx;
		height: 70upx;
		align-items: center;
		background-color: #fff;
	}
	.txt{
		color: #a0a0a0;
		font-size: 24upx;
	}

	.article-meta {
		padding: 20upx 30upx;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}
	.article-meta-text {
		color: gray;
	}

	.article-text {
		font-size: 26upx;
		line-height: 50upx;
		margin: 0 20upx;
	}

	.article-author {
		font-size: 30upx;
	}

	.article-time {
		font-size: 30upx;
	}

	.article-content {
		font-size: 30upx;
		padding: 0 30upx 30upx 30upx;
		// margin-bottom: 30upx;
		overflow: hidden;
		background-color: #fff;
	}
	/deep/ .article-content p{
		margin: $space-lg 0;
		color: #29293b;
		line-height: 58upx;
		word-break: break-word;
	}
	/deep/ .article-content img{
		display: block;
		width: 100%;
		margin: 0 auto;
	}
	.hepler_wrapper{
		padding: 50upx 30upx 0 30upx;
	}
	.helper{
		border-style: dashed;
		padding: 20upx 26upx;
		border-color: #a0a0a0;
		border-width: 1upx;
	}
	.txt {
		font-size: 26upx;
		color: #a0a0a0;
		line-height: 40upx;
	}
	.link_txt{
		color: #2e82cc;
	}
	.helper_txt{
		color:#707070
	}
	.author_wrapper{
		padding: 20upx 0upx 30upx 0upx;
	}
	.media-item-line {
        position: absolute;
        left: 30upx;
        right: 30upx;
        bottom: 20upx;
        height: 2upx;
        background-color: #ebebeb;
		z-index: 9;
    }
	.share_wrapper{
		margin-top: 30upx;
	}
	.share_txt_wrapper{
		background-color: #fff;
	}
	.share_txt{
		font-size: 30upx;
		color: #000;
		background-color: #fff;
		z-index:10;
		padding: 0upx 15upx;
	}
	.share_head{
		display: flex;
		align-items: center;
		// background-color: red;
	}
	.platform_wrapper{
		height: 60upx
	}
	.platform_item{
		flex: 1;
		justify-content: center;
	}
	.announce_wrapper{
		padding: 10upx 30upx;
		background-color: #fff;
	}
	.comment-wrap{
		background-color: #f5f5f5;
	}
	.fixed{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 12;
	}
	.popShare_wrapper{
		background-color: #fff;
		flex-wrap: wrap;
	}
	.popShare_icon_social{
		width: 70upx;
		height: 70upx;
	}
	.popShare_item{
		width: 25%;
		display: flex;
		flex-direction: column;
		padding: $space-base 0;
		align-items: center;
		justify-content: center;
	}
</style>
