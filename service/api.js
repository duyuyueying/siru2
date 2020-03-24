import MinRequest from './MinRequest'

const minRequest = new MinRequest()

// 请求拦截器
minRequest.interceptors.request((request) => {
    let api_token = uni.getStorageSync('api_token','')
    if(request.data===undefined){
        request.data = {}
    }
    request.data.api_token = api_token
    return request
})

// 响应拦截器
minRequest.interceptors.response((response) => {
    return response.data
})

// 设置默认配置
minRequest.setConfig((config) => {
    let api_token = uni.getStorageSync('api_token','')
    config.baseURL = 'http://127.0.0.1:8182'
    config.header = {
        'content-type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + api_token,
        'api_token': api_token,
    }
    return config
})

export default {
    // 这里统一管理api请求
    minRequest,
    apis: {
        uniapp(data) {
            return minRequest.get('/web/captcha', data)
        },
        send_sms(phone) {
            return minRequest.post('/api/common/send_sms', {phone: phone})
        },
        login_sms(phone, verify_code) {
            return minRequest.post('/api/login/sms', {phone: phone, verify_code: verify_code})
        },
        login(phone, verify_code) {
            return minRequest.post('/api/login', {phone: phone, verify_code: verify_code})
        },
        user() {
            return minRequest.get('/api/user')
        }
    }
}