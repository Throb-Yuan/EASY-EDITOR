/**
 * 账号相关操作模块
 * */
import store from '@/store'
import router from '@/router'
import {
	login,
	remove,
	register,
	getUserInfo
} from '@/api'
import {
	getToken,
	setToken,
	setExpiresIn,
	removeToken,
} from '@/common/js/auth'
let userModel = {
	/**
	 * 检测是否登录
	 * @returns {Promise<void>}
	 */
	async checkLoginState() {
		let userData = store.state.user;
		return !!userData.access_token
	},
	/**
	 * 登录
	 * @param options
	 * @param type
	 * @returns {Promise<void>}
	 */
	async doLogin(data) {
		return new Promise((resolve, reject) => {
			login(data).then(res => {
				setToken(res.data.access_token)
				setExpiresIn(res.data.expires_in)
				store.commit('UPDATE_ACCESS_TOKEN', res.data.access_token)
				store.commit('UPDATE_USER_INFO', res.data.userInfo)
				resolve(res.data)
			})
				.catch(err => {
					reject(err)
				})
		})
	},
	/**
	 * 注册
	 * @param options
	 * @param type
	 * @returns {Promise<void>}
	 */
	async doRegister(data) {
		return new Promise((resolve, reject) => {
			register(data).then(res => {
				store.commit('UPDATE_ACCESS_TOKEN', res.body.access_token)
				store.commit('UPDATE_USER_INFO', res.body.userInfo)
				resolve(res.body)
			})
				.catch(err => {
					reject(err)
				})
		})
	},
	/**
	 * 获取用户信息
	 * @returns {Promise<void>}
	 * @private
	 */
	getUserInfo() {
		return new Promise((resolve, reject) => {
			getUserInfo().then(res => {
				store.commit('UPDATE_USER_INFO', res.body);
				resolve(res.body)
			}).catch(err => {
				reject(err)
			})
		})
	},
	/**
	 * 退出
	 * @returns {Promise<void>}
	 */
	async doLogout() {
		return new Promise((resolve, reject) => {
			remove({access_token:getToken()}).then(res => {
				// 清除store user token
				removeToken()
				store.commit('UPDATE_ACCESS_TOKEN', '');
				window.sessionStorage.setItem('beforeLoginUrl', '');
				userModel.goLogin()
			}).catch(err => {
				reject(err)
			})
		})

	},
	/**
	 * 跳转登录
	 * @returns {Promise<void>}
	 */
	async goLogin() {
		// 将路由fullpath 保存在缓存中，用于登录完成后跳转
		let indexOf = window.location.href.indexOf('#/')
		let currentUrl = window.location.href.slice(indexOf + 1, window.location.href.length);
		window.sessionStorage.setItem('beforeLoginUrl', currentUrl);
		store.commit('UPDATE_ACCESS_TOKEN', '');
		router.replace({ name: 'Login' })
	},

	async goBeforeLoginUrl() {
		let url = window.sessionStorage.getItem('beforeLoginUrl');
		if (!url || url.indexOf('/login') != -1) {
			// router.push('/');
			// router.push(url);
			router.replace({ name: "Home" });
		} else {
			router.replace({ name: "Home" });
			// router.push(url);
			window.sessionStorage.setItem('beforeLoginUrl', '');
		}
	}
}

export default userModel
