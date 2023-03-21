/**
 * 终端webview请求封装
 */
import axios from 'axios-extra'
import $config from "@/config/index";
import { Message } from 'element-ui'
// 线上环境配置axios.defaults.baseURL，生产环境则用proxy代理
if (process.env.NODE_ENV !== 'development') {
	axios.defaults.baseURL = $config.baseURL;
}
axios.defaults.headers['Content-Type'] = 'application/json;charse=UTF-8'
axios.defaults.timeout = 30000; // 超时时间

const httpExtra = axios.create({
    maxConcurrent: 5, //并发为1
    queueOptions: {
        retry: 3, //请求失败时,最多会重试3次
        retryIsJump: false //是否立即重试, 否则将在请求队列尾部插入重试请求
    }
})
//请求拦截器
httpExtra.interceptors.request.use(config => {
	if(config.url.includes('content/program/download')) config.timeout = 300000;
	// config.headers['x-csrf-token'] = Cookie.get('x-csrf-token');
	return config
}, error => {
	return Promise.reject(error)
});

//响应拦截器即异常处理  status==200为blob数据类型
httpExtra.interceptors.response.use(response => {
	if (response.request.responseType === 'blob' || response.request.responseType === 'arraybuffer') {
		return Promise.resolve(response.data)
	}
	if (response.data.code==200 || response.code == 200) {
		return Promise.resolve(response.data)
	} else {
		Message.closeAll()
		Message({
			type: 'error',
			message: response.data.message || response.data.msg || response.data.errMsg
		});
		return Promise.reject(response.data)
	}

}, err => {
	if (err && err.response) {
		switch (err.response.status) {
			case 400:
				err.message = '错误请求';
				break;
			case 401:
				err.message = '未授权，请重新登录';
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
				err.message = '该节目需网络支持，请检查网络链接';
				break;
			case 500:
				err.message = '该节目需网络支持，请检查网络链接';
				break;
			case 501:
				err.message = '该节目需网络支持，请检查网络链接';
				break;
			case 502:
				err.message = '该节目需网络支持，请检查网络链接';
				break;
			case 503:
				err.message = '该节目需网络支持，请检查网络链接';
				break;
			case 504:
				err.message = '该节目需网络支持，请检查网络链接';
				break;
			default:
				err.message = `连接错误${err.response.msg}`
		}
	} else {
		err.message = "该节目需网络支持，请检查网络链接"
	}
	Message.closeAll()
	Message({
		type: 'error',
		message: err.message || err.response.msg
	});
	return Promise.reject(err.response)
});
export default {
	//get请求
	get(url, param, responseType, header) {
		return httpExtra({
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
		return httpExtra({
			method: 'post',
			url,
			headers: {
				...(header || {}),
				'Content-Type': 'application/json;charse=UTF-8'
			},
			data: param || {},
		})
	},
	//post请求
	put(url, param, header) {
		return httpExtra({
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
		return httpExtra({
			method: 'delete',
			url,
			headers: {
				...(header || {})
			},
			params: param || {},
		})
	},
}
