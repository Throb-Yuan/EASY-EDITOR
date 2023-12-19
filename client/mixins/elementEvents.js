import { callHandler, registerHandler } from '../common/js/appJsBridge'
// import { getProgramPlus } from '../../../api/modules/eleBus'
import { getProgramPlus } from '../api/modules/eleBus'
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
						let a = eventData.url.split('/')
						let b = a[a.length-1]
						let c = b.split('.')
						let d = c[0]
						// window.alert('预览暂不支持节目与应用跳转')
						getProgramPlus(d).then(response => {
							if(response&&response.data){
								localStorage.setItem('previewPageData',response.data.afterHtml)
								location.reload()
							}
							
						});
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
