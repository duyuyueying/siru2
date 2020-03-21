<template>
	<view>
		<view class="list" v-for="(list,list_i) in severList" :key="list_i">
			<uni-title :title="list.name" :isBold="false" :height="120" @click="toPage(list.nikeName)">
				<view @tap="toPage(list.nikeName)" class="flex_row_center">
					<text class="normal_txt" v-if="list.nikeName == 'clearCache'">{{cacheSize}}</text>
					<icons type="right" color="#ddd"></icons>
				</view>
			</uni-title>
		</view>
		<uni-popup ref="logout">
			<view class="message_box flex_column">
				<view class="content"><text class="list_item_black_title_sm">是否退出登录？</text></view>
				<view class="flex_row btns_box">
					<view class="flex1 cancle_btn" @click="cancle"><text class="list_item_black_title_sm">取消</text></view>
					<view class="flex1 sure_btn" @click="sure"><text class="list_item_black_title_sm">确定</text></view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniTitle from '@/components/uni-title.vue';
	import icons from '@/components/icons/icons.vue';
	import {uniPopup} from '@dcloudio/uni-ui';
	import {mapMutations, mapState} from 'vuex';
	const LOGIN = [
		{name:'实名认证',icon:'point.png',nikeName: 'authentication'},
		{name:'账号与安全',icon:'quan.png',nikeName: 'account'},
		{name:'行情&预警',icon:'momey.png',nikeName: 'setting'},
		{name:'推送管理',icon:'point.png',nikeName: 'pushNotification'},
		{name:'清除缓存',icon:'point.png',nikeName: 'clearCache'},
		{name:'给APP好评',icon:'point.png',nikeName: 'commet'},
		{name:'退出登录',icon:'point.png',nikeName: 'logout'},
	]
	const LOGOUT = [
		{name:'行情&预警',icon:'momey.png',nikeName: 'setting'},
		{name:'推送管理',icon:'point.png',nikeName: 'pushNotification'},
		{name:'清除缓存',icon:'point.png',nikeName: 'clearCache'},
		{name:'给APP好评',icon:'point.png',nikeName: 'commet'},
	]
	export default {
		data() {
			return {
				severList:[],
				cacheSize: ''
			}
		},
		components:{
			uniTitle,
			uniPopup
		},
		onLoad() {
			if(this.userId != null) {
				this.severList = LOGIN;
			} else {
				this.severList = LOGOUT;
			}
			this.calculateCache();
		},
		methods: {
			...mapMutations(['USER_ID']),
			//用户点击列表项
			toPage(type){
				let url = '';
				if(type == 'clearCache') {
					this.clearCache();
					return;
				}
				if(type == 'commet') {
					this.gotoMarket();
					return;
				}
				if(type === 'logout') {
					this.logout();
					return;
				}
				switch(type){
					case 'authentication':
						url = '/pages/authentication/authentication';
						break;
					case 'account':
						url='/pages/accountSafe/accountSafe';
						break;
					case 'setting':
						url='/pages/settingTheme/settingTheme';
						break;
					case 'pushNotification':
						url='/pages/pushNotification/pushNotification';
						break;
				}
				uni.navigateTo({
					url
				});
			},
			// 计算缓存
			calculateCache() {
				let _this = this;
				// #ifdef  APP-PLUS
				plus.cache.calculate( function ( size ) {
					let fileSizeString = '';
					if (size == 0) {
						fileSizeString = "0B";
					} else if (size < 1024) {
						fileSizeString = size + "B";
					} else if (size < 1048576) {
						fileSizeString = (size / 1024).toFixed(2) + "KB";
					} else if (size < 1073741824) {
						fileSizeString = (size / 1048576).toFixed(2) + "MB";
					} else {
						fileSizeString = (size / 1073741824).toFixed(2) + "GB";
					}
					_this.cacheSize = fileSizeString;
				});
				// #endif
			},
			// 清除缓存
			clearCache() {
				let _this = this;
				// #ifdef  APP-PLUS
				plus.cache.clear(function () {
					_this.cacheSize = '';
					uni.showToast({
						icon: 'none',
						title: '缓存已清除'
					});
				});
				// #endif
			},
			// 跳转应用市场
			gotoMarket() {
				// #ifdef  APP-PLUS
				var appurl;
				// TODO:ios和android缓存自己的appid即可
				if (plus.os.name=="Android") {
					appurl = "market://details?id=io.dcloud.HelloH5"; //由于hello uni-app没有上Android应用商店，所以此处打开了另一个示例应用
				}
				else{
					appurl = "itms-apps://itunes.apple.com/cn/app/hello-uni-app/id1417078253?mt=8";
				}
				if (typeof(marketPackageName)=="undefined") {
					plus.runtime.openURL(appurl, function(res) {
						console.log(res);
					});
				} else{//强制指定某个Android应用市场的包名，通过这个包名启动指定app
					if (plus.os.name=="Android") {
						plus.runtime.openURL(appurl, function(res) {
							plus.nativeUI.alert("本机没有安装应用宝");
						},marketPackageName);
					} else{
						plus.nativeUI.alert("仅Android手机才支持应用宝");
					}
				}
				// #endif
			},
			// 退出登录
			logout() {
				this.$refs.logout.open();
			},
			cancle() {
				this.$refs.logout.close();
			},
			sure() {
				this.USER_ID(null);
				uni.setStorage({
					key: 'USER_ID',
					data: null
				})
				uni.navigateBack({
					delta: 1
				});
			}
		},
		computed: mapState(['userId'])
	}
</script>

<style lang="scss">
.list{
	@include sideBorder;
}
.message_box{
	background-color: #fff;
	width: 240px;
}
.content{
	padding: 50upx 0;
	text-align: center;
}
.txt{
	font-size: 30upx;
}
.btns_box{
	@include sideBorder(top);
	height: 40px;
	line-height: 40upx;
	text-align: center;
}
.cancle_btn{
	@include sideBorder(right);
	line-height: 40px;
}
.sure_btn{
	line-height: 40px;
}
</style>
