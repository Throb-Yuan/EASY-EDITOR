/*
	页面相关api
**/
import $axios from "@/service/httpServer";

/**
 * =========== MY HuiJi Post =================================================
 *
 * */
//  export const newLogin = p => $axios.postFormData('/content/auth/oauth/token', p)
/**
 * 节目管理
*/
// 新增节目
export const addProgramNew = p => $axios.post('/content/program', p)
// 新增节目
export const addProgram = p => $axios.post('/content/program/add', p)
// 删除节目管理
export const delProgram = p => $axios.delete('/content/program/'+p, {})
// 修改增节目管理
export const updateProgram = p => $axios.put('/content/program/update', p)
// 获取节目管理详细信息
export const getProgram = p => $axios.get('/content/program/'+p, {})
// 查询节目管理列表
export const listProgram = p => $axios.get('/content/program/list', p)
// 查询节目列表
export const listProgramGet = p => $axios.get('/content/program/list/get', p)
// 下载节目
export const programDownload = p => $axios.get('/content/program/download/'+p, {},"blob")
// 导出节目xlsx
export const programExport = p => $axios.download('/content/program/export', p,"arraybuffer")
// 导出资源xlsx
export const exportResource = p => $axios.download('/content/resource/export', p,"arraybuffer")
/**
 * 节目排程
*/
// 新增节目排程
export const addGroup = p => $axios.post('/content/group', p)
// 查询节目排程列表
export const listGroup = p => $axios.get('/content/group/list', p)
// 查询节目排程详细
export const getGroup = p => $axios.get('/content/group/'+p, {})
// 修改节目排程
export const updateGroup = p => $axios.put('/content/group', p)
// 删除节目排程
export const delGroup = p => $axios.delete('/content/group/'+p, {})
/**
 * 终端管理
*/

// 获取终端组列表
export const terminalDetailListGet = p => $axios.get('/content/terminal/detail/list/get', p)
// 获取终端组列表
export const terminalGroupListGet = p => $axios.get('/content/terminal/group/list/get', p)
// 添加终端
export const terminalAdd = p => $axios.post('/content/terminal/add', p)
// 获取终端组下终端列表
export const terminalByGroupListGet = p => $axios.get('/content/terminal/by/group/list/get', p)
// 添加终端组
export const terminalGroupAdd = p => $axios.post('/content/terminal/group/add', p)
// 删除终端组
export const terminalGroupDelete = p => $axios.delete('/content/terminal/group/delete', p)
// 删除终端
export const terminalDelete = p => $axios.delete('/content/terminal/delete', p)
// 获取终端详情
export const terminalDetailGet = p => $axios.get('/content/terminal/detail/get', p)
// 获取终端树列表
export const terminalTreeListGet = p => $axios.get('/content/terminal/tree/list/get', p)
// 编辑终端
export const terminalUpdate = p => $axios.put('/content/terminal/update', p)
// 编辑终端组
export const terminalGroupUpdate = p => $axios.put('/content/terminal/group/update', p)
// 获取终端组与应用的关系列表
export const terminalGroupAppListGet = p => $axios.get('/content/terminal/group/app/list/get', p)
// 添加终端组与应用的关系
export const terminalGroupAppAdd = p => $axios.post('/content/terminal/group/app/add', p)
// 新增终端控制记录
export const addControl = p => $axios.post('/content/control', p)
// 修改终端控制记录
export const updateControl = p => $axios.put('/content/control', p)
// 删除终端控制记录
export const delControl = p => $axios.delete('/content/control/'+p, {})
// 查询终端控制记录列表
export const listControl = p => $axios.get('/content/control/list', p)
// 查询终端控制记录详细
export const getControl = p => $axios.get('/content/control/'+p, {})
/**
 * 节目终端
*/
// 新增节目
export const addProgramterminal = p => $axios.post('/content/programterminal/add', p)
// 删除节目终端
export const delProgramterminal = p => $axios.delete('/content/programterminal/'+p, {})
// 修改节目终端
export const updateProgramterminal = p => $axios.put('/content/programterminal/update', p)
// 查询节目终端详细
export const getProgramterminal = p => $axios.get('/content/programterminal/'+p, {})
// 查询节目终端列表
export const listProgramterminal = p => $axios.get('/content/programterminal/list', p)
// 批量新增节目终端
export const batchAddProgramterminal = p => $axios.post('/content/programterminal/batch/add', p)

// 新增节目排程
export const addSchedule = p => $axios.post('/content/schedule', p)

// 修改节目排程
export const updateSchedule = p => $axios.put('/content/schedule', p)

// 删除节目排程
export const delSchedule = p => $axios.delete('/content/schedule/'+p, {})

// 查询节目排程详细
export const getSchedule = p => $axios.get('/content/schedule/'+p, {})

/**
 * 节目资源
*/
// 新增节目资源
export const addProgramresource = p => $axios.post('/content/programresource', p)
// 查询节目资源列表
export const listProgramresource = p => $axios.get('/content/programresource/list', p)
//修改节目资源详细
export const updateProgramresource = p => $axios.put('/content/programresource', p)
//查询节目资源详细
export const getProgramresource = p => $axios.get('/content/programresource/'+p, {})
// 删除节目资源
export const delProgramresource = p => $axios.delete('/content/programresource/'+p, {})
// 导出节目资源列表
// export const exportResource = p => $axios.post('/content/programresource', p)
/**
 * 资源列表
*/
// 新增资源列表
export const addResource = p => $axios.post('/content/resource', p)
// 查询资源列表
export const listResource = p => $axios.get('/content/resource/list', p)
//查询资源列表详细
export const getResource = p => $axios.get('/content/resource/'+p, {})
// 修改资源列表
export const updateResource = p => $axios.put('/content/resource', p)
// 删除资源列表
export const delResource = p => $axios.delete('/content/resource/'+p, {})
/**
 * 资源类型
*/
// 新增资源类型
export const addResourcetype = p => $axios.post('/content/resourcetype', p)
// 查询资源类型列表
export const listResourcetype = p => $axios.get('/content/resourcetype/list', p)
//查询资源类型详细
export const getResourcetype = p => $axios.get('/content/resourcetype/'+p, {})
// 修改资源类型
export const updateResourcetype = p => $axios.put('/content/resourcetype', p)
// 删除资源类型
export const delResourcetype = p => $axios.delete('/content/resourcetype/'+p, {})
/**
 * 场景管理
*/
// 新增场景管理
export const addScene = p => $axios.post('/content/scene', p)
// 查询场景管理列表
export const listScene = p => $axios.get('/content/scene/list', p)
//查询场景管理详细
export const getScene = p => $axios.get('/content/scene/'+p, {})
// 修改场景管理
export const updateScene = p => $axios.put('/content/scene', p)
// 删除场景管理
export const delScene = p => $axios.delete('/content/scene/'+p, {})
/**
 * 开关机计划
*/
// 新增开关机计划
export const addShutdownPlan = p => $axios.post('/content/terminal/shutdown/plan', p)
// 查询开关机计划列表
export const listShutdownPlan = p => $axios.get('/content/terminal/shutdown/plan/list', p)
//查询开关机计划详细
export const getShutdownPlan = p => $axios.get('/content/terminal/shutdown/plan/'+p, {})
// 修改开关机计划
export const updateShutdownPlan = p => $axios.put('/content/terminal/shutdown/plan', p)
// 删除开关机计划
export const delShutdownPlan = p => $axios.delete('/content/terminal/shutdown/plan/'+p, {})
/**
 * 未被挂载的接口
 */
 export const listSchedule = p => $axios.get('/content/schedule/list', p)

 export const appListGet = p => $axios.post('/system/app/list/get', p)

 // 查询模板版本信息列表
 export const listVersion = p => $axios.get('/content/version/list', p)

 // 查询模板版本信息详细
 export const getVersion = p => $axios.get('/content/version/'+p, {})

 // 新增模板版本信息
 export const addVersion = p => $axios.post('/content/version', p)

 // 修改模板版本信息
 export const updateVersion = p => $axios.put('/content/version', p)

 // 删除模板版本信息
 export const delVersion = p => $axios.delete('/content/version/'+p, {})

 // 根据字典类型查询字典数据信息
 export const getDicts = p => $axios.get('/system/dict/data/type/'+p, {})

// 查询字幕信息列表
export const listSubtitle = p => $axios.get('/content/subtitle/list', p)

// 查询字幕信息详细
export const getSubtitle = p => $axios.get('/content/subtitle/'+p, {})

// 新增字幕信息
export const addSubtitle = p => $axios.post('/content/subtitle', p)

// 修改字幕信息
export const updateSubtitle = p => $axios.put('/content/subtitle', p)

// 删除字幕信息
export const delSubtitle = p => $axios.delete('/content/subtitle/'+p, {})

export const batchAddSubtitlTerminal = p => $axios.post('/content/subtitlTerminal/batch/add', p)
// 字典查询
export const dictList = p => $axios.get('/system/dict/data/list', p)
// 指定终端字幕下发记录
export const listSubtitlTerminal = p => $axios.get('/content/subtitlTerminal/list', p)
