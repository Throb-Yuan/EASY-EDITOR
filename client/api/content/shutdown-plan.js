import request from '@/service/httpServer'

// 查询开关机计划列表
export function listShutdownPlan(query) {
  return request({
    url: '/content/terminal/shutdown/plan/list',
    method: 'get',
    params: query
  })
}

// 查询开关机计划详细
export function getShutdownPlan(terminalShutdownPlanId) {
  return request({
    url: '/content/terminal/shutdown/plan/' + terminalShutdownPlanId,
    method: 'get'
  })
}

// 新增开关机计划
export function addShutdownPlan(data) {
  return request({
    url: '/content/terminal/shutdown/plan',
    method: 'post',
    data: data
  })
}

// 修改开关机计划
export function updateShutdownPlan(data) {
  return request({
    url: '/content/terminal/shutdown/plan',
    method: 'put',
    data: data
  })
}

// 删除开关机计划
export function delShutdownPlan(terminalShutdownPlanId) {
  return request({
    url: '/content/terminal/shutdown/plan/' + terminalShutdownPlanId,
    method: 'delete'
  })
}
