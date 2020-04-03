<template>
	<view class="container">
		<view class="bg_wrapper">
			<view :style="{ height: (iStatusBarHeight+44)+ 'px'}">
			  <!-- 这里是状态栏 /44的navbar-->
			</view>
			<view class="section">
				<text class="txt">#{{tagInfo.name}}#</text>
				<view class="btn" @click="focus"><text class="desc_txt" :style="{color: tagInfo.is_follow ? '#a0a0a0' : '#000'}">{{tagInfo.is_follow ? '已关注' : '+ 关注'}}</text></view>
			</view>
		</view>
		<mix-pulldown-refresh ref="mixPulldownRefresh" class="panel-content" :top="0" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll">
			<scroll-view
				class="panel-scroll-box" 
				:scroll-y="enableScrollY" 
				@scrolltolower="loadMore"
				>
				<news-item :newsItem="item" v-for="(item, index) in dataList" :key="index"></news-item>
				<!-- 上滑加载更多组件 -->
				<mix-load-more :status="loadMoreStatus" @click.native="loadMore"></mix-load-more>
			</scroll-view>
		</mix-pulldown-refresh>
	</view>
</template>

<script>
	import {focusAuthor, newItem, newsItems} from '@/mock/data.js';
	import newsItem from '@/components/list-item/news-item.vue';
	import {loadMore} from '@/common/util.js';
	export default {
		data() {
			return {
				iStatusBarHeight: 0,
				scrollViewOffset: 0,

				tagID: 0,
				tagInfo: {},
				dataList:[],
				loadMoreStatus:  0, //加载更多 0加载前，1加载中，2没有更多了
				enableScrollY: true,
				refreshing: false, // 刷新状态
				pageNum: 1,
				total: 0,
				pageSize: 15,
				lastPage: 1,
			}
		},
		mixins:[loadMore],
		components:{
			newsItem
		},
		onLoad(e) {
			this.iStatusBarHeight  = uni.getSystemInfoSync().statusBarHeight;
			this.tagID = e.id
			if (this.tagID=='0') {
				this.errorBack()
			}
			this.loadTag()

			this.loadList('refresh');
		},
		onPageScroll(e) {
			if(Math.ceil(e.scrollTop) + 20 > this.scrollViewOffset ) {
				this.enableScrollY = true;
			} else {
				this.enableScrollY = false;
			}
		},
		mounted() {
			this.getElSize();
		},
		methods:{
			loadTag() {
				this.$api.tag_info(this.tagID).then(data => {
					if (data && data.code === 200) {
						this.tagInfo = data.result
						uni.setNavigationBarTitle({
							title: `#${data.result.name}#`
						})
					}else{
						this.errorBack()
					}
				})
			},
			errorBack(){
				this.$message('操作错误',function () {
					uni.navigateBack({
						delta:1
					})
				})
			},
			//列表
			loadList(action){
				//action= add上拉加载 refresh下拉刷新
				if (action=='refresh') {
					this.dataList = [];
					this.pageNum = 1;
					this.loadMoreStatus = 0;
				}

				if (this.loadMoreStatus==0) {
					this.loadMoreStatus = 1;
					this.$api.search_articles({
						type: [1,3],
						keyword: this.tagInfo.name,
						pageNum: this.pageNum,
						pageSize: this.pageSize,
					}).then(data => {
						if (data && data.code === 200) {
							this.info = data.result.info
							const result = data.result.data
							this.total = data.result.total
							this.lastPage = data.result.last_page
							this.dataList.push(...result);
							this.$refs.mixPulldownRefresh && this.$refs.mixPulldownRefresh.endPulldownRefresh();
							this.refreshing = false;

							if (this.pageNum==this.lastPage) {
								this.loadMoreStatus = 2;
							}else{
								this.loadMoreStatus = 0;
							}
							this.pageNum += 1;
						}
					})
				}
			},
			//获得元素的size
			getElSize() { 
				let el = uni.createSelectorQuery().select('.panel-scroll-box');
				el.fields({
					size: true,
					scrollOffset: true,
					rect: true
				}, (data) => {
					this.scrollViewOffset = data.top;
				}).exec();
			},
			
			focus() {
				this.$api.follows_tag(this.tagInfo.id).then(data => {
					if (data && data.code === 200) {
						this.tagInfo.is_follow = data.result
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page,.container{
		height: 100%;
		// overflow: hidden;
	}
	.panel-scroll-box{
		height: 100%;
	}
	.bg_wrapper{
		position: relative;
		z-index: 2;
		height: 400upx;
		align-items: center;
		justify-content: center;
		background-image: radial-gradient(farthest-corner at 100% 100%, #1e0900,#bf7101 , #b25900);
	}
	.txt{
		// line-height: 56upx;
		@include txt(32upx, #fff);
	}
	.desc_txt{
		@include txt(28upx, #000);
		text-align: center;
	}
	.section{
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 50upx;
		height: 300upx;
		flex: 1;
	}
	.btn{
		width: 140upx;
		height: 56upx;
		border-radius: 30upx;
		background-color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 20upx;
	}
</style>
