import {callHandler,registerHandler} from '../common/js/appJsBridge'
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
				if(eventData.url){
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
		_event_submitForm(){
			return new Promise((resolve) => {
				window.alert('表单提交，待完善...')
				resolve()
			})
		},
		/**
		 * 节目跳转
		 * @private
		 */
		_event_linkLoacl(eventData){
			return new Promise((resolve) => {
				if(eventData.url){
					window.location.href = eventData.url;
				}
				resolve()
			})
		},
		/**
		 * 返回上一页
		 * @private
		 */
		 _event_goback(){
			return new Promise((resolve) => {
				window.history.back()
				resolve()
			})
		},
		/**
		 * 安卓apk
		 * @private
		 */
		 _event_openApp(eventData){
			return new Promise((resolve) => {
				window.terminal.openApp(eventData.mdkName)
				// callHandler('openApp',eventData.resourceMd5,()=>{
				// 	console.log('_event_openApp执行 ');
				// })
				resolve()
			})
		}
	}
}
