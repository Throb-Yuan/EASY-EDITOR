import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


/**  各个模块 */
export default new Router({
	routes: [{
		path: '/',
		name: 'Layout',
		component: () => import('@/pages/layout'),
		redirect: {name: 'Home'},
		children: [
			{
				path: 'home',
				name: 'Home',
				component: () => import('@/pages/home/index'),
				redirect: {name: 'pageList'},
				children: [{
					path: 'page-list',
					name: 'pageList',
					component: () => import('@/pages/home/page-list'),
				}, {
					path: 'my-template',
					name: 'myTemplate',
					component: () => import('@/pages/home/my-template'),
				}, {
					path: 'page-data',
					name: 'pageData',
					component: () => import('@/pages/home/page-data'),
				}, {
					path: 'page-data-detail',
					name: 'pageDataDetail',
					component: () => import('@/pages/home/page-data-detail'),
				}, {
					path: 'template-list',
					name: 'templateList',
					component: () => import('@/pages/home/template-list'),
				},{
					path: 'terminal-list',
					name: 'terminalList',//终端管理
					component: () => import('@/pages/home/terminal-list'),
				},{
					path: 'program-list',
					name: 'programList',//节目管理
					component: () => import('@/pages/home/program-list'),
				},{
					path: 'resource-list',
					name: 'resourceList',//资源列表
					component: () => import('@/pages/home/resource-list'),
				},{
					path: 'resourcetype-list',
					name: 'resourcetypeList',//资源类型列表
					component: () => import('@/pages/home/resourcetype-list'),
				},{
					path: 'scene-list',
					name: 'sceneList',//场景管理
					component: () => import('@/pages/home/scene-list'),
				},{
					path: 'group-list',
					name: 'groupList',//节目排程
					component: () => import('@/pages/home/group/index'),
				},{
					path: 'group-detail',
					name: 'groupDetail',//节目排程详情
					component: () => import('@/pages/home/group/detail'),
				},]
			}, {
				path: '/editor',
				name: 'Editor',
				component: () => import('@/pages/editor/Index')
			},{
				path: '/terminals',
				name: 'terminalLists',
				component: () => import('@/pages/terminal/terminal-list'),
			}
		],
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('@/pages/Login'),
		meta: {
			hideHeader: true,
			trust: true,
			noNeedLogin: true
		}
	}]
})
