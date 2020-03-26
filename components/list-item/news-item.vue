<template>
    <view class="media-item view list_item_wrap" @click="gotoDetail(newsItem.id, newsItem.type)">
		<view class="content_wrapper">
			<text class="media-title list_item_black_title_base">{{newsItem.name}}</text>
			<view class="media-info flex-row">
				<text v-if="newsItem.live && showTag" class="list_item_normal_txt focus_color right_space_base">直播</text>
				<text v-if="newsItem.recommend && showTag" class="list_item_normal_txt focus_color right_space_base">推广</text>
				<text v-if="newsItem.onlyOne && showTag" class="list_item_normal_txt focus_color right_space_base">独家</text>
				<text v-if="newsItem.depth && showTag" class="list_item_normal_txt focus_color right_space_base">深度</text>
				<text class="list_item_normal_txt right_space_base" v-if="showSource">来源</text>
				<text class="list_item_normal_txt right_space_base" v-if="newsItem.author.nickname && showAuthor">{{newsItem.author.nickname}}</text>
				<text class="list_item_normal_txt right_space_base">{{friendlyDate(date2tamp(newsItem[timeStyle]))}}</text>
				<!-- 为了样式只取一条放在listitem -->
				<view v-if="(newsItem.coins && (newsItem.coins.length > 0)) && showCoins">
					<mark-view 
						:end="newsItem.coins[0].endPrice"
						:start="newsItem.coins[0].startPrice"
						:item = "newsItem.coins[0]"
						></mark-view >
				</view>
			</view>
		</view>
		<view class="img_wrapper" v-if="showImg">
			<image class="image"
				v-if="newsItem.img_src" :src="newsItem.img_src" mode="aspectFill"></image>
		</view>
    </view>
</template>

<script>
	import markView from '@/components/markView.vue';
	import {friendlyDate,date2tamp} from '@/common/util.js';
    export default {
        props: {
            newsItem: {
                type: Object,
                default: function(e) {
                    return {}
                },
				author:{
					nickname:''
				}
            },
			// 是否需要展示图片
			showImg: {
				type: Boolean,
				default: true
			},
			// 是否需要显示标签
			showTag: {
				type: Boolean,
				default: true
			},
			// 是否需要显示来源
			showSource:{
				type: Boolean,
				default: true,
			},
			// 是否需要显示作者
			showAuthor:{
				type: Boolean,
				default: true,
			},
			// 是否需要显示币的请求
			showCoins: {
				type: Boolean,
				default: true
			},
			timeStyle: {
				type: String,
				default: 'create_time'
			}
        },
		components:{
			markView
		},
		mixins:[friendlyDate,date2tamp],
		created() {
		},
        methods: {
            gotoDetail(id, type) {
				let url = '';
				if(type === 'specialTopic') {
					url = '/pages/specialTopic/specialTopic?id='+id
				} else if(type === 'fastNews'){
					url = '/pages/details/fastNewsDetail?id='+id
				} else {
					let type = this.newsItem.type == 3 ? 'vedio' : 'news';
					url = '/pages/details/details?id='+id+'&type=' + type
				}
				uni.navigateTo({url});
            },
            close(e) {
                e.stopPropagation();
                this.$emit('close');
            }
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
