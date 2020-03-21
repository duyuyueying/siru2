<template>
	<view class="base_info_box">
		<view class="flex_row">
			<view class="label_key"><text class="lable_key_txt">{{name}}</text></view>
			<view class="flex1">
				<navigator url="link_url" v-if="isLink" cLass="link_txt">{{value}}</navigator>
				<text class="list_item_black_title_sm" v-else>{{value}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			name: String,
			isLink: {
				type: Boolean,
				default: false,
			},
			value: String,
			link_url: String
		}
	}
</script>

<style lang="scss">
	.base_info_box{
		padding: $space-lg;
		background-color: #fff;
		@include sideBorder;
	}
	.label_key{
		width: 200upx;
	}
	.lable_key_txt{
		@include txt(30upx, #a0a0a0);
	}
	.link_txt{
		@include txt(30upx, #489aff);
	}
</style>
