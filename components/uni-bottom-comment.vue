<template>
	<view class="uni-goods-nav">
		<!-- 底部占位 -->
		<view class="uni-tab__seat" />
		<view class="uni-tab__cart-box flex">
			
			<view :class="{'uni-tab__right':fill}" class="flex uni-tab__cart-sub-right ">
				<view
				 class="flex uni-tab__cart-button-right" @click="buttonClick"><text class="uni-tab__cart-button-right-text">我来说两句...</text></view>
				<!-- <view class="flex uni-tab__cart-button-right uni-tab__color-y ">立即购买</view> -->
			</view>
			<view class="flex uni-tab__cart-sub-left">
				<view v-for="(item,index) in options" :key="index" class="flex uni-tab__cart-button-left uni-tab__shop-cart" @click="onClick(index,item)">
					<view class="uni-tab__icon">
						<uni-icons :type="item.icon" size="20" :color="(item.icon == 'good' && item.isLike ) ? '#ffb011' : '#646566'"></uni-icons>
					</view>
					<view class="flex uni-tab__dot-box" v-if="item.icon != 'good'">
						<text v-if="item.info" :class="{ 'uni-tab__dots': item.info > 9 }" class="uni-tab__dot ">{{ item.info }}</text>
					</view>
					<view class="flex uni-tab__dot-box" v-else>
						<text v-if="item.info" class="invert_txt" :style="{color: (item.icon == 'good' && item.isLike ) ? '#ffb011' : '#646566' }">{{ item.info }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from '@/components/icons/icons.vue';
	/**
	 * GoodsNav 商品导航
	 * @description 商品加入购物车、立即购买等
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=865
	 * @property {Array} options 组件参数
	 * @property {Array} buttonGroup 组件按钮组参数
	 * @property {Boolean} fill = [true | false] 组件按钮组参数
	 * @event {Function} click 左侧点击事件
	 * @event {Function} buttonClick 右侧按钮组点击事件
	 * @example <uni-goods-nav :fill="true"  options="" buttonGroup="buttonGroup"  @click="" @buttonClick="" />
	 */
	export default {
		name: 'UniGoodsNav',
		components: {
			uniIcons
		},
		props: {
			options: {
				type: Array,
				default () {
					return [{
						icon: 'commet',
					}, {
						icon: 'good',
					}, {
						icon: 'share',
					}, {
						icon: 'more',
					}]
				}
			},
			buttonGroup: {
				type: Array,
				default () {
					return [{
							text: '加入购物车',
							backgroundColor: '#ffa200',
							color: '#fff'
						},
						{
							text: '立即购买',
							backgroundColor: '#ff0000',
							color: '#fff'
						}
					]
				}
			},
			fill: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			onClick(index, item) {
				this.$emit('clickItem', 
					index,
					item
				)
			},
			buttonClick(index, item) {
				this.$emit('buttonClick')
			}
		},
		computed:{
			optionss(x){
				console.log(x);
					return this.options
			}
		}
	}
</script>

<style lang="scss" scoped>
	.flex {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		
	}

	.uni-goods-nav {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: row;
		border-width: 2upx;
		border-style: solid;
		border-color: #f0f0f0;
	}

	.uni-tab__cart-box {
		flex: 1;
		height: 50px;
		background-color: #fff;
		z-index: 900;
	}

	.uni-tab__cart-sub-left {
		padding: 0 5px;
	}

	.uni-tab__cart-sub-right {
		flex: 1;
	}

	.uni-tab__right {
		margin: 5px 0;
		margin-right: 10px;
		border-radius: 100px;
		overflow: hidden;
	}

	.uni-tab__cart-button-left {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		// flex: 1;
		position: relative;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		padding: 0 10px;
	}

	.uni-tab__icon {
		width: 23px;
		height: 23px;
	}

	.image {
		width: 18px;
		height: 18px;
	}

	.uni-tab__text {
		margin-top: 3px;
		font-size: $uni-font-size-sm;
		color: #646566;
	}

	.uni-tab__cart-button-right {
		/* #ifndef APP-NVUE */
		display: flex;
		// flex-direction: column;
		/* #endif */
		flex: 1;
		justify-content: flex-start;
		align-items: center;
		background-color: #fafafa;
		padding-left: 10upx;
		margin: 14upx;
	}

	.uni-tab__cart-button-right-text {
		font-size: $uni-font-size-base;
		color: #5A5A5A;
	}

	.uni-tab__cart-button-right:active {
		opacity: 0.7;
	}

	.uni-tab__dot-box {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		position: absolute;
		right: 7px;
		top: 10upx;
		justify-content: center;
		align-items: center;
		border-radius: 4upx;
		// width: 0;
		// height: 0;
	}

	.uni-tab__dot {
		// width: 30rpx;
		// height: 30rpx;
		padding: 0 4px;
		line-height: 15px;
		color: #ffffff;
		text-align: center;
		font-size: 20upx;
		background-color: $mainColor;
		// border-radius: 15px;
	}
	

	.uni-tab__dots {
		padding: 0 4px;
		// width: auto;
		// border-radius: 15px;
	}

	.uni-tab__color-y {
		background-color: #ffa200;
	}

	.uni-tab__color-r {
		background-color: #ff0000;
	}
	.invert_txt{
		color: #000;
		background-color: transparent;
		padding: 0 4px;
		line-height: 15px;
		text-align: center;
		font-size: 20upx;
	}
</style>
