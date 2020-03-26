<script>
	import {mapState, mapMutations} from 'vuex';
	export default {
		onLaunch: function() {
			console.log('App Launch');
			let _this = this;
			uni.getStorage({
				key: 'api_token',
				success(e) {
					console.log(e);
					_this.API_TOKEN(e.data);
				}
			});
			uni.getStorage({
				key: 'USER_INFO',
				success(e) {
					_this.USER_INFO(e.data);
				}
			});
			uni.getStorage({
				key: 'COLOR_THEME',
				success(e) {
					_this.COLOR_THEME(e.data);
				}
			});
			uni.getStorage({
				key: 'PRICE_POSITION',
				success(e) {
					_this.PRICE_POSITION(e.data);
				}
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			...mapMutations(['COLOR_THEME', 'API_TOKEN', 'USER_INFO','PRICE_POSITION']),
		}
	}
</script>

<style>
	/*每个页面公共css */
	page{
		font-family: PingFang SC,Lantinghei SC,Helvetica Neue,Helvetica,Arial,Microsoft YaHei,"sans-serif"
	}
</style>
