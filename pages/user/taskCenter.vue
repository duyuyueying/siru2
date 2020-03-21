<template>
	<view>
		<uni-title title="每日任务">
			<view><text class="u-link_txt">{{progress}}/31</text></view>
		</uni-title>
		<view class="list" v-for="(item,index) in taskList" :key="index">
			<task-list-item :item="item">
			</task-list-item>
		</view>
	</view>
	
</template>

<script>
	import uniTitle from '@/components/uni-title.vue';
	import taskListItem from '@/pages/user/task-list-item.vue';
	export default {
		data() {
			return {
				progress: 0, // 总任务进度
				taskList:[
					{name:'分享文章', total: 5, progress: 0, description: '分享文章至微信好友/朋友圈', score: 5, btnTxt: '分享', route: '/pages/index/index'},
					{name:'分享快讯', total: 5, progress: 0, description: '分享快讯至微信好友/朋友圈', score: 5, btnTxt: '分享', route: '/pages/news/index'},
					{name:'分享金榜',total: 1, progress: 0, description: '分享金榜至微信好友/朋友圈', score: 1, btnTxt: '分享', route: '/pages/quotations/quotations'},
					{name:'快讯评论',total: 10, progress: 0, description: '快讯评论', score: 10, btnTxt: '评论', route: '/pages/news/index'},
					{name:'文章评论',total: 10, progress: 0, description: '文章评论', score: 10, btnTxt: '评论', route: '/pages/index/index'},
				],
			}
		},
		components:{
			uniTitle,
			taskListItem
		},
		methods: {
			//用户点击列表项
			toPage(type){
				uni.navigateTo({
					url: '/pages/userCenterList/userCenterList?type='+type
				})
			}
		}
	}
</script>

<style lang="scss">
// .list{
// 	@include sideBorder;
// }
</style>
