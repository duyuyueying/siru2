<template>
	<view class="table_head">
		<view class="flex flex_row">
			<view class="flex3"><text class="normal_txt">排名</text></view>
			<view class="flex4"><text class="normal_txt">币种</text></view>
			<view class="flex7"><text class="normal_txt">市值/24h成交额</text></view>
			<view class="flex6"><text class="normal_txt">价格/涨跌幅</text></view>
		</view>
	</view>
</template>

<script>
	export default {

	}
</script>

<style lang="scss">
	@import '@/common/quotations.scss';

	.table_head {
		height: 64upx;
		background-color: $bgColor;
		justify-content: center;
		padding: 0 $space-lg;
	}
</style>
