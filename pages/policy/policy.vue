<template>
	<view class="box">
		<rich-text :nodes="data" class="content"></rich-text>
	</view>
</template>

<script>
	import htmlParser from '@/common/html-parser.js';
	export default {
		data() {
			return {
				data: ''
			}
		},
		onLoad(e) {
			if(e.type == 'policy'){
				uni.setNavigationBarTitle({
					title:'隐私政策'
				});
			} else {
				uni.setNavigationBarTitle({
					title:'服务协议'
				});
			}
			this.$api.get_pages(e.type).then(data => {
				if (data && data.code === 200) {
					this.data = data.result.content;
					// this.data = htmlParser(data.result);
				} else {
				}
			})
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.box{
		padding: 0 $space-lg;
		background-color: #fff;
	}
.content{
	font-size: 28upx;
	line-height: 46upx;
	color:#000;
}
/deep/ .content p{
	margin: $space-lg 0;
	word-break: break-word;
}
</style>
