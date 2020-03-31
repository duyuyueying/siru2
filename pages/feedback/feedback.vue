<template>
	<view>
		<uni-title title="反馈类型" color="#999" :isBold="false"></uni-title>
		<view class="u-wrap">
			<view class="spacing-row-sm tag_item" v-for="(item, index) in types" :key="index">
				<uni-tag :text="item.name" :type="currType != item.type ?'default': 'selected'" @click="choiceTag(item, item.type)" isCircle></uni-tag>
			</view>
		</view>
		<uni-title title="反馈内容(必填)" color="#999" :isBold="false"></uni-title>
		<textarea value="" placeholder="请尽量详尽描述您的问题,您的建议与反馈是我们前进的动力" class="textarea" v-model="content"/>
		<uni-title title="联系人(必填)" color="#999" :isBold="false" placeholder-class="placeholder"></uni-title>
		<input type="text" class="input" placeholder="如何称呼您,如王先生/张女士" v-model="contact"/>
		<uni-title title="联系方式(必填)" color="#999" :isBold="false" placeholder-class="placeholder"></uni-title>
		<input type="text" class="input" placeholder="QQ/微信号/邮箱/手机号" v-model="contactStyle" />
		
		<view class="submit_btn" @click="submit" 
		:style="{backgroundColor:  '#FFB100'}">
			<text class="submit_btn_txt" :style="{color:  '#fff'}">提交</text></view>
	</view>
</template>

<script>
	import uniTitle from '@/components/uni-title.vue';
	import uniTag from '@/components/uni-tag.vue';

	//默认1功能,2体验,3内容,4其他
	const TYPE=[
		{name:'功能建议', type:1},
		{name:'体验建议', type:2},
		{name:'内容建议', type:3},
		{name:'其他', type:4}
	];
	export default {
		data() {
			return {
				types: TYPE,
				content: '',
				contact: '',
				contactStyle: '',
				currType: 1,
				tag: '',
			}
		},
		components:{
			uniTitle,
			uniTag
		},
		methods: {
			choiceTag(item, type) {
				this.currType = type;
				this.tag = item.name;
			},
			// 修改密码提交逻辑
			submit(){
				if(this.content == ''){
					uni.showToast({
						icon: 'none',
						title: '请输入反馈内容'
					});
					return;
				}
				if(this.contact == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入联系人'
					});
					return;
				}
				if(this.contactStyle == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入联系方式'
					});
					return;
				}

				this.$api.feedback_add({
					type: this.currType,
					content: this.content,
					nick_name: this.contact,
					contact: this.contactStyle,
				}).then(data => {
					if (data && data.code === 200) {
						this.$message('提交成功',function () {
							uni.navigateBack({
								delta: 1
							});
						},900)
					} else {
						this.$message(data.msg)
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.u-wrap{
		@include flex-center(row, flex-start,$flex-wrap: wrap);
		margin-bottom: $space-sm;
		background-color: $whiteColor;
	}
	.tag_item{
		margin-bottom: $space-sm;
	}
	.input{
		margin: 0 $space-lg;
		padding: $space-sm $space-lg;
		border: 1upx solid $borderColor;
		border-radius: 6upx;
		font-size: 26upx;
	}
	.textarea{
		margin: 0 $space-lg;
		padding: $space-sm $space-lg;
		border: 1upx solid $borderColor;
		font-size: 26upx;
		border-radius: 6upx;
		height: 240upx;
	}
	.placeholder{
		color: #ccc;
	}
	.submit_btn{
		width: 150px;
		height: 68upx;
		line-height: 68upx;	
		background-color: #fafafa;
		margin: 30upx auto 0upx;
		border-radius: 40upx;
		text-align: center;
	}
	.submit_btn_txt{
		color: #5d6368;
		font-size: 26upx;
	}
</style>
