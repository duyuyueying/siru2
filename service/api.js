import MinRequest from './MinRequest';
import store from '@/store/index';

const minRequest = new MinRequest()

// 请求拦截器
minRequest.interceptors.request((request) => {
    let api_token = uni.getStorageSync('api_token', '');
    if (request.data === undefined) {
        request.data = {}
    }
    request.data.api_token = api_token
    return request
})

// 响应拦截器
minRequest.interceptors.response((response) => {
	if(response.data.code == 401 || response.data.code == 402) {
		store.commit("USER_INFO", null);
	}
    return response.data
})

// 设置默认配置
minRequest.setConfig((config) => {
    let api_token = uni.getStorageSync('api_token', '')
	// 192.168.123.224
	// 192.168.1.3 192.168.123.90
	
    config.baseURL = 'http://192.168.123.90:8182'
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
        /**
         * 发送短信验证码
         * @param phone
         * @returns {Promise<unknown>}
         */
        send_sms(phone) {
            return minRequest.post('/api/common/send_sms', {phone: phone})
        },
        /**
         * 手机号码登录
         * @param phone
         * @param verify_code
         * @returns {Promise<unknown>}
         */
        login_sms(phone, verify_code) {
            return minRequest.post('/api/login/sms', {phone: phone, verify_code: verify_code})
        },
        /**
         * TODO:账号登录
         * @param phone
         * @param verify_code
         * @returns {Promise<unknown>}
         */
        login(phone, verify_code) {
            return minRequest.post('/api/login', {phone: phone, verify_code: verify_code})
        },
        /**
         * 获取登录用户信息
         * @returns {Promise<unknown>}
         */
        user() {
            return minRequest.get('/api/user')
        },
		/**
		 * 修改用户信息
		 * @returns {Promise<unknown>}
		 */
		user_modify() {
		    return minRequest.put('/api/users')
		},
        /**
         * 获取文章列表
         * @param articleId
         * @returns {Promise<unknown>}
         */
        articles(data) {
            return minRequest.get('/api/articles', data)
        },
        /**
         * 获取文章详情
         * @param articleId
         * @returns {Promise<unknown>}
         */
        article_info(articleId) {
            return minRequest.get('/api/articles/' + articleId)
        },
        /**
         * 文章消息利好
         * @param id
         * @returns {Promise | Promise<unknown>}
         */
        articles_good(id) {
            return minRequest.put('/api/articles/' + id + '/good')
        },
        /**
         * 文章消息利空
         * @param id
         * @returns {Promise | Promise<unknown>}
         */
        articles_bad(id) {
            return minRequest.put('/api/articles/' + id + '/bad')
        },
        /**
         * 文章点赞
         * @param id
         * @returns {Promise | Promise<unknown>}
         */
        articles_zan(id) {
            return minRequest.put('/api/articles/' + id + '/zan')
        },
        /**
         * 获取文章评论
         * @param articleId
         * @param data
         * @returns {Promise<unknown>}
         */
        comments(articleId, data) {
            return minRequest.get('/api/articles/' + articleId + '/comments', data)
        },
        /**
         * 添加评论
         * @param data
         * @returns {Promise<unknown>}
         */
        comments_add(data) {
            return minRequest.post('/api/comments', data)
        },
        /**
         * 评论点赞
         * @param id
         * @returns {Promise | Promise<unknown>}
         */
        comments_zan(id) {
            return minRequest.put('/api/comments/' + id + '/zan')
        },
        /**
         * 获取评论详情页
         * @param id
         * @param data
         * @returns {Promise | Promise<unknown>}
         */
        comments_info(id, data) {
            return minRequest.get('/api/comments/' + id + '/comment', data)
        },
        /**
         * 获取Banners
         * @returns {Promise<unknown>}
         */
        banners() {
            return minRequest.get('/api/banners')
        },
        /**
         * 获取tabbar
         * @returns {Promise | Promise<unknown>}
         */
        tabbars() {
            return minRequest.get('/api/tabbars')
        },
		follows(){

        },
        /**
         * 取消/关注用户
         * @param id
         * @returns {Promise | Promise<unknown>}
         */
        follows_add(id) {
            return minRequest.put('/api/users/' + id + '/follow')
        },

		/**
		 * 获取浏览历史
		 * @param data
		 * @returns {Promise | Promise<unknown>}
		 */
		get_history(data) {
		    return minRequest.get('/api/histories', data)
		},
		/**
		 * 添加浏览历史
		 * @param data
		 * @returns {Promise | Promise<unknown>}
		 */
		get_history_add(id) {
		    return minRequest.post('/api/histories', {article_id: id});
		},
		/**
		 * 获取收藏列表
		 * @param data
		 * @returns {Promise | Promise<unknown>}
		 */
		get_collection(data) {
		    return minRequest.get('/api/collections', data)
		},
		/**
		 * 取消/收藏文章
		 * @param data
		 * @returns {Promise | Promise<unknown>}
		 */
		articles_collect(id){
			return minRequest.put('/api/articles/' + id + '/collect')
		},
		/**
		 * 获取我的关注
		 * @param data
		 * @returns {Promise | Promise<unknown>}
		 */
		get_follows(data) {
		    return minRequest.get('/api/users/follows', data)
		},
		/**
		 * 获取我的粉丝
		 * @param data
		 * @returns {Promise | Promise<unknown>}
		 */
		get_fans(data) {
		    return minRequest.get('/api/users/fans', data)
		},
    }
}