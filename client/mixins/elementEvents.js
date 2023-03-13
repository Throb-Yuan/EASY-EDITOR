import { callHandler, registerHandler } from '../common/js/appJsBridge'
/**
 *  元素点击事件相关方法添加事件
 * */
export default {
	methods: {
		/**
		 * 链接跳转
		 */
		_event_link(eventData) {
			return new Promise((resolve) => {
				if (eventData.url) {
					window.location.href = eventData.url;
				}
				resolve()
			})
		},
		/**
		 * 分享
		 * @private
		 */
		_event_share() {
			return new Promise((resolve) => {
				window.alert('分享')
				resolve()
			})
		},
		/**
		 * 表单提交
		 * @private
		 */
		_event_submitForm() {
			return new Promise((resolve) => {
				window.alert('表单提交，待完善...')
				resolve()
			})
		},
		/**
		 * 节目跳转
		 * @private
		 */
		_event_linkLoacl(eventData) {
			return new Promise((resolve) => {
				if (eventData.url) {
					if (window.location.href.includes('http')) {
						window.alert('预览暂不支持节目与应用跳转')
					} else {
						window.location.href = eventData.url;
					}

				}
				resolve()
			})
		},
		/**
		 * 返回上一页
		 * @private
		 */
		_event_goback() {
			return new Promise((resolve) => {
				window.history.back()
				resolve()
			})
		},
		/**
		 * 安卓apk
		 * @private
		 */
		_event_openApp(eventData) {
			return new Promise((resolve) => {
				if(eventData.mdkName){
					if (window.location.href.includes('http')) {
						window.alert('预览暂不支持节目与应用跳转')
						return false
					}else{
						window.terminal.openApp(eventData.mdkName)
					}
				}
				resolve()
			})
		}
	}
}
