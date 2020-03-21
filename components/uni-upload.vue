<template>
	<view class="u-upload_wrap" @tap="chooseImg">
		<view v-if="imagPath != ''">
			<image class="img_wrap" mode="aspectFill" :src="imagPath"></image>
		</view>
		<view  @tap="chooseImg" v-else class="flex_column">
			<view class="u-circle_wrap"><icons type="add"></icons></view>
			<view style="margin-bottom: 56upx;text-align: center;"><text class="u-upload_name">{{label}}</text></view>
			<view><text class="u-upload_desc">支持jpeg，png格式，照片大小不超过5M</text></view>
		</view>
		
	</view>
</template>

<script>
	import icons from '@/components/icons/icons.vue';
	export default {
		data(){
			return {
				isTap: false, // 防止调用两次
			}
		},
		props: {
			label: String,
			imagPath: String,
		},	
		components:{
			icons
		},
		methods:{
			chooseImg(){
				if(this.isTap){
					return;
				}
				this.isTap = true;
				uni.hideKeyboard();
				let _this = this;
				uni.chooseImage({
					sizeType:['copressed'],
					success(res) {
						let imagPath = res.tempFilePaths;
						this.isTap = false;
						// TODO:这里跳转执行裁剪图片页面，
						_this.$emit('changePath');
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.img_wrap{
	width: 500upx;
	height: 300upx;
}
.u-upload_wrap{
	background-color: $bgColor;
	border-radius: 8upx;
	width: 500upx;
	height: 300upx;
	@include flex-center(column);
}
.u-upload_name{
	@include txt(30upx, #868686);
	align-self: center;
}
.u-upload_desc{
	@include txt(24upx, #868686);
	align-self: center;
}
.u-circle_wrap{
	@include circle(60upx);
	border-width: 3upx;
	border-color: #000;
	border-style: solid;
	margin-bottom: $space-base;
	justify-content: center;
	align-self: center;
}
</style>
