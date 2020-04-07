<template>
	<view>
    <uni-title title="个人介绍"></uni-title>
    <view class="content_wrapper">
      <view class="brBot"><text class="desc_txt">{{user.profile!=''?user.profile:'该用户很忙什么都没留下。'}}</text></view>
      <view class="list_container" v-if="user.phone!=''">
        <view class="icon_wrapper1">
          <image class="image-list2" src="../../static/social/phone.png"></image>
        </view>
        <view class="label-wrapper">
          <text class="name">手机号码</text>
          <text>{{user.phone}}</text>
        </view>
      </view>
      <view class="list_container" v-if="user.email!=''">
        <view class="icon_wrapper1">
          <image class="image-list2" src="../../static/social/message.png"></image>
        </view>
        <view class="label-wrapper">
          <text class="name">电子邮件</text>
          <text>{{user.email}}</text>
        </view>
      </view>
      <view class="list_container" v-if="user.wechat_official!=''">
        <view class="icon_wrapper1">
          <image class="image-list2" src="../../static/social/wechat2.png"></image>
        </view>
        <view class="label-wrapper">
          <text class="name">公众号</text>
          <text>{{user.wechat_official}}</text>
        </view>
      </view>
      <view class="list_container" v-if="user.wechat!=''">
        <view class="icon_wrapper1 ">
          <image class="image-list2" src="../../static/social/wechat.png"></image>
        </view>
        <view class="label-wrapper">
          <text class="name">微信号</text>
          <text>{{user.wechat}}</text>
        </view>
      </view>
      <view class="list_container" v-if="user.twitter!=''">
        <view class="icon_wrapper1 ">
          <image class="image-list2" src="../../static/social/twitter.png"></image>
        </view>
        <view class="label-wrapper">
          <text class="name">Twitter</text>
          <text>{{user.twitter}}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
	import uniTitle from '@/components/uni-title.vue';
	import icons from '@/components/icons/icons.vue';
	export default {
    name: 'author-home-page',
    props: {
      data: {
        type: Object,
        default(){
          return {}
        }
      }
    },
    computed: {
      user(){
        return this.data
      }
    },
		components:{
			uniTitle,
			icons,
		},
		methods: {
      initData() {
        // 关闭下拉刷新按钮
        setTimeout(()=>{
          this.$emit('changeRefreshStatus', false)
        }, 1500)
      },
		}
	}
</script>

<style lang="scss">
.content_wrapper{
  padding: 0 30upx;
  background-color: #fff;
  .list_container{
		display: flex;
    justify-content: row;
		background-color: #fff;
    	.icon_wrapper1 {
        width: 80upx;
        padding-top: 20upx;
        .image-list2{
          @include circle(50upx);
        }
      }
      .label-wrapper{
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 20upx 0upx;
        @include sideBorder;
        font-size: 30upx;
        color: #000;
        .name{
          font-size: 24upx;
          color: #858585;
        }
      }
	}
  .desc_txt{
		@include txt(30upx, #000);
		line-height: 38upx;
	}
	.brBot{
		@include sideBorder;
		padding-bottom: 30upx;
	}
}
</style>
