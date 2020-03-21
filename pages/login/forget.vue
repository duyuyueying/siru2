<template>
	<view>
		<login-layout :showLoginStyle="false" :isLogin="false" type="code">
			<template v-slot:input>
				<view class="flex1">
					<input type="text" class="u-input" placeholder="手机号" v-model="phoneNumber">
				</view>
			</template>
			
			<template v-slot:submit>
				<view class="submit_btn" @click="submit" :style="{backgroundColor: (phoneNumber != '') ? '#FFB100':'#fafafa'}">
					<text class="submit_btn_txt" :style="{color: (phoneNumber != '') ? '#fff':'#5d6368'}">获取验证码</text>
				</view>
			</template>
		</login-layout>
	</view>
</template>

<script>
	import loginLayout from '@/pages/login/login-layout.vue';
	export default {
		data() {
			return {
				phoneNumber: ''
			}
		},
		components:{
			loginLayout
		},
		methods: {
			submit() {
				uni.navigateTo({
					url: '/pages/login/vertifyCode?type=password'
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
