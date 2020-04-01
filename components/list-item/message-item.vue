<template>
    <view class="list_item_wrap" @click="onClick">
		<view class="link_wrapper flex1" >
			<view class="img_wrapper">
				<image class="image-list1" :src="dataItem.user.avatar_src!=''?dataItem.user.avatar_src:'../../static/temp/avatar.jpeg'"></image>
				<view class="icon_v" :style="{backgroundColor: dataItem.user.verify_status != 0 ? '#ffb100': '#ccc'}"><text style="color:#fff;font-size: 20upx;">v</text></view>
			</view>
			
			<view class="space_between flex_row flex1">
				<view class="flex_column flex1 space_between">
					<view class="flex_row" style="align-items: center;">
						<text class="list_item_black_title_sm mr20">{{item&&dataItem.user.nickname}}</text>
					</view>
					<slot></slot>
					<text class="list_item_normal_txt">{{dataItem.user.create_time}}</text>
				</view>
				<view class="btn_wrapper" v-if="showContent">
					<text class="normal_txt"></text>
				</view>
			</view>
		</view>
    </view>
</template>

<script>
	import  {identification} from '@/common/config.js'
    export default {
		data() {
			return {
				identification: null,
				isFocus: false,
				dataItem:{
					user:{},
				},
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
			showContent:{
				type: Boolean,
				default: true
			}
        },
		mounted() {
			// 这里需要根据接口返回来的关注人的列表判断当前这个人是否被关注过

			this.isFocus = this.item.isFocus || false;
			this.identification = identification[this.item.identification];
		},
		created(){
			if (this.showContent) {
				//评论
				this.dataItem = this.item
			}else{
				//用户
				this.dataItem.user = this.item
			}

		},
        methods: {
            focus() {
               this.isFocus = !this.isFocus;
            },
			onClick() {
				this.$emit('goPage', this.item.id);
			}
        },
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
		width: 200upx;
		max-height: 140upx;
		@extend .flex;
		align-items: center;
		overflow: hidden;
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
