import {get,post,put} from '@/service/httpServer'

// 查询终端控制记录列表
export function listControl(query) {
  return request({
    url: '/control/list',
    method: 'get',
    params: query
  })
}

// 查询终端控制记录详细
export function getControl(terminalControlId) {
  return request({
    url: '/control/' + terminalControlId,
    method: 'get'
  })
}

// 新增终端控制记录
export function addControl(data) {
  return request({
    url: '/control',
    method: 'post',
    data: data
  })
}

// 修改终端控制记录
export function updateControl(data) {
  return request({
    url: '/control',
    method: 'put',
    data: data
  })
}

// 删除终端控制记录
export function delControl(terminalControlId) {
  return request({
    url: '/control/' + terminalControlId,
    method: 'delete'
  })
}
//  获取终端组列表
export function terminalDetailListGet(data) {
  return post({
    url: '/terminal/detail/list/get',
    method: 'post',
    data: data
  })
}
