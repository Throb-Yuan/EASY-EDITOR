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
			<resourceLibs v-if="activeSideBar === 'resourceLibs'" />
		</div>
		<!--页面编辑区域-->
		<div class="editor-main">
			<div class="control-bar-wrapper">
				<controlBar :scale.sync="canvasConfig.scale" @import-psd-data="importPsdData"
					@showPreview="showPreviewFn" @cancel="cancelFn" @publish="publishFn" @save="saveFn" @changeRatio="changeRatioFn" />
			</div>
			<div id="div1" @drop="drop($event)" @dragover="allowDrop($event)">
				<editorPan :scale.sync="canvasConfig.scale" />
			</div>

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
			@closePreview="showPreview = false" @publishFn="publishFn" @saveFn="saveFn">
		</previewPage>
		<!--我的图片-->
		<imageLibs />
	</div>
</template>

<script>
import componentLibs from './components/component-libs/Index'
import pageManage from './components/page-manage'
import resourceLibs from './components/resource-libs'
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
		resourceLibs,
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
			putProjects: {},
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
				// {
				// 	label: '页面管理',
				// 	value: 'pageManage',
				// 	elementUiIcon: 'el-icon-document'
				// },
				{
					label: '资源库',
					value: 'resourceLibs',
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
 		* 更改画布大小，更新editorPan组件大小与projectData数据
 		* @param objs.e   所选比例值
		* @param objs.arr 数组
 		*/
		changeRatioFn(objs){
			let checkData = objs.arr.find(v=>v.value == objs.e)
			// let case = objs.arr.find(v=> {return v.value==objs.e})
			// console.log('button click',checkData);
			// this.projectData.width = checkData.toWidth
			// this.projectData.height = checkData.toHeight
		},
		/**
 		* 资源列表拖拽联动，生成对应标签添加至画布
 		* @param ev 承载node节点数据
 		*/
		allowDrop(ev) {
			// console.log("allowDrop函数移动时", ev);
			ev.preventDefault();
		},
		drop(ev) {
			// nodeData：获取拖拽节点数据信息
			let nodeStr = ev.dataTransfer.getData("node")
			let nodeData = JSON.parse(nodeStr)
			// 节点基础信息写入
			let a = {
				defaultStyle: {
					height: 225, paddingBottom: 0, paddingTop: 0, width: 400,
				},
				elName: nodeData.fileType == 'I' ? "qk-image" : "qk-video",
				icon: "iconfont iconshipin",
				title: nodeData.fileType == 'I' ? "图片" : "视频",
				valueType: "",

			}
			let b = {} //节点信息带入
			// 判断节点类型，添加至画布
			if (nodeData.resourceTypeName === "图片") {
				b.localPath = nodeData.filePath
				b.imageSrc = nodeData.fileUrl
				b.androidId = nodeData.resourceId
			} else if (nodeData.resourceTypeName === "视频") {
				b.localPath = nodeData.filePath
				b.videoSrc = nodeData.fileUrl
				b.androidId = nodeData.resourceId
				b.videoAutoPlay = true
				b.videoControls = true
			} else if (nodeData.resourceTypeName === "音乐") {
				b.localPath = nodeData.filePath
				b.musicSrc = nodeData.fileUrl
				b.androidId = nodeData.resourceId
				b.musicAutoPlay = true
				b.musicControls = true
				// 调整大小与模板名称
				a.defaultStyle.width = 60
				a.defaultStyle.height = 60
				a.elName = "qk-bg-music"
				a.title = "音乐"
			}
			this.$store.dispatch('addElement', { ...a, needProps: b })
			ev.preventDefault();
		},
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
				jsonProjects.notDevs = false
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
		 * 保存HTMl（驼峰转换）
		 */
		getKebabCase(str) {
			return str.replace(/[A-Z]/g, function (i) {
				return '-' + i.toLowerCase();
			})
		},
		/**
		 * 过滤对象的空值
		 */
		isEmpty(obj) {
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
		 * 保存 生成节目
		 * @niceHtml 拼接完整的html字符串
		 * @postIds 资源主键集合
		 */
		async publishFn() {
			// 提交数据再预览 后台新增节目管理
			let startHtml = '\x3C!DOCTYPE html>\x3Chtml lang="en">\x3Chead>\x3Cmeta charset="UTF-8">\x3Ctitle>\x3C/title>\x3Clink rel="shortcut icon" href=" ../../assets/public/favicon.ico" type="image/x-icon">\x3Cmeta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">\x3Cmeta content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no" name="viewport">\x3Cmeta name="keywords" content="">\x3Cmeta name="description" content="">\x3Cmeta name="renderer" content="webkit">\x3Cmeta name="robots" content="index, follow">\x3Cmeta name="format-detection" content="telephone=no">\x3Cscript src=" ../../assets/public/third-libs/vue.js">\x3C/script>\x3Clink rel="stylesheet" href=" ../../assets/public/third-libs/animate.min.css">\x3Clink rel="stylesheet" href=" ../../assets/public/third-libs/swiper.min.css">\x3Cscript src=" ../../assets/public/third-libs/swiper.min.js">\x3C/script>\x3C!--引入模板-->\x3Cscript src=" ../../assets/public/engine_libs/h5-swiper/page-engine.umd.js">\x3C/script>\x3Clink rel="stylesheet" href=" ../../assets/public/engine_libs/h5-swiper/page-engine.css">\x3Cstyle>* {padding: 0;margin: 0;box-sizing: border-box;}html, body, #app{position: relative;width: 100%;height: 100%;}\x3C/style>\x3Cscript>window._pageData = '
			let endHtmls = '\x3C/script>\x3C/head>\x3Cbody>\x3Cdiv id="app">\x3Cengine-h5-swiper  />\x3C/div>\x3Cscript>new Vue({el:"#app"})\x3C/script>\x3Cscript>eval(window._pageData.script);\x3C/script>\x3C/body>\x3C/html>'
			let theProjectData = JSON.parse(JSON.stringify(this.projectData))
			theProjectData.notDevs = true
			let jsonProject = JSON.stringify(theProjectData)
			let jsonAfter = JSON.stringify(theProjectData)
			let niceHtml = startHtml + jsonProject + endHtmls
			/**
			 * get资源主键
			 * @propsValue ==>图，视频，音频
			 * @qkImageCarousel ==>轮播图
			 * @linkLoacl ==>节目
			 */
			let postIds = []
			theProjectData.pages.map(item => {
				item.elements.map(cur => {
					if (cur.propsValue.androidId) postIds.push(cur.propsValue.androidId)
					if (cur.elName == "qk-image-carousel" && cur.propsValue.imageSrcList.length){
						cur.propsValue.imageSrcList.map(ele => {
							if (ele.androidId) postIds.push(ele.androidId)
						})
					}
					if(cur.events.length){
						cur.events.map(eve => {
							if (eve.type=="linkLoacl") postIds.push(eve.url.slice(2,34))
						})
					}
				})
			})
			console.log("theEndProjectData==", theProjectData,postIds);
			if (!this.putProjects.programId) {
				let a = {
					html: niceHtml,//节目html拼接字符串
					programName: theProjectData.title,//节目名称
					resourceIdList: postIds,//节目资源主键集合
					afterHtml: jsonAfter,//JSON数据
					sceneId: theProjectData.sceneId //节目ID
				}
				this.$API.addProgram(a).then(() => {
					this.$message.success('已成功保存并发布!');
					this.showPreview = false
					this.$router.push({ name: 'pageList' })
				})
			} else {
				let b = JSON.parse(JSON.stringify(this.putProjects))
				b.html = niceHtml
				b.programName = theProjectData.title
				b.resourceIdList = postIds
				b.sceneId = theProjectData.sceneId
				b.afterHtml = jsonAfter
				
				this.$API.updateProgram(b).then(() => {
					this.$message.success('已成功保存并发布!');
					this.showPreview = false
					this.$router.push({ name: 'pageList' })
				})
			}
		},
		async showPreviewFn() {
			console.log("将提交数据===", this.projectData);
			// await this.screenshots()
			// 提交数据再预览
			this.showPreview = true
			// this.$API.updatePage({ pageData: this.projectData }).then(() => {
			// 	this.showPreview = true
			// })
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
		// width: 230px;
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
