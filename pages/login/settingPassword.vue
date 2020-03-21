<template>
	<view class="container">
		<view class="title"><text >设置密码</text></view>
		<view class="flex1">
			<input type="password" class="u-input" placeholder="请输入新密码" v-model="password">
		</view>
		<view class="flex1">
			<input type="password" class="u-input" placeholder="请再次输入新密码" v-model="comfirmPassword">
		</view>
		<view class="submit_btn" @click="submit" :style="{backgroundColor: (password != '' && comfirmPassword != '') ? '#FFB100':'#fafafa'}">
			<text class="submit_btn_txt" :style="{color: (password != '' && comfirmPassword != '') ? '#fff':'#5d6368'}">完成</text>
		</view>
	</view>
</template>

<script>
	import loginLayout from '@/pages/login/login-layout.vue';
	export default {
		data() {
			return {
				comfirmPassword: '',
				password: '',
			}
		},
		components:{
			loginLayout
		},
		methods: {
			submit() {
				uni.showToast({
					title: '密码设置成功！前去登录'
				});
				uni.navigateBack({
					delta:3
				});
			},
			gotoForget() {
				uni.navigateTo({
					url: '/pages/login/forget'
				})
			}
		}
	}
</script>

<style lang="scss">
	.container{
		background-color: #fff;
		padding: $space-lg;
	}
	.title{
		font-size: 50upx;
		margin: 50upx 0;
	}
.u-input{
	height: 50upx;
	@include sideBorder($color: #edf0f2);
	@include txt(26upx);
	padding: $space-base $space-lg;
	text-align: left;
	margin-bottom: 20upx;
}
.submit_btn{
	margin: 0 40upx 50upx;
	height: 78upx;
	line-height: 78upx;
	background-color: #fafafa;
	text-align: center;
	border-radius: 4upx;
}
.submit_btn_txt{
	color: #5d6368;
	font-size: 26upx;
}
</style>
