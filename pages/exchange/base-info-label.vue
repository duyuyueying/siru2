<template>
	<view class="base_info_box">
		<view class="flex_row">
			<view class="label_key"><text class="lable_key_txt">{{name}}</text></view>
			<view class="flex1" v-if="typeof value == 'string'">
				<text class="list_item_black_title_sm">{{value}}</text>
			</view>
			<view class="flex1" v-else>
				<text class="link_txt" v-for="(item,index) in value" :key="index" @click="openUrl(item.url)">{{item.name}}</text>
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
			value: {
				type: [String, Array]
			},
			link_url: String
		},
		methods:{
			openUrl(url) {
				if(!this.isLink) {
					return;
				}
				// #ifdef  APP-PLUS
				plus.runtime.openURL(url);
				// #endif
			}
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
		margin-right: 8upx;
	}
</style>
