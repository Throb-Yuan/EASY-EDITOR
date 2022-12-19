import request from '@/service/httpServer'

// 查询节目排程列表
export function listGroup(query) {
  return request({
    url: '/content/group/list',
    method: 'get',
    params: query
  })
}

// 查询节目排程详细
export function getGroup(programScheduleGroupId) {
  return request({
    url: '/content/group/' + programScheduleGroupId,
    method: 'get'
  })
}

// 新增节目排程
export function addGroup(data) {
  return request({
    url: '/content/group',
    method: 'post',
    data: data
  })
}

// 修改节目排程
export function updateGroup(data) {
  return request({
    url: '/content/group',
    method: 'put',
    data: data
  })
}

// 删除节目排程
export function delGroup(programScheduleGroupId) {
  return request({
    url: '/content/group/' + programScheduleGroupId,
    method: 'delete'
  })
}
