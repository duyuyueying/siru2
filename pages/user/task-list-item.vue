<template>
    <view class="media-item view" @click="click">
		<view class="link_wrapper">
			<view class="img_wrapper">
				<text class="btn_txt">+{{item.score}}</text>
			</view>
			<view class="content_wrapper">
				<view class="flex_row">
					<text class="info-text title_txt">{{item.name}}</text>
					<text  class="info-text title_txt">{{item.progress}}/{{item.total}}</text>
				</view>
				<text class="info-text">{{item.description}}</text>
			</view>
			<view class="btn_wrapper">
				<view  @tap.stop="focus" class="button" :class="{isFocus}"><text class="btn_txt">{{item.btnTxt}}</text></view>
			</view>
		</view>
        <view class="media-item-line"></view>
    </view>
</template>

<script>
    export default {
		data() {
			return {
				isFocus: false,
			}
		},
        props: {
            item: Object,
			
        },
		mounted() {
			// 这里需要根据接口返回来的关注人的列表判断当前这个人是否被关注过
			this.isFocus = false;
				
			
			console.log(this.showIdentification,this.item,this.showLine, );
			// console.log(this);
		},
        methods: {
            focus() {
               // this.isFocus = !this.isFocus 
			   uni.switchTab({
			   	url: this.item.route
			   })
            },
            close(e) {
                e.stopPropagation();
                this.$emit('close');
            }
        },
		watch:{
			item(data) {
				if(this.showIdentification) {
					this.identification = identification[this.item.identification];
				}
				console.log('xxx',this.identification);
			}
		}
    }
</script>

<style scoped lang="scss">
    
    .media-item {
        flex: 1;
        flex-direction: row;
        justify-content: space-between;
		display: flex;
		position: relative;
    }
	.link_wrapper{
		display: flex;
		flex-direction: row;
		padding: 20upx;
	}
	.navigator-hover{
		background-color: #fff;
	}
	.flex_row{
		display: flex;
		flex-direction: row;
	}
    .media-item-line {
        position: absolute;
        left: 30upx;
        right: 30upx;
        bottom: 0;
        height: 1upx;
        background-color: #ebebeb;
    }
	.img_wrapper {
		width: 80upx;
		height: 80upx;
		margin-right: 15upx;
		
		z-index: 10;
		text-align: center;
		
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
	.content_wrapper{
		width: 440upx;
		// margin-right: 70upx;
		flex-direction: column;
		justify-content: space-between;
		// align-items: center;
		// justify-content: center;
		
	}
	.info-text {
	    margin-right: 20upx;
	    color: #868e96;
	    font-size: 24upx;
		line-height: 40upx;
	}
	.title_txt{
		color: #000;
	}
	.btn_wrapper{
		width: 140upx;
		// justify-content: center;
		align-self: center;
	}
	.button {
		background-color: #fff2bb;
		padding: 0;
		border: 0;
		width: 140upx;
		height: 55upx;
		border-radius: 0;
		text-align: center;
		
	}
	.btn_txt{
		color: #f39700;
		font-size: 24upx;
		text-align: center;
		line-height: 55upx;
	}
	.isFocus{
		background-color: #eee;
		color: #999;
	}
</style>
