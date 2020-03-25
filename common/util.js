import moment from 'moment';
// 时间转换工具
const friendlyDate = {
    methods: {
        friendlyDate(timestamp) {
            var formats = {
                'year': '%n% 年前',
                'month': '%n% 月前',
                'day': '%n% 天前',
                'hour': '%n% 小时前',
                'minute': '%n% 分钟前',
                'second': '%n% 秒前',
            };

            var now = Date.now();
            var seconds = Math.floor((now - timestamp) / 1000);
            var minutes = Math.floor(seconds / 60);
            var hours = Math.floor(minutes / 60);
            var days = Math.floor(hours / 24);
            var months = Math.floor(days / 30);
            var years = Math.floor(months / 12);

            var diffType = '';
            var diffValue = 0;
            if (years > 0) {
                diffType = 'year';
                diffValue = years;
                return moment(timestamp).format('YYYY-MM-DD');
            } else {
                if (months > 0) {
                    diffType = 'month';
                    diffValue = months;
                    return moment(timestamp).format('YYYY-MM-DD');
                } else {
                    if (days > 0) {
                        diffType = 'day';
                        diffValue = days;
                        return moment(timestamp).format('YYYY-MM-DD');
                    } else {
                        if (hours > 0) {
                            diffType = 'hour';
                            diffValue = hours;
                        } else {
                            if (minutes > 0) {
                                diffType = 'minute';
                                diffValue = minutes;
                            } else {
                                diffType = 'second';
                                diffValue = seconds === 0 ? (seconds = 1) : seconds;
                            }
                        }
                    }
                }
            }
            return formats[diffType].replace('%n%', diffValue);
        }
    }
}
// 计算币的涨跌颜色
const color = {
    methods: {
        color(start, end) {
            let colors = {
                greenUp: {txt: '#39b54a', bg: '#d7f0db'},
                greenDown: {txt: '#e54d42', bg: '#fadbd9'}
            }
            let theme = uni.getStorageSync('markTheme');
            if (!theme) {
                uni.setStorageSync('markTheme', 'greenUp');
                theme = 'greenUp'
            }
            let isUp = end - start > 0;
            if (isUp) {
                if (theme == 'greenUp') {
                    return colors.greenUp
                } else {
                    return colors.greenDown
                }
            } else {
                if (theme == 'greenUp') {
                    return colors.greenDown
                } else {
                    return colors.greenUp
                }
            }
        }
    }
}

const loadMore = {
    data() {
        return {
            enableScroll: true,
        }
    },
    methods: {
        //获取分类
        initTab(tabs) {
            let tabList = tabs;
            tabList.forEach(item => {
                item.newsList = [];
                item.loadMoreStatus = 0;  //加载更多 0加载前，1加载中，2没有更多了
                item.refreshing = 0;
                item.page = 0;
            })
            return tabList;
        },
        // 下拉刷新
        onPulldownReresh() {
            this.loadList('refresh');
        },
        //上滑加载
        loadMore() {
            this.loadList('add');
        },
        //设置scroll-view是否允许滚动，在小程序里下拉刷新时避免列表可以滑动
        setEnableScroll(enable) {
            if (this.enableScroll !== enable) {
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
        },
    }
}

const date2tamp = {
    methods: {
        date2tamp(dateStr) {
			console.log(dateStr);
            if (dateStr!=undefined) {
                dateStr = dateStr.substring(0, 19);
                dateStr = dateStr.replace(/-/g,'/');
                return new Date(dateStr).getTime();
            }
        },
    }
}
//获得元素的size
const getElSize = {
	data(){
		return {
			elSize: null,
			elOffsetTop: 0
		}
	},
	methods: {
		getElSize(selector) { 
			let el = uni.createSelectorQuery().select(selector);
			el.fields({
				size: true,
				scrollOffset: true,
				rect: true
			}, (data) => {
				console.log(data);
				this.elSize = {width: data.width, height: data.height};
				this.elOffsetTop = data.top;
			}).exec();
		}
	}
}


export {
    friendlyDate,
    color,
    loadMore,
	date2tamp,
	getElSize
}
