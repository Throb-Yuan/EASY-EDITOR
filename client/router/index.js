import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


/**  各个模块 */
export default new Router({
	mode: process.env.NODE_ENV == 'development' ? "hash" : 'history',
	routes: [{
		path: '/',
		name: 'Layout',
		component: () => import('@/pages/layout'),
		redirect: {name: 'Login'},
		children: [
			{
				path: 'home',
				name: 'Home',
				component: () => import('@/pages/home/index'),
				redirect: {name: 'pageList'},
				children: [{
					path: 'page-list',//我的节目
					name: 'pageList',
					component: () => import('@/pages/home/page-list'),
				}, {
					path: 'terminal-list',
					name: 'terminalList',//终端管理
					component: () => import('@/pages/home/terminal-list'),
				},{
					path: 'resource-list',
					name: 'resourceList',//资源列表
					component: () => import('@/pages/home/resource-list'),
				},{
					path: 'scene-list',
					name: 'sceneList',//场景管理
					component: () => import('@/pages/home/scene-list'),
				},{
					path: 'group-list',
					name: 'groupList',//节目排程
					component: () => import('@/pages/home/group/index'),
				},{
					path: 'subtitle-list',
					name: 'subtitleList',//节目排程
					component: () => import('@/pages/home/subtitle-list'),
				},{
					path: 'group-detail',
					name: 'groupDetail',//节目排程详情
					component: () => import('@/pages/home/group/detail'),
				},{
					path: 'template-version-list',
					name: 'templateVersionList',//模板版本管理
					component: () => import('@/pages/home/template-version-list'),
				}]
			}, {
				path: '/editor',//节目新增/编辑
				name: 'Editor',
				component: () => import('@/pages/editor/Index')
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
