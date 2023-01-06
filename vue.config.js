const path = require('path')
const fs = require('fs')

const port = process.env.port || process.env.npm_config_port || 80 // 端口
let devServer = {
	proxy: { // 代理
		// [process.env.VUE_APP_BASE_API]: {
		// 	target: `http://localhost:8080`,
		// 	changeOrigin: true,
		// 	pathRewrite: {
		// 	  ['^' + process.env.VUE_APP_BASE_API]: ''
		// 	}
		//   },
		//   disableHostCheck: true
		'/': {
			target: 'http://192.168.101.250:2501',//设置你调用的接口域名和端口号 别忘了加httphttp://192.168.101.250:2501
			ws: false,
			changeOrigin: true,               // needed for virtual hosted sites
			pathRewrite: {
				"^/": "",///content
			},
		}
	}
}
let devServerPl = {
	host: '0.0.0.0',
	port: port,
	open: true,
	proxy: {
		// detail: https://cli.vuejs.org/config/#devserver-proxy
		[process.env.VUE_APP_BASE_API]: {
			target: `http://localhost:8080`,
			changeOrigin: true,
			pathRewrite: {
				['^' + process.env.VUE_APP_BASE_API]: ''
			}
		}
	},
	disableHostCheck: true
}

module.exports = {
	publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
	// 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
	outputDir: 'dist',
	// 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
	assetsDir: 'static',
	// 是否开启eslint保存检测，有效值：ture | false | 'error'
	lintOnSave: process.env.NODE_ENV === 'development',
	// 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
	productionSourceMap: false,
	devServer: devServer,
	// 输出文件目录
	assetsDir: "static",
	// 修改 pages 入口
	pages: {
		index: {
			entry: 'client/main.js', // 入口
			template: 'public/engine-h5-long.html', // 模板
			filename: 'index.html' // 输出文件
		}
	},
	css: {
		loaderOptions: {
			sass: {
				// @/ 是 src/ 的别名
				data: fs.readFileSync(path.resolve(__dirname, `./client/common/styles/variables.scss`), 'utf-8') // 公共变量文件注入
			}
		}
	},
	// 扩展 webpack 配置
	chainWebpack: config => {
		// @ 默认指向 src 目录，这里要改成 examples
		// 另外也可以新增一个 ~ 指向 packages
		config.resolve.alias
			.set('@', path.resolve('client'))
			.set('@client', path.resolve('client'))
			.set('@plugins', path.resolve('plugins'))
			.set('@server', path.resolve('server'))
		config.module
			.rule('js')
			.include.add(/engine-template/).end()
			.include.add(/client/).end()
			.include.add(/common/).end()
			.use('babel')
			.loader('babel-loader')
			.tap(options => {
				// 修改它的选项...
				return options
			})
	}
}
