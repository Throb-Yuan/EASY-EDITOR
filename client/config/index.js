/**
 * 公共配置文件
 */
import $config from '../../config'


const configDict = {
	development: {
		baseURL: 'http://localhost:4000'
	},
	production: {
		baseURL:  process.env.VUE_APP_BASE_API
	}
}

const currentConfigKey = process.env.NODE_ENV
const isDev = process.env.NODE_ENV === 'development'
const isTest = process.env.NODE_ENV === 'development'
const isApp = !window.location.href.includes('http')
// const isApp = true
const configObj = {
	isDevelop: (isDev || isTest),
	...configDict[currentConfigKey],
	// h5模式宽高
	// canvasH5Width: 375,
	// canvasH5Height: 644,
	canvasH5Width: isApp ? window.screen.availWidth : 800,
	canvasH5Height: isApp ? window.screen.availHeight : 450,
	pageModeList: [{
		value: 'h5',
		label: 'H5',
		disabled: false
	}, {
		value: 'longPage',
		label: '长页H5',
		disabled: false
	}, {
		name: 'relativePage',
		label: '排版图文',
		disabled: true
	}, {
		value: 'pc',
		label: 'PC页面',
		disabled: true
	}]
}

export default configObj
