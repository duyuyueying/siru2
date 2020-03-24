<template>
	<view class="container">
		<view class="list">
			<uni-title title="手机号" :isBold="false" :height="120" @click="onClick('phone')">
				<view class="flex_row item_wrap">
					<text class="list_item_black_txt">1398308941</text>
					<icons type="icon" color='#ddd'></icons>
				</view>
			</uni-title>
		</view>
		<view class="list">
			<uni-title title="微信" :isBold="false" :height="120">
				 <switch checked disabled color="#99e3ac" style="transform:scale(0.8)"/>
			</uni-title>
		</view>
		<view class="list mb20">
			<uni-title title="注销账号" :isBold="false" :height="120" @click="onClick('logoff')">
				<view>
					<icons type="icon" color='#ddd'></icons>
				</view>
			</uni-title>
		</view>
		<view class="list">
			<uni-title title="账号密码" :isBold="false" :height="120" @click="onClick('password')">
				<view class="flex_row item_wrap">
					<text class="list_item_black_txt">未设置</text>
					<icons type="right" color='#ddd'></icons>
				</view>
			</uni-title>
		</view>
	</view>
	
</template>

<script>
	import uniTitle from '@/components/uni-title.vue';
	import icons from '@/components/icons/icons.vue';
	export default {
		data() {
			return {
				severList:[
					{name:'手机号',icon:'point.png',nikeName: 'authentication'},
					{name:'微信',icon:'quan.png',nikeName: 'account'},
					{name:'注销账号',icon:'momey.png',nikeName: 'setting'},
					{name:'账号密码',icon:'point.png',nikeName: 'pushNotification'},
				],
			}
		},
		components:{
			uniTitle,
			icons
		},
		methods: {
			//用户点击列表项
			toPage(type){
				console.log(type);
				let url = '/pages/accountSafe/changeAccount?type='+type;
				uni.navigateTo({
					url
				});
			},
			onClick(type) {
				this.toPage(type);
			}
		}
	}
</script>

<style lang="scss">
.list{
	@include sideBorder;
}
.item_wrap{
	width: 500upx;
	justify-content: space-between;
	align-items: center;
}
.mb20{
	margin-bottom: 20upx;
}
</style>
