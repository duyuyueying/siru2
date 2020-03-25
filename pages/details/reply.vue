<template>
	<view class="wrap">
		<textarea maxlength="140" type="text" value="" :placeholder="nickname!='' ? '回复 @' + nickname:'我来说两句...'" focus class="input" @input="caclLength" v-model="value"></textarea>

		<view class="fixed" :style="{bottom: bottom}"><text class="letter_length_txt">{{length}}/140</text></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bottom: 0,
				length: 0,
				value: '',

				article_id:'0',
				reply_id:'0',
				reply_user_id:'0',
				nickname:'',
				re_reply_id:'0'
			}
		},
		onLoad(e) {
			this.article_id   = e.article_id || '0'
			this.reply_id   = e.reply_id || '0'
			this.reply_user_id   = e.reply_user_id || '0'
			this.nickname   = e.nickname || ''
			this.re_reply_id   = e.re_reply_id || '0'

			if (this.article_id=='0') {
				this.$message('操作错误',function () {
					uni.navigateBack({
						delta:1
					})
				})
			}

			let _this = this;
			uni.onKeyboardHeightChange(function(res){
				_this.bottom = res.height+10;
			})
		},
		onNavigationBarButtonTap(e) {
			if(e.index == 0) {
				//取消
				uni.navigateBack({
					delta:1
				})
			} else {
				//发布
				let content = this.value

				this.$api.comments_add({
					article_id: this.article_id,
					reply_id: this.reply_id,
					re_reply_id: this.re_reply_id,
					reply_user_id: this.reply_user_id,
					content: content,
				}).then(data => {
					if (data && data.code === 200) {
						this.$message('评论成功',function () {
							uni.navigateBack({
								delta:1
							})
						})
					} else {
						this.$message(data.msg)
					}
				})

			}
		},
		methods: {
			caclLength(e){
				let value = e.detail.value;
				let length = value.length;
				if(length <= 140){
					this.value = value;
					this.length = length;
				}
			}
		}
	}
</script>

<style lang="scss">
	.fixed{
		position: fixed;
		bottom: 10px;
		right: 10px;
		transition: bottom .5;
	}
	.wrap{
		padding: 0 $space-lg;
		position: relative;
	}
	.input{
		font-size: 32upx;
	}
	.letter_length_txt{
		font-size: 28upx;
		color: #ccc
	}
</style>
