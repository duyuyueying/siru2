<template>
	<view class="list">
		<uni-title :title="title" :isBold="false" :height="120">
			<view class="flex_row item_wrap">
				<icons type="question" @click="showMask" color='#ffb100' v-if="showIcon"></icons>
				<view v-else></view>
				<switch :checked="checked" color="#34c759" style="transform:scale(0.8)" @change="onChange"/>
			</view>
		</uni-title>
	</view>
</template>

<script>
	import icons from '@/components/icons/icons.vue';
	import uniTitle from '@/components/uni-title.vue';
	export default {
		props: {
			title: String,
			checked:{
				type: Boolean,
				default: true,
			},
			showIcon:{
				type: Boolean,
				default: false
			}
		},
		components:{
			icons,
			uniTitle
		},
		methods:{
			showMask(){
				this.$emit('showMask');
			},
			onChange(e) {
				this.$emit('switchChange', e);
			}
		}
	}
</script>

<style lang="scss">
	.list{
		@include sideBorder;
	}
	.item_wrap{
	width: 450upx;
	justify-content: space-between;
	align-items: center;
}
</style>
