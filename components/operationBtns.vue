<template>
	<view class="flex_row operation_wrapper">
		<view @click="doGood" class="btn_item"><icons type="chartUp" :color="goodFlag && upTheme != null  ? upTheme.txt : '#a0a0a0' "></icons><text class="txt" :style="{color:goodFlag && upTheme != null  ? upTheme.txt : '#a0a0a0' }">利好  {{goodCount}}</text></view>
		<view @click="doBad" class="btn_item"><icons type="chartDown" :color="badFlag && downTheme != null  ? downTheme.txt : '#a0a0a0'"></icons><text class="txt" :style="{color:badFlag && downTheme != null  ? downTheme.txt : '#a0a0a0' }">利空  {{badCount}}</text></view>
		<view @click="doCommet" class="btn_item" v-if="showComment"><icons type="commet" color="#a0a0a0"></icons><text class="txt">评论  {{commentCount}}</text></view>
		<view @click="doShare" class="btn_item" v-if="showShare"><icons type="share" color="#a0a0a0"></icons><text class="txt">分享</text></view>
	</view>
</template>

<script>
	import icons from '@/components/icons/icons.vue';
	import {mapState} from 'vuex';
	export default {
		data() {
			return {
				goodFlag: false,
				badFlag: false,
			}
		},
		props: {
			goodCount: Number,
			badCount: Number,
			commentCount: Number,
			id: Number,
			showComment: {
				type: Boolean,
				default: true
			},
			showShare: {
				type: Boolean,
				default: true
			},
			isClick: {
				type: Boolean,
				default: true
			}
		},
		components:{
			icons,
		},
		created(){
			if(!this.isClick){
				this.init();
			}
		},
		computed:mapState(['upTheme', 'downTheme']),
		methods: {
			init() {
				if(this.goodCount > this.badCount){
					this.goodFlag = true;
					this.badFlag = false;
				} else {
					this.goodFlag = false;
					this.badFlag = true;
				}
			},
			// 利好
			doGood(){
				this.$emit('doGood');
				// if(!this.isClick){
				// 	return;
				// }
				// this.goodFlag = !this.goodFlag;
				// if(this.goodFlag) {
				// 	this.goodCount++;
				// } else {
				// 	this.goodCount--;
				// }
			},
			// 利空
			doBad(){
				this.$emit('doBad');
				// if(!this.isClick){
				// 	return;
				// }
				// this.badFlag = !this.badFlag;
				// if(this.badFlag) {
				// 	this.badCount++;
				// } else {
				// 	this.badCount;
				// }
			},
			doCommet() {
				this.$emit('gotoCommet');
			},
			doShare() {
				console.log('xxx');
				this.$emit('share');
			}
		}
	}
</script>

<style lang="scss">
	.operation_wrapper{
		background-color: #fff;
		align-items: center;
	}
	.btn_item{
		flex-direction: row;
		flex:1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: $space-sm 0;
		margin-left: $space-sm;
	}
	.txt{
		@include txt;
		margin-left: 5upx;
	}
</style>
