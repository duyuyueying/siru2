<template>
	<view class="detail_page container">
		<view class="banner" auto-focus>
			<view class="title-area">
				<text class="title-text">{{detail.name}}</text>
			</view>
		</view>
		<view style="padding: 30upx"><text class="txt mr20">{{friendlyDate(date2tamp(detail.create_time))}}</text></view>
		<view class="article-content">
			<rich-text :nodes="content" class="content"></rich-text>
		</view>
	</view>
</template>

<script>
	// #ifdef APP-PLUS
	const dom = weex.requireModule('dom');
	// #endif
	import htmlParser from '@/common/html-parser.js';
	import {friendlyDate, date2tamp} from '@/common/util.js';
	const FAIL_CONTENT = '<p>获取信息失败1</p>';
	export default {
		data() {
			return {
				id: '', // 文章id
				content: [],
				detail: {},
			}
		},
		mixins:[friendlyDate,date2tamp],
		onLoad(event) {
			this.id = 248;
			// this.id = event.id;
			let _this = this;
			this.getDetail();
		},
		methods: {
			// 获取文章详情
			async getDetail() {
				let content = FAIL_CONTENT
				try{
					this.$api.article_info(this.id).then(data => {
						if (data && data.code === 200) {
							const nodes = htmlParser(data.result.content);
							this.content = nodes;
							this.detail = data.result;
						} else {
							this.$message(data.msg, function () {
								uni.navigateBack({
									delta: 1
								});
							})
						}
					})
				} catch (e){

				}
			},
		},
	}
</script>

<style lang="scss" scoped>
	
	/* #ifndef APP-PLUS */
	page {
		min-height: 100%;
	}
	/* #endif */
	.detail_page{
		position: relative;
		margin-bottom: 50px;
	}
	.banner{
		padding: 0upx $space-lg;
		background-color: #fff;
	},
	.title-text {
		font-size: 40upx;
		font-weight: bold;
		line-height: 58upx;
		color: #000;
	}
	.article-content {
		padding: 0 $space-lg;
		overflow: hidden;
		background-color: #fff;
		text-align: justify;
		position: relative;
	}
	.content {
		font-size: 28upx;
		line-height: 58upx;
		color: #29293b;
		font-family: PingFang SC,Lantinghei SC,Helvetica Neue,Helvetica,Arial,Microsoft YaHei,"sans-serif"
	}
	/deep/ .article-content p{
		margin: $space-lg 0;
		color: #29293b;
		line-height: 58upx;
		word-break: break-word;
	}
	/deep/ .article-content img{
		display: block;
		width: 100%;
		margin: 0 auto;
	}
	.txt {
		font-size: 26upx;
		color: #a0a0a0;
		line-height: 40upx;
	}
</style>
