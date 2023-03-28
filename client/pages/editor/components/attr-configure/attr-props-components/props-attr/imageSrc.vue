<template>
	<div @drop="drop($event)" @dragover="allowDrop($event)" @dragenter="dragenter($event)">
		<div class="tip-drop">可将本地文件或媒体资源拖至下方替换<span @click="changeSide"> 查看资源库</span></div>
		<el-upload ref="upload" drag style="height: 100px;" :action="uploadAction" accept="image/*" :auto-upload="false"
			:on-change="beforePressUpload" :on-success="handleSuccess" :show-file-list="false" :multiple="false">
			<div class="drag-info-box">
				<div class="inline-block cropper-res-img">
					<div class="cropper-res-imgs">
						<img v-if="tempValue" :src="tempValue" alt="">
						<div v-else>
							<i class="el-icon-plus" style="font-size: 20px;"></i>
						</div>
						<p v-show="!tempValue" class="cropper-res-img-title">上传图片</p>
					</div>
				</div>
				<div class="media-indo">
					<div class="media-name">{{ tempValue? tempFileName: '请点击或拖至此处上传' }}</div>
					<div class="media-size">{{ tempValue? tempFileSize: '支持本地文件与已上传媒体资源' }}</div>
				</div>
			</div>
		</el-upload>
	</div>
</template>

<script>
import * as imageConversion from 'image-conversion'
const baseURL = process.env.VUE_APP_BASE_API
export default {
	name: "attr-qk-imageSrc",
	props: {
		imageSrc: String,
		androidId: String,
		localPath: String,
		fileName: String,
		fileSize: String
	},
	data() {
		return {
			defaultCoverImage: require('@client/common/images/defimgs.png'),
			uploadAction: baseURL + '/file/upload',
			tempValue: '',
			tempAndroidId: '',
			tempLocalPath: "",
			tempFileSize: "",
			tempFileName: "",
			activeCss: false
		}
	},
	mounted() {
		this.tempValue = this.imageSrc;
		this.tempAndroidId = this.androidId;
		this.tempLocalPath = this.localPath;
		this.tempFileName = this.fileName;
		this.tempFileSize = this.fileSize
	},
	methods: {
		/**
		* 资源列表拖拽联动，将对应图片数据覆盖至拖拽的节点数据
		* @param ev 承载node节点数据
		*/
		allowDrop(ev) {
			ev.preventDefault();
		},
		drop(ev) {
			// nodeData：获取拖拽节点数据信息
			let nodeStr = ev.dataTransfer.getData("node")
			if (!nodeStr) return false
			let nodeData = JSON.parse(nodeStr)
			// 为图片则更改当前轮播项数据
			!this.activeCss ? '' : this.activeCss = false
			if (nodeData.resourceTypeId != "1") {
				this.$message.warning('请选择图片类型拖入覆盖');
				return false
			}
			this.tempValue = nodeData.fileUrl
			this.tempLocalPath = nodeData.filePath
			this.tempAndroidId = nodeData.resourceId
			this.tempFileSize = this.$mUtils.transFileSize(nodeData.fileSize)
			this.tempFileName = nodeData.resourceName
			ev.preventDefault();
		},
		dragenter() {
			this.activeCss ? '' : this.activeCss = true
		},
		changeSide() {
			let nowSide = this.$store.state.editor.activeSideBar
			if (nowSide != "resourceLibs") this.$store.commit('updateSideBar', "resourceLibs")
		},
		beforePressUpload(files) {
			let file = files.raw
			return new Promise(resolve => {
				this.loading = true;
				let isLt2M = file.size / 1024 / 1024 < 1 // 判定图片大小是否小于1MB
				const isJPG = file.type.includes('image')
				const isGif = file.type.includes('gif')
				if (isLt2M || !isJPG || isGif) {
					this.$refs.upload.submit(file)
					resolve(file)
				} else {
					// 可自定义kb
					let toSize = Math.round(file.size / 1024 / 6);
					imageConversion.compressAccurately(file, toSize).then(res => {
						this.$refs.upload.submit(res)
						resolve(res)
					})
				}
			})
		},
		handleSuccess(res) {
			let response = res.data
			let param = {
				resourceId: response.fileId,
				resourceName: response.fileName,
				resourceTypeId: "1",
				resourceMd5: response.fileHash,
				fileSize: response.fileSize,
				fileType: response.fileId.substr(0, 1),
				fileUrl: baseURL + '/file/download/' + response.fileId
			}

			this.$API.addResource(param).then(() => {
				this.$modal.msgSuccess("上传成功");
				this.open = false;
				this.tempValue = baseURL + '/file/download/' + response.fileId
				this.tempAndroidId = response.fileId
				this.tempFileName = response.fileName
				this.tempFileSize = this.$mUtils.transFileSize(response.fileSize)
				let arrs = response.fileName.split('.')
				this.tempLocalPath = '../../resource/' + response.fileHash+'.'+arrs[arrs.length-1]
			});
			this.loading = false;
		},
	},
	watch: {
		/**
* 监听元素值改变，将新值传递给父元素
* @function tempValue 图片路径
* @function tempLocalPath 图片本地路径
* @function tempAndroidId 图片资源ID
*/
		imageSrc(val) {
			this.tempValue = val;
		},
		androidId(val) {
			this.tempAndroidId = val;
		},
		localPath(val) {
			this.tempLocalPath = val;
		},
		fileSize(val) {
			this.tempFileSize = val;
		},
		fileName(val) {
			this.tempFileName = val;
		},
		tempValue() {
			this.$emit('update:imageSrc', this.tempValue);
		},
		tempAndroidId() {
			this.$emit('update:androidId', this.tempAndroidId);
		},
		tempLocalPath() {
			this.$emit('update:localPath', this.tempLocalPath);
		},
		tempFileSize() {
			this.$emit('update:fileSize', this.tempFileSize);
		},
		tempFileName() {
			this.$emit('update:fileName', this.tempFileName);
		}
	}
}
</script>
<style>
.el-upload-dragger {
	width: auto !important;
	height: auto !important;
}
</style>
<style lang="scss" scoped>

</style>
