import Vue from 'vue'
import App from './App'
import store from './store/index';
import MinRequest from './service/MinRequest'
import minRequest from './service/api'
import {showMsg} from './utils/utils'


Vue.prototype.$message = showMsg
Vue.prototype.$http = minRequest.minRequest // ajax请求方法
Vue.use(MinRequest)
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
    store,
    minRequest
})
app.$mount()
