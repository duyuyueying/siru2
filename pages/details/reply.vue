<template>
	<view class="wrap">
		<textarea maxlength="140" type="text" value="" placeholder="我来说两句..." focus class="input" @input="caclLength" v-model="value"></textarea>
		
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
			}
		},
		onLoad(e) {
			this.article_id   = e.article_id || '0'
			this.reply_id   = e.reply_id || '0'
			this.reply_user_id   = e.reply_user_id || '0'
			this.nickname   = e.nickname || ''
			let _this = this;
			uni.onKeyboardHeightChange(function(res){
				_this.bottom = res.height+10;
			})
		},
		onNavigationBarButtonTap(e) {
			if(e.index == 0) {
				uni.navigateBack({
					delta:1
				})
			} else {
				console.log('发布')
			}
			console.log(e);
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
