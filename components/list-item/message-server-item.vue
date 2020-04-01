<template>
	<view class="" @click="goPage">
		<view class="timer_wrap"><text class='normal_txt'>{{item.update_time}}</text></view>
		<view class="card_wrap">
			<view class="content_wrap">
				<text class="list_item_black_title_sm" v-html="item.content">
				</text>
			</view>
			<uni-title title="查看详情" :isBold="false">
				<icons type="right" color='#ddd'></icons>
			</uni-title>
		</view>
	</view>
</template>

<script>
	import uniTitle from '@/components/uni-title.vue';
	import icons from '@/components/icons/icons.vue';
	export default {
		components:{
			uniTitle,
			icons
		},
		props: {
			item: Object,
		},
		methods:{
			goPage() {
				return
				uni.showToast({
					icon: 'none',
					title:'想跳转到哪儿就跳转到哪儿'
				})
			}
		}
	}
</script>

<style lang="scss">
	.timer_wrap{
		height:60upx;
		line-height: 60upx;
		text-align: center;
	}
	.card_wrap{
		background-color: #fff;
		margin: 0 $space-lg;
		border-radius: 6upx;
		overflow: hidden;
		box-shadow: 0 0 10upx rgba(0,0,5upx,.3);
	}
	.content_wrap{
		padding: $space-lg;
		@include sideBorder;
	}
</style>
