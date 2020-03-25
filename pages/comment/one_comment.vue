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
						<navigator url="../author/author" class="link_wrapper" hover-class="navigator-hover">
							<image class="image-list1" src="../../static/temp/avatar.jpeg"></image>
						</navigator>
					</view>
					<view class="content_wrapper">
						<view class="flex_row">
							<text class="info-text">{{item.comment_user}}</text>
						</view>
						<view><text class="comment_txt black">{{item.comment}}</text></view>
						<view class="flex_row">
							<text class="info-text" >{{friendlyDate(item.time)}}</text>
							<text @tap="reply" class="info-text black">回复</text>
						</view>
					</view>
					<view class="btn_wrapper flex_row" @tap.stop="doLike(item.id)">
						<text class="btn_txt" :class="{isLike}">{{item.like>0 ? item.like : '点赞'}}</text><icons type="good" :color="isLike?'#ffb100' : '#999'"></icons>
					</view>
				</view>
				<view class="sub_reply" v-if="item.reply&&item.reply.length > 0">
					<view v-for="(subItem, index) in item.reply" :key="index" class="flex_row main_comment">
						<view class="img_wrapper">
							<navigator url="../author/author" class="link_wrapper" hover-class="navigator-hover">
								<image class="image-list1" src="../../static/temp/avatar.jpeg"></image>
							</navigator>
						</view>
						<view class="content_wrapper">
							<view class="flex_row">
								<text class="info-text">{{subItem.comment_user}}</text>
								<text class="txt">评论</text>
								<text class="info-text">{{subItem.reply_user_name}}</text>
							</view>
							<view><text class="comment_txt black">{{subItem.comment}}</text></view>
							<view class="flex_row">
								<text class="info-text" >{{friendlyDate(subItem.time)}}</text>
								<text @tap="reply" class="info-text black">回复</text>
							</view>
						</view>
						<view class="btn_wrapper flex_row" @tap.stop="doLike(subItem.id)">
							<text class="btn_txt" :class="{isLike}">{{subItem.like>0 ? subItem.like : '点赞'}}</text><icons type="good" :color="isLike?'#ffb100' : '#999'"></icons>
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
				item: {
					id: '124',
					comment_user_id: '111',
					comment_user: '王麻子',
					comment_user_avatar: '',
					comment: '我是评论，挺好的！',
					like: 0,
					time: 1581076464000,
					reply: [{
					id: '124',
					comment_user_id: '114',
					comment_user: '张山',
					reply_user_name: '王麻子',
					comment_user_avatar: '',
					comment: '我是评论，挺好的！',
					like: 0,
					time: 1581076464000,
					reply: [{
						id: '124',
						comment_user_id: '114',
						comment_user: '张山',
						reply_user_name: '王麻子',
						comment_user_avatar: '',
						comment: '我是回复，挺好的！',
						like: 0,
						time: 1581076464000,
						reply: []
					}],
				}]
			},
			enableScrollY: true,
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
			this.isLike = false;
		},
        methods: {
            close(e) {
                e.stopPropagation();
                this.$emit('close');
            },
			doLike(id) {
				this.isLike = !this.isLike;
				if(this.isLike) {
					this.item.like += 1;
				} else {
					this.item.like -= 1;
				}
			},
			// 去回复
			reply(id){
				uni.navigateTo({
					url:'/pages/details/reply?id='+id
				});
			},
			gotoDetail(id) {
				uni.navigateTo({
					url:'/pages/details/details?id='+id
				});
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
 