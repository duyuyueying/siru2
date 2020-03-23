<template>
	<view class="container">
		<view class="flex_column content">
			<text class="title">验证码</text>
			<text class="normal_txt">短信已发送至：{{phone}}</text>
			<!-- 输入框 -->
			<view @click="moveUp(0)" class="flex_column input_box" style="align-self: center;">
				<view class="flex_row" style="height: 80rpx;padding-left: 23rpx;">
					<view style="margin-right: 65rpx;font-size: 60rpx;" v-for="(x,i) in codeList" :key="i" >{{x}}</view>
					<view class="move-inpt" v-show="codeList.length<6" style="width: 3rpx;height: 50rpx;background-color: #FFB100;margin-left: 13rpx;">
					</view>
				</view>
				<view class="flex_row" >
					<view style="margin-right: 25rpx;" :class="x==codeList.length?'input-code':'code'"  v-for="x in [0,1,2,3,4,5]" :key="x" ></view>
				</view>
			</view>
			<view class="promp" v-if="showMessage">
				<text class="list_item_black_title_sm">正在提交...</text>
			</view>
			<view class="timer_section">
				<text class="normal_txt mr20" v-if="counter != 0">{{counter}}s&nbsp;&nbsp;后可再次</text>
				<text class="normal_txt" :style="{color: counter == 0 ? '#ffb100' : '#a0a0a0'}" @click="sendCode">发送验证码</text>
			</view>
		</view>
		<!-- 键盘 -->
		<view :animation="animationData"  style="background-color: #F1F1F1;position: fixed;bottom: 0;width: 750rpx;
		height: 500rpx;z-index: 10;" class="flex-column-around">
			<view class="flex-row-around flex-wrap">
				<view @click="nup(x)" class="flex-row-center num-int" v-for="x in [1,2,3,4,5,6,7,8,9]" :key="x">
					{{x}}
				</view>
				<view @click="backNup" class="flex-row-center num-int" style="background-color: #F1F1F1;">
					←
				</view>
				<view @click="nup(0)" class="flex-row-center num-int">
					0
				</view>
				<view @click="moveUp(500)" class="flex-row-center num-int">
					<view class="rotate_icon">
						<icons type="add" color="#ffb100"></icons>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import icons from '@/components/icons/icons.vue';
	import {mapState, mapMutations} from 'vuex';
	import {isPhone} from '@/utils/validate'

	// 转换率
	const l=uni.getSystemInfoSync().screenWidth/750
	export default {
		data() {
			return {
				fwMes:"",
				codeList:[],
				animationData:{},
				counter: 60,
				showMessage: false,
				phone:''
			}
		},
		created() {
			this.calcCounter()
		},
		onLoad(e) {
			this.type = e.type;
			this.phone = e.phone;

			if (!isPhone(this.phone)) {
				this.$message('手机号码不正确',function () {
					uni.navigateTo({
						url: '/pages/login/login'
					})
				})
			}

		},
		methods: {
			...mapMutations(['USER_ID']),
			// 移动自定义数字键盘
			moveUp(x){
				 var animation = uni.createAnimation({
				      duration: 500,
				        timingFunction: 'ease',
				    })

				    this.animation = animation
					// 用px解决手机端失效问题
				    animation.translateY(x*l).step()

				    this.animationData = animation.export()
			},
			// 对应输入法删减最后一个数字
			backNup(){
				if(this.codeList.length>0){
					this.codeList.pop()
				}
			},
			// 清除验证码
			clearCode(){
				this.codeList=[]
			},
			// 输入6个数字之后自动校验验证码
			nup(i){
				if(this.codeList.length<6){
					// 小于6个会填写验证码
					this.codeList.push(i)
					// 如果填写后等于6个会触发验证
					if(this.codeList.length==6){
						var codePl="";
						this.showMessage = true;
						// 拿到验证码
						this.codeList.forEach((x)=>{
							codePl+=x+""
						})
						// 这里写业务逻辑
						// 接口成功后跳转
						if(this.type == 'login') {
							this.USER_ID(1);
							uni.setStorage({
								key:'USER_ID',
								data: 1
							})
							uni.navigateBack({
								delta: 2
							});
						} else {
							uni.navigateTo({
								url: '/pages/login/settingPassword'
							});
						}

					}
				}

			},
			calcCounter(){
				this.timer = setInterval(()=>{
					if(this.counter == 0){
						clearInterval(this.timer);
					} else {
						this.counter--
					}
				},1000);
			},
			// 发送验证码
			sendCode() {
				// 发送验证码逻辑
				this.counter = 60;
			}
		}
	}
</script>

<style lang="scss">
	.title{
		font-size: 50upx;
		margin: 50upx 0;
	}
	.content{
		padding: $space-lg;
	}
	.container{
		background-color: #fff;
	}
	.input_box{
		margin: 40upx 0;
	}
	.timer_section{
		margin-top: 50upx;
		text-align: center;
	}
	.flex-column-around{
			 display: flex;
			 flex-direction: column;
				 justify-content: space-around;
				 align-items: center;

	}
	.flex-row-around{
			 display: flex;
			 flex-direction: row;
			 justify-content: space-around;
			 align-items: center;
	}
	.flex-row-center{
			 display: flex;
			 flex-direction: row;
			 justify-content: center;
			 align-items: center;
	}
	.flex-wrap{
		flex-wrap: wrap;
	}
.move-inpt{
	animation:inpt 0.6s ease;
	animation-iteration-count:infinite;
	animation-direction:alternate;
}
.input-code{
	width: 75rpx;
	height: 4rpx;
	background-color: $mainColor;
	/* 定义名为bigt动画,0.6秒完成 ease为先减速再加速再减速的缓动运动 */
	animation:bigt 0.6s ease;
	/* 动画次数,infinite为一直重复 */
	animation-iteration-count:infinite;
	/* 定义动画重复时的运动方向,alternate为反向运动 */
	animation-direction:alternate;
}
/* 动画实际操作 */
@keyframes bigt
{
	/* {}里为组件属性 */
from {opacity:1;}
to {opacity:0.5;}
}
@keyframes inpt
{
from {opacity:1;}
to {opacity:0;}
}
.code{
	width: 75rpx;
	height: 1rpx;
	background-color: #a7a7a7;
}
.rotate_icon{
	transform: rotate(45deg);
}
.num-int{
	width: 215rpx;
	margin-top: 20rpx;
	height: 100rpx;
	background-color: #e7e7e7;
	border-radius: 10rpx;
	font-size: 40rpx;
}
</style>
