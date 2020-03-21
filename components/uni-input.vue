<template>
	<view class="u-input_wrap">
		<label for="" class="u-input_label"></label>
		<input type="text" class="u-input" :placeholder="placeholder" @input="input" v-model="value">
		<view><text class="u-input_desc" v-if="desc">{{desc}}</text></view>
		<picker :range="country" range-key="name" @change="input" v-if="type == 'picker'" class="picker"></picker>
		<view class="icon_wrap" v-if="type == 'picker'"><icons type="down" color="#ccc"></icons></view>
	</view>
</template>

<script>
	const COUNTRY = [{
		name: '中国',
		type: 'IDCard'
	},{
		name: '美国',
		type: 'HongkongPass'
	},{
		name: '日本',
		type: 'TaiwanPass',
	},
	{
		name: '英国',
		type: 'passport'
	}];
	import icons from '@/components/icons/icons.vue';
	export default {
		name: 'uniInputSection',
		data(){
			return {
				country: COUNTRY,
				value: ''
			}
		},
		props:{
			placeholder: String,
			desc: String,
			type: String,
		},
		components:{
			icons
		},
		methods:{
			input(e){
				let value = '';
				if(this.type == 'picker'){
					value = COUNTRY[e.detail.value].name;
				} else {
					value = e.detail.value
				}
				this.value = value
				this.$emit('input', value)
			}
		}
	}
</script>

<style lang="scss">
	.u-input_wrap{
		padding: 0 $space-lg;
		position: relative;
	}
	.u-input{
		height: 96upx;
		border-style: solid;
		border-width: 1upx;
		border-color: #edf0f2;
		border-radius: 4upx;
		@include txt(30upx);
		padding: $space-base $space-lg;
	}
	.u-input_desc{
		@include txt(24upx, #868686);
		line-height: 30upx;
		margin-top: $space-base;
	}
	.picker{
		position: absolute;
		left: $space-lg;
		right: $space-lg;
		top: 0;
		bottom: 0;
		z-index: 20;
	}
	.icon_wrap{
		width: 50upx;
		height: 50upx;
		// background-color: red;
		position: absolute;
		right: 50upx;
		top: 35upx;
		z-index: 15;
	}
</style>
