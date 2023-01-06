import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

const TenantIdKey = 'TENANT_ID'
const TenantNameKey = 'TENANT_NAME'
const LoginUserId = 'LOGIN_USER_ID'
const LoginUserName = 'LOGIN_USER_NAME'
const LoginUserDept = 'LOGIN_USER_DEPT'
const LoginUserDeptName = 'LOGIN_USER_DEPT_NAME'

const ExpiresInKey = 'Admin-Expires-In'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function getLoginUserId() {
  return Cookies.get(LoginUserId)
}

export function setLoginUserId(loginUserId) {
  return Cookies.set(LoginUserId, loginUserId)
}
export function getLoginUserName() {
  return Cookies.get(LoginUserName)
}

export function setLoginUserName(loginUserName) {
  return Cookies.set(LoginUserName, loginUserName)
}

export function getLoginUserDept() {
  return Cookies.get(LoginUserDept)
}

export function setLoginUserDept(loginUserDept) {
  return Cookies.set(LoginUserDept, loginUserDept)
}

export function getLoginUserDeptName() {
  return Cookies.get(LoginUserDeptName)
}

export function setLoginUserDeptName(loginUserDeptName) {
  return Cookies.set(LoginUserDeptName, loginUserDeptName)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getExpiresIn() {
  return Cookies.get(ExpiresInKey) || -1
}

export function setExpiresIn(time) {
  return Cookies.set(ExpiresInKey, time)
}

export function removeExpiresIn() {
  return Cookies.remove(ExpiresInKey)
}

export function getTenantId() {
  return Cookies.get(TenantIdKey)
}
export function setTenantId() {
  return Cookies.set(TenantIdKey)
}
