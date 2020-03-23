<template>
	<view class="container">
		<view class="flex_column bg_wrapper">
			<view class="img_wrapper">
				<image class="image-list1" src="../../static/temp/avatar.jpeg"></image>
				<view class="mask" @click="goCrop"><icons type="picture" color="#fff" size="24"></icons></view>
			</view>
		</view>
		<view class="input_wrap flex_row">
			<view class="label_wrap"><text class="list_item_black_title_sm">昵称</text></view>
			<input type="text" class="u-input" placeholder="手机号" v-model="nikeName">
		</view>
		<view class="input_wrap flex_row mb20" style="position: relative;">
			<view class="label_wrap"><text class="list_item_black_title_sm">性别</text></view>
			<input type="text" class="u-input" placeholder="手机号" v-model="sex">
			<picker :range="['男','女']" class="picker" @change="modifySex"></picker>
		</view>
		<view class="input_wrap flex_row">
			<view class="label_wrap"><text class="list_item_black_title_sm">Title</text></view>
			<input type="text" class="u-input" placeholder="请填写您的职位" v-model="position">
		</view>
		<view class="input_wrap flex_row">
			<view class="label_wrap"><text class="list_item_black_title_sm">介绍</text></view>
			<input type="text" class="u-input" placeholder="请填写您的个人介绍" v-model="profile">
		</view>
		<view class="input_wrap flex_row">
			<view class="label_wrap"><text class="list_item_black_title_sm">手机号</text></view>
			<input type="text" class="u-input" placeholder="请填写您的手机号" v-model="phoneNumber">
		</view>
		<view class="input_wrap flex_row">
			<view class="label_wrap"><text class="list_item_black_title_sm">微信号</text></view>
			<input type="text" class="u-input" placeholder="请填写您的微信号" v-model="wechat">
		</view>
		<view class="input_wrap flex_row">
			<view class="label_wrap"><text class="list_item_black_title_sm">公众号</text></view>
			<input type="text" class="u-input" placeholder="请填写您的公众号" v-model="wechat">
		</view>
		<view class="input_wrap flex_row">
			<view class="label_wrap"><text class="list_item_black_title_sm">Twitter</text></view>
			<input type="text" class="u-input" placeholder="请填写您的Twitter" v-model="twitter">
		</view>
		<view class="input_wrap flex_row mb20">
			<view class="label_wrap"><text class="list_item_black_title_sm">邮箱</text></view>
			<input type="text" class="u-input" placeholder="请填写您的邮箱" v-model="email">
		</view>
		
		<view class="submit_btn" @click="submit" :style="{backgroundColor:'#FFB100'}">
				<text class="submit_btn_txt" :style="{color:  '#fff'}">提交</text></view>
		
	</view>
</template>

<script>
	import {focusAuthor, newsItems} from '@/mock/data.js';
	import  {identification} from '@/common/config.js';
	import tabs from '@/components/tabs.vue';
	import uniTitle from '@/components/uni-title.vue';
	import newsItem from '@/components/list-item/news-item.vue';
	import icons from '@/components/icons/icons.vue';
	import {loadMore} from '@/common/util.js';
	import {uniPopup} from '@dcloudio/uni-ui';
	
	export default {
		data() {
			return {
				data: focusAuthor,
				nikeName: '',
				sex: '',
				position: '',
				phoneNumber: '',
				wechat: '',
				email: '',
				twitter: '',
				profile: '',
			}
		},
		components:{
			tabs,
			uniTitle,
			newsItem,
			icons,
			uniPopup
		},
		onLoad() {
		},
		onShareAppMessage() {
			console.log('分享...');
		},
		onNavigationBarButtonTap(e) {
			if(e.text == '关注') {
				
			}
			console.log(e);
		},
		methods: {
			goCrop() {
				let _this = this;
				uni.chooseImage({
					sizeType:['copressed'],
					success(res) {
						let imagPath = res.tempFilePaths;
						_this.isTap = false;
						uni.navigateTo({
							url: '/pages/crop/crop?imagePaht='+imagPath+'&type=self'
						})
					}
				})
				
			},
			modifySex(e) {
				let value = e.detail.value;
				this.sex = ['男','女'][value];
			},
			submit() {
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="scss">
	page,.container,{
		height: 100%;
		background-color: #f5f5f5;
		// overflow: hidden;
	}
	.bg_wrapper{
		height: 230upx;
		background-color: #fff;
		align-items: center;
		margin-bottom: $space-sm;
	}
	.img_wrapper {
		margin: $space-base;
		width: 160upx;
		height: 160upx;
		position: relative;
		z-index: 10;
	}
	.image-list1, .mask {
	    @include circle(160upx);
	}
	.mask{
		position: absolute;
		top:0;
		background-color: rgba(0,0,0,.5);
	}
		
	.input_wrap{
		@include sideBorder($color: #edf0f2);
		padding: $space-base $space-lg;
		height: 50upx;
		background-color: #fff;
	}
	 .u-input{
		// height: 50upx;
		// @include sideBorder($color: #edf0f2);
		@include txt(26upx, #000);
		@extend .flex;
		flex: 1;
		height: 50upx;
		// padding: $space-base $space-lg;
		text-align: left;
	}
	.label_wrap{
		width: 150upx;
		line-height: 50upx;
	}
	.mb20{
		margin-bottom: 20upx;
	}
	.submit_btn{
		margin: 0 auto;
		height: 78upx;
		line-height: 78upx;
		width: 300upx;
		background-color: #fafafa;
		text-align: center;
		border-radius: 4upx;
	}
	.submit_btn_txt{
		color: #5d6368;
		font-size: 26upx;
	}
	.picker{
		width: 100%;
		height: 100%;
		// background-color: red;
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
	}
</style>
