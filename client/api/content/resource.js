import request from '@/service/httpServer'

// 查询资源列表列表
export function listResource(query) {
  return request({
    url: '/content/resource/list',
    method: 'get',
    params: query
  })
}

// 查询资源列表详细
export function getResource(resourceId) {
  return request({
    url: '/content/resource/' + resourceId,
    method: 'get'
  })
}

// 新增资源列表
export function addResource(data) {
  return request({
    url: '/content/resource',
    method: 'post',
    data: data
  })
}

// 修改资源列表
export function updateResource(data) {
  return request({
    url: '/content/resource',
    method: 'put',
    data: data
  })
}

// 删除资源列表
export function delResource(resourceId) {
  return request({
    url: '/content/resource/' + resourceId,
    method: 'delete'
  })
}
