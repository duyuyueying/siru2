<template>
		<view class="media-item">
			<view class="link_wrapper" v-for="(item, index) in items" :key="index" :style="{marginRight: index == 0 ? '30upx' : '0upx'}"  @tap="gotoDetail" hover-class="hover">
				<view class="content_wrapper flex_row" >
					<text class="list_item_black_title_base right_space_base">{{item.name}}</text>
					<text class="tag" v-if="item.number>49">热</text>
				</view>
				<view class="btn_wrapper"  @tap.stop="focus(item)" >
					<text :class="{isFocus:item.is_follow}">{{item.is_follow ? '-' : '+'}}</text>
				</view>
			</view>
		</view>
    
</template>

<script>
    export default {
		data() {
			return {
				isFocus: [false, false]
			}
		},
        props: {
            items: {
                type: Array
            }
        },
		created() {
			// 这里需要根据接口返回来的关注人的列表判断当前这个人是否被关注过
			// this.isFocus = [this.items[0].focus || false, this.items[1].focus || false];
		},
        methods: {
			// 关注
            focus(item) {
				// this.isFocus = !this.isFocus;
				this.$api.follows_tag(item.id).then(data => {
					if (data && data.code === 200) {
						item.is_follow = data.result
					}
				})
			},
			gotoDetail() {
				uni.navigateTo({
					url: '/pages/tagPage/tagPage'
				})
			}
        }
    }
</script>

<style scoped lang="scss">
    .media-item {
        flex: 1;
        flex-direction: row;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: $space-base $space-base 0 $space-base;
    }
	.link_wrapper{
		display: flex;
		flex-direction: row;
		padding: 25upx;
		border-width: 1px;
		border-style: solid;
		border-color: #eee;
		border-radius: 8upx;
		flex: 1;
	}
	.content_wrapper{
		flex: 1;
		align-items: center;
	}
	.tag {
		display: inline-block;
		background-color: $mainColor;
		color: #fff;
		font-size: 18upx;
		padding: 6upx;
	}
	.btn_wrapper{
		width: 50upx;
		text-align: right;
		justify-content: center;	
	}

</style>
