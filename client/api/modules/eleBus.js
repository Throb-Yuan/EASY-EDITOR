/*
* 组件所需接口
**/
import terminalServer from "@/service/terminalServer";

// 获取地区信息列表
export const areaList = p => terminalServer.get('/content/chinacity/list/get', {})
// 获取天气列表
export const weatherList = p => terminalServer.get('/content/weather/list/'+p, {})
// 获取当日天气
export const todayWeather = p => terminalServer.get('/content/weather/today/get/'+p, {})
// 获取rss内容
export const getRssUrl = p => terminalServer.get('/content/resource/by/url/get', p)
// 获取节目管理详细信息Plus
export const getProgramPlus = p =>terminalServer.get('/content/program/'+p, {})
