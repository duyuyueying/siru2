<template>
	<view>
		<view class="list" v-for="(list,list_i) in severList" :key="list_i">
			<uni-title :title="list.name" :isBold="false" :height="120" @click="onClick(list.nikeName)">
				<view @tap="toPage(list.nikeName)"><icons type="right" color="#ddd"></icons></view>
			</uni-title>
		</view>
	</view>
	
</template>

<script>
	import uniTitle from '@/components/uni-title.vue';
	import icons from '@/components/icons/icons.vue'
	export default {
		data() {
			return {
				severList:[
					{name:'回复我的',icon:'point.png',nikeName: 'replyMe'},
					{name:'赞过我的',icon:'quan.png',nikeName: 'likeMe'},
					{name:'关注我的',icon:'momey.png',nikeName: 'focusMe'},
					{name:'系统消息',icon:'point.png',nikeName: 'systemMessage'},
				],
			}
		},
		components:{
			uniTitle
		},
		methods: {
			//用户点击列表项
			toPage(type){
				uni.navigateTo({
					url: '/pages/userCenterList/userCenterList?type='+type
				})
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
</style>
