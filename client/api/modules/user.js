/*
	用户相关api
**/
import $axios from "@/service/httpServer";
// 登录
// export const login = p => $axios.post('/quark/auth/login', p);
export const login = p => $axios.postFormData('/auth/oauth/token', p);
// 用户密码重置
export const updateUserPwd = p => $axios.put('/system/user/profile/updatePwd?'+p, {});
// 获取用户信息
export const getUserProfile = () => $axios.get('/system/user/profile');
// 退出登录
export const remove = p => $axios.postFormData('/auth/oauth/token/remove',p);
// 注册
export const register = p => $axios.post('/quark/auth/register', p);
// 获取用户信息
export const getUserInfo = () => $axios.get('/quark/user/info');
// 修改用户昵称
export const updateNickName = p => $axios.post('/quark/user/update/name', p);
// 修改密码
export const updateUserPass = p => $axios.post('/quark/user/update/pass', p);
// 修改头像
export const updateUserAvatar = p => $axios.post('/quark/user/update/avatar', p);
// 关键字搜索用户列表
export const getUserListByKeywords = p => $axios.get('/quark/user/getUserList', p);


