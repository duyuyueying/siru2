<template>
    <view class="media-item view">
		<view class="relative_section" style="background-color: #fff;z-index: 2;"><view class="list_wrap" @click="gotoDetail"><text class="list_wrap_txt">查看原内容</text></view></view>
		<mix-pulldown-refresh ref="mixPulldownRefresh" class="panel-content" :top="0" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll">
			<scroll-view
				class="panel-scroll-box" 
				:scroll-y="enableScrollY" 
				@scrolltolower="loadMore"
				style="height: 100vh"
				>
				<view class="flex_row main_comment">
					<view class="img_wrapper">
						<navigator :url="'/pages/author/author?id=' + info.user.id" class="link_wrapper" hover-class="navigator-hover">
							<image class="image-list1" :src="info.user.avatar_src!=''?info.user.avatar_src:'../../static/temp/avatar.jpeg'"></image>
						</navigator>
					</view>
					<view class="content_wrapper">
						<view class="flex_row">
							<text class="info-text">{{info.user.nickname}}</text>
						</view>
						<view><text class="comment_txt black">{{info.content}}</text></view>
						<view class="flex_row">
							<text class="info-text" >{{friendlyDate(date2tamp(info.create_time))}}</text>
							<text @tap="reply(info.id, info.user.id)" class="info-text black">回复</text>
						</view>
					</view>
					<view class="btn_wrapper flex_row" @tap.stop="doLike(info)">
						<text class="btn_txt" :class="{isLike}">{{info.zan>0 ? info.zan : '点赞'}}</text><icons type="good" :color="info.is_zan?'#ffb100' : '#999'"></icons>
					</view>
				</view>

				<view class="sub_reply" v-if="dataList&&dataList.length > 0">
					<view v-for="(subItem, index) in dataList" :key="index" class="flex_row main_comment">
						<view class="img_wrapper">
							<navigator :url="'/pages/author/author?id=' + subItem.user.id" class="link_wrapper" hover-class="navigator-hover">
								<image class="image-list1" :src="subItem.user.avatar_src!=''?subItem.user.avatar_src:'../../static/temp/avatar.jpeg'"></image>
							</navigator>
						</view>
						<view class="content_wrapper">
							<view class="flex_row">
								<text class="info-text">{{subItem.user.nickname}}</text>
<!--								<text class="txt">评论</text>-->
<!--								<text class="info-text">{{subItem.reply_user_name}}</text>-->
							</view>
							<view><text class="comment_txt black">{{subItem.content}}</text></view>
							<view class="flex_row">
								<text class="info-text" >{{friendlyDate(date2tamp(subItem.create_time))}}</text>
								<text @tap="reply(info.id, subItem.user.id, subItem.user.nickname, subItem.id)" class="info-text black">回复</text>
							</view>
						</view>
						<view class="btn_wrapper flex_row" @tap.stop="doLike(subItem)">
							<text class="btn_txt" :class="{isLike}">{{subItem.zan>0 ? subItem.zan : '点赞'}}</text><icons type="good" :color="subItem.is_zan?'#ffb100' : '#999'"></icons>
						</view>
					</view>
				</view>
				<!-- 上滑加载更多组件 -->
				<mix-load-more :status="loadMoreStatus" @click.native="loadMore"></mix-load-more>
			</scroll-view>
		</mix-pulldown-refresh>
    </view>
</template>

<script>
	import  {identification} from '@/common/config.js';
	import {friendlyDate, date2tamp, loadMore} from '@/common/util.js';
	import icons from '@/components/icons/icons.vue';
    export default {
		data() {
			return {
				isLike: false,
				identification: null,
				commentId: '0',
				info:{
					user:{
						avatar_src:''
					}
				},
				dataList:[],

				loadMoreStatus:  0, //加载更多 0加载前，1加载中，2没有更多了
				enableScrollY: true,
				refreshing: false, // 刷新状态
				pageNum: 1,
				total: 0,
				pageSize: 15,
				lastPage: 1,
			}
		},
		components:{
			icons
		},
		mixins:[friendlyDate, date2tamp, loadMore],
		mounted() {
			// 这里需要根据接口返回来的关注人的列表判断当前这个人是否被点过赞过
			// this.isLike = false;
		},
		onShow(){
			this.loadList('refresh');
		},
		onLoad(event) {
			this.commentId = event.commentId;

			if (this.commentId=='0') {
				this.errorBack()
			}
			let _this = this;
		},
        methods: {
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
					this.$api.comments_info(this.commentId,{
						pageNum: this.pageNum,
						pageSize: this.pageSize,
					}).then(data => {
						if (data && data.code === 200) {
							console.log(this.pageNum)

							this.info = data.result.info
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
							this.errorBack()
						}
					})
				}
			},
            close(e) {
                e.stopPropagation();
                this.$emit('close');
            },
			doLike(item) {
				this.$api.comments_zan(item.id).then(data => {
					if (data && data.code === 200) {
						item.zan = data.result.zan
						item.is_zan = data.result.is_zan
					}
				})
			},
			// 去回复
			reply(reply_id,reply_user_id,nickname,re_reply_id){
				let url = '/pages/details/reply?article_id='+this.info.article.id+'&reply_id='+reply_id
				if (reply_user_id) {
					url += '&reply_user_id='+reply_user_id
				}
				if (nickname) {
					url += '&nickname=' + nickname
				}
				if (re_reply_id) {
					url += '&re_reply_id=' + re_reply_id
				}
				uni.navigateTo({
					url: url
				});
			},
			errorBack(){
				this.$message('操作错误',function () {
					uni.navigateBack({
						delta:1
					})
				})
			},
			gotoDetail(id) {
				if (this.info.article.type==2) {
					uni.navigateTo({
						url:'/pages/details/fastNewsDetail?id='+this.info.article.id
					});
				}else{
					uni.navigateTo({
						url:'/pages/details/details?id='+this.info.article.id
					});
				}
			}
        },
		watch:{
		}
    }
</script>

<style scoped lang="scss">
    .list_wrap{
		height: 60upx;
		line-height: 60upx;
		border: 1upx solid $borderColor;
		text-align: center;
	}
	.list_wrap_txt{
		font-size: 28upx;
		color: $mainColor
	}
    .media-item {
        flex: 1;
        // flex-direction: row;
        // justify-content: space-between;
		// display: flex;
		padding: 10upx 30upx 30upx 30upx;
		margin-bottom: 12upx;
		background-color: #fff;
    }
	.main_comment{
		justify-content: space-between;
		margin-top: 20upx;
	}
	.navigator-hover{
		background-color: #fff;
	}
	.flex_row{
		display: flex;
		flex-direction: row;
	}
    .media-item-line {
        position: absolute;
        left: 30upx;
        right: 30upx;
        bottom: 0;
        height: 1upx;
        background-color: #ebebeb;
    }
	.img_wrapper {
		width: 60upx;
		height: 60upx;
		margin-right: 15upx;
		position: relative;
		z-index: 10;
		
	}
	.image-list1 {
	    @include circle(60upx);
	}
	.icon_v{
		@include circle(24upx);
		@include center;
		font-size: 16upx;
		color: #fff;
		position: absolute;
		bottom: 0upx;
		right: 0upx;
		z-index: 11;
		background-color: $mainColor;
	}
	.content_wrapper{
		// width: 440upx;
		// margin-right: 70upx;
		flex: 1;
		flex-direction: column;
		justify-content: space-between;
		
	}
	.info-text {
	    margin-right: 20upx;
	    color: #868e96;
	    font-size: 24upx;
		@include more_line_ellipsis(1);
	}
	.txt{
		margin-right: 20upx;
		color: #666;
		font-size: 20upx;
	}
	.comment_txt{
		font-size: 30upx;
		line-height: 50upx;
	}
	.black{
		color: #000;
	}
	.btn_wrapper{
		width: 140upx;
		justify-content: center;
		align-items: flex-start;
	}
	.button {
		background-color: #fff2bb;
		padding: 0;
		border: 0;
		width: 140upx;
		height: 55upx;
	}
	.btn_txt{
		color: #999;
		font-size: 24upx;
		text-align: center;
		line-height: 55upx;
		margin-right: 10upx;
	}
	.icon_btn{
		color: #999;
		font-size: 24upx;
		line-height: 55upx;
	}
	.isLike{
		color: $mainColor;
	}
	.sub_reply{
		margin-left: 60upx;
	}
</style>
 