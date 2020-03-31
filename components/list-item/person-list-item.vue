<template>
    <view class="list_item_wrap" hover-class="hover">
		<navigator :url="'/pages/author/author?id=' + item.id" class="link_wrapper flex1" hover-class="none">
			<view class="img_wrapper">
				<image class="image-list1" :src="item.avatar_src!=''?item.avatar_src:'../../static/temp/avatar.jpeg'"></image>
				<view class="icon_v" :style="{backgroundColor: identification != null ? identification.color: '#ccc'}"><text style="color:#fff;font-size: 20upx;">v</text></view>
			</view>
			
			<view class="space_between flex_row flex1">
				<view class="flex_column flex1 space_between">
					<view class="flex_row" style="align-items: center;">
						<text class="list_item_black_title_sm mr20">{{item.nickname}}</text>
						<text class="list_item_normal_txt"
							  v-if="showIdentification && identification != null"
							  :style="{color:identification != null ? identification.color: '#ccc'}">
							{{item.verify_name}}
						</text>
					</view>
					<slot></slot>
					<text class="list_item_normal_txt" v-if="showDetail">{{item.verify_name}}</text>
				</view>
				<view class="btn_wrapper">
					<view  @tap.stop="focus" class="button" :class="{isFocus:item.is_follow}"><text class="btn_txt" :style="{color: item.is_follow? '#999' :'#f39700' }">{{item.is_follow ? '已关注' : '+  关注'}}</text></view>
				</view>
			</view>
		</navigator>
    </view>
</template>

<script>
	import  {identification} from '@/common/config.js'
    export default {
		data() {
			return {
				identification: null,
				isFocus: false,
			}
		},
        props: {
            item: Object,
			// 认证
			showIdentification: {
				type: Boolean,
				default: false,
			},
			// 描述
			showDetail: {
				type: Boolean,
				default: false
			},
			
        },
		mounted() {
			// 这里需要根据接口返回来的关注人的列表判断当前这个人是否被关注过
			// this.isFocus = this.item &&this.item.isFocus || false;
			// this.identification = identification[this.item.identification];
		},
        methods: {
            focus() {
               // this.isFocus = !this.isFocus;
				this.$api.follows_user(this.item.id).then(data => {
					if (data && data.code === 200) {
						this.item.is_follow = data.result
					}
				})
            }
        },
		watch:{
			item() {
				console.log(this.item);
			}
		}
		
    }
</script>

<style scoped lang="scss">
	.link_wrapper{
		display: flex;
		flex-direction: row;
	}
	.img_wrapper {
		width: 80upx;
		height: 80upx;
		margin-right: 15upx;
		position: relative;
		z-index: 10;
	}
	.image-list1 {
	    @include circle(80upx);
	}
	.icon_v{
		@include circle(24upx);
		@include center;
		font-size: 16upx;
		color: #fff;
		position: absolute;
		bottom: 0upx;
		right: 0upx;
		z-index: 11;
		background-color: $mainColor;
	}
	.btn_wrapper{
		width: 140upx;
		@extend .flex;
		align-items: center;
	}
	.button {
		background-color: #fff2bb;
		width: 140upx;
		height: 55upx;
		text-align: center;
	}
	.btn_txt{
		color: #f39700;
		font-size: 24upx;
		line-height: 55upx;
	}
	.isFocus{
		background-color: #eee;
		color: #999;
	}
	
</style>
