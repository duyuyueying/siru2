<template>
	<view>
		<!-- 更换手机号 -->
		<view class="wrap" v-if="type == 'phone'">
			<view v-if="steps == 'one'" class="space_mar flex_column">
				<text class="desc_txt">为确保账号安全，需验证当前手机有效性</text>
				<text class="list_item_black_title_sm">当前绑定手机号：13896308941</text>
			</view>
			<view class="flex1" v-else>
				<input type="text" class="u-input" placeholder="输入新手机号码" @input="input" v-model="phoneNumber">
			</view>
			<view class="flex1" style="position: relative;">
				<input type="text" class="u-input space_pad" placeholder="验证码" @input="input" v-model="verifyCode">
				<view class="vitify_btn" @click="sendCode">
					<view class="hr"></view>
					<text class="submit_btn_txt" :style="{color: !codeFlag ? '#ffb100' : '#5d6368'}">{{verifyCodeDesc}}</text>
				</view>
			</view>
			<view class="submit_btn" @click="submit" :style="{backgroundColor: verifyCode.length == 6 ? '#FFB100':'#fafafa'}">
				<text class="submit_btn_txt" :style="{color: verifyCode.length == 6 ? '#fff':'#5d6368'}">{{steps == 'one' ? '下一步' : '确定'}}</text></view>
		</view>
		<!-- 注销账号 -->
		<view class="wrap" v-if="type == 'logoff'">
			<view class="space_mar"></view>
			<view class="submit_btn" @click="logoff" :style="{backgroundColor:'#ffb100'}">
				<text class="submit_btn_txt" :style="{color:'#fff'}">申请注销</text></view>
		</view>
		<!-- 更改密码 -->
		<view class="wrap" v-if="type == 'password'">
			<view class="space_mar">
				<text class="desc_txt">为确保账号安全，需验证当前手机有效性</text>
				<text class="list_item_black_title_sm">当前绑定手机号：13896308941</text>
			</view>
			<view class="flex1">
				<input type="text" class="u-input space_pad" placeholder="验证码" v-model="verifyCode">
				<view class="vitify_btn" @click="sendCode">
					<view class="hr"></view>
					<text class="submit_btn_txt" :style="{color: !codeFlag ? '#ffb100' : '#5d6368'}">{{verifyCodeDesc}}</text>
				</view>
			</view>
			<view class="flex1">
				<input type="password" class="u-input" placeholder="输入最少8位密码" v-model="password">
			</view>
			<view class="flex1">
				<input type="password" class="u-input" placeholder="确认密码" v-model="comfirePassword">
			</view>
			<view class="submit_btn" @click="changePassword" :style="{backgroundColor: (verifyCode != '' && password !='' && comfirePassword != '') ? '#FFB100':'#fafafa'}">
				<text class="submit_btn_txt" :style="{color: (verifyCode != '' && password !='' && comfirePassword != '') ? '#fff':'#5d6368'}">完成</text></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value: '',
				steps: 'one',
				verifyCode: '', // 验证码
				phoneNumber: '', //新电话号码
				verifyCodeDesc: '获取验证码',
				codeFlag: false, // 
				password: '',
				comfirePassword: '',
			};
		},
		onLoad(query) {	
			this.type = query.type
			if(query.type == 'phone') {
				uni.setNavigationBarTitle({
					title: '更换手机号'
				});
			} else if(query.type == 'logoff') {
				uni.setNavigationBarTitle({
					title: '安全中心'
				});
			} else if(query.type == 'password') {
				uni.setNavigationBarTitle({
					title: '设置密码'
				})
			}
			// console.log(query);
		},
		methods:{
			// 修改密码提交逻辑
			changePassword(){
				if(this.verifyCode == ''){
					uni.showToast({
						icon: 'none',
						title: '请输入验证码'
					});
					return;
				}
				if(this.password == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入新密码'
					});
					return;
				}
				if(this.comfirePassword == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入确认密码'
					});
					return;
				}
				if(this.password != this.comfirePassword){
					uni.showToast({
						icon: 'none',
						title: '新密码和确认密码一致'
					});
					return;
				}
			},
			// 更换手机号码提交逻辑
			submit(){
				if(this.steps == 'two' && this.phoneNumber == ''){
					uni.showToast({
						icon: 'none',
						title: '请输入新手机号码'
					});
					return;
				}
				if(this.verifyCode == ''){
					uni.showToast({
						icon: 'none',
						title: '请输入验证码'
					});
					return;
				}
				if(this.steps=="one") {
					// reset数据
					this.codeFlag = false;
					clearInterval(this.timer);
					this.verifyCodeDesc = '获取验证码';
					this.verifyCode = '';
					// 设置数据
					this.steps = 'two';
					uni.setNavigationBarTitle({
						title: '更换新手机号码'
					})
				}
			},
			// 发送验证码倒计时
			sendCode() {
				if(this.steps == 'two' && this.phoneNumber == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入新手机号码'
					});
					return;
				}
				if(this.codeFlag){
					return;
				}
				this.codeFlag = true;
				let counter = 60;
				this.verifyCodeDesc = counter+'s';
			}
		}
	}
</script>

<style lang="scss">
	.wrap{
		padding: 75upx;
		flex: 1;
		text-align: center;
	}
	.desc_txt{
		font-size: 26upx;
		color: #555;
		margin-bottom: $space-lg;
	}
	.u-input{
		height: 80upx;
		@include sideBorder($color: #edf0f2);
		@include txt(26upx);
		padding: $space-base $space-lg;
		text-align: left;
		margin-bottom: 20upx;
	}
	.space_pad{
		padding-right: 210upx;
	}
	.space_mar{
		margin-bottom: 110upx;
	}
	.submit_btn{
		margin: 0 40upx;
		height: 78upx;
		line-height: 78upx;
		background-color: #fafafa;
		justify-content: center;
		align-items: center;
		border-radius: 4upx;
	}
	.submit_btn_txt{
		color: #5d6368;
		font-size: 26upx;
	}
	.hr{
		position: absolute;
		width: 1upx;
		left: 0upx;
		top:20upx;
		bottom: 20upx;
		background-color: #edf0f2;
	}
	.vitify_btn{
		height: 80upx;
		width: 200upx;
		position: absolute;
		right: 0;
		bottom: 20upx;
		padding: 0 $space-lg;
		justify-content: center;
		line-height: 80upx;
	}
</style>
