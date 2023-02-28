/*
* 组件所需接口
**/
import $axios from "@/service/httpServer";

// 获取地区信息列表
export const areaList = p => $axios.get('/content/chinacity/list/get', {})
// 获取天气列表
export const weatherList = p => $axios.get('/content/weather/list/'+p, {})
// 获取当日天气
export const todayWeather = p => $axios.get('/content/weather/today/get/'+p, {})
// 获取rss内容
export const getRssUrl = p => $axios.get('/content/resource/by/url/get', p)
