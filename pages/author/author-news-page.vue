<template>
	<view class="news-list">
    <news-item :newsItem="item" v-for="(item, index) in dataList" :key="index"></news-item>
	</view>
</template>

<script>
  import uniTitle from '@/components/uni-title.vue';
	import newsItem from '@/components/list-item/news-item.vue';
	export default {
    name: 'author-news-page',
    props: {
      data: {
        type: Object,
        default(){
          return {}
        }
      }
    },
		data() {
			return {
				dataList:[], // 列表数据
				loadMoreStatus:  0, //加载更多 0加载前，1加载中，2没有更多了
				pageNum: 1,
				total: 0,
				pageSize: 15,
				lastPage: 1,
			}
    },
    computed: {
      id(){
        return this.data.id
      }
    },
		methods: {
      initData(){
        this.loadList('refresh')
      },
      loadMore(){
        this.loadList('add')
      },
			//列表
			loadList(action){
				//action= add上拉加载 refresh下拉刷新
				if (action=='refresh') {
					this.dataList = [];
					this.pageNum = 1;
          this.loadMoreStatus = 0;
          this.$emit('changeLoadStatus', 0)
				}
				if (this.loadMoreStatus==0) {
          this.loadMoreStatus = 1;
          this.$emit('changeLoadStatus', 1)
					this.$api.search_articles({
						user_id: this.id,
						pageNum: this.pageNum,
						pageSize: this.pageSize,
					}).then(data => {
						if (data && data.code === 200) {
							this.info = data.result.info
							const result = data.result.data
							this.total = data.result.total
							this.lastPage = data.result.last_page
							this.dataList.push(...result);
              this.$emit('changeRefreshStatus', false);
							if (this.pageNum>=this.lastPage) {
                this.loadMoreStatus = 2;
                this.$emit('changeLoadStatus', 2)
							}else{
                this.loadMoreStatus = 0;
                this.$emit('changeLoadStatus', 0)
							}
							this.pageNum += 1;
						} else {
							uni.navigateBack({
									delta: 1
								});
						}
					})
				}
			}
    },
    components:{
			uniTitle,
			newsItem,
		},
	}
</script>

<style lang="scss">
</style>
