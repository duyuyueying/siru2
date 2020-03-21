<template>
	<view class="" @click="goPage">
		<view class="timer_wrap"><text class='normal_txt'>2019-12.14 14:00</text></view>
		<view class="card_wrap">
			<view class="content_wrap">
				<text class="list_item_black_title_sm">
					跟欧盟其他兄弟相比，面条家算是靠谱了，民众虽然不太给力，但总比隔壁高卢好吧？现在为止，真正比较靠谱的政府，除了我国以外。
					韩国 新加坡 越南 然后就算意大利了。从某种程度来说，肯奋起一战的面条，真比一群躺平的兄弟姐妹强多了。
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
		methods:{
			goPage() {
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
