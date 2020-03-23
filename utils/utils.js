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

    uni.showToast({
        title: msg,
    });

    setTimeout(function () {
        uni.hideLoading();
        callback()
    }, time);
}