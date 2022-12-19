<template>
	<div class="page-editor editor-wrapper" v-loading="loading">
		<!--左侧导航-->
		<div class="editor-side-bar border-R">
			<el-tabs tab-position="left" v-model="activeSideBar" style="height: 100%;">
				<el-tab-pane v-for="(item, index) in sidebarMenus" :key="index" :name="item.value">
					<el-tooltip slot="label" class="item" effect="dark" :content="item.label" placement="right">
						<i :class="item.elementUiIcon"></i>
					</el-tooltip>
				</el-tab-pane>
			</el-tabs>
		</div>
		<!--组件&页面&模板-->
		<div class="editor-page-edit-wrapper">
			<componentLibs v-if="activeSideBar === 'componentLibs'" />
			<pageManage v-if="activeSideBar === 'pageManage'" />
			<templateLibs v-if="activeSideBar === 'templateLibs'" />
		</div>
		<!--页面编辑区域-->
		<div class="editor-main">
			<div class="control-bar-wrapper">
				<controlBar :scale.sync="canvasConfig.scale" @import-psd-data="importPsdData"
					@showPreview="showPreviewFn" @returnHtml="returnHtmlFn" @cancel="cancelFn" @publish="publishFn"
					@save="saveFn" />
			</div>
			<editorPan :scale.sync="canvasConfig.scale" />
		</div>
		<!--属性编辑区域-->
		<div class="el-attr-edit-wrapper scrollbar-wrapper">
			<el-tabs v-model="activeAttr" stretch>
				<el-tab-pane label="属性" name="属性">
					<attrEdit></attrEdit>
				</el-tab-pane>
				<el-tab-pane label="事件" name="事件">
					<eventEdit></eventEdit>
				</el-tab-pane>
				<el-tab-pane label="动画" name="动画">
					<animationEdit></animationEdit>
				</el-tab-pane>
				<el-tab-pane label="JS脚本" name="脚本">
					<scriptEdit></scriptEdit>
				</el-tab-pane>
				<el-tab-pane label="页面设置" name="页面属性">
					<pageAttrEdit></pageAttrEdit>
				</el-tab-pane>
			</el-tabs>
		</div>
		<!--预览-->
		<previewPage v-if="showPreview" :pageData="projectData" :sceneList="sceneList" :pageId="id"
			@closePreview="showPreview = false" @publishFn="publishFn" @saveHtmlFn="saveHtmlFn" @saveFn="saveFn">
		</previewPage>
		<!--我的图片-->
		<imageLibs />
	</div>
</template>

<script>
import componentLibs from './components/component-libs/Index'
import pageManage from './components/page-manage'
import templateLibs from './components/template-libs'
import editorPan from './components/editor-panel/Index'
// 属性编辑相关组件
import attrEdit from './components/attr-configure/attr-edit'
import animationEdit from './components/attr-configure/animation-edit'
import eventEdit from './components/attr-configure/event-edit'
import pageAttrEdit from './components/attr-configure/page-attr-edit'
import scriptEdit from './components/attr-configure/script-edit'
import { createUUID, deepClone } from '../../../common/uitls'
import controlBar from './components/control-bar'

import previewPage from './components/preview'
import imageLibs from '@client/components/image-libs'

import { mapState } from 'vuex'
import html2canvas from 'html2canvas'

export default {
	components: {
		componentLibs,
		pageManage,
		templateLibs,
		imageLibs,
		editorPan,
		attrEdit,
		animationEdit,
		eventEdit,
		pageAttrEdit,
		scriptEdit,
		controlBar,
		previewPage
	},
	data() {
		return {
			putProjects:{},
			id: '', // 当前页面id
			programId: '',
			loading: false,
			showPreview: false,
			activeAttr: '属性',
			activeSideBar: 'componentLibs',
			sceneList: [],
			sidebarMenus: [
				{
					label: '组件列表',
					value: 'componentLibs',
					elementUiIcon: 'el-icon-s-operation'
				},
				{
					label: '页面管理',
					value: 'pageManage',
					elementUiIcon: 'el-icon-document'
				},
				{
					label: '模板库',
					value: 'templateLibs',
					elementUiIcon: 'el-icon-files'
				}
			],
			canvasConfig: {
				scale: 1
			}
		}
	},
	computed: {
		...mapState({
			projectData: state => state.editor.projectData,
			activePageUUID: state => state.editor.activePageUUID,
			activeElementUUID: state => state.editor.activeElementUUID
		})
	},
	created() {
		this.$store.dispatch('setPrjectData')
		this.id = this.$route.query.id;
		this.initPageData()
		this.getSceneList();
		// this.id ? this.initPageData() : this.$store.dispatch('setPrjectData', {...this.$programInit})
	},
	methods: {
		/**
		 * 初始化页面数据
		 */
		getSceneList() {
			this.$API.listScene().then(response => {
				this.sceneList = response.data;
				this.projectData.sceneId = response.data[0].sceneId
			});
		},
		initPageData() {
			if (!this.id) {
				let body = deepClone(this.$programInit.body)
				body.pages[0].uuid = createUUID()
				this.$store.dispatch('setPrjectData', {
					...this.$programInit.body
				})
				return false;
			}
			this.loading = true;
			this.$API.getProgram(this.id).then(res => {
				this.loading = false;
				let jsonProjects = JSON.parse(res.data.afterHtml)
				this.putProjects = res.data
				console.log("res.body==", jsonProjects);
				this.$store.dispatch('setPrjectData', {
					...jsonProjects
				})

			}).catch(() => {
				this.loading = false;
			})
		},
		/**
		 * 保存HTMl
		 */
		getKebabCase(str) {
			return str.replace(/[A-Z]/g, function (i) {
				return '-' + i.toLowerCase();
			})
		},

		isEmpty(obj) {
			/**
		 * 过滤对象的空值，节省性能
		 */
			if (typeof obj === 'undefined' || obj === null || obj === '') return true;
			return false
		},
		preProcessData(formData) {
			Object.keys(formData).forEach(item => {
				if (this.isEmpty(formData[item])) {
					delete formData[item];
				}
			})
			return formData;
		},
		async saveHtmlFn() {
			// await this.screenshots()
			// 提交数据再预览
			let projectDataEles = JSON.parse(JSON.stringify(this.projectData.pages[0].elements))
			let needRate = ["width", "height", "top", "left", 'padding', 'fontSize', 'margin', "paddingBottom", "paddingLeft", "paddingRight", "paddingTop", "borderRadius"]
			// let regs = 'yuanRenJun'.replace(/[A-Z]/g, '-$&').toLowerCase()
			let htmlStart = '<html dir="ltr" lang="zh"> <head><meta charset="utf-8"><title>quarkTest</body></body></title><style>body { background: #FFFFFF; margin: 0;max-width:100vw;}</style></head><body>'
			let htmlEnd = '  </body></html>'
			let bodyIns = ''
			console.log("页面数据==》", projectDataEles);
			// let tagsArr = this.projectData.pages[0].elements
			let getTags = projectDataEles.map(cur => {
				// if(cur.elName=="qk-text"){
				// 	bodyIns =`${bodyIns}<div type=>${cur.propsValue.text}</div>`
				// }
				let cssData = this.preProcessData(cur.commonStyle)

				let cssString = ''
				Object.keys(cssData).forEach(key => {
					if (needRate.includes(key)) {
						cssData[key] = cssData[key] / 800 * 100
						cssString = cssString + key.replace(/[A-Z]/g, '-$&').toLowerCase() + ':' + cssData[key] + 'vw;'
					} else {
						cssString = cssString + key.replace(/[A-Z]/g, '-$&').toLowerCase() + ':' + cssData[key] + ';'
					}
				})
				let androidId = ''
				if (cur.androidId) androidId = cur.androidId
				if (cur.elName == "qk-image") {
					bodyIns = `${bodyIns}<div type='2cse_pic' id='${androidId}'> <image style='${cssString}' src='${cur.propsValue.imageSrc}'></image> </div>`
				}
				// if (cur.elName == "qk-text") {
				// 	bodyIns = `${bodyIns}<div type='2cse_text' style='${cssString}'> ${cur.propsValue.text}</div>`
				// }
				if (cur.elName == "qk-rectangle-border") {//分割线
					bodyIns = `${bodyIns}<div type='2cse_rectangle-border' style='${cssString}'></div>`
				}
			})
			let htmlAlls = htmlStart + bodyIns + htmlEnd
			// 在那些黎明将至的山谷里 我急促的甚至奔跑起来 生命穿越苏醒的花丛 让我带走这里躁动的希望
			// 在那些炙热潮湿的喧嚣里 我急促的甚至奔跑起来 汗水渗透城市的睡梦 让我带走这里欢快的舞蹈
			// 在那些插着稻草人的田野里 我急促的甚至奔跑起来 风吹拂金黄颜色的麦地 让我带走这里成熟的消息
			// 在那些雪花绽放的日子里 我急促的甚至奔跑起来 冰雪的花粉在脸上融化 让我带走这里所有的回忆
			this.$copyText(htmlAlls).then(() => {
				this.$message.success('复制成功!');
			})
		},
		/**
		 * 保存
		 */
		async saveFn() {
			// await this.screenshots()
			// 提交数据再预览
			this.$API.updatePage({ pageData: this.projectData }).then(() => {
				// this.$message.success('保存成功!')
				this.showPreview = false
			})
		},
		/**
		 * 保存
		 */
		async publishFn() {
			// 提交数据再预览 后台新增节目管理
			let startHtml = '\x3C!DOCTYPE html>\x3Chtml lang="en">\x3Chead>\x3Cmeta charset="UTF-8">\x3Ctitle>\x3C/title>\x3Clink rel="shortcut icon" href="./public/favicon.ico" type="image/x-icon">\x3Cmeta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">\x3Cmeta content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no" name="viewport">\x3Cmeta name="keywords" content="">\x3Cmeta name="description" content="">\x3Cmeta name="renderer" content="webkit">\x3Cmeta name="robots" content="index, follow">\x3Cmeta name="format-detection" content="telephone=no">\x3Cscript src="./public/third-libs/vue.js">\x3C/script>\x3Clink rel="stylesheet" href="./public/third-libs/animate.min.css">\x3Clink rel="stylesheet" href="./public/third-libs/swiper.min.css">\x3Cscript src="./public/third-libs/swiper.min.js">\x3C/script>\x3C!--引入模板-->\x3Cscript src="./public/engine_libs/h5-swiper/page-engine.umd.js">\x3C/script>\x3Clink rel="stylesheet" href="./public/engine_libs/h5-swiper/page-engine.css">\x3Cstyle>* {padding: 0;margin: 0;box-sizing: border-box;}html, body, #app{position: relative;width: 100%;height: 100%;}\x3C/style>\x3Cscript>window._pageData = '
			let endHtmls = '\x3C/script>\x3C/head>\x3Cbody>\x3Cdiv id="app">\x3Cengine-h5-swiper  />\x3C/div>\x3Cscript>new Vue({el:"#app"})\x3C/script>\x3Cscript>eval(window._pageData.script);\x3C/script>\x3C/body>\x3C/html>'
			let jsonProject = JSON.stringify(this.projectData)
			let jsonAfter = JSON.stringify(this.projectData)
			let niceHtml = startHtml + jsonProject + endHtmls
			let postIds = []//资源主键集合
			this.projectData.pages.map(item => {
				item.elements.map(cur => {
					if (cur.androidId) postIds.push(cur.androidId)
				})
			})
			
			console.log("this.projectData==",this.projectData);
			if (!this.putProjects.programId) {
				let a = {
				html: niceHtml,//节目html拼接字符串
				programName: this.projectData.title,//节目名称
				resourceIdList: postIds,//节目资源主键集合
				afterHtml:jsonAfter,
				sceneId: this.projectData.sceneId //节目ID
			}
				this.$API.addProgram(a).then(() => {
					this.$message.success('已成功保存并发布!');
					this.showPreview = false
					this.$router.push({ name: 'pageList' })
				})
			} else {
				let b = JSON.parse(JSON.stringify(this.putProjects))
				b.html = niceHtml
				b.programName = this.projectData.title
				b.resourceIdList = postIds
				b.sceneId = this.projectData.sceneId
				b.afterHtml = jsonAfter
				this.$API.updateProgram(b).then(() => {
					this.$message.success('已成功保存并发布!');
					this.showPreview = false
					this.$router.push({ name: 'pageList' })
				})
			}

			// let data = { ...this.projectData };
			// data.isPublish = true;
			// data.programId = "test123456"
			// this.$API.updatePage({ pageData: data }).then(() => {
			// 	this.$message.success('已成功保存并发布!');
			// 	this.showPreview = false
			// 	this.$router.push({ name: 'pageList' })
			// })
		},
		async showPreviewFn() {
			// await this.screenshots()
			// 提交数据再预览
			// console.log("页面数据==》",this.projectData);
			// return false;
			this.showPreview = true
			// this.$API.updatePage({ pageData: this.projectData }).then(() => {
			// 	this.showPreview = true
			// })
		},
		returnHtmlFn() {
			console.log("数据提交==", this.projectData);
			let startHtml = '\x3C!DOCTYPE html>\x3Chtml lang="en">\x3Chead>\x3Cmeta charset="UTF-8">\x3Ctitle>\x3C/title>\x3Clink rel="shortcut icon" href="./public/favicon.ico" type="image/x-icon">\x3Cmeta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">\x3Cmeta content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no" name="viewport">\x3Cmeta name="keywords" content="">\x3Cmeta name="description" content="">\x3Cmeta name="renderer" content="webkit">\x3Cmeta name="robots" content="index, follow">\x3Cmeta name="format-detection" content="telephone=no">\x3Cscript src="./public/third-libs/vue.js">\x3C/script>\x3Clink rel="stylesheet" href="./public/third-libs/animate.min.css">\x3Clink rel="stylesheet" href="./public/third-libs/swiper.min.css">\x3Cscript src="./public/third-libs/swiper.min.js">\x3C/script>\x3C!--引入模板-->\x3Cscript src="./public/engine_libs/h5-swiper/page-engine.umd.js">\x3C/script>\x3Clink rel="stylesheet" href="./public/engine_libs/h5-swiper/page-engine.css">\x3Cstyle>* {padding: 0;margin: 0;box-sizing: border-box;}html, body, #app{position: relative;width: 100%;height: 100%;}\x3C/style>\x3Cscript>window._pageData = '
			let endHtmls = '\x3C/script>\x3C/head>\x3Cbody>\x3Cdiv id="app">\x3Cengine-h5-swiper  />\x3C/div>\x3Cscript>new Vue({el:"#app"})\x3C/script>\x3Cscript>eval(window._pageData.script);\x3C/script>\x3C/body>\x3C/html>'
			// let oldJson = { "shareConfig": { "coverImage": "", "title": "这是#分享者#的大力推荐", "description": "这是#分享者#大力推荐的H5" }, "title": "未命名场景", "coverImage": "", "description": "我用夸克可视化编辑器做了一个超酷炫的H5，快来看看吧。", "script": "", "width": 800, "height": 450, "pageMode": "h5", "flipType": 0, "slideNumber": false, "status": 1, "isPublish": true, "isTemplate": false, "members": [], "version": 1, "_id": "6397d66abb21fe097091e080", "pages": [{ "uuid": "b7df6e4b-1d63-49fe-ba0c-89e7f6b33083", "name": "", "elements": [{ "uuid": "d3a79ae5-97a2-4550-9edf-bce55d39b58b", "elName": "qk-image", "animations": [], "commonStyle": { "position": "absolute", "width": 400, "height": 225, "top": 0, "left": 0, "rotate": 0, "paddingTop": 0, "paddingLeft": 0, "paddingRight": 0, "paddingBottom": 0, "marginTop": 0, "marginLeft": 0, "marginRight": 0, "marginBottom": 0, "borderWidth": 0, "borderColor": "", "borderStyle": "solid", "borderRadius": 0, "boxShadow": "", "fontSize": 16, "fontWeight": 500, "lineHeight": 1.4, "letterSpacing": 0, "textAlign": "center", "color": "#000000", "backgroundColor": "", "backgroundImage": "", "backgroundSize": "cover", "opacity": 1, "zIndex": 1 }, "events": [], "propsValue": { "imageSrc": "\t\nhttp://192.168.101.250:2501/file/download/I52F33273F5634635BE8058A76F96F8F3" }, "valueType": "String", "androidId": "I52F33273F5634635BE8058A76F96F8F3" }, { "uuid": "4f494da5-f0cc-49bf-a197-0d29419cbbba", "elName": "qk-image", "animations": [], "commonStyle": { "position": "absolute", "width": 400, "height": 225, "top": 225, "left": 400, "rotate": 0, "paddingTop": 0, "paddingLeft": 0, "paddingRight": 0, "paddingBottom": 0, "marginTop": 0, "marginLeft": 0, "marginRight": 0, "marginBottom": 0, "borderWidth": 0, "borderColor": "", "borderStyle": "solid", "borderRadius": 10, "boxShadow": "", "fontSize": 16, "fontWeight": 500, "lineHeight": 1.4, "letterSpacing": 0, "textAlign": "center", "color": "#000000", "backgroundColor": "", "backgroundImage": "", "backgroundSize": "cover", "opacity": 1, "zIndex": 2 }, "events": [], "propsValue": { "imageSrc": "\t\nhttp://192.168.101.250:2501/file/download/IF60B18507EA04A75BD6F0615749BEF2E" }, "valueType": "String", "androidId": "IF60B18507EA04A75BD6F0615749BEF2E" }, { "uuid": "155567d9-dfa2-4bec-a424-b8e04ca27ab3", "elName": "qk-text", "animations": [], "commonStyle": { "position": "absolute", "width": 400, "height": 32, "top": 20, "left": 400, "rotate": 0, "paddingTop": 0, "paddingLeft": 0, "paddingRight": 0, "paddingBottom": 0, "marginTop": 0, "marginLeft": 0, "marginRight": 0, "marginBottom": 0, "borderWidth": 0, "borderColor": "", "borderStyle": "solid", "borderRadius": 0, "boxShadow": "", "fontSize": 18, "fontWeight": 500, "lineHeight": 1.5, "letterSpacing": 0, "textAlign": "center", "color": "#000000", "backgroundColor": "", "backgroundImage": "", "backgroundSize": "cover", "opacity": 1, "zIndex": 3 }, "events": [], "propsValue": { "text": "细节决定成败" }, "valueType": "String" }, { "uuid": "131a3a89-b8c8-4bd1-9eb8-637ce49463ab", "elName": "qk-rectangle-border", "animations": [], "commonStyle": { "position": "absolute", "width": 300, "height": 1, "top": 54, "left": 508, "rotate": 0, "paddingTop": 0, "paddingLeft": 0, "paddingRight": 0, "paddingBottom": 0, "marginTop": 0, "marginLeft": 0, "marginRight": 0, "marginBottom": 0, "borderWidth": 0, "borderColor": "", "borderStyle": "solid", "borderRadius": 0, "boxShadow": "", "fontSize": 16, "fontWeight": 500, "lineHeight": 1.4, "letterSpacing": 0, "textAlign": "center", "color": "#000000", "backgroundColor": "#999999", "backgroundImage": "", "backgroundSize": "cover", "opacity": 1, "zIndex": 4 }, "events": [], "valueType": "String" }, { "uuid": "29d41c72-4e0f-49c4-9b2c-ca9e515f8f50", "elName": "qk-text", "animations": [], "commonStyle": { "position": "absolute", "width": 200, "height": 32, "top": 58, "left": 457, "rotate": 0, "paddingTop": 0, "paddingLeft": 0, "paddingRight": 0, "paddingBottom": 0, "marginTop": 0, "marginLeft": 0, "marginRight": 0, "marginBottom": 0, "borderWidth": 0, "borderColor": "", "borderStyle": "solid", "borderRadius": 0, "boxShadow": "", "fontSize": 18, "fontWeight": 500, "lineHeight": 1.5, "letterSpacing": 0, "textAlign": "center", "color": "#000000", "backgroundColor": "", "backgroundImage": "", "backgroundSize": "cover", "opacity": 1, "zIndex": 5 }, "events": [], "propsValue": { "text": "把握细节" }, "valueType": "String" }, { "uuid": "f26fc031-5ed8-454d-8453-7d4a3e1b63cb", "elName": "qk-rectangle-border", "animations": [], "commonStyle": { "position": "absolute", "width": 300, "height": 1, "top": 84, "left": 450, "rotate": 0, "paddingTop": 0, "paddingLeft": 0, "paddingRight": 0, "paddingBottom": 0, "marginTop": 0, "marginLeft": 0, "marginRight": 0, "marginBottom": 0, "borderWidth": 0, "borderColor": "", "borderStyle": "solid", "borderRadius": 0, "boxShadow": "", "fontSize": 16, "fontWeight": 500, "lineHeight": 1.4, "letterSpacing": 0, "textAlign": "center", "color": "#000000", "backgroundColor": "#999999", "backgroundImage": "", "backgroundSize": "cover", "opacity": 1, "zIndex": 6 }, "events": [], "valueType": "String" }, { "uuid": "b0d1636e-7630-4a5f-8065-5076200172b1", "elName": "qk-text", "animations": [], "commonStyle": { "position": "absolute", "width": 200, "height": 32, "top": 89, "left": 426, "rotate": 0, "paddingTop": 0, "paddingLeft": 0, "paddingRight": 0, "paddingBottom": 0, "marginTop": 0, "marginLeft": 0, "marginRight": 0, "marginBottom": 0, "borderWidth": 0, "borderColor": "", "borderStyle": "solid", "borderRadius": 0, "boxShadow": "", "fontSize": 18, "fontWeight": 500, "lineHeight": 1.5, "letterSpacing": 0, "textAlign": "center", "color": "#000000", "backgroundColor": "", "backgroundImage": "", "backgroundSize": "cover", "opacity": 1, "zIndex": 7 }, "events": [], "propsValue": { "text": "小中见大" }, "valueType": "String" }, { "uuid": "61fc7f3f-e514-4aaa-8d0c-5a954a3d62b8", "elName": "qk-rectangle-border", "animations": [], "commonStyle": { "position": "absolute", "width": 300, "height": 1, "top": 115, "left": 419, "rotate": 0, "paddingTop": 0, "paddingLeft": 0, "paddingRight": 0, "paddingBottom": 0, "marginTop": 0, "marginLeft": 0, "marginRight": 0, "marginBottom": 0, "borderWidth": 0, "borderColor": "", "borderStyle": "solid", "borderRadius": 0, "boxShadow": "", "fontSize": 16, "fontWeight": 500, "lineHeight": 1.4, "letterSpacing": 0, "textAlign": "center", "color": "#000000", "backgroundColor": "#999999", "backgroundImage": "", "backgroundSize": "cover", "opacity": 1, "zIndex": 8 }, "events": [], "valueType": "String" }, { "uuid": "6080530d-5a29-4fc4-adc1-0a49a1378e0c", "elName": "qk-text", "animations": [], "commonStyle": { "position": "absolute", "width": 400, "height": 40, "top": 266, "left": 0, "rotate": 0, "paddingTop": 0, "paddingLeft": 0, "paddingRight": 0, "paddingBottom": 0, "marginTop": 0, "marginLeft": 0, "marginRight": 0, "marginBottom": 0, "borderWidth": 0, "borderColor": "", "borderStyle": "solid", "borderRadius": 0, "boxShadow": "", "fontSize": 22, "fontWeight": 500, "lineHeight": 1.5, "letterSpacing": 0, "textAlign": "center", "color": "#E8B910", "backgroundColor": "", "backgroundImage": "", "backgroundSize": "cover", "opacity": 1, "zIndex": 9 }, "events": [], "propsValue": { "text": "细节是灵魂" }, "valueType": "String" }, { "uuid": "c7a4af1e-feb3-4e5b-a839-fe376d8ce5d5", "elName": "qk-image", "animations": [], "commonStyle": { "position": "absolute", "width": 200, "height": 110, "top": 340, "left": 0, "rotate": 0, "paddingTop": 0, "paddingLeft": 0, "paddingRight": 0, "paddingBottom": 0, "marginTop": 0, "marginLeft": 0, "marginRight": 0, "marginBottom": 0, "borderWidth": 0, "borderColor": "", "borderStyle": "solid", "borderRadius": 5, "boxShadow": "", "fontSize": 16, "fontWeight": 500, "lineHeight": 1.4, "letterSpacing": 0, "textAlign": "center", "color": "#000000", "backgroundColor": "", "backgroundImage": "", "backgroundSize": "cover", "opacity": 1, "zIndex": 10 }, "events": [], "propsValue": { "imageSrc": "https://img-baofun.zhhainiao.com/market/5/44de55ff8dd22fc6ee58d96c21edb195.jpg" }, "valueType": "String" }], "commonStyle": { "backgroundColor": "", "backgroundImage": "", "backgroundSize": "cover" } }], "author": "627340f666cf240fd4ad64a8", "created": "2022-12-13T01:33:30.613Z", "updated": "2022-12-13T01:55:58.486Z", "__v": 0 }
			let jsonProject = JSON.stringify(this.projectData)
			// let endHtmls = ''
			let postIds = []//资源主键集合
			this.projectData.pages.map(item => {
				item.elements.map(cur => {
					if (cur.androidId) postIds.push(cur.androidId)
				})
			})
			console.log("数据提交111==", postIds, this.projectData._id);
			let niceHtml = startHtml + jsonProject + endHtmls
			let a = {
				html: niceHtml,//节目html拼接字符串
				programName: this.projectData.title,//节目名称
				resourceIdList: postIds,//节目资源主键集合
				sceneId: this.projectData._id//节目ID
			}
			// this.$API.programAdd(a).then(() => {
			// 	this.$message.success('节目已导出!');
			// })
			// this.$API.programDel('3F18690EE1CB4B2A8841B32FB0AE70F2').then(() => {
			// 	this.$message.success('节目已删除!');
			// })
			// this.$API.programDownload('A86323E109C84563ADAD8CACD427022C').then(response => {
			// 	const url = window.URL.createObjectURL(new Blob([response.data]))
			// 	const link = window.document.createElement("a")
			// 	link.style.display = "none"
			// 	link.href = url
			// 	link.setAttribute("download", "细节灵魂" + ".zip")
			// 	document.body.appendChild(link)
			// 	link.click()
			// 	console.log("导出完成");
			// 	this.$message.success('节目已导出!');
			// })
			return false;
			this.saveHtmlFn()
		},
		/**
		 * 退出
		 */
		cancelFn() {
			this.$confirm('确认退出编辑?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$router.push({ name: 'Home' })
			}).catch(() => { })
		},
		/**
		 * 提供截屏作为项目主图
		 */
		screenshots() {
			const el = document.querySelector("#canvas-panel")
			return new Promise((resolve, reject) => {
				html2canvas(el, { proxy: `${this.$config.baseURL}/common/html2canvas/corsproxy` }).then(canvas => {
					const dataUrl = canvas.toDataURL('image/jpeg', 0.6)
					const blob = this.$mUtils.dataURItoBlob(dataUrl)
					const file = new window.File([blob], +new Date() + '.png', { type: 'image/png' })
					let params = new FormData()
					params.append('file', file);
					this.$axios.post('/common/uploadFile', params).then(res => {
						// 替换主图链接
						this.projectData.coverImage = res.body;
						resolve(res.body)
					}).catch(err => {
						reject(err)
					})
				})
			})
		},
		/**
		 *
		 * @param dataList
		 */
		importPsdData(psdData) {
			let elementsList = psdData.elements
			let psdWidth = psdData.document.width;
			let scalingRatio = this.projectData.width / psdWidth
			elementsList.forEach(item => {
				let { width, height, top, left, imageSrc, opacity, zIndex } = item;
				setTimeout(() => {
					this.$store.dispatch('addElement', {
						elName: 'qk-image',
						defaultStyle: {
							width: width * scalingRatio,
							height: height * scalingRatio,
							top: top * scalingRatio,
							left: left * scalingRatio,
							zIndex: zIndex,
							opacity
						},
						needProps: {
							imageSrc: imageSrc
						}
					})
				}, 10)
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.editor-wrapper {
	display: flex;
	height: 100%;
	position: relative;

	.editor-side-bar {
		width: 55px;
	}

	.editor-page-edit-wrapper {
		width: 210px;
		padding: 0 1px;
	}

	.editor-main {
		flex: 1;
		background: #f0f2f5;
		position: relative;
	}

	.el-attr-edit-wrapper {
		width: 380px;
		padding: 0;
	}
}

.control-bar-wrapper {
	position: absolute;
	top: -44px;
	left: 0;
	width: 100%;
	text-align: center;
	z-index: 1000;
}
</style>
<style lang="scss">
.editor-side-bar {
	.el-tabs__item.is-active {
		background: rgba(37, 165, 137, 0.09);
	}
}

.el-attr-edit-wrapper {
	.el-tabs {
		height: 100%;
		padding-left: 16px;
		padding-right: 16px;
		padding-bottom: 10px;
	}

	.el-tabs__content {
		height: calc(100% - 55px);

		&>div {
			height: 100%;
		}

		.attr-edit-inner {
			padding-left: 16px;
			padding-right: 16px;
		}
	}
}
</style>
