<template>
	<view>
		<!-- 港澳台实名认证 -->
		<view style="flex:1">
			<view class="mb50" v-if="this.showType == 'passport'"><uni-input-section placeholder="国家或地区" type="picker" @input="changeValue('country', $event)"></uni-input-section></view>
			<view class="mb20"><uni-input-section placeholder="证件姓名" @input="changeValue('name', $event)"></uni-input-section></view>
			<view class="mb50"><uni-input-section placeholder="证件号码"  @input="changeValue('id', $event)"></uni-input-section></view>
			<view class="mb50 center"><uni-upload label="上传证件正面照片" @changePath="changPath($event, 'front')" :imagPath="frontImg"></uni-upload></view>
			<view class="mb50 center" v-if="this.showType != 'passport'"><uni-upload label="上传证件反面照片" @changePath="changPath($event, 'back')" :imagPath="backImg"></uni-upload></view>
			<view class="submit_btn" @click="submit"><text class="submit_btn_txt">提交</text></view>
		</view>
		
		<!-- 企业认证 -->
		<!-- <uni-steps :options="steps" activeColor="#ffb100" deactiveColor="#e1e1e1"></uni-steps>
		<view class="mb20"><uni-input-section placeholder="企业姓名"></uni-input-section></view>
		<view class="mb50 center"><uni-input-section placeholder="企业营业执照注册号" desc="请输入15位营业执照注册号,无注册号输入18位统一社会信用代码,主体号码与营业执照上必须保持一致,其他号码不予认证"></uni-input-section></view>
		<view class="mb50 center"><uni-upload label="上传营业执照照片"></uni-upload></view> -->
		
		<!-- 媒体认证 -->
		<!-- <uni-steps :options="steps1" activeColor="#ffb100" deactiveColor="#e1e1e1"></uni-steps>
		<view class="mb20"><uni-input-section placeholder="组织名称" desc="请填写组织机构代码证中的组织名称,注册成功后名称不可修改"></uni-input-section></view>
		<view class="mb50"><uni-input-section placeholder="组织机构代码" desc="请输入9位组织机构代码,或输入18位的统一社会信用代码,其他号码不予认证"></uni-input-section></view>
		<view class="mb50 center"><uni-upload label="上传营业执照扫描件"></uni-upload></view> -->
	</view>
</template>

<script>
	import {UniSteps} from '@dcloudio/uni-ui';
	import uniInputSection from '@/components/uni-input.vue';
	import uniUpload from '@/components/uni-upload.vue';
	import {mapState, mapMutations } from 'vuex';
	export default {
		data() {
			return {
				steps: [{
					desc: '上传企业信息'
				},{
					desc: '上传运营者信息'
				}],
				steps1: [{
					desc: '上传主体信息'
				},{
					desc: '上传运营者信息'
				}],
				showType: '',// HongkongTaiPass: 港澳台pass；passport:护照
				name: '', // 缓存名称
				id: '', // 缓存证件号码
				country: '', // 国家
				// frontImgPath: '', // 正面照
				// backImgPath: '', //背面照
				
			}
		},
		onLoad(query) {
			if(query.type === 'HongkongPass' || query.type === 'TaiwanPass') {
				this.showType = 'HongkongTaiPass';
			} else {
				this.showType = 'passport';
			}
			uni.setNavigationBarTitle({
				title: '个人实名认证'
			})
		},
		onUnload(){
			if(this.frontImg != null) {
				this.FRONT_IMG(null)
			}	
			if(this.backImg != null) {
				this.BACK_IMG(null)
			}
		},
		components:{
			UniSteps,
			uniInputSection,
			uniUpload
		},
		computed: mapState(['frontImg', 'backImg']),
		methods: {
			...mapMutations(['BACK_IMG','FRONT_IMG']),
			changeValue(key, value) {
				this[key] = value;
			},
			changPath(imgUrl,type){
				uni.navigateTo({
					url: '/pages/crop/crop?imagePaht='+imgUrl+'&type='+type
				})
				// this.frontImgPath = '../../static/temp/avatar.jpeg';
			},
			showToast(txt){
				uni.showToast({
					icon:'none',
					title: txt
				});
				setTimeout(()=>{
					uni.hideToast()
				}, 3000);
			},
			verify(){
				if(this.showType === 'passport' && this.country == ''){
					this.showToast('请选择国家或地区');
					return false;
				}
				if(this.name == ''){
					this.showToast('请填写证件姓名');
					return false;
				}
				if(this.id == ''){
					this.showToast('请填写号码');
					return false;
				}
				if(this.frontImgPath == ''){
					this.showToast('请上传正面照片');
					return false;
				}
				if(this.showType == 'HongkongTaiPass' && this.backImgPath == ''){
					this.showToast('请上传反面照片');
					return false;
				}
				return true
				
			},
			submit() {
				if(this.verify()) {
					// TODO: 联调接口
				}
			}
		}
	}
</script>

<style lang="scss">
.mb50{
		margin-bottom: 50upx;
	}
.center{
	@include flex-center;
}
.submit_btn{
	margin: 0 150upx;
	height: 88upx;
	@extend .flex;
	background-color: $mainColor;
	justify-content: center;
	align-items: center;
}
.submit_btn_txt{
	color: #fff;
	font-size: 34upx;
}
.mb20{
	margin-bottom: 20upx;
}
.mb50{
	margin-bottom: 50upx;
}
</style>
