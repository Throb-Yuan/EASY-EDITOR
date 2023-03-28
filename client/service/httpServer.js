/**
 * 后台管理web请求封装
 */
import axios from 'axios-extra'
import store from '@/store/index'
import $config from "@/config/index";
import userModel from '@/libs/userModel'
// import { Cookie } from '@/common/js/mUtils'
import QS from 'qs';
import { getToken } from '@/common/js/auth'

// 线上环境配置axios.defaults.baseURL，生产环境则用proxy代理
if (process.env.NODE_ENV !== 'development') {
	axios.defaults.baseURL = $config.baseURL;
}
axios.defaults.headers['Content-Type'] = 'application/json;charse=UTF-8'
axios.defaults.timeout = 30000; // 超时时间

const webHttp = axios.create({
    maxConcurrent: 5, //并发为1
})
//请求拦截器
webHttp.interceptors.request.use(config => {
	if(config.url.includes('content/program/download')) config.timeout = 21600000;
	if(config.url.includes('content/resource')) config.timeout = 21600000;
	if(config.url.includes('file/multipart/tasks')) config.timeout = 21600000;
	
	if (getToken()) {
		// 有token则携带token
		config.headers['Authorization'] = 'Bearer ' + getToken()
	}
	// config.headers['x-csrf-token'] = Cookie.get('x-csrf-token');
	return config
}, error => {
	return Promise.resolve(error)
});

//响应拦截器即异常处理  status==200为blob数据类型
webHttp.interceptors.response.use(response => {
	if (response.request && (response.request.responseType === 'blob' || response.request.responseType === 'arraybuffer')) {
		return Promise.resolve(response.data)
	}
	if (response.data.code==200 || response.code == 200) {
		return Promise.resolve(response.data)
	} else {
		store.dispatch('showMassage', {
			type: 'error',
			data: response.data.message || response.data.msg || response.data.errMsg
		});
		return Promise.resolve(response.data)
	}

}, err => {
	if (err && err.response) {
		switch (err.response.status) {
			case 400:
				err.message = '错误请求';
				break;
			case 401:
				err.message = '未授权，请重新登录';
				userModel.goLogin();
				break;
			case 403:
				err.message = '没有访问权限，拒绝访问';
				break;
			case 404:
				err.message = '请求错误,未找到该资源';
				break;
			case 405:
				err.message = '请求方法未允许';
				break;
			case 408:
				err.message = '请求超时';
				break;
			case 500:
				err.message = err.response.msg || err.response.data.message || '连接错误';
				break;
			case 501:
				err.message = '网络未实现';
				break;
			case 502:
				err.message = '网络错误';
				break;
			case 503:
				err.message = '服务不可用';
				break;
			case 504:
				err.message = '网络超时';
				break;
			default:
				err.message = `连接错误${err.response.msg}`
		}
	} else {
		err.message = "连接到服务器失败"
	}
	store.dispatch('showMassage', {
		type: 'error',
		data: err.message || err.response.msg
	});
	return Promise.resolve(err.response)
});
/**
 * 下载文件
 */
let downloadFile = (url) => {
	window.open(url)
};
export default {
	download(url, params, responseType,header) {
		return webHttp({
			method: 'post',
			url,
			responseType:responseType,
			headers: {
				...(header || {}),
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: QS.stringify(params) || {},
		})
	},
	//get请求
	get(url, param, responseType, header) {
		return webHttp({
			method: 'get',
			url,
			headers: {
				...(header || {})
			},
			responseType: responseType,
			params: param || {},
		})
	},
	//post请求
	post(url, param, header) {
		return webHttp({
			method: 'post',
			url,
			headers: {
				...(header || {}),
				'Content-Type': 'application/json;charse=UTF-8'
			},
			data: param || {},
		})
	},
	postFormData(url, params, header) {
		return webHttp({
			method: 'post',
			url,
			headers: {
				...(header || {}),
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: QS.stringify(params) || {},
		})
	},
	//post请求
	put(url, param, header) {
		return webHttp({
			method: 'put',
			url,
			headers: {
				...(header || {}),
				'Content-Type': 'application/json;charse=UTF-8'
			},
			data: param || {},
		})
	},
	// delete
	delete(url, param, header) {
		return webHttp({
			method: 'delete',
			url,
			headers: {
				...(header || {})
			},
			params: param || {},
		})
	},
	// 此方法非promise 导出文件
	getFile(url, params) {
		let tempParams = {
			...(params || {})
		}
		// 拼接下载地址
		let list = [];
		for (let key in tempParams) {
			list.push(key.toString() + '=' + tempParams[key]);
		}
		url = $config.baseURL + url + '?' + list.join('&');
		url = encodeURI(url);
		downloadFile(url);
	}
}
