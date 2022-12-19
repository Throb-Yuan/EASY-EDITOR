import request from '@/service/httpServer'

// 查询节目管理列表
export function listProgram(query) {
  return request({
    url: '/content/program/list',
    method: 'get',
    params: query
  })
}

export function listProgramGet(query) {
  return request({
    url: '/content/program/list/get',
    method: 'get',
    params: query
  })
}

// 查询节目管理详细
export function getProgram(programId) {
  return request({
    url: '/content/program/' + programId,
    method: 'get'
  })
}

// 新增节目管理
export function addProgram(data) {
  return request({
    url: '/content/program',
    method: 'post',
    data: data
  })
}

// 修改节目管理
export function updateProgram(data) {
  return request({
    url: '/content/program',
    method: 'put',
    data: data
  })
}

// 删除节目管理
export function delProgram(programId) {
  return request({
    url: '/content/program/' + programId,
    method: 'delete'
  })
}
