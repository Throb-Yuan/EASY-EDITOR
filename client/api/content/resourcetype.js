import request from '@/service/httpServer'

// 查询资源类型列表
export function listResourcetype(query) {
  return request({
    url: '/content/resourcetype/list',
    method: 'get',
    params: query
  })
}

// 查询资源类型详细
export function getResourcetype(resourceTypeId) {
  return request({
    url: '/content/resourcetype/' + resourceTypeId,
    method: 'get'
  })
}

// 新增资源类型
export function addResourcetype(data) {
  return request({
    url: '/content/resourcetype',
    method: 'post',
    data: data
  })
}

// 修改资源类型
export function updateResourcetype(data) {
  return request({
    url: '/content/resourcetype',
    method: 'put',
    data: data
  })
}

// 删除资源类型
export function delResourcetype(resourceTypeId) {
  return request({
    url: '/content/resourcetype/' + resourceTypeId,
    method: 'delete'
  })
}
