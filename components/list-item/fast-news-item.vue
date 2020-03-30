<template>
    <view class="media-item view list_item_wrap" @click="gotoDetail(newsItem.id, newsItem.type)">
		<view class="content_wrapper">
			<text class="media-title list_item_black_title_base">{{newsItem.name}}</text>
			<view class="media-info flex-row space_between">
				<!-- <text class="list_item_normal_txt focus_color">快讯</text> -->
				<text class="list_item_normal_txt right_space_base">{{friendlyDate(date2tamp(newsItem.create_time))}}</text>
				<!-- 为了样式只取一条放在listitem -->
				<view>
					<operation-btns :goodCount="newsItem.good" :badCount="newsItem.bad" :showComment="false" :showShare="false" :isClick="false"></operation-btns>

				</view>
			</view>
		</view>
    </view>
</template>

<script>
	import {friendlyDate,date2tamp} from '@/common/util.js';
	import operationBtns from '@/components/operationBtns.vue';
    export default {
        props: {
            newsItem: {
                type: Object,
                default: function(e) {
                    return {}
                }
            },
        },
		components:{
			operationBtns
		},
		mixins:[friendlyDate,date2tamp],
		created() {
		},
        methods: {
            gotoDetail(id, type) {
				let url = '/pages/details/fastNewsDetail?id='+id
				uni.navigateTo({url});
            },
        }
    }
</script>

<style scoped lang="scss">
    .media-item {
        position: relative;
    }
	.content_wrapper{
		flex: 1;
	}
	.image{
	    width: 214upx;
	    height: 144upx;
	}
	.img_wrapper {
		@extend .image;
		margin-left: $space-padding;
	}
    .media-title {
		flex: 1;
		@include more_line_ellipsis;
    }
    .media-info {
		display: flex;
        flex-direction: row;
        align-items: center;
    }
</style>
