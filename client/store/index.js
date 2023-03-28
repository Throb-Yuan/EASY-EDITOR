import Vue from 'vue'
import Vuex from 'vuex'

// 各个模块
import editor from './modules/editor'
import user from './modules/user'


import { Message } from 'element-ui'
/**
 * 全局状态管理
 */
const state = {

};
const actions = {

	/**
	 * 显示提示 msg.type 类型  msg.data 消息内容
	 * @param commit
	 * @param msg
	 */
	showMassage(store, msg) {
		Message.closeAll()
		Message({
			type: msg.type,
			message: msg.message || msg.data
		})
	},
	// Login({ commit }, userInfo) {
	// 	const {username, password, grant_type, scope, client_id, client_secret} = userInfo
	// 	return new Promise((resolve, reject) => {
	// 	  login({
	// 		username: username.trim(),
	// 		password: RSA(password),
	// 		grant_type,
	// 		scope,
	// 		client_id,
	// 		client_secret: RSA(client_secret)
	// 	  }).then(res => {
	// 		console.log('用户token信息', res)
	// 		let data = res.data
	// 		setToken(data.access_token)
	// 		commit('SET_TOKEN', data.access_token)
	// 		setExpiresIn(data.expires_in)
	// 		commit('SET_EXPIRES_IN', data.expires_in)
	// 		resolve()
	// 	  }).catch(error => {
	// 		reject(error)
	// 	  })
	// 	})
	//   },
};
const mutations = {};
const getters = {};

Vue.use(Vuex);
export default new Vuex.Store({
	state,
	getters,
	actions,
	mutations,
	modules: {
		editor,
		user
	}
});
