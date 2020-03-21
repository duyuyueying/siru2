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
					{name:'行情颜色',nikeName: 'color'},
					{name:'显示价格',nikeName: 'price'},
				],
			}
		},
		components:{
			uniTitle
		},
		onLoad(e) {
			console.log(e);
		},
		methods: {
			//用户点击列表项
			toPage(type){
				uni.navigateTo({
					url: '/pages/settingTheme/changeSettingTheme?type='+type
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
