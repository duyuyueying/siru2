<template>
	<view class="container">
		<view class="flex_column bg_wrapper">
			<view :style="{ height: (iStatusBarHeight+44)+ 'px'}">
			  <!-- 这里是状态栏 /44的navbar-->
				<view :style="{marginTop: (iStatusBarHeight+10)+ 'px'}"></view>
				<text style="fontSize:18px;color:#fff">{{data.name}}</text>
			</view>
			<view class="img_wrapper">
				<image class="image-list1" src="../../static/temp/avatar.jpeg"></image>
				<view class="icon_v" :style="{backgroundColor: identification != null ? identification.color: '#ccc'}"><text style="color:#fff;font-size: 20upx;">v</text></view>
			</view>
			<view class="flex_row">
				<text class="txt right_space_base" v-if="identification != null">{{identification.name}}</text>
				<view class="qrCode_wrap" @tap="showQrCode"><icons type="qrCode" color="#ffb100"></icons></view>
			</view>
			<view class="flex_row">
				<view><text class="txt white right_space_base">粉丝 {{data.fans}}</text></view>
				<view><text class="txt white">关注 {{data.focus}}</text></view>
			</view>
		</view>
		<view class="relative_section">
			<tabs :tabs="['主页','专栏']" @changeTab="changeTab" :defaultTab="currTab"></tabs>
		</view>
		<swiper :current="currTab" @change="changeTab" class="swiper">
			<swiper-item>
				<view class="content_wrapper">
					<uni-title title="个人介绍"></uni-title>
					<view class="pad30">
						<view class="brBot"><text class="desc_txt">{{data.description}}</text></view>
						<!-- TODO:此处可循环，暂时写死 -->
						<view class="list_container flex_row">
							<view class="icon_wrapper1">
								<image class="image-list2" src="../../static/temp/avatar.jpeg"></image>
							</view>
							<view class="flex_column border_bottom">
								<text class="list_item_black_txt">公众号</text>
								<text class="list_item_black_title_sm">{{data.gongzhonghaoName}}</text>
							</view>
						</view>
						<view class="list_container flex_row">
							<view class="icon_wrapper1 ">
								<image class="image-list2" src="../../static/temp/avatar.jpeg"></image>
							</view>
							<view class="flex_column border_bottom">
								<text class="list_item_black_txt">微信号</text>
								<text class="list_item_black_title_sm">{{data.wechatAccount}}</text>
							</view>
						</view>
						<!-- TODO:END -->
					</view>
				</view>
			</swiper-item>
			<swiper-item>
				<mix-pulldown-refresh ref="mixPulldownRefresh" class="panel-content" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll">
					<scroll-view
						class="panel-scroll-box" 
						:scroll-y="enableScrollY" 
						@scrolltolower="loadMore"
						>
						<news-item :newsItem="item" v-for="(item, index) in dataList" :key="index"></news-item>
						<!-- 上滑加载更多组件 -->
						<mix-load-more :status="loadMoreStatus"></mix-load-more>
					</scroll-view>
				</mix-pulldown-refresh>
			</swiper-item>
		</swiper>
		<uni-popup ref="sign">
			<view class="sign_box">
				<view><text class="list_item_black_title_sm heavy">{{data.name}}</text></view>
				<image src="/static/temp/avatar.jpeg" mode="aspectFill" class="qr_img"></image>
				<!-- <view><text class="blod_black_txt" style="color:#ffb100">恭喜您获得&nbsp;1&nbsp;金币</text></view>
				<view><text class="normal_txt">连续签到奖励更丰富</text></view> -->
				<view @click="download">
					<text class="list_item_black_title_sm">点击下载二维码</text>
				</view>
				<view class="close_btn rotate" @click="close">
					<icons type='add' color='#fff'></icons>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {focusAuthor, newsItems} from '@/mock/data.js';
	import  {identification} from '@/common/config.js';
	import tabs from '@/components/tabs.vue';
	import uniTitle from '@/components/uni-title.vue';
	import newsItem from '@/components/list-item/news-item.vue';
	import icons from '@/components/icons/icons.vue';
	import {loadMore} from '@/common/util.js';
	import {uniPopup} from '@dcloudio/uni-ui';
	export default {
		data() {
			return {
				data: focusAuthor,
				identification: null,
				iStatusBarHeight: 0,
				currTab: 0,
				dataList: [],
				loadMoreStatus:  0, //加载更多 0加载前，1加载中，2没有更多了
				refreshing: false, // 刷新状态
				isFocus: false, // 是否被关注
				scrollViewOffset: 0,
				enableScrollY: false,
			}
		},
		mixins:[loadMore],
		components:{
			tabs,
			uniTitle,
			newsItem,
			icons,
			uniPopup
		},
		onLoad() {
			this.iStatusBarHeight  = uni.getSystemInfoSync().statusBarHeight;
			this.identification = identification[this.data.identification];
			this.loadList('add');
			uni.setNavigationBarTitle({
				title: this.data.name
			});
		},
		onShareAppMessage() {
			console.log('分享...');
		},
		onNavigationBarButtonTap(e) {
			if(e.text == '关注') {
				uni.navigateTo({
					url: '/pages/user/userEdit'
				})
			}
			console.log(e);
		},
		mounted() {
			this.getElSize();
		},
		onPageScroll(e) {
			if(Math.ceil(e.scrollTop) + 20 > this.scrollViewOffset ) {
				this.enableScrollY = true;
			} else {
				this.enableScrollY = false;
			}
		},
		methods: {
			//列表
			loadList(type){
				// let tabItem = this.tabBars[this.currTab];
				//type add 加载更多 refresh下拉刷新
				
				if(type === 'add'){
					console.log(this.loadMoreStatus)
					if(this.loadMoreStatus === 2){
						return;
					}
					this.loadMoreStatus = 1;
				}
				// #ifdef APP-PLUS
				else if(type === 'refresh'){
					this.refreshing = true;
				}
				// #endif
				
				//setTimeout模拟异步请求数据
				setTimeout(()=>{
					let list = newsItems;
					list.sort((a,b)=>{
						return Math.random() > .5 ? -1 : 1; //静态数据打乱顺序
					})
					if(type === 'refresh'){
						// 刷新前清空数组
						this.dataList = [];
					}
					let tempArr = [];
					list.forEach(item=>{
						item.id = parseInt(Math.random() * 10000);
						tempArr.push(item);
					});
					this.dataList.push(...tempArr);
					//下拉刷新 关闭刷新动画
					if(type === 'refresh'){
						this.$refs.mixPulldownRefresh && this.$refs.mixPulldownRefresh.endPulldownRefresh();
						// #ifdef APP-PLUS
						this.refreshing = false;
						// #endif
						this.loadMoreStatus = 0;
					}
					//上滑加载 处理状态
					if(type === 'add'){
						this.loadMoreStatus = this.dataList.length > 40 ? 2: 0;
					}
				}, 600)
			},
			changeTab(e) {
				let index = e.detail.current
				if(index == this.currTab){
					return;
				}
				this.currTab = e.detail.current;
				if(this.dataList.length == 0) {
					this.loadList('add')
				}
			},
			showQrCode() {
				this.$refs.sign.open();
			},
			download() {
				uni.downloadFile({
					url: 'https://img.36krcdn.com/20200307/v2_945dcd5d78514102a1e83a016bfbb2a6_img_000',
					success(e) {
						
						uni.saveImageToPhotosAlbum({
							filePath: e.tempFilePath,
							success(path) {
								uni.showToast({
									icon:'none',
									title: '图片已保存至相册'
								})
							}
						})
					},
					fail(e){
						console.log("fail",e)
					}
				});
				this.close();	
			},
			//获得元素的size
			getElSize() { 
				let el = uni.createSelectorQuery().select('.relative_section');
				el.fields({
					size: true,
					scrollOffset: true,
					rect: true
				}, (data) => {
					this.scrollViewOffset = data.top;
				}).exec();
			},
			close() {
				this.$refs.sign.close();
			}
		}
	}
</script>

<style lang="scss">
	page,.container,{
		height: 100%;
		// overflow: hidden;
	}
	.swiper, .panel-scroll-box{
		height: 100%;
	}
	.bg_wrapper{
		height: 480upx;
		align-items: center;
		background-image:linear-gradient(70deg,#ace, #f96);
		// background-image: radial-gradient(farthest-corner at 100% 100%, #1e0900,#bf7101 , #b25900);
	}
	.img_wrapper {
		width: 160upx;
		height: 160upx;
		position: relative;
		z-index: 10;
	}
	.image-list1 {
	    @include circle(160upx);
	}
	.icon_v{
		@include circle(36upx);
		@include center;
		font-size: 20upx;
		color: #fff;
		position: absolute;
		bottom: 0upx;
		right: 0upx;
		z-index: 11;
		background-color: $mainColor;
	}
	.txt{
		line-height: 56upx;
		@include txt(30upx, $mainColor);
	}
	.white{
		color: #fff
	}
	.desc_txt{
		@include txt(30upx, #000);
		line-height: 38upx;
	}
	.brBot{
		@include sideBorder;
		padding-bottom: 30upx;
	}
	.qrCode_wrap{
		padding: 0 $space-sm;
	}
	.list_container{
		@include flexRow;
		background-color: #fff;
	}
	.icon_wrapper1 {
		width: 80upx;
		padding-top: 20upx;
	}
	.image-list2{
		@include circle(50upx);
	}
	.border_bottom{
		@include sideBorder;
		flex: 1;
		padding: 20upx 0upx;
	}
	.sign_box{
		width: 250px;
		padding: $space-lg 0;
		background-color: #fff;
		@extend .flex_column;
		align-items: center;
	}
	.close_btn{
		width: 30px;
		height: 30px;
		background-color: $mainColor;
		border-radius: 20px;
		position: absolute;
		right: -15px;
		top: -15px;
		text-align: center;
		line-height: 30px;
	}
	.rotate{
		transform: rotate(45deg);
	}
	.qr_img{
		width: 180px;
		height: 180px;
		margin: $space-base;
	}
</style>
