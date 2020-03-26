<template>
	<view class="container">
		<uni-status-bar></uni-status-bar>
		<view class="header">
			<view class="userinfo" v-if="userinfo.id" @click="goPerson">
				<view class="face">
					<image :src="userinfo.avatar_src!=''?userinfo.avatar_src:'/static/temp/avatar.jpeg'" class="face_img" mode="aspectFill"></image>
				</view>
				<view class="info flex_column">
					<text class="u-title_txt">{{userinfo.nickname}}</text>
					<text class="u_desc_txt">{{userinfo.verify_name}}</text>
					<text class="u_desc_txt">UID:{{userinfo.id}}</text>
				</view>
			</view>
			<view class="userinfo" v-else>
				<view class="face">
					<image src="/static/userCenter/avatar.png" class="face_img" mode="aspectFill"></image>
				</view>
				<view class="info flex_column" @click="toLogin">
					<text class="list_item_black_title_sm">点击登录</text>
				</view>
			</view>
			<view class="setting" @tap="toPage('invite')">
				<text class="u-link_txt">邀请好友</text>
			</view>
		</view>
		<view class="mb20">
			<view class="box">
				<view class="label flex_column" v-for="(row,index) in orderTypeLise" :key="row.name"  @tap="toPage(row.nikeName)" >
					<text class="u-title_txt">{{row.count}}</text>
					<text class="u_desc_txt">{{row.name}}</text>
				</view>
			</view>
		</view>
		<view class="u-task_wrap">
			<view class="box">
				<view class="label" v-for="(row,index) in taskList" :key="row.name" hover-class="hover"  @tap="toPage(row.nikeName)">
					<view class="icon"><image class="icon_img" :src="'/static/userCenter/'+row.icon"></image></view>
					<text class="u_desc_txt">{{row.name}}</text>
				</view>
			</view>
		</view>
		<uni-title title="签到领金币">
			<text class="u-link_txt">1/7</text>
		</uni-title>
		<view class="mb20">
			<view class="box u-checkIn_list">
				<view class="label u-checkIn_item" v-for="(row,index) in checkInList" :key="row.name" hover-class="hover"  @tap="toSign(index, row)">
					<view class="icon"><image class="u-checkIn_item_img" :src="'/static/userCenter/'+(row.checkIn ? 'x.png' : row.count > 1 ? 'gift.png' : 'money.png')"></image></view>
					<text class="u-link_txt">{{row.checkIn?'已签':'+'+row.count}}</text>
					<view class="u-checkIn-flag" v-if="row.sign"></view>
				</view>
			</view>
		</view>
		<view class="list" v-for="(list,list_i) in severList" :key="list_i">
			<uni-title :title="list.name" :isBold="false" :height="120" @click="toPage(list.nikeName)">
				<view @click="toPage(list.nikeName)">
					<icons type="right" color='#ddd'></icons>
				</view>
			</uni-title>
		</view>
		<uni-popup ref="sign">
			<view class="sign_box">
				<view><text class="list_item_black_title_sm">签到成功</text></view>
				<view><text class="blod_black_txt" style="color:#ffb100">恭喜您获得&nbsp;1&nbsp;金币</text></view>
				<view><text class="normal_txt">连续签到奖励更丰富</text></view>
				<view class="close_btn" @click="close" :style="{backgroundColor: '#FFB100'}">
					<text class="list_item_black_title_sm" :style="{color:  '#fff'}">知道了</text></view>
			</view>
		</uni-popup>
	</view>
</template>
<script>
	import {uniStatusBar} from '@dcloudio/uni-ui';
	import uniTitle from '@/components/uni-title.vue';
	import icons from '@/components/icons/icons.vue';
	import loginLayout from '@/pages/login/login-layout.vue';
	import {mapState, mapMutations} from 'vuex';
	import {uniPopup} from '@dcloudio/uni-ui';
	const defaultMessage = [
					//name-标题 icon-图标 badge-角标
					{name:'金币',count:0, nikeName: 'coin'},
					{name:'关注',count:0, nikeName: 'focus'},
					{name:'粉丝',count:0, nikeName: 'fans'},
					{name:'消息',count:0, nikeName: 'message'},
				];
	const defaultCheckIn = [
					{count: 1, sign: true},
					{count: 2},
					{count: 2},
					{count: 1},
					{count: 1},
					{count: 2},
					{count: 3},
				];
	export default {
		data() {
			return {
				userinfo:{},
				orderTypeLise:defaultMessage,
				taskList: [
					{name:'邀请好友',nikeName: 'invite',icon:'invite1.png'},
					{name:'任务领金币',nikeName: 'task',icon:'award.png'},
					{name:'实名认证',nikeName:'authentication',icon:'auth.png'},
				],
				checkInList: defaultCheckIn,
				severList:[
					{name:'我的收藏',nikeName: 'myCollect'},
					{name:'我的专栏',nikeName: 'myArtical'},
					{name:'浏览历史',nikeName: 'history'},
					{name:'我的设置',nikeName: 'mySetting'},
					{name:'隐私政策',nikeName: 'policy'},
					{name:'服务协议',nikeName: 'services'},
					{name:'意见反馈',nikeName: 'feedback'},
					{name:'关于我们',nikeName: 'about'},
				],
				isAuthentication: false,
			};
		},
		components:{
			uniStatusBar,
			uniTitle,
			loginLayout,
			uniPopup
		},
		onShow(){
			/** 执行页面数据刷新的方法 */
			// this.init()
		},
		onLoad() {
			this.init()
		},
		mounted() {
		},
		computed: mapState(['userInfo', 'apiToken']),
		methods: {
			...mapMutations(['USER_INFO']),
			init() {
				// this.apiToken
				// const api_token = uni.getStorageSync('api_token');
				if (this.apiToken) {
					this.$api.user().then(data => {
						if (data && data.code === 200) {
							uni.setStorage({
								key:'USER_ID',
								data: data.result.id
							})
							this.USER_INFO(data.result);
							this.userinfo = data.result
							this.orderTypeLise=[
								//name-标题 icon-图标 badge-角标
								{name:'金币',count:1, nikeName: 'coin'},
								{name:'关注',count:2, nikeName: 'focus'},
								{name:'粉丝',count:3, nikeName: 'fans'},
								{name:'消息',count:4, nikeName: 'message'},
							];
							this.checkInList = [
								{count: 1, checkIn: true},
								{count: 2, sign: true},
								{count: 2},
								{count: 1},
								{count: 1},
								{count: 2},
								{count: 3},
							];
						} else {
							this.$message(data.msg)
							// uni.removeStorageSync('USER_ID')
							// uni.setStorageSync('user_info', null);
						}
					})
				}
				//用户信息
				// this.userinfo={
				// 	face:'/static/temp/avatar.jpeg',
				// 	username:"VIP会员10240",
				// 	integral:"1435"
				// };

			},
			//用户点击订单类型
			toSign(index, item){
				if(this.apiToken == null){
					this.toLogin();
					return
				}
				let tempArr = [];
				this.checkInList.forEach(item=>{
					let newItem = Object.assign({}, item);
					if(newItem.sign) {
						newItem.sign = false;
						newItem.checkIn = true;
					}
					tempArr.push(newItem);
				})
				this.checkInList = tempArr;
				if(item.sign) {
					this.$refs.sign.open()
				}
			},
			close() {
				this.$refs.sign.close()
			},
			toLogin() {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			},
			//用户点击列表项
			toPage(type){
				let url = '';
				if(this.apiToken == null){
					this.toLogin();
					return
				}
				switch(type){
					// 邀请好友
					case 'invite':
						url = '/pages/user/invite';
						break;
					// 金币记录页面/关注/粉丝/我的收藏/浏览历史
					case 'coin':
					case 'focus':
					case 'fans':
					case 'myCollect':
					case 'history':
						url = '/pages/userCenterList/userCenterList?type='+type;
					break;
					// 我的专栏
					case 'myArtical':
						url = this.isAuthentication ? '/pages/userCenterList/userCenterList?type='+type : '/pages/authentication/authentication?show=true';
						break;
					// 消息
					case 'message':
						url = '/pages/messageCenter/messageCenter';
						break;
					// 任务中心
					case 'task':
						url = '/pages/user/taskCenter';
						break;
					// 认证
					case 'authentication':
						url = '/pages/authentication/authentication';
						break;
					case 'policy':
					case 'services':
						url = '/pages/policy/policy?type='+type;
						break;
					case 'mySetting':
						url = '/pages/setting/setting';
						break;
					case 'feedback':
						url = '/pages/feedback/feedback';
						break;
					case 'about':
						url = '/pages/about/about';
						break;

				}
				uni.navigateTo({
					url
				})
				// uni.showToast({title: this.severList[list_i][li_i].name});
			},
			// 去个人中心页面
			goPerson(id){
				uni.navigateTo({
					url: '/pages/author/author?id='+id+'&type=self'
				})
			}
		},
		watch:{
			apiToken(e){
				if(e == null) {
					this.userinfo = {}
					this.orderTypeLise= defaultMessage;
					this.checkInList = defaultCheckIn;
				} else {
					this.init()
				}
			}
		}
	}
</script>

<style lang="scss">
page{background-color:$bgColor}
.container{
	background-color: #f5f5f5;
}
.header{
	@include flex-center($justify: space-between);
	height:230upx;
	padding:0 $space-lg;
	background-color:$whiteColor;
	@include sideBorder;
}
.userinfo{
	@include flex-center(row);
	// flex: 1;
}

.face_img{
	@include circle(116upx);
}
.info{
	// flex: 1;
	// @extend .flex;
	padding-left:$space-lg;
}
.u-title_txt{
	@include txt(32upx, $blackColor);
	line-height: 50upx;
}
.u_desc_txt{
	@include txt($color: #999);
	line-height: 38upx;
}
.u-link_txt{
	@include txt($color: $mainColor);
}

.hover{background-color:#eee}
.orders{
	background-color:#ff6364;width:92%;height:11vw;padding:0 4%;margin-bottom:calc(11vw + 40upx);display:flex;align-items:flex-start;border-radius:0 0 100% 100%;margin-top: -1upx;
}
.box{
	flex: 1;
	background-color:$whiteColor;
	@include flex-center(row);
	padding: $space-base 0;
	text-align: center;
}
.u-task_wrap{
	margin-top: $space-sm;
	@include sideBorder;
}
.label{
	flex:1;
	align-items: center;
}
.icon{
	// margin-bottom: $space-sm;
}
.u-checkIn_list{
	padding: 0 $space-lg $space-lg $space-lg;
}
.u-checkIn_item{
	background-color: #FFF2dd;
	margin-right: $space-sm;
	padding: $space-sm 0;
	position: relative;
	overflow: hidden;
}
.u-checkIn_item_img{
	width: 56upx;
	height: 56upx;
}
.u-checkIn-flag{
	width: 48upx;
	height: 48upx;
	background-color: $mainColor;
	position: absolute;
	top: -25upx;
	left: -30upx;
	transform: rotate(-45deg);
}
.icon_img{width:65upx;height:65upx}
.list{
	@include sideBorder;
}
.sign_box{
	width: 250px;
	padding: $space-lg 0;
	background-color: #fff;
	@extend .flex_column;
	align-items: center;
}
.close_btn{
	width: 100px;
	margin-top: 15px;
	padding: $space-sm $space-base;
	text-align: center;
}

</style>
