<template>
	<view class="section_head">
		<text class="head_txt">{{title}}</text>
		<!-- <view class="media-item-line">111</view> -->
		<slot></slot>
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
	height: 48px;
	line-height: 48px;
	background-color: #f9f9f9;
	position: relative;
	display: flex;
	padding: 0 $space-lg;
	justify-content: space-between;
}
.head_txt{
	color: #000;
	font-weight: bold;
	font-size: 28upx;
	
	// margin-left: 30upx;
}
.media-item-line {
	// position: relative;
	// left: 0upx;
	// top: 10upx;
	// bottom: 10upx;
	// width: 20upx;
	// height: 20upx;
	// width: 8px;
	// background-color: #000;
	// z-index: 100;
}
</style>
