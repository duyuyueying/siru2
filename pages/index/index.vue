<template>
	<view class="content">
		<!--
		* 广告组件
		* timedown 倒计时时间
		* imageUrl 背景图
		* url 跳转链接
		*  -->
		<!-- #ifndef MP -->
		<!-- <mix-advert
			ref="mixAdvert"
			:timedown="8"
			imageUrl="/static/advert.jpg"
			:url="advertNavUrl"
		></mix-advert> -->
		<!-- #endif -->
		<!-- 头部 -->
		<view style="background-color: #fff;" class="fixed_navbar">
			<uni-status-bar />
			<view class="navbar_header">
				<view class="logo_wrap">
					<image src="/static/logo.png" mode="aspectFit" class="logo"></image>
				</view>
				<view class="flex1 radius search_wrap">
					<view class="input_search" @click="gotoSearchPage">
						<text class="input_search_txt">搜索你关注的内容</text>
						<uni-icons type="search" color="#999"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-navbar__placeholder">
			<uni-status-bar />
			<view class="uni-navbar__placeholder-view" />
		</view>
		<uni-tab-swiper :tabBars="tabBars" :initIndex="1" isScrollX></uni-tab-swiper>
	</view>
</template>

<script>
	import mixAdvert from '@/components/mix-advert/vue/mix-advert';
  import uniTabSwiper from '@/components/uni-tab-swiper/uni-tab-swiper'
  import HomeList from '@/components/home-list/home-list'
  import { uniStatusBar,uniIcons } from '@dcloudio/uni-ui';
	import {mapState} from "vuex";

	export default {
		components: {
			mixAdvert,
      uniTabSwiper,
      uniStatusBar,
      uniIcons
		},
		data() {
			return {
				tabBars: [],
			}
		},
		onLoad() {
			this.loadTabbars();
		},
		onReady(){
			/**
			 * 启动页广告 使用文档（滑稽）
			 * 1. 引入组件并注册
			 * 		import mixAdvert from '@/components/mix-advert/vue/mix-advert';
			 *      components: {mixAdvert},
					 <!-- #ifndef MP -->
						<mix-advert
							ref="mixAdvert"
							:timedown="8"
							imageUrl="/static/advert.jpg"
							:url="advertNavUrl"
						></mix-advert>
					<!-- #endif -->
			 * 	2. 调用组件的initAdvert()方法进行初始化
			 *
			 *  初始化的时机应该是在splash关闭时，否则会造成在app端广告显示了数秒后首屏才渲染出来
			 */
			// #ifndef MP
			// this.$refs.mixAdvert.initAdvert();
			// #endif
		},

		methods: {
			//获取Tabbar
			loadTabbars(){
				this.$api.tabbars().then(data=>{
					if (data && data.code === 200) {
            this.tabBars = data.result;
            let tabs = data.result.map(item=>{
              return item.component = HomeList
            });

					}
				})
			},
			// 跳转到搜索页面
			gotoSearchPage() {
				uni.navigateTo({
					url: '../search/search'
				})
			},
		}
	}
</script>

<style lang='scss'>
	page, .content{
		background-color: #f8f8f8;
		height: 100%;
		overflow: hidden;
	}
	.navbar_header{
		height: 44px;
		line-height: 44px;
		@extend .flex_row;
		@extend .space_between;
		padding: 0 $space-lg;
		background-color: $whiteColor;
		.logo{
			width: 120px;
			height: 22px;
		}
		.logo_wrap{
			width: 120px;
			margin-right: $space-lg;
			@extend .flex;
			align-items: center;
		}
		.search_wrap{
			@extend .flex;
			align-items: center;
		}
	}
	/* 顶部tabbar */
	.nav-bar{
		position: relative;
		z-index: 10;
		height: 90upx;
		white-space: nowrap;
		box-shadow: 0 2upx 8upx rgba(0,0,0,.06);
		background-color: #fff;
		.nav-item{
			display: inline-block;
			/* width: 150upx; */
			padding: 0 20upx;
			/* height: 90upx; */
			text-align: center;
			line-height: 90upx;
			font-size: 30upx;
			color: #303133;
			position: relative;
			&:after{
				content: '';
				width: 0;
				height: 0;
				border-bottom: 4upx solid #007aff;
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translateX(-50%);
				transition: .3s;
			}
		}
		.current{
			color: $mainColor;
			/* &:after{
				width: 50%;
			} */
		}
	}

	.swiper-box{
		height: 100%;
	}
	.panel-scroll-box{
		height: calc(100% - 44px - var(--status-bar-height));
	}
	/* 新闻列表  emmm 仅供参考 */
	.news-item{
		background-color: #fff;
	}
	/* 头部样式 */
	.header{
		height: 85upx;
		padding: 10upx 15upx;
		display: flex;
		align-items: center;
		background-color:#fff;
		flex-direction: row;
		justify-content: space-between;
	}
	.input_search{
		background-color: #f5f5f5;
		border-radius: 6upx;
		height: 55upx;
		padding: 0upx 20upx;
		justify-content: space-between;
		display: flex;
		align-items: center;
		flex-direction: row;
		flex: 1;
	}
	.input_search_txt {
		color: #999;
		font-size: 25upx
	}
	/* 新闻早八点|专题 */
	.import_news_wrapper {
		height: 166upx;
		margin-bottom: 12upx;
		background-color: #fff;
		display: flex;
		flex-direction: row;
		overflow: hidden;
		position: relative;
	}
	.import_item {
		flex: 1;
		padding: 20upx;
		justify-content: space-between;
		position: relative;
	}
	.import_item_head {
		@extend .flex_row;
		/* flex-direction: row; */
		justify-content: space-between;
		align-items: center;
	}
	.import_item_title{
		font-weight: bold;
		color: $mainColor;
	}
	.import_item_time {
		color: #999;
		font-size: 20upx
	}
	.import_item_content_txt{
		font-size: 28upx;
		// line-height: 1.4;
		color: #000;
		@include more_line_ellipsis;
	}
	.media-item-line {
		position: absolute;
		top: 30upx;
		right:0;
		bottom: 0;
		width: 2upx;
		height: 106upx;
		background-color: $borderColor;
	}
	.import_news_list_wrapper {
		background-color: #fff;
		margin-bottom: 12upx;
	}
	/* 关注头部 */
	.focus_head_tab_wrap{
		height: 75upx;
		justify-content: space-between;
	}
	.text_wrap{
		width: 100upx;
		line-height: 75upx;
	}

</style>
