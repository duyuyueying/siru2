<template>
    <view class="media-item view list_item_wrap" @click="gotoDetail(newsItem.id, 'https://www.baidu.com')">
		<view class="content_wrapper">
			<text class="media-title list_item_black_title_base">{{newsItem.title}}</text>
			<view class="media-info flex-row space_between">
				<text class="list_item_normal_txt right_space_base">{{friendlyDate(newsItem.issuetime || newsItem.datetime)}}</text>
			</view>
		</view>
    </view>
</template>

<script>
	import {friendlyDate} from '@/common/util.js';
    export default {
        props: {
            newsItem: {
                type: Object,
                default: function(e) {
                    return {}
                }
            },
			isLink: {
				type: Boolean,
				default: true
			}
        },
		mixins:[friendlyDate],
		created() {
		},
        methods: {
            gotoDetail(id, url) {
				// 如果是链接就打开外链
				//TODO:暂时不支持打开公告(原为跳转到fxh静态页面)
				return
				if(this.isLink) {
					// #ifdef  APP-PLUS
					plus.runtime.openURL(url);
					// #endif
				} else {
					let url = '/pages/details/announce-detail?id='+id
					uni.navigateTo({url});
				}
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
