<template>
	<view style="height:100%">
		<!-- 顶部选项卡 -->
		<scroll-view id="nav-bar" class="nav-bar" scroll-x scroll-with-animation :scroll-left="scrollLeft" :show-scrollbar="false" v-if="isScrollX">
			<view
				v-for="(item,index) in tabBars" :key="index"
				class="nav-item"
				:class="{current: index === tabCurrentIndex}"
				:id="'tab'+index"
				@click="changeTab(index,item)"
			>{{item.name}}</view>
		</scroll-view>
		<view class="nav-bar nav-bar-no-slip" id="nav-bar" v-else>
			<view
				v-for="(item,index) in tabBars" :key="index"
				class="nav-item"
				:class="{current: index === tabCurrentIndex}"
				:id="'tab'+index"
				@click="changeTab(index)"
			>{{item.name}}</view>
		</view>
		<!-- 下拉刷新组件 -->
		<mix-pulldown-refresh ref="mixPulldownRefresh" class="panel-content" :top="90" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll">
			<swiper
				id="swiper"
				class="swiper-box"
				:scroll-y="enableScrollY"
				:duration="300"
				:current="tabCurrentIndex"
        @change="changeTab"
			>
				<swiper-item v-for="(tabItem, index) in tabBars" :key="index">
					<scroll-view
						class="panel-scroll-box"
						:scroll-y="enableScroll"
						@scrolltolower="loadMore"
					>
						<component :is="tabItem.component" :tabItem="tabItem" :data="tabItem.data" ref="component" @changeLoadStatus="onChangeLoadStatus" @changeRefreshStatus="onChangeRefreshStatus"></component>
						<mix-load-more :status="loadMoreStatus" @click.native="loadMore" v-if="!tabItem.noLoadMore"></mix-load-more>
					</scroll-view>
				</swiper-item>
			</swiper>
		</mix-pulldown-refresh>
	</view>
</template>

<script>
	import mixPulldownRefresh from '@/components/mix-pulldown-refresh/mix-pulldown-refresh';
	import mixLoadMore from '@/components/mix-load-more/mix-load-more';
	import uniVedioListItem from '@/components/list-item/uni-video-list-item.vue';

	let windowWidth = 0, scrollTimer = false, tabBar;
	export default {
    name: 'uni-tab-swiper',
		components: {
			mixPulldownRefresh,
			mixLoadMore,
    },
    props: {
      tabBars: {
        type: Array,
        default(){
          return []
        }
      },
      initIndex: {
        type: Number,
        default: 0
			},
			// tabBar是否支持x轴滚动
			isScrollX:{
				type: Boolean,
				default: false,
			}
    },
		data() {
			return {
				scrollLeft: 0, //顶部选项卡左滑距离
				enableScroll: true,
				tabCurrentIndex: this.initIndex, //当前选项卡索引
				loadMoreStatus:  0, //加载更多 0加载前，1加载中，2没有更多了
				enableScrollY: true,
				refreshing: false, // 刷新状态
				pageNum: 1,
				total: 0,
				pageSize: 15,
				lastPage: 1,
			}
		},
    created(){
      windowWidth = uni.getSystemInfoSync().windowWidth;
    },
    mounted(){
      // TODO: nextTick之后为什么拿不到dom元素？？
      setTimeout(()=>{
        this.initListData(this.tabCurrentIndex)
      }, 500)
      // this.nextTick(()=>{
      //   let component = this.$refs.component[this.tabCurrentIndex];
      //   if(component && component.initData){
      //     component.initData();
      //   }
      // })
    },
		methods: {
      // 初始化列表数据
      initListData(current) {
        let component = this.$refs.component[current];
        if(component && component.initData){
          component.initData();
        }
      },
      onPulldownReresh(){
        this.initListData(this.tabCurrentIndex)
      },
      loadMore(){
        let component = this.$refs.component[this.tabCurrentIndex];
        if(component && component.loadMore){
          component.loadMore();
        }
      },
      onChangeLoadStatus(status) {
        this.loadMoreStatus = status
      },
      onChangeRefreshStatus(status) {
        this.$refs.mixPulldownRefresh && this.$refs.mixPulldownRefresh.endPulldownRefresh();
        this.refreshing = status
      },
			//切换Tabbar
			async changeTab(e,item){
				if(scrollTimer){
					//多次切换只执行最后一次
					clearTimeout(scrollTimer);
					scrollTimer = false;
				}
				let index = e;
				//e=number为点击切换，e=object为swiper滑动切换
				if(typeof e === 'object'){
					index = e.detail.current
				}
				if(typeof tabBar !== 'object'){
					tabBar = await this.getElSize("nav-bar")
				}
				//计算宽度相关
				let tabBarScrollLeft = tabBar.scrollLeft;
				let width = 0;
				let nowWidth = 0;
				//获取可滑动总宽度
				for (let i = 0; i <= index; i++) {
					let result = await this.getElSize('tab' + i);
					width += result.width;
					if(i === index){
						nowWidth = result.width;
					}
				}
				if(typeof e === 'number'){
					//点击切换时先切换再滚动tabbar，避免同时切换视觉错位
					this.tabCurrentIndex = index;
				}
				//延迟300ms,等待swiper动画结束再修改tabbar
				scrollTimer = setTimeout(()=>{
					if (width - nowWidth/2 > windowWidth / 2) {
						//如果当前项越过中心点，将其放在屏幕中心
						this.scrollLeft = width - nowWidth/2 - windowWidth / 2;
					}else{
						this.scrollLeft = 0;
					}
					if(typeof e === 'object'){
						this.tabCurrentIndex = index;
					}
					this.tabCurrentIndex = index;
        }, 300)
        this.initListData(index);
      },
			//设置scroll-view是否允许滚动，在小程序里下拉刷新时避免列表可以滑动
			setEnableScroll(enable){
				if(this.enableScroll !== enable){
					this.enableScroll = enable;
				}
      },
			//获得元素的size
			getElSize(id) {
				return new Promise((res, rej) => {
					let el = uni.createSelectorQuery().select('#' + id);
					el.fields({
						size: true,
						scrollOffset: true,
						rect: true
					}, (data) => {
						res(data);
					}).exec();
				});
			}
    }
	}
</script>

<style lang='scss'>
	page, .content{
		background-color: #f8f8f8;
		height: 100%;
		overflow: hidden;
	}
	.navbar_header{
		height: 44px;
		line-height: 44px;
		@extend .flex_row;
		@extend .space_between;
		padding: 0 $space-lg;
		background-color: $whiteColor;
		.logo{
			width: 120px;
			height: 22px;
		}
		.logo_wrap{
			width: 120px;
			margin-right: $space-lg;
			@extend .flex;
			align-items: center;
		}
		.search_wrap{
			@extend .flex;
			align-items: center;
		}
	}
	/* 顶部tabbar */
	.nav-bar{
		position: relative;
		z-index: 10;
		height: 90upx;
		white-space: nowrap;
		box-shadow: 0 2upx 8upx rgba(0,0,0,.06);
		background-color: #fff;
		&.nav-bar-no-slip{
			display: flex;
			flex: 1;
			.nav-item{
				flex: 1;
				padding: 0;
			}
		}
		.nav-item{
			display: inline-block;
			/* width: 150upx; */
			padding: 0 20upx;
			/* height: 90upx; */
			text-align: center;
			line-height: 90upx;
			font-size: 30upx;
			color: #303133;
			position: relative;
			&:after{
				content: '';
				width: 0;
				height: 0;
				border-bottom: 4upx solid #007aff;
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translateX(-50%);
				transition: .3s;
			}
		}
		.current{
			color: $mainColor;
			/* &:after{
				width: 50%;
			} */
		}
	}

	.swiper-box{
		height: 100%;
	}
	.panel-scroll-box{
		height: calc(100% - 44px - var(--status-bar-height));
	}
	/* 新闻列表  emmm 仅供参考 */
	.news-item{
		background-color: #fff;
	}
	/* 头部样式 */
	.header{
		height: 85upx;
		padding: 10upx 15upx;
		display: flex;
		align-items: center;
		background-color:#fff;
		flex-direction: row;
		justify-content: space-between;
	}
	.input_search{
		background-color: #f5f5f5;
		border-radius: 6upx;
		height: 55upx;
		padding: 0upx 20upx;
		justify-content: space-between;
		display: flex;
		align-items: center;
		flex-direction: row;
		flex: 1;
	}
	.input_search_txt {
		color: #999;
		font-size: 25upx
	}
	/* 新闻早八点|专题 */
	.import_news_wrapper {
		height: 166upx;
		margin-bottom: 12upx;
		background-color: #fff;
		display: flex;
		flex-direction: row;
		overflow: hidden;
		position: relative;
	}
	.import_item {
		flex: 1;
		padding: 20upx;
		justify-content: space-between;
		position: relative;
	}
	.import_item_head {
		@extend .flex_row;
		/* flex-direction: row; */
		justify-content: space-between;
		align-items: center;
	}
	.import_item_title{
		font-weight: bold;
		color: $mainColor;
	}
	.import_item_time {
		color: #999;
		font-size: 20upx
	}
	.import_item_content_txt{
		font-size: 28upx;
		// line-height: 1.4;
		color: #000;
		@include more_line_ellipsis;
	}
	.media-item-line {
		position: absolute;
		top: 30upx;
		right:0;
		bottom: 0;
		width: 2upx;
		height: 106upx;
		background-color: $borderColor;
	}
	.import_news_list_wrapper {
		background-color: #fff;
		margin-bottom: 12upx;
	}
	/* 关注头部 */
	.focus_head_tab_wrap{
		height: 75upx;
		justify-content: space-between;
	}
	.text_wrap{
		width: 100upx;
		line-height: 75upx;
	}

</style>
