<template>
	<view class="container" :style="{marginBottom: detail.status == '未开始' ? '100upx' : '0upx'}">
		<view class="banner" auto-focus>
			<image class="banner-img" src="https://img.36krcdn.com/20200307/v2_945dcd5d78514102a1e83a016bfbb2a6_img_000" mode="aspectFill"></image>
			<view class="title-area" style="{background-color: detail.status === '未开始' ? '#e44d66': '#aaa' }">
				<text class="title-text">{{detail.status}}</text>
			</view>
		</view>
		<tabs :tabs="['简介','图文直播']" @changeTab="changeTab" :defaultTab="currTab"></tabs>
		<view v-if="currTab === 0" class="content_wrapper">
			<view class="content_head_wrapper">
				<view class="title_wrapper">
					<text class="title_txt">{{detail.title}}</text>
				</view>
				<view class="desc_wrapper">
					<text class="desc_txt">{{detail.detail}}</text>
				</view>
			</view>
			<view class="pad30">
				<live-list-item title="主办方:" :content="detail.sponsor"></live-list-item>
				<live-list-item title="时间:" :content="detail.time"></live-list-item>
				<live-list-item title="赞助商:" :content="detail.support"></live-list-item>
			</view>
			<section-head title="主持人"></section-head>
			<view class="pad30">
				<img-txt-list v-for="(item, index) in detail.host" :item="item" :key="index"></img-txt-list>
			</view>
			<section-head title="活动嘉宾"></section-head>
			<view class="pad30">
				<img-txt-list v-for="(item, index) in detail.guest" :item="item" :key="index"></img-txt-list>
			</view>
			<announce-txt></announce-txt>
		</view>
		<view v-if="currTab === 1" class="content_wrapper">
			<view style="background-color: #fff;">
				<timeline :items="detail.live" type="live"></timeline>
			</view>
		</view>
		<view class="fix_foot" v-if="detail.status === '未开始'">
			<text class="foot_txt">
				直播即将开始
			</text>
			
		</view>
	</view>
</template>

<script>
	import htmlParser from '@/common/html-parser'
	import {liveDetail} from '@/mock/data.js';
	import tabs from '@/components/tabs.vue';
	import LiveListItem from '@/components/liveListItem.vue';
	import timeline	from '@/components/timeline.vue';
	import sectionHead from '@/components/sectionHead.vue';
	import imgTxtList from '@/components/imgTxtList.vue';
	import announceTxt from '@/components/announceTxt.vue';

	const FAIL_CONTENT = '<p>获取信息失败1</p>';

	function parseImgs(nodes) {
		nodes.forEach(node => {
			if (
				node.name === 'img' &&
				node.attrs &&
				node.attrs['data-img-size-val']
			) {
				const sizes = node.attrs['data-img-size-val'].split(',')
				const width = uni.upx2px(720 * 0.9)
				const height = parseInt(width * (sizes[1] / sizes[0]))
				node.attrs.style = `width:${width};height:${height};`
			}
			if (Array.isArray(node.children)) {
				parseImgs(node.children)
			}
		})
		return nodes
	}

	export default {
		data() {
			return {
				banner: {},
				content: [],
				detail: {},
				currTab: 0,
			}
		},
		components:{
			tabs,
			LiveListItem,
			timeline,
			sectionHead,
			imgTxtList,
			announceTxt
		},
		onShareAppMessage() {
			return {
				title: this.banner.title,
				path: '/pages/detail/detail?query=' + JSON.stringify(this.banner)
			}
		},
		onLoad(event) {
			this.getDetail();
		},
		methods: {
			getDetail() {
				this.detail = liveDetail;
			},
			changeTab(index) {
				if(this.detail.status === '未开始' && index == 1){
					return;
				}
				this.currTab = index
			}
		}
	}
</script>

<style lang="scss">
	@import '@/common/common.scss';
	/* #ifndef APP-PLUS */
	page {
		min-height: 100%;
	}
	/* #endif */
	.banner {
		height: 376upx;
		position: relative;
	}
	.banner-img {
		height: 376upx;
		/* #ifndef APP-PLUS */
		width: 100%;
		/* #endif */
	}
	.title-area {
		position: absolute;
		right: 0upx;
		top: 0upx;
		width: 126upx;
		height: 56upx;
		background-color: #aaa;
		z-index: 11;
		align-items: center;
	}

	.title-text {
		font-size: 26upx;
		line-height: 56upx;
		color: #ffffff;
	}

	.article-meta {
		padding: 20upx 30upx;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}

	.article-meta-text {
		color: gray;
	}

	.article-text {
		font-size: 26upx;
		line-height: 50upx;
		margin: 0 20upx;
	}

	.article-author {
		font-size: 30upx;
	}

	.article-time {
		font-size: 30upx;
	}

	.article-content {
		font-size: 30upx;
		padding: 0 30upx;
		margin-bottom: 30upx;
		overflow: hidden;
	}
	.content_wrapper{
		
	}
	.content_head_wrapper{
		padding: 30upx 30upx 20upx 30upx;
		background-color: #fff;
		margin-bottom: 12upx;
		background-color: #fff;
	},
	.title_txt{
		line-height: 60upx;
		font-weight: bold;
		color: #000;
		font-size: 40upx;
	}
	.desc_txt{
		font-size: 30upx;
		line-height: 50upx;
		color: #767676;
	}
	.pad30{
		padding: 0upx 30upx;
		background-color: #fff;
	},
	.fix_foot {
		height: 100upx;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #fff;
		padding-left: 30upx;
		border-top-width: 2upx;
		border-top-style: solid;
		border-top-color: #f5f5f5;
		z-index: 100;
		justify-content: center;
	}
	.foot_txt{
		@include txt(26upx,#333)
	}
</style>
