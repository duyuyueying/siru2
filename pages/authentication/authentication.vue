<template>
	<view>
		<view class="pad30" v-if="show">
			<text class="foucs_title">如何开通我的专栏</text>
			<text class="focus_txt">实名认证后开通“我的专栏”，登录思如科技官网投稿发布到思如科技平台，“我的专栏”可查看发布文章与粉丝信息</text>
		</view>
		<view class="list" v-for="(item,index) in list" :key="index">
			<view class="media-item">
					<view class="img_wrapper">
						<image class="image-list1" :src="'../../static/authentication/'+item.icon_name"></image>
					</view>
					<view class="content_wrapper">
						<view class="flex_row">
							<text class="info-text title_txt">{{item&&item.name}}</text>
						</view>
						<text class="info-text">{{item.description}}</text>
					</view>
			    <view class="media-item-line"></view>
				<picker :range="authenticationType" range-key="name" @change="changePicker" v-if="index == 0" class="picker"></picker>
			</view>
		</view>
		<uni-title title="温馨提示" size="26"></uni-title>
		<view class="pad30"><text class="info-text" style="color:#a0a0a0;">{{detailText.announce5}}</text></view>
	</view>
	
</template>

<script>
	import uniTitle from '@/components/uni-title.vue';
	import {detailText} from '@/common/config.js';
	const LIST_ITEEMS = [
		{name:'个人认证', description: '适合行业专家，意见领袖，评论家及自媒体人士申请',icon_name: 'personal.png'},
		// {name:'企业认证', description: '适合企业，公司，分支机构，企业相关品牌，产业与服务等', icon_name: 'company.png'},
		// {name:'媒体认证', description:'适合各类媒体及有新闻资质的网站等内容生产公司/机构申请', icon_name: 'media.png'},
	];
	const AUTHENTICATION_TYPE = [{
		name: '身份证',
		type: 'IDCard'
	},{
		name: '港澳来往大陆通行',
		type: 'HongkongPass'
	},{
		name: '台湾来往大陆通行',
		type: 'TaiwanPass',
	},
	{
		name: '护照',
		type: 'passport'
	}];
	export default {
		data() {
			return {
				list: LIST_ITEEMS, // 列表内容
				detailText: detailText, // 提示信息 
				authenticationType: AUTHENTICATION_TYPE, //个人认证类型
				show: true,
			}
		},
		components:{
			uniTitle,
		},
		onLoad(query){
			this.show = !!query.show
		},
		methods: {
			// 用户点击列表项
			toPage(type){
				uni.navigateTo({
					url: '/pages/authentication/authenticationInput?type='+type
				})
			},
			changePicker(e) {
				const currValue = this.authenticationType[e.detail.value];
				if(currValue.type === 'IDCard' ) {
					uni.showToast({
						title: '去人脸识别'
					});
				} else {
					this.toPage(currValue.type);
				}
			}
		}
	}
</script>

<style lang="scss">
	.media-item {
		@extend .flex1;
		@extend .flex_row;
		justify-content: space-between;
		padding: $space-lg;
	}
	.media-item-line {
		position: absolute;
		left: 30upx;
		right: 30upx;
		bottom: 0;
		height: 1upx;
		background-color: #ebebeb;
	}
	.image-list1 {
		width: 100upx;
		height: 100upx;
	}
	.img_wrapper {
		@extend .image-list1;
		margin-right: 40upx;
	}
	.content_wrapper{
		flex: 1;
		justify-content: space-between;
	}
	.info-text {
		@include txt($color: #868e96);
	}
	.title_txt{
		@include txt(32upx, #000);
	}
	.foucs_title{
		@include txt(30upx, $mainColor);
		line-height: 70upx;
	}
	.focus_txt {
		@include txt($color:  $mainColor);
		line-height: 34upx;
	}
	.picker{
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 20;
	}
</style>
