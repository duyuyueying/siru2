<template>
	<view class="container">
		<view class="flex_row_center">
			<image class="logo_img" src="../../static/logo.png"></image>
		</view>
		<view class="main">
			<view class="txt_wrap flex_column">
				<text class="black_txt" @longpress="copy('xxxx@xxx.com')">媒体合作：xxxx@xxx.com</text>
				<text class="black_txt" @longpress="copy('xxxx@xxx.com')">市场合作：xxxx@xxx.com</text>
				<text class="black_txt" @longpress="copy('xxxx@xxx.com')">广告合作 微信：xxxx@xxx.com</text>
			</view>
			<text class="normal_txt">注：长按复制联系方式</text>
			
			<view class="btn_section">
				<view class="submit_btn" @click="checkVersion" :style="{backgroundColor: '#FFB100'}">
					<text class="submit_btn_txt" :style="{color: '#fff'}">检查更新</text>
				</view>
				<view class="submit_btn" @click="functionIntro" :style="{backgroundColor: '#fff',borderColor: '#aaa'}">
					<text class="submit_btn_txt" :style="{color: '#333'}">功能介绍</text>
				</view>
			</view>
		
		</view>
		<view class="footer">
			<text class="normal_txt">思如科技：V{{version}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				version: '0.0.0'
			};
		},
		onLoad() {
			let _this = this;
			let version
			// #ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid,(info)=>{
				console.log(typeof info.version, this.version)
				// version = info.version;
				// this.version = '1111';
			})
			// #endif
		},
		methods:{
			copy(content) {
				uni.showToast({
					title: '内容已复制',
					icon: 'none'
				})
			},
			checkVersion() {
				console.log('xxxxx');
				let appid = plus.runtime.appid;
				if (appid && appid.toLocaleLowerCase() != "hbuilder") {
					uni.request({
						url: 'https://uniapp.dcloud.io/update', //检查更新的服务器地址
						data: {
							appid: plus.runtime.appid,
							version: plus.runtime.version
						},
						success: (res) => {
							if (res.statusCode == 200 && res.data.isUpdate) {
								let openUrl = plus.os.name === 'iOS' ? res.data.iOS : res.data.Android;
								// 提醒用户更新
								uni.showModal({
									title: '更新提示',
									content: res.data.note ? res.data.note : '是否选择更新',
									success: (showResult) => {
										if (showResult.confirm) {
											plus.runtime.openURL(openUrl);
										}
									}
								})
							}
						}
					})
				}
			}
		}
		
	}
</script>

<style lang="scss">
	page, container {
		background-color: #fff;
		height: 100%;
	}
	.logo_img{
		width: 488upx;
		height: 168upx;
		margin: 50upx auto;
	}
	.black_txt{
		font-size: 26upx;
	}
	.main{
		@include flex-center(column);
		line-height: 60upx;
	}
	.submit_btn{
		margin: 0 40upx;
		width: 280upx;
		height: 68upx;
		line-height: 58upx;
		background-color: #fafafa;
		text-align: center;
		border-radius: 4upx;
		margin-top: $space-lg;
		border: 2upx solid $mainColor;
	}
	.submit_btn_txt{
		font-size: 26upx;
	}
	.footer{
		position: absolute;
		bottom: 20upx;
		left: 0;
		right: 0;
		height: 60upx;
		background-color: #fff;
		text-align: center;
	}
</style>
