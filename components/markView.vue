<template>
	<view class="mark" :style="{backgroundColor: isUp > 0 ? upTheme.bg : downTheme.bg}" @click.stop="onClick">
		<text class="makt_txt" :style="{color: isUp > 0 ? upTheme.txt : downTheme.txt}">{{item.name}}</text>
		<view class="flex_row ml20">
			<text class="makt_txt" :style="{color: isUp > 0 ? upTheme.txt : downTheme.txt}">{{start - end}}.75%</text>
			<icons :type="isUp > 0 ? 'up' : 'down'" size="12" :color="isUp > 0 ? upTheme.txt : downTheme.txt" ></icons>
		</view>
	</view>
</template>

<script>
	import icons from '@/components/icons/icons.vue';
	import {mapState} from 'vuex';
	export default {
		components:{
			icons
		},
		props: {
			item: {
				type: Object,
				default: function() {
					return {}
				}
			},
			// 币的开市价格
			start : {
				type: [Number,String],
				default: 0
			},
			// 币的关市价格
			end: {
				default: 0,
				type: [Number,String],
			}
		},
		methods:{
			onClick() {
				let symbol = this.item.name || '';
				let exChangeName = this.item.exChange || '';
				uni.navigateTo({
					url: '/pages/quotations/coinDetail?symbol='+symbol+'&exChangeName='+exChangeName
				});
			}
		},
		computed: {
			...mapState(['upTheme', 'downTheme']),
			isUp(){
				return (this.end - this.start) > 0;
			}
		}
	}
</script>

<style lang="scss">
	.mark{
		display: flex;
		flex:1;
		// min-width: 168upx;
		padding: 10upx;
		justify-content: space-between;
		flex-direction: row;
	}
	.ml20{
		margin-left: $space-base;
	}
	.makt_txt{
		font-size: 20upx;
	}
	.greenBg {
		background-color: #d7f0db;
	}
	.greenColor {
		color: #39b54a;
	}
	.redBg{
		background-color: #fadbd9
	}
	.redColor {
		color: #e54d42
	}
	.iconfont{
		font-family: iconfont;
		font-size: 30upx;
	}
</style>
