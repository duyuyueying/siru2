<template>
	<view class="live_item" @click="toPage(item.id)">
		<view class="banner" auto-focus>
			<image class="banner-img" src="https://img.36krcdn.com/20200307/v2_945dcd5d78514102a1e83a016bfbb2a6_img_000" mode="aspectFill"></image>
			<view class="title-area" style="{background-color: detail.status === '未开始' ? '#e44d66': '#aaa' }">
				<view class="rotate_icon">
					<icons type="down" color="#fff" size="45"></icons>
				</view>
			</view>
		</view>
		<view class="u-head">
			<text class="u-head_title">{{item.title}}</text>
			<view class="flex_row sub_title_wrap">
				<text class="u-head_time" style="color: #333">{{item.source}}</text>
				<text class="u-head_time">{{startTime(item.time)}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import moment from 'moment';
	import icons from '@/components/icons/icons.vue';
	export default {
		data() {
			return {
				
			};
		},
		props: {
			item: {
				type: Object
			}
		},
		components:{
			icons,
		},
		onLoad(){
			console.log(this.item);
		},
		methods:{
			startTime(time) {
				return moment(time).format('YYYY-MM-DD HH:mm:ss');
			},
			toPage(id) {
				uni.navigateTo({
					url:'/pages/details/details?id='+id+'&type=video'
				})
			}
		}
	}
</script>

<style lang="scss">
	// @import '@/common/quotations.scss';
	.live_item{
		margin-bottom: $space-base;
		background-color: $whiteColor;
		padding: $space-lg $space-base;
	}
	.banner {
		height: 350upx;
		position: relative;
	}
	.banner-img {
		height: 344upx;
		width: 100%;
	}
	.title-area {
		position: absolute;
		right: 0upx;
		top: 0upx;
		left: 0upx;
		bottom: 0upx;
		z-index: 11;
		align-items: center;
		justify-content: center;
		display: flex;
	}
	.rotate_icon{
		transform: rotate(-90deg);
	}
	.u-head{
		@include flex-center(column, $align: flex-start);
		margin-top: $space-sm;
	}
	.sub_title_wrap{
		margin-top: $space-sm;
		justify-content: space-between;
		// display: flex;
		// flex: 1;
		// background-color: red;
		width: 700upx;
	}
	.u-head_title{
		color: $uni-text-color;
		font-size: 36upx;
		line-height: 52upx;
		@include more_line_ellipsis(1);
		margin-bottom: $space-sm;
	}
	.u-head_time {
		color:$whiteTextColor;
		font-size: 26upx;
		display: flex;
	}
</style>
