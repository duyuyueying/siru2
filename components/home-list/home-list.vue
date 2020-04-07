<template>
	<view>
		<!-- 最新/头条,id为top tab内容 -->
    <view class="main_news_section" v-if="tabItem.id == 'top'">
      <view class="banner_wrapper">
        <swiper-banner :swiperList="bannerList" :autoplay="true"></swiper-banner>
      </view>
      <view class="import_news_wrapper" v-if="importNews.length > 0">
        <view class="import_item" v-for="(item, index) in importNews" :key="index" @click="toPage(item.id, item.type)">
          <view class="import_item_head">
            <text class="import_item_title">{{index == 0 ? '新闻早八点' :'专题'}}</text>
            <text class="import_item_time">{{item.time}}</text>
          </view>
          <view class="import_item_content">
            <text class="import_item_content_txt">{{item.detail}}</text>
          </view>
          <view class="media-item-line" v-if="index==0"></view>
        </view>
      </view>
      <view class="import_news_list_wrapper">
        <news-item :newsItem="item" v-for="(item, index) in importNewsListData" :key="index"></news-item>
      </view>
      <view class="banner_wrapper" v-if="specialList.length > 0" style="margin-bottom: 5px;">
        <swiper-banner :swiperList="specialList" :autoplay="false" cornerMark="专题"></swiper-banner>
      </view>
    </view>

    <!-- 关注头部 -->
    <view v-if="tabItem.name == '关注'" class="row_wrap focus_head_tab_wrap">
      <view class="flex_row_center">
        <view class="text_wrap" @click="changeFocusTabCurr(0)">
          <text class="list_item_normal_txt" :class="{focus_color: focusTabCurr == 0}">作者</text>
        </view>
        <view class="text_wrap" @click="changeFocusTabCurr(1)">
          <text class="list_item_normal_txt" :class="{focus_color: focusTabCurr == 1}">标签</text>
        </view>
      </view>
      <view class="text_wrap" @click="gotoSubscribe">
        <text class="list_item_more_black_txt">+订阅</text>
      </view>
    </view>
    <view v-for="(item, index) in dataList" :key="index" class="news-item">
      <uni-vedio-list-item :item="item" v-if="item.type == '3'"></uni-vedio-list-item >
      <person-list-item :item="item" v-else-if="hasFollow==false && tabItem.id == 'follow' && focusTabCurr == 0" showDetail></person-list-item>
      <tag-list-item :items="item" v-else-if="hasFollow==false && tabItem.id == 'follow' && focusTabCurr == 1"></tag-list-item>
      <fast-news-item :newsItem="item" v-else-if="item.type == '2'"></fast-news-item >
      <news-item :newsItem="item" v-else></news-item>
    </view>
	</view>
</template>

<script>
	import uniVedioListItem from '@/components/list-item/uni-video-list-item.vue';
	import fastNewsItem from '@/components/list-item/fast-news-item.vue';
	import newsItem from '@/components/list-item/news-item.vue';
	import personListItem from '@/components/list-item/person-list-item.vue';
	import TagListItem from '@/components/list-item/tag_list_item.vue';
	import swiperBanner from '@/components/swaper-banner.vue';
	import {mapState} from "vuex";

  const USER_FLAG = 'user';
	export default {
		components: {
			fastNewsItem,
			newsItem,
			personListItem,
			TagListItem,
			uniVedioListItem,
			swiperBanner
    },
    props: {
      tabItem: {
        type: Object,
        default(){
          return {}
        }
      },
      initIndex: {
        type: Number,
        default: 0
      },
    },
		data() {
			return {
				bannerList: [], // banner图片
				importNewsListData: [], // 存放专题和新闻早八点之间的5条新闻
				specialList: [], // 专栏图片
				importNews: [], // 存放新闻早八点、专题的两条新闻
				focusTabCurr: 0, // 存放关注页面【作者|标签】的tab
				hasFollow: false, // 是否有关注的标签或作者
				dataList:[], // 存放数据源
				tabCurrentIndex: this.initIndex, //当前选项卡索引
        followType: USER_FLAG, // 存放关注页面【作者|标签】的tab
        loadMoreStatus:  0,
				pageNum: 1,
				total: 0,
				pageSize: 15,
				lastPage: 1,
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
      // 初始化钩子
      initData(){
        if(this.tabItem.id == 'top') {
          this.loadBanners();
        }
        this.loadNewsList('refresh');
      },
      // 加载更多对外钩子
      loadMore(){
        this.loadNewsList('add');
      },
			//获取Banner
			loadBanners() {
				this.$api.banners().then(data => {
					if (data && data.code === 200) {
            this.bannerList = data.result;
					} else {
					}
				})
			},
      //action= add上拉加载 refresh下拉刷新
			async loadNewsList(action){
        const category_id = this.tabItem.id;
				if (action=='refresh') {
					this.dataList = [];
          this.pageNum = 1;
          this.loadMoreStatus = 0;
          this.$emit('changeLoadStatus', 0)
        }
				if (this.loadMoreStatus==0) {
          // 获取关注数据
					if (category_id=='follow') {
						this.loadFollow()
						return
          }
          this.loadMoreStatus = 1;
           this.$emit('changeLoadStatus', 1)
          let data = [];
          if (category_id=='top') {
            // 获取头条新闻数据
						data = await this.$api.articles_top({
              pageNum: this.pageNum,
              pageSize: this.pageSize,
            })
          } else {
            // 获取其他类型新闻
            data = await this.$api.articles({
              category_id,
              type: [1,3],
              pageNum: this.pageNum,
              pageSize: this.pageSize,
            })
          }
          if (data && data.code === 200) {
						const result = data.result.data
						this.total = data.result.total
						this.lastPage = data.result.last_page
						this.dataList.push(...result);
            this.$emit('changeRefreshStatus', false);
						if (this.pageNum==this.lastPage) {
              this.loadMoreStatus = 2;
							this.$emit('changeLoadStatus', 2)
						}else{
              this.loadMoreStatus = 0;
							this.$emit('changeLoadStatus', 0)
						}
						this.pageNum += 1;
					} else {
						this.$message(data.msg)
					}
				}
			},
      // 获取关注tab数据
			loadFollow() {
        // 配置标签和作者的字段配置
        let FLOLLOW_JSON = {
          tag: {
            followCountKey: 'follows_tag_count',// userinfo中表示tag关注的数量的字段名
            apiNewsKey: 'articles_tag',// 新闻api名称
            apiInitKey: 'tags',// tag api名称
          },
          user: {
            followCountKey: 'follows_count',
            apiNewsKey: 'articles_author',
            apiInitKey: 'authors',// 作者 api名称
          }
        }
        const {followCountKey, apiNewsKey, apiInitKey} = FLOLLOW_JSON[this.followType]
        let flag = this.userInfo&&(this.userInfo[followCountKey] > 0) ? true : false
         // user没有关注标签或tag时候获取新闻列表，否则获取默认的标签和作者列表
        if (flag) {
          this.loadMoreStatus = 1;
          this.$emit('changeLoadStatus', 1)
          this.$api[apiNewsKey]({
            pageNum: this.pageNum,
            pageSize: this.pageSize,
          }).then(data => {
            if (data && data.code === 200) {
              this.hasFollow = true
              const result = data.result.data
              this.total = data.result.total
              this.lastPage = data.result.last_page
              this.dataList.push(...result);
              this.$emit('changeRefreshStatus', false);
              if (this.pageNum==this.lastPage) {
                this.loadMoreStatus = 2;
                this.$emit('changeLoadStatus', 2)
              }else{
                this.loadMoreStatus = 0;
                this.$emit('changeLoadStatus', 0)
              }
              this.pageNum += 1;
            } else {
              this.$message(data.msg)
            }
          })
        }else{
          this.hasFollow = false
          this.loadMoreStatus = 1;
         this.$emit('changeLoadStatus', 1)
          setTimeout(async ()=>{
            let data = await this.$api[apiInitKey]({})
            if (data && data.code === 200) {
              let tempData = [];
              // 构造标签页面的二维数组结构
              if(this.followType != USER_FLAG) {
                let tempTags = [].concat(data.result);
                let tempArr = [];
                for (let i = 0, j = 0, tagsLen = tempTags.length; i < tagsLen; i += 2, j++) {
                  tempArr[j] = tempTags.splice(0, 2)
                }
                tempData = tempArr;
              } else {
                tempData = data.result
              }
              this.dataList = tempData;
            }
            this.$emit('changeRefreshStatus', false);
            this.loadMoreStatus = 2;
            this.$emit('changeLoadStatus', 2)
          },300)
        }
      },
			// 关注页面tablIST切换
			changeFocusTabCurr(focusTabindex) {
				if( focusTabindex == this.focusTabCurr){
					return;
				}
				this.focusTabCurr = focusTabindex;
				this.followType = (this.focusTabCurr == 0) ? 'user': 'tag'
				// 清空之前缓存的newsList避免样式污染
				// if(this.tabBars[tabItemIndex] && this.tabBars[tabItemIndex].newsList && this.tabBars[tabItemIndex].newsList.length > 0){
				// 	this.tabBars[tabItemIndex].newsList = []
				// }
				this.loadNewsList('refresh');
			},
			// 去订阅页面
			gotoSubscribe() {
				uni.navigateTo({
					url: "/pages/subscribe/subscribe"
				})
      },
      // 跳转到详情页
			toPage(id, type) {
				if(type === 'specialTopic') {
					uni.navigateTo({
						url:'/pages/specialTopic/specialTopic?id='+id
					})
				} else {
					uni.navigateTo({
						url:'/pages/details/details?id='+id
					})
				}
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
