<template>
	<view :class="['uni-tag--' + type]"
		 @click="onClick()" class="uni-tag" v-if="text" :style="{borderRadius: isCircle ? '60upx': '0upx'}">
		<view>
			<text class="uni-tag-text" :class="[type === 'default' ? 'uni-tag--default':'uni-tag--selected']">{{ text }}</text>
		</view>
		<view  @click="onClickRight()" class="right_btn_wrap" v-if="rightBtn">
			<icons type="add" color="#a0a0a0" size="12"></icons>
		</view>
	</view>
	
</template>

<script>
	/**
	 * Tag 标签
	 * @description 用于展示1个或多个文字标签，可点击切换选中、不选中的状态
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=35
	 * @property {String} text 标签内容
	 * @property {String} size = [normal|small] 大小尺寸
	 * 	@value normal 正常
	 * 	@value small 小尺寸
	 * @property {String} type = [default|primary|success｜warning｜error｜royal]  颜色类型
	 * 	@value default 灰色
	 * 	@value primary 蓝色
	 * 	@value success 绿色
	 * 	@value warning 黄色
	 * 	@value error 红色
	 * 	@value royal 紫色
	 * @property {Boolean} disabled = [true|false] 是否为禁用状态
	 * @property {Boolean} inverted = [true|false] 是否无需背景颜色（空心标签）
	 * @property {Boolean} circle = [true|false] 是否为圆角
	 * @event {Function} click 点击 Tag 触发事件
	 */
	import icons from '@/components/icons/icons.vue';
	export default {
		name: "UniTag",
		props: {
			type: {
				// 标签类型default、selected
				type: String,
				default: "default"
			},
			// 标签内容
			text: {
				type: String,
				default: ""
			},
			// 右边的x是否显示
			rightBtn: {
				type: Boolean,
				default: false
			},
			isCircle: {
				type: Boolean,
				default: false,
			}
		},
		components:{
			icons
		},
		methods: {
			onClick() {
				this.$emit("click");
			},
			onClickRight() {
				this.$emit("click-right");
			}
		}
	};
</script>

<style lang="scss" scoped>
	$tag-pd: 0px 16px;
	$tag-small-pd: 0px 8px;

	.uni-tag {
		@include flex-center(row);
		padding: $tag-pd;
		height: 64upx;
		line-height: 64upx;
		justify-content: center;
		color: $uni-text-color;
		border-radius: $uni-border-radius-base;
		background-color: $uni-bg-color-grey;
		border-width: 1rpx;
		border-style: solid;
		border-color: $uni-bg-color-grey;
	}                                                                                                                                                                                                                                                                                                                                       
	.uni-tag--selected {
		background-color: $whiteMainColor !important;
	}
	.uni-tag-text {
		color: $mainColor;
		font-size: $middle-font;
	}
	.uni-tag--default{
		color: $blackColor;
	}
	.uni-tag-btn-text{
		color: $whiteTextColor;
		font-size: $middle-font;
	}
	.right_btn_wrap{
		margin-left: $space-base;
		transform: rotate(45deg);
	}
	
</style>
