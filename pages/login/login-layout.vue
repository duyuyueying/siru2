<template>
	<view class="login_container">
		<view class="top-section">
			<view class="img_wrap">
				<image src="/static/logo.png" mode="" class="img"></image>
			</view>
			<view class="prompt" v-if="showPrompt">
				<text class="normal_txt" v-if="isLogin">未注册用户验证手机号即可自动创建账号，登录后可前往个人中心内设置密码</text>
				<text class="normal_txt" v-else>通过验证注册手机号即可重新设置新的密码</text>
			</view>
			<view class="prompt" v-else>
			</view>
			<slot name="input"></slot>
		</view>
		<view class="bottom_section">
			<slot name="submit"></slot>
			<view class="flex_row space_between login_style_wrap" v-if="showLoginStyle">
				<view class="flex1 flex_row_center" @click="toPassWordLogin" v-if="type=='code'"><text class="bottom_txt">账号密码登录</text></view>
				<view class="flex1 flex_row_center" @click="goBack" v-else><text class="bottom_txt">验证码登录</text></view>
				<view class="flex_row flex1 flex_row_center" @click="weChatLogin">
					<image src="/static/social/wechat.png" mode="" class="img_wechat"></image>
					<text class="bottom_txt">微信登录</text></view>
			</view>
			<view class="login_style_wrap" v-else></view>
			<view class="bottom_txt_wrap" v-if="showBottom">
				<text class="bottom_txt">
					登录即代表您同意我们《<text class="focus_color" @click="gotoPolicy('services')">服务协议</text>》与《<text class="focus_color" @click="gotoPolicy('policy')">隐私条款</text>》
				</text>
			</view>
			<view class="bottom_txt_wrap" v-else>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			showPrompt:{
				type: Boolean,
				default: true
			},
			showBottom: {
				type: Boolean,
				default: true
			},
			isLogin: {
				type: Boolean,
				default: true,
			},
			showLoginStyle: {
				type: Boolean,
				default: true,
			},
			type: {
				type: String,
				default: 'code',
			}
		},
		created() {
			console.log(this)
		},
		methods:{
			input() {
				
			},
			weChatLogin() {
				uni.showToast({
					icon: 'none',
					title: '微信登录'
				})
			},
			toPassWordLogin() {
				uni.navigateTo({
					url: '/pages/login/passwordLogin'				
				})
			},
			gotoPolicy(type) {
				uni.navigateTo({
					url: '/pages/policy/policy?type='+type	
				})
			},
			goBack() {
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="scss">
	.login_container{
	
		background-color: #fff;
		padding: $space-lg;
	}
	.img{
		height: 44upx;
		width: 244upx;
	}
	
	.img_wechat{
		width: 60upx;
		height: 60upx;
		margin-right: 20upx;
	}
	.prompt{
		height: 80upx;
		margin: 40upx 0;
	}
	.login_style_wrap{
		height: 40upx;
	}
	.bottom_section{
		position: absolute;
		width: 100%;
		bottom: 40px;
		left: 0;
	}
	.bottom_txt_wrap{
		height: 40upx;
		padding: 0 $space-lg;
		margin-top: 50upx;
	}
	.bottom_txt{
		font-size: 30upx;
		color: #b0b0b0;
		font-family: PingFang SC,Lantinghei SC,Helvetica Neue,Helvetica,Arial,Microsoft YaHei,"sans-serif"
	}
</style>
