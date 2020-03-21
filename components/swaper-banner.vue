<template>
	<swiper class="card-swiper" :class="dotStyle?'square-dot':'round-dot'"  :circular="true"
	  :autoplay="autoplay"
	  previous-margin="10px"
	  next-margin="10px"
	  interval="5000" duration="500">
		<swiper-item v-for="(item,index) in swiperList" :key="index" :class="cardCur==index?'cur':''" class="banner_item">
			<view class="swiper-item" @click="onClick(item.id, item.type)">
				<image :src="item.url" mode="aspectFill" class="swiper_img"></image>
				<view class="cornerMark" v-if="cornerMark"><text class="cornerMark_txt">{{cornerMark}}</text></view>
			</view>
		</swiper-item>
	</swiper>
</template>

<script>
	export default {
		name: 'swiperCanlendar',
		data() {
			return {
				dotStyle: true,
				cardCur: 0,
			};
		},
		props: {
			swiperList: {
				type: Array,
				default: function(){
					return []
				}
			},
			autoplay: {
				type: Boolean,
				default: false
			},
			cornerMark: {
				type: String,
				default: ''
			}
		},
		created() {
			console.log('======',this.swiperList);
		},
		methods:{
			onClick(id, type) {
				
				if(type === 'specialTopic' || this.cornerMark) {
					uni.navigateTo({
						url:'/pages/specialTopic/specialTopic?id='+id
					})
				} else {
					uni.navigateTo({
						url:'/pages/details/details?id='+id
					})
				}
				
			}
		}
	}
</script>

<style lang="scss">
	.card-swiper {
		height: 344upx !important;
		position: relative;
	}
	.banner_item {
		position: relative;
		height: 344upx;
		padding: 0 10upx;
		box-sizing: border-box;
		overflow: initial;
		z-index: 10;
	}
	.cornerMark{
		position: absolute;
		left: 20px;
		top: 12px;
		z-index: 1000;
		width: 100upx;
		height: 50upx;
	}
	.cornerMark_txt{
		color:#fff;
		font-size: 30upx;
	}
	.swiper_img{
		width: 100%;
	}
</style>
