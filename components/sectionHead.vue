<template>
	<view class="section_head">
		<text class="head_txt">{{title}}</text>
		<view class="media-item-line"></view>
	</view>
</template>

<script>
	export default {
		props: {
			title: String
		}
	}
</script>

<style lang="scss">
.section_head{
	height: 60upx;
	background-color: #f9f9f9;
	position: relative;
}
.head_txt{
	color: #000;
	font-weight: bold;
	font-size: 28upx;
	line-height: 60upx;
	margin-left: 30upx;
}
.media-item-line {
	position: absolute;
	left: 0upx;
	top: 10upx;
	bottom: 10upx;
	width: 8upx;
	// height: 2upx;
	background-color: $mainColor;
	z-index: 9;
}
</style>
