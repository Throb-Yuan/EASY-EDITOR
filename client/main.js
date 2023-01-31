import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import httpServer from '@client/service/httpServer' // axios拦截器配置
import '@/permission' // 权限控制
import * as mUtils from '@/common/js/mUtils'
import config from '@/config'
import filters from './filters/index'
import AES from '@/common/js/secret'
import * as API from '@/api/index'
import pluginsHui from '@client/pluginHui' // pluginsHui
import Element from 'element-ui'
import '@/common/styles/ruoyi.scss'
import '@/common/styles/element-variables.scss'
import '@/common/styles/index.scss' // 自定义 css
import 'animate.css'
import VueClipboard from 'vue-clipboard2'
import VueLazyload from 'vue-lazyload'//懒加载
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, addBeginAndEndTime, handleTree } from '@client/common/js/ruoyi';
// 字典数据组件
import DictData from '@client/common/js/DictData';
// 分页组件
import Pagination from '@client/components/Pagination';
// 自定义表格工具组件
import RightToolbar from '@client/components/RightToolbar'
Vue.use(Element);
Vue.use(VueClipboard)
Vue.use(pluginsHui)
DictData.install()
// 全局方法挂载
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.addBeginAndEndTime = addBeginAndEndTime
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.handleTree = handleTree
// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
const loadimage = require('./common/images/myicons/loadingis.gif')
const errorimage = require('./common/images/logos.png')

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: errorimage,
  loading: loadimage,
  attempt: 1
})
/**
 * 引入公共方法mUtils
 */
Vue.prototype.$mUtils = mUtils;
Vue.prototype.AES = AES
Vue.prototype.$axios = httpServer;
Vue.prototype.$api = API;
Vue.prototype.$API = API;

/**
 * 公共配置信息
 */
Vue.prototype.$config = config
Vue.prototype.$programInit = {
	status: true,
	body: {
		sceneId: '',
		programId: '',
		shareConfig: {
			coverImage: '',
			title: '曜的菜园',
			description: '这是曜的菜园的节目'
		},
		title: '未命名场景',
		coverImage: '',
		description: '慧集互联的可视化编辑，快来看看吧。',
		script: '',
		width: 800,
		height: 450,
		pageMode: 'h5',
		flipType: 0,
		slideNumber: false,
		status: 1,
		isPublish: false,
		isTemplate: false,
		members: [],
		version: 1,
		_id: '',
		pages: [
			{
				uuid: '',
				name: '',
				elements: [],
				commonStyle: {
					backgroundColor: '',
					backgroundImage: '',
					backgroundSize: 'cover'
				}
			}
		],
		author: '',
		created: '',
		updated: '',
		__v: 0
	},
	msg: 'success',
	code: 200
}
// 注册全局过滤器
Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
})



// 登录后跳转方法
Vue.prototype.goBeforeLoginUrl = () => {
	let url = mUtils.Cookie.get('beforeLoginUrl')
	url = decodeURIComponent(url)
	if (!url || url.indexOf('/author') != -1) {
		router.push('/')
	} else {
		router.push(url)
		mUtils.Cookie.set('beforeLoginUrl', '', 1 / 24 / 60, window.location.host, window.location.pathname.substring(0, window.location.pathname.length - 1))
	}
};


String.prototype.replaceAll = function (s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2);
}

Vue.config.productionTip = false

store.commit('UPDATE_USER_FROM_LOCAL')

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
