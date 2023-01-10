import request from '@/service/httpServer'

// 查询模板版本信息列表
export function listVersion(query) {
  return request({
    url: '/content/version/list',
    method: 'get',
    params: query
  })
}

// 查询模板版本信息详细
export function getVersion(tplId) {
  return request({
    url: '/content/version/' + tplId,
    method: 'get'
  })
}

// 新增模板版本信息
export function addVersion(data) {
  return request({
    url: '/content/version',
    method: 'post',
    data: data
  })
}

// 修改模板版本信息
export function updateVersion(data) {
  return request({
    url: '/content/version',
    method: 'put',
    data: data
  })
}

// 删除模板版本信息
export function delVersion(tplId) {
  return request({
    url: '/content/version/' + tplId,
    method: 'delete'
  })
}
