<template>
	<view class="table_head">
		<view class="flex flex_row">
			<view class="flex5" @click="onClick"><slot></slot></view>
			<view class="flex6"><text class="normal_txt">价格</text></view>
			<view class="flex4"><text class="normal_txt">24h涨跌幅</text></view>
		</view>
	</view>
</template>

<script>
	export default {
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
		height: 32px;
		background-color: $bgColor;
		justify-content: center;
		padding: 0 $space-lg;
	}
</style>
