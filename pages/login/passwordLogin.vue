<template>
	<view>
		<login-layout :showPrompt="false" :showBottom="false" type="password">
			<template v-slot:input>
				<view class="flex1">
					<input type="text" class="u-input" placeholder="手机号" v-model="phoneNumber">
				</view>
				<view class="flex1">
					<input type="text" class="u-input" placeholder="密码" v-model="password">
				</view>
				<view @click="gotoForget" style="text-align: right;">
					<text class="normal_txt">忘记密码？</text>
				</view>
			</template>
			<template v-slot:submit>
				<view class="submit_btn" @click="submit" :style="{backgroundColor: (phoneNumber != '' && password != '') ? '#FFB100':'#fafafa'}">
					<text class="submit_btn_txt" :style="{color: (phoneNumber != '' && password != '') ? '#fff':'#5d6368'}">登录</text>
				</view>
			</template>
		</login-layout>
	</view>
</template>

<script>
	import loginLayout from '@/pages/login/login-layout.vue';
	import {mapMutations} from 'vuex';
	export default {
		data() {
			return {
				phoneNumber: '',
				password: '',
			}
		},
		components:{
			loginLayout
		},
		methods: {
			...mapMutations(['USER_ID']),
			submit() {
				console.log()
				this.USER_ID(1);
				uni.setStorage({
					key:'USER_ID',
					data: 1
				})
				uni.navigateBack({
					delta:3
				});
			},
			gotoForget() {
				uni.navigateTo({
					url: '/pages/login/forget'
				})
			}
		}
	}
</script>

<style lang="scss">
.u-input{
	height: 50upx;
	@include sideBorder($color: #edf0f2);
	@include txt(26upx);
	padding: $space-base $space-lg;
	text-align: left;
	margin-bottom: 20upx;
}
.submit_btn{
	margin: 0 40upx 50upx;
	height: 78upx;
	line-height: 78upx;
	background-color: #fafafa;
	text-align: center;
	border-radius: 4upx;
}
.submit_btn_txt{
	color: #5d6368;
	font-size: 26upx;
}
</style>
