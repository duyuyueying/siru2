<template>
	<view class="detail_page container">
		<view class="banner" auto-focus>
			<view class="title-area">
				<text class="title-text">{{detail.title}}</text>
			</view>
		</view>
		<view class="txt_wrapper flex_row">
			<text class="txt mr20">{{friendlyDate(detail.time)}}</text>
			<uni-rate size="15" value="4.5"></uni-rate>
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
			<operation-btns :goodCount="detail.goodCount" :badCount="detail.badCount" @gotoCommet="showReply(detail.id)" @share="share"></operation-btns>
		</view>
		<section-head title="评论"></section-head>
		<view class="comment-wrap">
			<comment-item v-for="(item, index) in commentList" :key="index" :item="item"></comment-item>
		</view>
		<view class="fixed">
			<uni-bottom-comment :options="options" @buttonClick="showReply" @clickItem="onClick"></uni-bottom-comment>
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
	import {friendlyDate} from '@/common/util.js';
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

	function parseImgs(nodes) {
		nodes.forEach(node => {
			if (
				node.name === 'img' &&
				node.attrs &&
				node.attrs['data-img-size-val']
			) {
				const sizes = node.attrs['data-img-size-val'].split(',')
				const width = uni.upx2px(720 * 0.9)
				const height = parseInt(width * (sizes[1] / sizes[0]))
				node.attrs.style = `width:${width};height:${height};`
			}
			if (Array.isArray(node.children)) {
				parseImgs(node.children)
			}
		})
		return nodes
	}

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
				options: OPTIONS
			}
		},
		mixins:[friendlyDate],
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
		onLoad(event) {
			this.id = event.id;
			this.getDetail();
			this.getListData();
			this.getCommentList();
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
					let result = await getNormalNewsDetail('5299102');
					if (result.statusCode == 200) {
						content = result.data.content
					}
					const nodes = htmlParser(oneNews.detail);
					// #ifdef APP-PLUS-NVUE
					parseImgs(nodes)
					// #endif
					this.content = nodes;
					this.detail = oneNews;
					console.log(this.detail);
				} catch (e){
					
				}
			},
			getListData(){
				this.listData = newItem;
			},
			getCommentList() {
				this.commentList = comment;
			},

			share() {
				this.$refs.popup.open();
			},
			// 去回复页面
			showReply(id){
				uni.navigateTo({
					url:'/pages/details/reply?id='+id
				});
			},
			onClick(index, item) {
				if(item.icon == 'share'){
					this.$refs.popup.open();
				}
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
