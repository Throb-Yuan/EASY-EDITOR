<template>
	<div class="page-thumbnail-panel" v-loading="loading" v-if="pageData">
		<!-- <span class="unpublish" v-if="!pageData.isPublish && showPublishState">未发布</span> -->
		<div class="thumbnail-panel-cover">
			<div class="header-mask">
				<div class="details-btn" @click="preview(pageData.afterHtml)">预览</div>
			</div>
			<div class="image-wrapper">
				<img style="object-fit: cover;" v-if="pageData.coverImgId" :src='baseURL+"/file/download/"+pageData.coverImgId' alt="" />
				<img style="object-fit: cover;" :src="defaultCoverImage" v-else alt="">
			</div>
		</div>
		<div class="page-item-title border-T ellipsis">
			<span class="item-title-i" style="padding-right:10px;" :title="pageData.programName">{{ pageData.programName
		|| '未命名作品'
}}</span>
			<el-tag type="success" size="mini" v-if="pageData.sceneName">{{ pageData.sceneName }}</el-tag>
		</div>
		<div class="border-T thumbnail-panel-btn" v-if="btnList.length">
			<div class="btn-wrapper" v-if="btnList.includes('edit')">
				<el-button type="text" size="mini" @click="edit">编辑</el-button>
			</div>
			<!-- <div class="btn-wrapper" v-if="btnList.includes('useTemplate')">
				<el-button type="text" size="mini" @click="copyPage">使用模板</el-button>
			</div> -->
			<div class="btn-wrapper" v-if="btnList.includes('copyTemplate')">
				<el-button type="text" size="mini" @click="terminal">下发节目</el-button>
			</div>
			<div class="btn-wrapper" v-if="showMoreBtn">
				<el-dropdown @command="command" placement="top-start">
					<el-button type="text" size="mini">更多 <i class="el-icon-more-outline"></i></el-button>
					<el-dropdown-menu>
						<template v-for="(item, index) in operationDataList">
							<el-dropdown-item :key="index" :command="item.eventType"
								v-if="btnList.includes(item.eventType)">
								<div :class="item.extraClassName">
									{{ item.title }}
								</div>
							</el-dropdown-item>
						</template>
					</el-dropdown-menu>
				</el-dropdown>
			</div>
		</div>
	</div>
	<div class="page-thumbnail-panel create" v-loading="loading" v-else>
		<div class="temp-create" @click="newPage">
			<i class="el-icon-plus"></i>
			<p class="paddingT10">创建节目</p>
		</div>
	</div>
</template>

<script>
import {
	Dropdown,
	DropdownMenu,
	DropdownItem,
} from 'element-ui'
// import editorProjectConfig from '@/pages/editor/DataModel'

import addCooperationer from '@/components/add-cooperationer/index.js'
const baseURL = process.env.VUE_APP_BASE_API
export default {
	props: {
		showPublishState: {
			type: Boolean,
			default: true
		},
		showMoreBtn: {
			type: Boolean,
			default: true
		},
		pageType: {
			type: String,
			default: 'h5'
		},
		pageData: Object,
		// 操作按钮显示哪些按钮  根据type来匹配。
		btnList: {
			type: Array,
			default: () => {
				return []
			}
		},
	},
	components: {
		[Dropdown.name]: Dropdown,
		[DropdownMenu.name]: DropdownMenu,
		[DropdownItem.name]: DropdownItem
	},
	data() {
		return {
			baseURL,
			loading: false,
			defaultCoverImage: require('@/common/images/quark--pagecover-image.png'),
			operationDataList: [{
				title: '导出节目',
				eventType: 'exports',
				extraClassName: '',
				iconClass: ''
			}, {
				title: '复制节目主键',
				eventType: 'copys',
				extraClassName: '',
				iconClass: ''
			}, {
				title: '复制节目HTML',
				eventType: 'copysHTML',
				extraClassName: '',
				iconClass: ''
			}, {
				title: '删除',
				eventType: 'delete',
				extraClassName: 'error',
				iconClass: ''
			}]
		}
	},
	methods: {
		// 发送到终端
		terminal() {
			this.$emit('terminalFun', this.pageData)
		},
		/**
		 * 操作命令
		 * @param type
		 */
		command(type) {
			switch (type) {
				case 'exports':
					this.exports()
					break;
				case 'copys':
					this.copys('节目主键');
					break;
				case 'copysHTML':
					this.copys('HTML');
					break;
				case 'publish':
					this.publish();
					break;
				case 'copyUrl':
					this.copyUrl();
					break;
				case 'setTemplate':
					this.setTemplate();
					break;
				case 'viewPageData':
					this.viewPageData();
					break;
				case 'cooperation':
					this.cooperation();
					break;
				case 'delete':
					this.delete();
					break;
				case 'unCooperation':
					this.unCooperation();
					break;
				case 'publishTemplate':
					this.publishTemplate();
					break;
			}
		},
		// 新建页面
		newPage() {
			// let newPageData = editorProjectConfig.getProjectConfig()
			this.$router.push({ name: 'Editor' })
			// this.loading = true;
			// this.$API.createPage({...newPageData}).then(res => {
			// 	this.loading = false;
			// 	if (res.body) {
			// 		this.$router.push({name: 'Editor', query: {id: res.body.programId}})
			// 	}
			// }).catch(() => {
			// 	this.loading = false;
			// })
		},
		// 编辑
		edit() {
			this.$router.push({ name: 'Editor', query: { id: this.pageData.programId } })
		},
		// 复制页面
		copyPage() {
			this.loading = true;
			this.$API.copyPage({ id: this.pageData.programId }).then(res => {
				this.loading = false;
				this.$router.push({ name: 'Editor', query: { id: res.body.programId } })
			}).catch(() => {
				this.loading = false;
			})
		},
		// 发布
		publish() {
			this.loading = true;
			this.$API.publishPage({ id: this.pageData.programId }).then(() => {
				this.loading = false;
				this.$message.success('发布成功');
				this.preview(this.pageData.programId);
				this.$emit('refresh');
			}).catch(() => {
				this.loading = false;
			})
		},
		// 预览
		preview(afterHtml) {
			// this.$emit('showPreview', id)
			
			if (process.env.NODE_ENV == 'production') {
				// 暂只支持测试环境
				localStorage.setItem("previewPageData",afterHtml)
				window.open('http://192.168.101.250:8887/previews/html/index/preview.html')
			}else{
				this.$message.warning('暂只支持在测试环境预览')
			}
			
		},
		// 复制链接
		copyUrl() {
		},
		// 设为我的模板
		setTemplate() {
			this.loading = true;
			this.$API.setTemplatePage({ id: this.pageData.programId }).then(() => {
				this.loading = false;
				this.$message.success('已添加到我的模板')
			}).catch(() => {
				this.loading = false;
			})
		},
		// 页面数据
		viewPageData() {
			this.$router.push({ name: 'pageDataDetail', query: { id: this.pageData.programId } })
		},
		// 协作设置
		cooperation() {
			addCooperationer(this.pageData.programId)
		},
		// 删除
		delete() {
			this.$alert('确认删除节目？删除后，将无法恢复此节目?', '操作提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				this.$API.delProgram(this.pageData.programId).then(() => {
					this.$message.success('删除成功！');
					this.$emit('refresh')
				})
			})
		},
		// 退出协作
		unCooperation() {
			this.$alert('确认退出协作编辑？退出后，将无法编辑此页面?', '操作提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				this.$API.delCooperation({ pageId: this.pageData.programId, userId: this.$store.state.user.userInfo.programId }).then(() => {
					this.$message.success('已退出！');
					this.$emit('refresh')
				})
			})
		},
		// 发布模板到模板市场
		publishTemplate() {
			this.loading = true;
			this.$API.publishPage({ id: this.pageData.programId }).then(() => {
				this.loading = false;
				this.$message.success('发布成功');
			}).catch(() => {
				this.loading = false;
			})
		},
		// 导出节目zip
		exports() {
			this.$modal.msgSuccess("正在生成节目，请勿关闭页面");
			this.$API.programDownload(this.pageData.programId).then(
				response => {
					console.log(response)
					// if (!response.data.size) {
					//   this.$message({
					//     message: "没有可下载文件",
					//     type: "warning"
					//   })
					//   return
					// }
					const url = window.URL.createObjectURL(new Blob([response]))
					const link = window.document.createElement("a")
					link.style.display = "none"
					link.href = url
					link.setAttribute("download", this.pageData.programName + "-unzip.zip")
					document.body.appendChild(link)
					this.$modal.msgSuccess("正在下载节目，请勿关闭页面");
					link.click()
				},
				err => {
					this.$message.error(err);
				}
			)
		},
		// 复制资源主键
		copys(name) {
			this.$copyText(name == "节目主键" ? this.pageData.programId : this.pageData.html).then(() => {
				this.$message.success(`${name}已复制!`);
			})
		},
	}
}
</script>

<style lang="scss" scoped>
.page-thumbnail-panel {
	width: 224px;
	height: 296px;
	border-radius: 8px;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	background: white;
	position: relative;
	transition: all 0.28s;

	&:hover {
		box-shadow: 0 0 16px 0 rgba(0, 0, 0, .16);
		transform: translate3d(0, -2px, 0);

		.header-mask {
			opacity: 1;
		}
	}

	.header-mask {
		position: absolute;
		top: 0;
		left: 0;
		opacity: 0;
		background-color: rgba(0, 0, 0, .3);
		width: 100%;
		height: 100%;
		border-radius: 4px 4px 0 0;
		padding-top: 92px;
		text-align: center;
		transition: top .28s ease, opacity .28s ease, height .28s ease;

		.details-btn {
			display: inline-block;
			width: 120px;
			height: 44px;
			font-size: 18px;
			line-height: 44px;
			border-radius: 22px;
			border: 1px solid #fff;
			color: #fff;
			cursor: pointer;
		}
	}
}

.thumbnail-panel-cover {
	flex: 1;
	position: relative;

	.image-wrapper {
		width: 100%;
		height: 100%;
		overflow: hidden;
		padding: 5px;
		z-index: 10;
		width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
		img {
			display: block;
			width: 180px;
			height: 180px;
			border-radius: 8px;
			// height: 45%;
		}
	}
}

.page-item-title {
	height: 36px;
	line-height: 36px;
	padding: 0 8px;
	font-size: 14px;
}

.thumbnail-panel-btn {
	height: 36px;
	width: 100%;
	display: flex;
	flex-direction: row;

	.btn-wrapper {
		flex: 1;
		text-align: center;
	}
}

.unpublish {
	position: absolute;
	top: 5px;
	left: 5px;
	font-size: 12px;
	display: block;
	padding: 0 10px;
	height: 30px;
	line-height: 30px;
	background-color: #76838f;
	color: #fff;
	border-top-left-radius: 4px;
	border-bottom-right-radius: 12px;
	z-index: 10;
}

.page-thumbnail-panel.create {
	padding: 16px;
	text-align: center;

	.temp-create {
		display: inline-block;
		width: 100%;
		height: 100%;
		border: 1px solid #e6ebed;
		border-radius: 3px;
		padding-top: 100px;
		transition: all 0.28s;
		cursor: pointer;

		&:hover {
			color: $primary;
			border-color: $primary;
		}
	}

	.null-create {
		display: inline-block;
		width: 100%;
		height: 42px;
		line-height: 42px;
		border: 1px solid #4a4e52;
		transition: all 0.28s;
		cursor: pointer;

		&:hover {
			color: $primary;
			border-color: $primary;
		}
	}
}
</style>
