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
    <uni-tab-swiper :tabBars="tabBars"></uni-tab-swiper>
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
  import uniTabSwiper from '@/components/uni-tab-swiper/uni-tab-swiper'
	import icons from '@/components/icons/icons.vue';
  import {uniPopup} from '@dcloudio/uni-ui';
  import authorHomePage from '@/pages/author/author-home-page.vue';
  import authorNewsPage from '@/pages/author/author-news-page.vue';
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
        // tabBars: [{name: '主页', component: authorHomePage}, {name: '专栏', component: authorNewsPage}],
				id: 0,
				userData: userData,
				user: {
					data: userData
				}
			}
		},
		components:{
			icons,
      uniPopup,
      uniTabSwiper
    },
		async onLoad(query) {
			this.iStatusBarHeight  = uni.getSystemInfoSync().statusBarHeight;
			this.type = query.type;
			this.id =  query.id;

			if(this.type == 'self') {
				this.user = this.userInfo
				this.user.data = Object.assign({}, this.userData, this.userInfo.data)
			} else {
				await this.getUser(this.id);
			}
			uni.setNavigationBarTitle({
				title: this.user.nickname
			});
			this.modifyStatusBarButtonStyle();
		},
		onShareAppMessage() {
			console.log('分享...');
    },
    // 关注按钮交互
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
		computed: {
      ...mapState(['userInfo']),
      tabBars(){
        if(this.type == 'self') {
          this.user = this.userInfo
          this.user.data = Object.assign({}, this.userData, this.userInfo.data)
        }
        return [{name: '主页', component: authorHomePage, data: this.user.data, noRefresh: true, noLoadMore: true }, {name: '专栏', component: authorNewsPage, data:{id: this.id}}]
      } 
    },
		methods: {
      // 获取作者信息
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
      // 下载二维码弹框
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
	    // 展示二维码弹框
			showQrCode() {
				this.$refs.sign.open();
      },
      // 关闭二维码弹框
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
