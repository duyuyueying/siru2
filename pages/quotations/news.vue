<template>
	<view>
		<text>quotations----</text>
		<!-- <news></news> -->
		<web-view :src="url" @message="receiveMsg" style="width: 730px; height: 500px"></web-view>
	</view>
</template>

<script>
	// import news from '@/pages/quotations/news.vue';
	export default {
		components: {
			// news
		},
		onLoad(option) {
			// this.url = 'https://uniapp.dcloud.io/static/web-view.html';
			this.url = '/hybrid/html/index.html?symbol=BTCUSDT';
			// this.url="https://www.baidu.com/";
			uni.setNavigationBarTitle({


				title: 'BTCUSDT'
			});
			//   this.symbol = option.symbol;
			// console.log("option:"+option.symbol)
		},
		methods: {
			receiveMsg(e) {
				uni.setStorage({
					key: 'market',
					data: e.detail.data[0],
					success: function() {
						uni.switchTab({
							url: "/pages/trade/main"
						})
					}
				});
			}
		},
		data() {
			return {
				symbol: ' ',
				url: ''
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50upx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
