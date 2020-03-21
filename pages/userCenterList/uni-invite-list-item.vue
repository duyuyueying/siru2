<template>
    <view class="list_item_wrap item_wrap">
		<view class="img_wrapper">
			<image class="image-list1" src="../../static/temp/avatar.jpeg"></image>
		</view>
		<view class="flex2">
			<text class="list_item_black_title_sm">{{item.name}}</text>
		</view>
		<view class="flex2">
			<text class="list_item_normal_txt">{{moment(item.time)}}</text>
		</view>
		<view class="flex1 textRight">
			<text class="list_item_normal_txt heavy focus_color">+5</text>
		</view>
    </view>
</template>

<script>
	import moment from 'moment';
    export default {
        props: {
            item: Object,
        },
        methods: {
			moment(time) {
				return moment(time).format('YYYY-MM-DD hh:mm')
			}
        }
    }
</script>

<style scoped lang="scss">
	.item_wrap{
		align-items: center;
	}
	
	.img_wrapper {
		width: 60upx;
		height: 60upx;
		margin-right: 15upx;
		position: relative;
		z-index: 10;
	}
	.textRight{
		text-align: right;
	}
	.image-list1 {
	    @include circle(60upx);
	}
	.btn_txt{
		color: #f39700;
		font-size: 24upx;
		text-align: center;
		line-height: 55upx;
	}
</style>
