<template>
	<view class="container">
		<view class="flex_column bg_wrapper">
			<view class="img_wrapper">
				<image class="image-list1" :src="userForm.avatar_src!=''?userForm.avatar_src:'../../static/temp/avatar.jpeg'"></image>
				<view class="mask" @click="goCrop">
					<icons type="picture" color="#fff" size="14"></icons></view>
			</view>
		</view>
		<view class="input_wrap flex_row">
			<view class="label_wrap"><text class="list_item_black_title_sm">昵称</text></view>
			<input type="text" class="u-input" placeholder="昵称" v-model="userForm.nickname">
		</view>
		<view class="input_wrap flex_row mb20" style="position: relative;">
			<view class="label_wrap"><text class="list_item_black_title_sm">性别</text></view>
			<input type="text" class="u-input" placeholder="性别" v-model="userForm.data.sex">
			<picker :range="['保密','男','女']" class="picker" @change="modifySex"></picker>
		</view>
		<view class="input_wrap flex_row">
			<view class="label_wrap"><text class="list_item_black_title_sm">Title</text></view>
			<input type="text" class="u-input" placeholder="请填写您的职位" v-model="userForm.data.job">
		</view>
		<view class="input_wrap flex_row">
			<view class="label_wrap"><text class="list_item_black_title_sm">介绍</text></view>
			<input type="text" class="u-input" placeholder="请填写您的个人介绍" v-model="userForm.data.profile">
		</view>
		<view class="input_wrap flex_row">
			<view class="label_wrap"><text class="list_item_black_title_sm">手机号</text></view>
			<input type="text" class="u-input" placeholder="请填写您的手机号" v-model="userForm.data.phone">
		</view>
		<view class="input_wrap flex_row">
			<view class="label_wrap"><text class="list_item_black_title_sm">微信号</text></view>
			<input type="text" class="u-input" placeholder="请填写您的微信号" v-model="userForm.data.wechat">
		</view>
		<view class="input_wrap flex_row">
			<view class="label_wrap"><text class="list_item_black_title_sm">公众号</text></view>
			<input type="text" class="u-input" placeholder="请填写您的公众号" v-model="userForm.data.wechat_official">
		</view>
		<view class="input_wrap flex_row">
			<view class="label_wrap"><text class="list_item_black_title_sm">Twitter</text></view>
			<input type="text" class="u-input" placeholder="请填写您的Twitter" v-model="userForm.data.twitter">
		</view>
		<view class="input_wrap flex_row mb20">
			<view class="label_wrap"><text class="list_item_black_title_sm">邮箱</text></view>
			<input type="text" class="u-input" placeholder="请填写您的邮箱" v-model="userForm.data.email">
		</view>
		
		<view class="submit_btn" @click="submit" :style="{backgroundColor:'#FFB100'}">
				<text class="submit_btn_txt" :style="{color:  '#fff'}">提交</text></view>
		
	</view>
</template>

<script>
	import {mapMutations, mapState} from 'vuex';
	import {focusAuthor, newsItems} from '@/mock/data.js';
	import icons from '@/components/icons/icons.vue';
	import {uniPopup} from '@dcloudio/uni-ui';
	import {isEmail, isPhone} from '@/utils/validate.js';
	
	export default {
		data() {
			return {
				userForm: {
					nickname: '',
					avatar: '',
					avatar_src: '',
					data: {
						sex: '保密',
						job: '',
						phone: '',
						wechat: '',
						wechat_official: '',
						email: '',
						twitter: '',
						profile: '',
					},
				},

				data: focusAuthor,
			}
		},
		components:{
			icons,
			uniPopup
		},
		onLoad() {
			this.init();
		},
		computed:mapState(['userInfo']),
		methods: {
			...mapMutations(['USER_INFO']),
			// 初始化
			init() {
				let userInfo = this.userInfo;

				this.userForm.nickname = userInfo.nickname || ''
				this.userForm.avatar = userInfo.avatar
				this.userForm.avatar_src = userInfo.avatar_src

				this.userForm.data = {
					sex: userInfo.data && userInfo.data.sex || '保密',
					job: userInfo.data && userInfo.data.job || '',
					phone: userInfo.data && userInfo.data.phone || '',
					wechat: userInfo.data && userInfo.data.wechat || '',
					wechat_official: userInfo.data && userInfo.data.wechat_official || '',
					email: userInfo.data && userInfo.data.email || '',
					twitter: userInfo.data && userInfo.data.twitter || '',
					profile: userInfo.data && userInfo.data.profile || '',
				}
			},
			// 去裁剪头像
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
				this.userForm.data.sex = ['男','女','保密'][value];
			},
			async submit() {
				let data = await this.$api.user_modify(this.userForm)
				if (data && data.code === 200){
					this.USER_INFO(data.result);
					this.$message("保存成功", function(){
						uni.navigateBack({
							delta:1
						})
					})
				} else {
					this.$message(data.msg)
				}
				// uni.navigateBack({
				// 	delta:1
				// })
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
