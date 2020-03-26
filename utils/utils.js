/**
 * 提示框
 * @param msg
 * @param time
 * @param callback
 */
export function showMsg(msg, callback, time) {
    time = time || 2000
    callback = callback || function () {
    }
	let icon = 'success', title = '';
	if(typeof msg === 'string') {
		title = msg;
	}
	if(typeof msg == 'object'){
		icon = msg.icon || 'none';
		title = msg.title;
	}
    uni.showToast({
		icon,
        title
    });

    setTimeout(function () {
        uni.hideLoading();
        callback()
    }, time);
}