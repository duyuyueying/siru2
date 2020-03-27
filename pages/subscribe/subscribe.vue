<template>
	<view class="content">
		<view class="subscribe_tab_wrap">
			<tabs :tabs="['作者', '标签']" :defaultTab="currTab" @changeTab="changeTab"></tabs>
		</view>
		<mix-pulldown-refresh ref="mixPulldownRefresh" class="panel-content" :top="90" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll">
 			<swiper 
				id="swiper"
				class="swiper-box" 
				:duration="300" 
				:current="currTab" 
				@change="changeTab"

				:scroll-y="enableScrollY"
				@scrolltolower="loadMore"
			>
				<swiper-item v-for="(tabItem, tabItemIndex) in tabBars" :key="tabItemIndex">
					<scroll-view 
						class="panel-scroll-box" 
						:scroll-y="enableScroll" 
						@scrolltolower="loadMore"
						>
						<!-- 
							* 新闻列表 
							* 和nvue的区别只是需要把uni标签转为weex标签而已
							* class 和 style的绑定限制了一些语法，其他并没有不同
						-->
						<view v-for="(item, index) in dataList" :key="index" class="news-item">
							<tag-list-item :items="item" v-if=" tabItemIndex == 1"></tag-list-item>
							<person-list-item :item="item" v-else-if=" tabItemIndex == 0" showDetail></person-list-item>
						</view>
						<!-- 上滑加载更多组件 -->
						<mix-load-more :status="loadMoreStatus" @click.native="loadMore"></mix-load-more>
					</scroll-view>
				</swiper-item>
			</swiper>
		 </mix-pulldown-refresh>
	</view>
</template>

<script>
	import tabs from '@/components/tabs.vue';
	import {focusAuthors, tags} from '@/mock/data.js';
	import personListItem from '@/components/list-item/person-list-item.vue';
	import TagListItem from '@/components/list-item/tag_list_item.vue';
	import {loadMore} from '@/common/util.js';
	export default {
		data() {
			return {
				currTab: 0,
				personList: [],
				tabBars: [],

				followType: 'user',
				dataList:[],
				loadMoreStatus:  0, //加载更多 0加载前，1加载中，2没有更多了
				enableScrollY: true,
				refreshing: false, // 刷新状态
				pageNum: 1,
				total: 0,
				pageSize: 8,
				lastPage: 1,
			}
		},
		mixins:[loadMore],
		components:{
			tabs,
			personListItem,
			TagListItem
		},
		created() {
			this.tabBars = this.initTab([{name: '作者'},{name: '标签'}]);
			this.loadList('add');
		},
		methods: {
			//列表
			loadList(action){
				//action= add上拉加载 refresh下拉刷新
				if (action=='refresh') {
					this.dataList = [];
					this.pageNum = 1;
					this.loadMoreStatus = 0;
				}

				console.log("status:"+this.loadMoreStatus)
				if (this.loadMoreStatus==0) {
					this.loadMoreStatus = 1;

					if(this.followType == 'tag') {
						//获取tag列表
						this.$api.tags({}).then(data=>{
							if (data && data.code === 200) {
								console.log(data);
								let tempTags = [].concat(data.result);
								let tempArr = [];
								for (let i = 0, j = 0, tagsLen = tempTags.length; i < tagsLen; i += 2, j++) {
									tempArr[j] = tempTags.splice(0, 2)
								}
								this.dataList = tempArr;
								this.$refs.mixPulldownRefresh && this.$refs.mixPulldownRefresh.endPulldownRefresh();
								this.refreshing = false;
								this.loadMoreStatus = 2;
							}
						})
						return
					}

					this.$api.authors({
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
						} else {
							this.errorBack()
						}
					})
				}
			},
			// 切换tab
			changeTab(e) { 
				let index = e.detail.current
				if(index == this.currTab) {
					return;
				}
				this.currTab = index;
				this.followType = (this.currTab == 0) ? 'user': 'tag'

				if(!(this.tabBars[index] && this.tabBars[index].newsList.length > 0)){
					this.loadList('refresh')
				}
			}
		}
	}
</script>

<style>
page, .content{
	background-color: #fff;
	height: 100%;
	overflow: hidden;
}
.subscribe_tab_wrap{
	position: relative;
	z-index: 2;
}
.swiper-box{
		height: 100%;
	}
.panel-scroll-box{
	height: 100%;
	
	.panel-item{
		background: #fff;
		padding: 30px 0;
		border-bottom: 2px solid #000;
	}
}
</style>
