<template>
	<view class="container">
		<view class="bg_wrapper">
			<view class="bg">
				<image class="bg_img" src="/static/userCenter/invite.png"></image>
			</view>
			<view class="u-count_wrap u-txt_wrap"><text class="txt">已邀请好友 {{count}} 人,已获得金币 {{coinCount}}</text></view>
			<view class="u-link_wrap u-txt_wrap" @tap="toPage"><text class="txt u-link-txt">查看我的邀请记录</text></view>
			<view class="invite_btn" @tap="invite"></view>
		</view>
		<view>
			<uni-title title="活动规则"></uni-title>
			<view class="pad30">
				<view v-for="(item, index) in rules" :key="index"><text class="u-rules_txt">{{index+1}}、{{item}}</text></view>
				<view class="mb20"><text class="u-rules_txt gray-txt">{{detailText.announce4}}</text></view>
			</view>
		</view>
	</view>
</template>

<script>
	import {rules, detailText} from '@/common/config.js';
	import uniTitle from '@/components/uni-title.vue';
	export default {
		data() {
			return {
				count: 0,
				coinCount: 1,
				rules: rules,
				detailText: detailText
			}
		},
		components:{
			uniTitle
		},
		methods: {
			toPage(){
				uni.navigateTo({
					url:'/pages/userCenterList/userCenterList?type=invite'
				})
			},
			invite() {
				console.log('去邀请')
			}
		}
	}
</script>

<style lang="scss">
	.bg_wrapper{
		height: 1088upx;
		position: relative;
	}
	.bg{
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right:0;
	}
	.bg_img{
		height: 1088upx;
		width: 100%;
	}
	.invite_btn{
		position: absolute;
		bottom: 314upx;
		left: 100upx;
		right: 100upx;
		height: 100upx;
	}
	.u-txt_wrap{
		position: absolute;
		left: 0;
		right: 0;
		@include flex-center;
	}
	.u-count_wrap {
		bottom: 535upx;
	}
	.u-link_wrap{
		bottom: 488upx;
	}
	.txt{
		@include txt(30upx, #fff)
	}
	.u-link-txt{
		text-decoration: underline;
	}
	.u-rules_txt{
		@include  txt(20upx, #000);
		line-height: 30upx;
	}
	.gray-txt{
		color: $whiteTextColor
	}
</style>
