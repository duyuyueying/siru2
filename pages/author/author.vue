<template>
	<view class="container">
		<view class="flex_column bg_wrapper">
			<view :style="{ height: (iStatusBarHeight+44)+ 'px'}">
			  <!-- 这里是状态栏 /44的navbar-->
				<view :style="{marginTop: (iStatusBarHeight+10)+ 'px'}"></view>
				<text style="fontSize:18px;color:#fff">{{user.nickname}}</text>
			</view>
			<view class="img_wrapper">
				<image class="image-list1" :src="user.avatar_src!=''?user.avatar_src:'../../static/temp/avatar.jpeg'"></image>
				<view class="icon_v" :style="{backgroundColor: user.verify_status != 0 ? '#ffb100': '#ccc'}"><text style="color:#fff;font-size: 20upx;">v</text></view>
			</view>
			<view class="flex_row">

			</view>
			<view class="flex_row">
				<view><text class="list_item_black_txt white right_space_base">{{user.data.sex}} </text></view>
				<view><text class="list_item_black_txt white right_space_base">{{user.data.job}} </text></view>

				<text class="txt right_space_base" :style="{color: user.verify_status!=0 ? '#f39700': '#ccc'}">{{user.verify_name}}</text>
			</view>
			<view class="flex_row">
				<view><text class="txt white right_space_base">{{user.fans_count}} 粉丝</text></view>
				<view><text class="txt white right_space_base">{{user.follows_count}} 关注</text></view>
				<view v-if="user.data.qrCode" class="qrCode_wrap" @tap="showQrCode"><icons type="qrCode" color="black"></icons></view>
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
						<view class="brBot"><text class="desc_txt">{{user.data.profile!=''?user.data.profile:'该用户很忙什么都没留下。'}}</text></view>

						<view class="list_container flex_row" v-if="user.data.phone!=''">
							<view class="icon_wrapper1">
								<image class="image-list2" src="../../static/social/phone.png"></image>
							</view>
							<view class="flex_column border_bottom">
								<text class="list_item_black_txt">手机号码</text>
								<text class="list_item_black_title_sm">{{user.data.phone}}</text>
							</view>
						</view>

						<view class="list_container flex_row" v-if="user.data.email!=''">
							<view class="icon_wrapper1">
								<image class="image-list2" src="../../static/social/message.png"></image>
							</view>
							<view class="flex_column border_bottom">
								<text class="list_item_black_txt">电子邮件</text>
								<text class="list_item_black_title_sm">{{user.data.email}}</text>
							</view>
						</view>

						<view class="list_container flex_row" v-if="user.data.wechat_official!=''">
							<view class="icon_wrapper1">
								<image class="image-list2" src="../../static/social/wechat2.png"></image>
							</view>
							<view class="flex_column border_bottom">
								<text class="list_item_black_txt">公众号</text>
								<text class="list_item_black_title_sm">{{user.data.wechat_official}}</text>
							</view>
						</view>
						<view class="list_container flex_row" v-if="user.data.wechat!=''">
							<view class="icon_wrapper1 ">
								<image class="image-list2" src="../../static/social/wechat.png"></image>
							</view>
							<view class="flex_column border_bottom">
								<text class="list_item_black_txt">微信号</text>
								<text class="list_item_black_title_sm">{{user.data.wechat}}</text>
							</view>
						</view>

						<view class="list_container flex_row" v-if="user.data.twitter!=''">
							<view class="icon_wrapper1 ">
								<image class="image-list2" src="../../static/social/twitter.png"></image>
							</view>
							<view class="flex_column border_bottom">
								<text class="list_item_black_txt">Twitter</text>
								<text class="list_item_black_title_sm">{{user.data.twitter}}</text>
							</view>
						</view>
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
				<view><text class="list_item_black_title_sm heavy">{{user.nickname}}</text></view>
				<image src="/static/temp/avatar.jpeg" mode="aspectFill" class="qr_img"></image>
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
	import {mapState} from 'vuex';
	import {focusAuthor, newsItems} from '@/mock/data.js';
	import {identification} from '@/common/config.js';
	import tabs from '@/components/tabs.vue';
	import uniTitle from '@/components/uni-title.vue';
	import newsItem from '@/components/list-item/news-item.vue';
	import icons from '@/components/icons/icons.vue';
	import {loadMore} from '@/common/util.js';
	import {uniPopup} from '@dcloudio/uni-ui';
	export default {
		data() {
			const userData = {
				sex: '保密',
				job: '',
				phone: '',
				wechat: '',
				wechat_official: '',
				email: '',
				twitter: '',
				profile: '',
			}
			return {
				id: 0,
				userData: userData,
				user: {
					data: userData
				},
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
		async onLoad(query) {
			this.iStatusBarHeight  = uni.getSystemInfoSync().statusBarHeight;
			// this.identification = identification[this.user.identification];
			this.type = query.type;
			this.id =  query.id;
			this.loadList('add');
			if(this.type == 'self') {
				this.user = this.userInfo
				this.user.data = Object.assign({}, this.userData, this.userInfo.data)
			} else {
				await this.getUser(this.id);
			}
			console.log(this.user)
			uni.setNavigationBarTitle({
				title: this.user.nickname
			});
			this.modifyStatusBarButtonStyle();
		},
		onShareAppMessage() {
			console.log('分享...');
		},
		onNavigationBarButtonTap(e) {
			if(this.type == 'self' && e.index == 1) {
				uni.navigateTo({
					url: '/pages/user/userEdit'
				})
			}else{
				this.$api.follows_user(this.id).then(data => {
					if (data && data.code === 200) {
						this.user.is_follow = data.result
						if (!data.result) {
							this.$message('取消关注', null,800)
						}
					}
				})
			}
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
		computed: mapState(['userInfo']),
		methods: {
			async getUser(id) {
				return new Promise((resolve)=>{
					this.$api.getUser(id).then(data => {
						if (data && data.code === 200) {
							this.user = data.result
							this.user.data = Object.assign({}, this.userData, data.result.data)
							resolve(data.result.data);
						} else {
							this.$message('获取用户信息失败',function () {
								uni.navigateBack({
									delta: 1
								});
							})
						}
					})
				})
			},
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
			},
			// 修改状态栏上的buton的文字样式
			modifyStatusBarButtonStyle() {
				// #ifdef APP-PLUS
				var webView = this.$mp.page.$getAppWebview();
				// 修改buttons
				// index: 按钮索引, style {WebviewTitleNViewButtonStyles }
				if(this.type == 'self') {
					webView.setTitleNViewButtonStyle(1, {
					    text: '编辑',
					});
				}else{
					webView.setTitleNViewButtonStyle(1, {
						text: this.user.is_follow ? '已关注':'关注',
					});
				}
				// #endif

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
