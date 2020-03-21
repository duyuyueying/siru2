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
						<view v-for="(item, index) in tabItem.newsList" :key="index" class="news-item">
							<tag-list-item :items="item" v-if=" tabItemIndex == 1"></tag-list-item>
							<person-list-item :item="item" v-else-if=" tabItemIndex == 0" showDetail></person-list-item>
						</view> 
						<!-- 上滑加载更多组件 -->
						<mix-load-more :status="tabItem.loadMoreStatus"></mix-load-more>
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
			loadList(type){
				let tabItem = this.tabBars[this.currTab];
				//type add 加载更多 refresh下拉刷新
				if(type === 'add'){
					if(tabItem.loadMoreStatus === 2){
						return;
					}
					tabItem.loadMoreStatus = 1;
				}
				// #ifdef APP-PLUS
				else if(type === 'refresh'){
					tabItem.refreshing = true;
				}
				// #endif
				
				//setTimeout模拟异步请求数据
				setTimeout(()=>{
					let list = [];
					if(this.currTab == 0) {
						list = focusAuthors;
					} else {
						let tempTags = [].concat(tags);
						let tempArr = [];
						for (let i = 0, j = 0, tagsLen = tempTags.length; i < tagsLen; i += 2, j++) {
							tempArr[j] = tempTags.splice(0, 2)
						 }
						list = tempArr;
					}
				
					list.sort((a,b)=>{
						return Math.random() > .5 ? -1 : 1; //静态数据打乱顺序
					})
					if(type === 'refresh'){
						tabItem.newsList = []; //刷新前清空数组
					}
					list.forEach(item=>{
						item.id = parseInt(Math.random() * 10000);
						tabItem.newsList.push(item);
					})
					//下拉刷新 关闭刷新动画
					if(type === 'refresh'){
						this.$refs.mixPulldownRefresh && this.$refs.mixPulldownRefresh.endPulldownRefresh();
						// #ifdef APP-PLUS
						tabItem.refreshing = false;
						// #endif
						tabItem.loadMoreStatus = 0;
					}
					//上滑加载 处理状态
					if(type === 'add'){
						tabItem.loadMoreStatus = tabItem.newsList.length > 40 ? 2: 0;
					}
				}, 600)
			},
			// 切换tab
			changeTab(e) { 
				let index = e.detail.current
				if(index == this.currTab) {
					return;
				}
				this.currTab = index;
				if(!(this.tabBars[index] && this.tabBars[index].newsList.length > 0)){
					this.loadList('add')
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
