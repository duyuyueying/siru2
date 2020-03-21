<template>
	<view class="header" :style="{height:height+'upx'}" @click="onClick">
		<text class="header_txt" :style="{fontSize:size+'upx',fontWeight: isBold ? 'bold' : 'normal', color: color}">{{title}}</text>
		<slot></slot>
	</view>
</template>

<script>
	export default {
		props: {
			title: String,
			height: {
				type: [String, Number],
				default: 80
			},
			size: {
				type: [String, Number],
				default: 30
			},
			headLeftTxt: {
				type: String,
			},
			isBold: {
				type: Boolean,
				default: true
			},
			color: {
				type: String,
				default: '#000'
			}
		},
		methods:{
			headTap() {
				console.log('xxxxxxxxx');
				this.$emit('headTap');
			},
			onClick(){
				this.$emit('click');
			}
		}
	}
</script>

<style lang="scss">
	.header{
		background-color: $whiteColor;
		padding: 0 $uni-spacing-row-lg;
		@include flex-center($justify:space-between);
	}
	.header_txt{
		color: $blackColor;
		font-weight: bold;
	}
	.m-head_left{
		width: 150upx;
		@include flex-center($justify:flex-end);
		
	}
	.m-head_left_text{
		@include txt;
	}
</style>
