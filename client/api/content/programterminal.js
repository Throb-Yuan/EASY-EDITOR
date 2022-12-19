import request from '@/service/httpServer'

// 查询节目终端列表
export function listProgramterminal(query) {
  return request({
    url: '/content/programterminal/list',
    method: 'get',
    params: query
  })
}

// 查询节目终端详细
export function getProgramterminal(programTerminalId) {
  return request({
    url: '/content/programterminal/' + programTerminalId,
    method: 'get'
  })
}

// 新增节目终端
export function addProgramterminal(data) {
  return request({
    url: '/content/programterminal',
    method: 'post',
    data: data
  })
}

// 批量新增节目终端
export function batchAddProgramterminal(data) {
  return request({
    url: '/content/programterminal/batch/add',
    method: 'post',
    data: data
  })
}

// 修改节目终端
export function updateProgramterminal(data) {
  return request({
    url: '/content/programterminal',
    method: 'put',
    data: data
  })
}

// 删除节目终端
export function delProgramterminal(programTerminalId) {
  return request({
    url: '/content/programterminal/' + programTerminalId,
    method: 'delete'
  })
}
