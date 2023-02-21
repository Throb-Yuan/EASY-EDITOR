import $config from '@client/config'

export default [
	{
		title: '基础组件',
		components: [
			{
				elName: 'qk-text',
				title: '文字',
				icon: 'iconfont iconwenben',
				// 每个组件设置props来展示哪些显示哪些编辑项
				valueType: '', // 标识数据类型，用于表单组件
				defaultStyle: {
					height: 40
				}
			},
			{
				elName: 'qk-image',
				title: '图片',
				icon: 'iconfont icontupian',
				valueType: '', // 标识数据类型，用于表单组件,
				defaultStyle: {
					width: $config.canvasH5Width/2,
					height: $config.canvasH5Height/2,
					top: 80,
					left: 180,
					borderRadius: 6
				}
			},
			{
				elName: 'qk-button',
				title: '按钮',
				icon: 'iconfont iconanniuzu',
				// 每个组件设置props来展示哪些显示哪些编辑项
				valueType: '', // 标识数据类型，用于表单组件
				defaultStyle: {
					width: 140,
					height: 40,
					paddingTop: 10,
					paddingBottom: 10,
					borderColor: "#409EFF",
					borderStyle: 'solid',
					borderWidth: 1,
					borderRadius: 4,
					backgroundColor: '#409EFF',
					color: "#FFF"
				}
			},
			{
				elName: 'qk-rectangle-border',
				title: '矩形边框',
				icon: 'iconfont iconjuxing',
				valueType: '',
				defaultStyle: {
					width: 120,
					height: 100,
					borderColor: "#999999",
					borderStyle: 'solid',
					borderWidth: 2
				}
			},
			{
				elName: 'qk-rectangle-line',
				title: '分割线',
				icon: 'iconfont icon758bianjiqi_fengexian',
				valueType: '',
				defaultStyle: {
					height: 31,
					width: 300,
					// backgroundColor: '#999999',
					paddingTop:15,
					paddingBottom:15
				}
			},
			{
				elName: 'qk-iframe',
				title: '内嵌iframe',
				icon: 'iconfont iconiframetianjia',
				valueType: '',
				defaultStyle: {
					width: $config.canvasH5Width / 2,
					height: 300,
					paddingTop: 10,
					paddingBottom: 10
				}
			},
			// {
			// 	elName: 'map',
			// 	title: '地图',
			// 	icon: 'iconfont iconditu',
			// 	valueType: '', 
			// 	defaultStyle: {
			// 		width: 300,
			// 		height: 200,
			// 		paddingTop: 10,
			// 		paddingBottom: 10
			// 	}
			// },

		]
	},
	// {
	// 	title: '表单组件',
	// 	components: [
	// 		{
	// 			elName: 'input',
	// 			title: '文本框',
	// 			icon: 'iconfont iconwenbenkuang'
	// 		},
	// 		{
	// 			elName: 'radio',
	// 			title: '单选框',
	// 			icon: 'iconfont iconplus-radio'
	// 		},
	// 		{
	// 			elName: 'checkbox',
	// 			title: '复选框',
	// 			icon: 'iconfont iconduoxuan'
	// 		},
	// 		{
	// 			elName: 'date',
	// 			title: '日期选择器',
	// 			icon: 'iconfont iconriqi'
	// 		},
	// 		{
	// 			elName: 'time',
	// 			title: '时间选择器',
	// 			icon: 'iconfont iconshijian'
	// 		},
	// 		{
	// 			elName: 'datetime',
	// 			title: '日期时间',
	// 			icon: 'iconfont iconriqishijian'
	// 		}
	// 	]
	// },
	{
		title: '功能组件',
		components: [
			{
				elName: 'qk-video',
				title: '视频',
				icon: 'iconfont iconshipin',
				valueType: '',
				defaultStyle: {
					width: $config.canvasH5Width/2,
					height: $config.canvasH5Height/2,
					paddingTop: 0,
					paddingBottom: 0,
					top: 40,
					left: 40
				}
			}, {
				elName: 'qk-bg-music',
				title: '音乐',
				icon: 'iconfont iconyinlemusic217',
				valueType: '',
				defaultStyle: {
					height: 52,
					width: 52,
				}
			},
			{
				elName: 'qk-image-carousel',
				title: '混播',
				icon: 'iconfont iconshouyelunbotu',
				valueType: '', // 标识数据类型，用于表单组件,
				defaultStyle: {
					width: $config.canvasH5Width/2,
					height: $config.canvasH5Height/2,
					top: 20,
					left: $config.canvasH5Width/2
				}
			},{
				elName: 'qk-pdf-view',
				title: 'PDF',
				icon: 'hjiconfont iconPDF',
				valueType: '', // 标识数据类型，用于表单组件,
				defaultStyle: {
					width: 315,
					height: 450,
					top: 0,
					left: 0
				}
			},
			{
				elName: 'qk-date-time',
				title: '日期时间',
				icon: 'iconfont iconriqishijian',
				// 每个组件设置props来展示哪些显示哪些编辑项
				valueType: '', // 标识数据类型，用于表单组件
				defaultStyle: {
					width: 400,
					height: 40,
					color: "#3e8dd3",
					fontSize: 32,
					fontWeight: 600
				}
			},{
				elName: 'qk-week-time',
				title: '星期',
				icon: 'hjiconfont iconwodeyizhou',
				// 每个组件设置props来展示哪些显示哪些编辑项
				valueType: '', // 标识数据类型，用于表单组件
				defaultStyle: {
					width: 120,
					height: 40,
					color: "#3e8dd3",
					fontSize: 32,
					top: 240,
					fontWeight: 600
				}
			},{
				elName: 'qk-count-down',
				title: '倒计时',
				icon: 'hjiconfont iconjishishalou',
				// 每个组件设置props来展示哪些显示哪些编辑项
				valueType: '', // 标识数据类型，用于表单组件
				defaultStyle: {
					width: 180,
					height: 32,
					color: "#3e8dd3",
					fontSize: 24,
					fontWeight: 600,
					top: 280,
				}
			},
			{
				elName: 'qk-notice',
				title: '公告栏',
				icon: 'hjiconfont iconpaomadeng_fuzhi',
				valueType: '',
				defaultStyle: {
					width: $config.canvasH5Width,
					height: 40,
					paddingTop: 0,
					paddingBottom: 0,
					color: '#f90',
					backgroundColor: '#fdf6ec',
					fontSize: 22,
					fontWeight: 600,
					top: 400,
					left: 0
				}
			},
			{
				elName: 'qk-qrcode',
				title: '二维码',
				icon: 'iconfont iconfengexian',
				valueType: '',
				defaultStyle: {
					height: 120,
					width: 120,
				}
			},
			{
				elName: 'qk-weather',
				title: '天气',
				icon: 'hjiconfont iconduoyun',
				valueType: '',
				defaultStyle: {
					height: 80,
					width: 180,
					color:'#0d7fef'
				}
			},
			// {
			// 	elName: 'qk-notice-rss',
			// 	title: 'RSS',
			// 	icon: 'hjiconfont iconrss',
			// 	valueType: '',
			// 	defaultStyle: {
			// 		height: 180,
			// 		width: 180,
			// 		color:'#0d7fef'
			// 	}
			// }
		]
	},

]
