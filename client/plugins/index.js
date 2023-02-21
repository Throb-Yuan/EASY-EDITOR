/**
 * 组件库入口
 * */

import Text from './text'
import Image from './image'
import ImageCarousel from './image-carousel'
import RectangleBorder from './rectangle-border'
import RectangleLine from './rectangle-line'
import Iframe from './iframe'
import Button from './button'
import bgMusic from './bg-music'
import Video from './video'
import Notice from './notice'
import Qrcode from './qrcode'
import DateTmie from './date-time'
import WeekTmie from './week-time'
import countDownTmie from './count-down'
import pdfView from './pdf-view'
import Weather from './weather'
import NoticeRss from './noticeRss'
// 所有组件列表
const components = [
	Text,
	Image,
	ImageCarousel,
	RectangleBorder,
	RectangleLine,
	Iframe,
	Button,
	bgMusic,
	Video,
	Notice,
	Qrcode,
	DateTmie,
	WeekTmie,
	countDownTmie,
	pdfView,
	NoticeRss,
	Weather
]
// 定义 install 方法，接收 Vue 作为参数
const install = function (Vue) {
	// 判断是否安装，安装过就不继续往下执行
	if (install.installed) return
	install.installed = true
	// 遍历注册所有组件
	components.map(component => Vue.component(component.name, component))
}

// 检测到 Vue 才执行，毕竟我们是基于 Vue 的
if (typeof window !== 'undefined' && window.Vue) {
	install(window.Vue)
}

let _qk_register_components_object = {};
components.forEach(item => {
	_qk_register_components_object[item.name] = item
})


export {
	Text,
	Image,
	ImageCarousel,
	RectangleBorder,
	RectangleLine,
	Iframe,
	Button,
	bgMusic,
	Video,
	Notice,
	Qrcode,
	DateTmie,
	WeekTmie,
	countDownTmie,
	pdfView,
	Weather,
	NoticeRss,
	_qk_register_components_object
}



export default {
	install,
	// 所有组件，必须具有 install，才能使用 Vue.use()
}
