import request from '@/service/httpServer'

// 查询场景管理列表
export function listScene(query) {
  return request({
    url: '/content/scene/list',
    method: 'get',
    params: query
  })
}

// 查询场景管理详细
export function getScene(sceneId) {
  return request({
    url: '/content/scene/' + sceneId,
    method: 'get'
  })
}

// 新增场景管理
export function addScene(data) {
  return request({
    url: '/content/scene',
    method: 'post',
    data: data
  })
}

// 修改场景管理
export function updateScene(data) {
  return request({
    url: '/content/scene',
    method: 'put',
    data: data
  })
}

// 删除场景管理
export function delScene(sceneId) {
  return request({
    url: '/content/scene/' + sceneId,
    method: 'delete'
  })
}
