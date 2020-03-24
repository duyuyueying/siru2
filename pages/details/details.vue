<template>
	<view class="detail_page container">
		<view v-if="isVideo">
			<view class="video-wrapper">
				<video 
					class="video"
					src="https://dcloud-img.oss-cn-hangzhou.aliyuncs.com/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20181126.mp4" 
					controls
					poster="https://img.36krcdn.com/20200307/v2_945dcd5d78514102a1e83a016bfbb2a6_img_000"
					objectFit="fill"
					:autoplay="false"
				></video>
			</view>
		</view>
		<view class="banner" auto-focus>
			<view class="title-area">
				<text class="title-text">{{detail.title}}</text>
			</view>
		</view>
		<person-list-item  v-if="detail.author" :item="detail.author" showIdentification >
			<view class="txt_wrapper">
				<text class="txt mr20">{{friendlyDate(detail.time)}}</text>
				<view class="flex_row ">
					<icons type="fire" color="#a0a0a0"></icons>
					<text class="txt"> {{detail.hot}}</text>
				</view>
			</view>
		</person-list-item>
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
			<rich-text :nodes="content" :style="{fontSize: fontSize+'upx'}" class="content"></rich-text>
		</view>
		<view class="hepler_wrapper">
			<view class="helper">
				<text class="txt helper_txt">{{helper.hepler[0]}}</text><text class="txt link_txt">{{helper.hepler[1]}}</text>
			</view>
			<view class="flex_row author_wrapper">
				<text class="txt mr20">本文作者：{{detail.author_name}}</text>
				<text class="txt">责任编辑：{{detail.author_name}}</text>
			</view>
			<view>
				<text class="txt">{{helper.announce1}}</text>
			</view>
		</view>
		<view class="share_wrapper">
			<view class="share_head">
				<view class="media-item-line"></view>
				<view class="share_txt_wrapper"><text class="share_txt">分享至</text></view>
			</view>
			<view class="platform_wrapper flex_row">
				<view v-for="(item, index) in sharePlatform" :key="index" @click="share(item.name)" class="platform_item">
					<!-- <text class="txt" style="text-align: center;">{{item.name}}</text> -->
					<image :src="'../../static/social/'+item.icon_url" mode="aspectFill" class="icon_social"></image>
				</view>
			</view>
		</view>
		<section-head title="相关阅读"></section-head>
		<view class="list_wrapper">
			<news-item :newsItem="item" @click="goDetail(item)" v-for="(item, index) in listData" :key="index"></news-item>
		</view>
		<view class="announce_wrapper">
			<text class="txt">{{helper.announce2}}</text>
		</view>
		<section-head title="评论" ref="commentBox" class="comment-title-wrap"></section-head>
		<view class="comment-wrap">
			<comment-item v-for="(item, index) in commentList" :key="index" :item="item"></comment-item>
		</view>
		<!-- 底部操作 -->
		<view class="fixed">
			<uni-bottom-comment :options="options" @buttonClick="showReply" @clickItem="onClick" :commentCount="detail.comment" :likeCount="detail.like"></uni-bottom-comment>
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
		<!-- 更多弹出框 -->
		<uni-popup ref="popupMore" type="bottom">
			<view v-if="showQuotations" style="backgroundColor: #f5f5f5;">
				<uni-title title="相关行情" :isBold="false"></uni-title>
				<uni-self-dish-table-head>
					<view class="edit_cell"><text class="normal_txt">币种</text></view>
				</uni-self-dish-table-head>
				<scroll-view scroll-y="true" :style="{height: '800upx'}" >
					<uni-self-dish-table-cell v-for="(item, index) in coins" :key="index" :item="item" @click="goPage(item.name, item.exChange)"></uni-self-dish-table-cell>
				</scroll-view>
				<view class="popupMore_btn" @click="changFlag"><text class="popupMore_btn_txt">取消</text></view>
			</view>
			<view style="backgroundColor: #f5f5f5;" v-else>
				<view class="slider_wrap flex_row">
					<text class="list_item_black_txt sm">A</text>
					<view class="flex1">
						<slider :min="20" :max="50" :value="fontSize" :block-size="12" @changing="changeFontSize"></slider>
					</view>
					<text class="list_item_black_txt big">A</text>
				</view>
				<view class="popupMore_wrapper flex_row">
					<view v-for="(item, index) in popOperation" :key="index" @click="onClick(index, item, 'popup')" class="popShare_item">
						<icons :type="item.icon" :color="item.icon == 'collect' && item.isCollect ? '#ffb011': '#333'"></icons>
						<text class="list_item_black_txt">{{item.name}}</text>
					</view>
				</view>
				<view class="popupMore_btn" @click="closePopup"><text class="popupMore_btn_txt">关闭</text></view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	// #ifdef APP-PLUS
	const dom = weex.requireModule('dom');
	// #endif
	import htmlParser from '@/common/html-parser.js';
	import {getNormalNewsDetail} from '@/service/getData.js';
	import personListItem from '@/components/list-item/person-list-item.vue';
	import newsItem from '@/components/list-item/news-item.vue';
	import sectionHead from '@/components/sectionHead.vue';
	import commentItem from '@/pages/comment/comment_item.vue';
	import {friendlyDate} from '@/common/util.js';
	import markView from '@/components/markView.vue';
	import {detailText, platform} from  '@/common/config.js';
	import {newItem,comment,oneNews, coins} from '@/mock/data.js';
	import uniBottomComment from '@/components/uni-bottom-comment.vue';
	import {uniPopup} from "@dcloudio/uni-ui"
	import uniTitle from '@/components/uni-title.vue';
	import icons from '@/components/icons/icons.vue';
	import uniSelfDishTableHead from '@/components/list-item/uni-self-dish-table-head.vue';
	import uniSelfDishTableCell from '@/components/list-item/uni-self-dish-table-cell.vue';
	
	const FAIL_CONTENT = '<p>获取信息失败1</p>';
	const popOperation = [{
		name: '收藏',
		nikeName: 'collect',
		icon: 'collect'
		
	},{
		name: '行情',
		nikeName: 'quotations',
		icon: 'quotations'
	},{
		name: '分享',
		nikeName: 'share',
		icon: 'share'
	}]

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
	
	let OPTIONS = [{
						icon: 'commet',
					}, {
						icon: 'good',
					}, {
						icon: 'share',
					}, {
						icon: 'more',
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
				options: OPTIONS,
				scrollFlag: 0, // 滚动标准，为true滚动到评论区，false滚动到顶部
				screenWidth: 0,
				popOperation: popOperation,
				fontSize: 34,
				showQuotations: false, // 控制是否显示操作栏内的行情的开关
				coins: coins,
				isVideo: false, // 是否是video类型的新闻
				// data: {},
			}
		},
		mixins:[friendlyDate],
		components:{
			personListItem,
			markView,
			sectionHead,
			newsItem,
			commentItem,
			uniBottomComment,
			uniPopup,
			uniTitle,
			icons,
			uniSelfDishTableHead,
			uniSelfDishTableCell
		},
		onShareAppMessage() {
			return {
				title: this.banner.title,
				path: '/pages/detail/detail?query=' + JSON.stringify(this.banner)
			}
		},
		onLoad(event) {
			this.id = event.id;
			this.isVideo = !!event.type 
			let _this = this;
			this.getDetail();
			this.getListData();
			this.getCommentList();
		},
		mounted() {
			// this.$nextTick(function(e){
			// 	this.scrollTo();
			// })
			// this.scrollTo();
		},
		methods: {
			async getDetail() {
				let content = FAIL_CONTENT
				try{
					let result = await getNormalNewsDetail('5299102');
					if (result.statusCode == 200) {
						content = result.data.content
					}
					const nodes = htmlParser(content);
					// #ifdef APP-PLUS-NVUE
					parseImgs(nodes)
					// #endif
					this.content = nodes;
					this.detail = oneNews;
					this.detail.isFocus = false;
					let newOptions = [];
					for(let i = 0, len = this.options.length; i < len; i++){
						newOptions[i] = Object.assign(this.options[i]);
						if(i == 0) {
							newOptions[i].info = this.detail.comment;
						}
						if(i == 1) {
							newOptions[i].info = this.detail.like
						}
					}
					this.options = newOptions
				} catch (e){
					
				}
			},
			getListData(){
				this.listData = newItem;
			},
			getCommentList() {
				console.log(comment);
				this.commentList = comment;
			},
			share(name) {
				if(name.indexOf('复制') >= 0) {
					uni.setClipboardData({
						data: 'http:baidu.com',
						success() {
							uni.showToast({
								title: '链接复制成功！',
								icon: 'none'
							});
							setTimeout(()=>{
								uni.hideToast()
							}, 3000)
						}
					})
				} else {
					uni.showToast({
						title: '分享至'+name,
						icon: 'none'
					});
					setTimeout(()=>{
						uni.hideToast()
					}, 3000)
				}
				
			},
			// 去回复页面
			showReply(){
				uni.navigateTo({
					url:'./reply'
				});
			},
			onClick(index, item, fromTo) {
				console.log(index, item);
				if(item.icon == 'commet') {
					this.scrollToComment();
				} else if(item.icon == 'share'){
					console.log(this.$refs);
					if(fromTo == 'popup'){
						this.$refs.popupMore.close();
					}
					this.$refs.popup.open();
				} else if(item.icon == 'more') {
					this.$refs.popupMore.open()
				} else if(item.icon == 'good') {
					this.doLike();
				} else if(item.icon == 'collect') {
					this.doCollect();
				} else if (item.icon == 'quotations') {
					this.showQuotations = true;
				}
			},
			// 点赞
			doLike() {
				let tempArr = [];
				for(let i = 0, len = this.options.length; i < len; i++) {
					let item = this.options[i];
					if(item.icon == 'good') {
						item.isLike = !item.isLike
						if(item.isLike) {
							item.info++
						} else {
							item.info--;
						}
					}
					tempArr[i] = Object.assign({}, item);
				}
				this.options = tempArr;
			},
			// 收藏
			doCollect() {
				let tempArr = [];
				for(let i = 0, len = this.popOperation.length; i < len; i++) {
					let item = this.popOperation[i];
					if(item.icon == 'collect') {
						item.isCollect = !item.isCollect
					}
					tempArr[i] = Object.assign({}, item);
				}
				this.popOperation = tempArr;
			},
			// 滚动到评论区
			scrollToComment(){
				if(this.scrollFlag){
					uni.pageScrollTo({
						scrollTop: 0,
						duration: 300
					});
					this.scrollFlag = false;
				} else {
					uni.createSelectorQuery().in(this).select('.comment-title-wrap').fields({
						rect: true
					}, (res) => {
						uni.pageScrollTo({
							scrollTop: res.top,
							duration: 300
						});
						this.scrollFlag = true
					}).exec();
				}
			},
			// 改变字体大小
			changeFontSize(res) {
				console.log(res.detail);
				let size = res.detail.value;
				this.fontSize = size;
			},
			// 关闭更多的模态框
			closePopup() {
				this.$refs.popupMore.close()
			},
			// 跳转到币详情页
			goPage(symbol, exChangeName) {
				uni.navigateTo({
					url: '/pages/coinDetail/coinDetail?symbol='+symbol+'&exChangeName='+exChangeName
				});
			},
			// 改变行情开关的值
			changFlag() {
				this.showQuotations = false
			},
			// 播放vedio
			playVedio() {
				
			}
		},
	}
</script>

<style lang="scss" scoped>
	
	/* #ifndef APP-PLUS */
	page {
		min-height: 100%;
	}
	/* #endif */
	.detail_page{
		position: relative;
		margin-bottom: 50px;
	}
	.fixed{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 12;
	}
	.flex_row{
		@include flexRow;
	}
	.coin_wrapper{
		padding: 0upx $space-lg;
		flex-wrap: wrap;
		justify-content: space-between;
		background-color: #fff;
		// margin-bottom: 20upx;
	}
	.mark_wrapper{
		// flex: 1;
		margin-bottom: $space-base;
		width: 45%;
	}
	.banner{
		padding: 0upx $space-lg;
		background-color: #fff;
	},
	.title-text {
		font-size: 40upx;
		font-weight: bold;
		line-height: 58upx;
		color: #000;
	}
	.txt_wrapper {
		display: flex;
		flex-direction: row;
	}
	.txt{
		color: #a0a0a0;
		font-size: 24upx;
	}
	.article-content {
		padding: 0 $space-lg;
		overflow: hidden;
		background-color: #fff;
		text-align: justify;
		position: relative;
	}
	.content {
		font-size: 46upx;
		line-height: 58upx;
		color: #29293b;
		font-family: PingFang SC,Lantinghei SC,Helvetica Neue,Helvetica,Arial,Microsoft YaHei,"sans-serif"
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
		padding: 50upx 30upx 30upx 30upx;
		background-color: #fff;
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
        top: 6s0upx;
        height: 2upx;
        background-color: #ebebeb;
		z-index: 9;
    }
	.share_wrapper{
		padding: 30upx;
		background-color: #fff;
		position: relative;
	}
	.share_txt_wrapper{
		background-color: #fff;
		position: relative;
		z-index: 10;
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
		justify-content: center;
		position: relative;
		// background-color: red;
	}
	.platform_wrapper{
		height: 60upx
	}
	.platform_item{
		display: flex;
		flex: 1;
		justify-content: center;
		align-items: center;
	}
	.announce_wrapper{
		margin-top: 10upx;
		padding: 10upx 30upx;
	}
	.comment-wrap{
		background-color: #f5f5f5;
		height: 500upx;
	}
	.icon_social{
		width: 45upx;
		height: 45upx;
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
	.popupMore_wrapper{
		background-color: #fff;
		justify-content: center;
		border: 0 solid #fafafa;
		border-top-width: 2upx;
	}
	.popupMore_btn{
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		height: 100upx;
		line-height: 100upx;
		margin-top: 10upx;
	}
	.popupMore_btn_txt{
		line-height: 100upx;
		font-size: 30upx;
		color: #858585;
	}
	.sm{
		font-size: 20upx;
	}
	.big{
		font-size: 50upx;
	}
	.slider_wrap{
		padding: 0 $space-lg;
		justify-content: center;
		align-items: center;
		background-color: #fff;
	}
	.video-wrapper{
		height: 350upx;
		padding-bottom: $space-base;
		.video{
			width: 100%;
			height: 100%;
		}
	}
</style>
