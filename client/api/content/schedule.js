import request from '@/service/httpServer'

// 查询节目排程列表
export function listSchedule(query) {
  return request({
    url: '/content/schedule/list',
    method: 'get',
    params: query
  })
}

// 查询节目排程详细
export function getSchedule(programScheduleId) {
  return request({
    url: '/content/schedule/' + programScheduleId,
    method: 'get'
  })
}

// 新增节目排程
export function addSchedule(data) {
  return request({
    url: '/content/schedule',
    method: 'post',
    data: data
  })
}

// 修改节目排程
export function updateSchedule(data) {
  return request({
    url: '/content/schedule',
    method: 'put',
    data: data
  })
}

// 删除节目排程
export function delSchedule(programScheduleId) {
  return request({
    url: '/content/schedule/' + programScheduleId,
    method: 'delete'
  })
}
