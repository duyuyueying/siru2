<template>
    <view>
        <login-layout type="code">
            <template v-slot:input>
                <view class="flex1">
                    <input type="text" class="u-input" placeholder="手机号" prop="phoneNumber" v-model="phoneNumber">
                </view>
            </template>

            <template v-slot:submit>
                <view class="submit_btn" @click="submit"
                      :style="{backgroundColor: (checkPhone) ? '#FFB100':'#fafafa'}">
                    <text class="submit_btn_txt" :style="{color: (checkPhone) ? '#fff':'#5d6368'}">获取验证码</text>
                </view>
            </template>
        </login-layout>
    </view>
</template>

<script>
    import loginLayout from '@/pages/login/login-layout.vue';
    import {isPhone} from '@/utils/validate'

    export default {
        data() {
            return {
                checkPhone: false,
                phoneNumber: '',
            }
        },
        components: {
            loginLayout
        },
        watch: {
            phoneNumber: function (val, oldVal) {
                if (isPhone(val)) {
                    this.checkPhone = true
                } else {
                    this.checkPhone = false
                }
            }
        },
        methods: {
            submit() {
                if (!this.checkPhone) {
                    this.$message('请输入正确的手机号码')
                    return
                }

                uni.navigateTo({
                    url: '/pages/login/vertifyCode?type=login&phone=' + this.phoneNumber
                })
                return;

                //TODO 调试成功,暂时不需要发送短信(需数据库查看短信验证码)
                this.$api.send_sms(this.phoneNumber).then(data => {
                    if (data && data.code === 200) {
                        // this.$message('发送短信成功', function (phone) {
                            uni.navigateTo({
                                // url: '/pages/login/vertifyCode?type=login&phone=' + phone
                                url: '/pages/login/vertifyCode?type=login&phone=' + this.phoneNumber
                            })
                        // }(this.phoneNumber), 2000)
                    } else {
                        this.$message(data.msg)
                    }
                }).catch(err => {
                    this.$message('网络错误')
                })
            }
        }
    }
</script>

<style lang="scss">
    .u-input {
        height: 50upx;
        @include sideBorder($color: #edf0f2);
        @include txt(26upx);
        padding: $space-base $space-lg;
        text-align: left;
        margin-bottom: 20upx;
    }

    .submit_btn {
        margin: 0 40upx 50upx;
        height: 78upx;
        line-height: 78upx;
        background-color: #fafafa;
        text-align: center;
        border-radius: 4upx;
    }

    .submit_btn_txt {
        color: #5d6368;
        font-size: 26upx;
    }
</style>
