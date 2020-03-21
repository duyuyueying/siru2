<template>
	<view class="table_head">
		<view class="flex flex_row">
			<view class="flex2"><text class="normal_txt">{{items[0]}}</text></view>
			<view class="flex2"><text class="normal_txt">{{items[1]}}</text></view>
			<view class="flex1"><text class="normal_txt">{{items[2]}}</text></view>
			
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			items: Array
		},
		methods:{
			onClick() {
				this.$emit('headClick');
			}
		}
	}
</script>

<style lang="scss">
	@import '@/common/quotations.scss';
	.table_head{
		height: 64upx;
		background-color: $bgColor;
		justify-content: center;
		padding: 0 $space-lg;
		line-height: 64upx;
	}
</style>
