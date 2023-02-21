<template>
	<div @drop="drop($event)" @dragover="allowDrop($event)" @dragenter="dragenter($event)">
		<div class="tip-drop">可将本地文件或媒体资源拖至下方替换<span @click="changeSide"> 查看资源库</span></div>
		<el-upload ref="upload" drag style="height: 100px;" :action="uploadAction" accept="video/*" :auto-upload="true" :on-success="handleSuccess" :show-file-list="false" :multiple="false">
			<div :class="activeCss ? 'drag-info-box active-css' : 'drag-info-box'">
				<div class="inline-block cropper-res-img">
					<div class="cropper-res-imgs">
						<img v-if="tempValue" src="../../../../../../common/images/myicons/videosss.jpg" alt="">
						<div v-else>
							<i class="el-icon-plus" style="font-size: 20px;"></i>
						</div>
						<p v-show="!tempValue" class="cropper-res-img-title">上传视频</p>
					</div>
				</div>
				<div class="media-indo">
					<div class="media-name">{{ tempValue? tempFileName: '请点击或拖至此处上传' }}</div>
					<div class="media-size">{{ tempValue? tempFileSize: '支持本地文件与已上传媒体资源' }}</div>
				</div>
			</div>
		</el-upload>
		<div style="display: flex;align-items: center;justify-content: space-between;padding-right: 30px;flex-wrap: wrap; gap: 12px; margin-top: 14px;">
			<div><span class="switch-labels">播放控件</span><el-switch v-model="tempConytols">
			</el-switch></div>
			<div><span class="switch-labels">自动播放</span><el-switch v-model="tempAutoPlay">
			</el-switch></div>
			<div><span class="switch-labels">循环播放</span><el-switch v-model="tempVideoLoop">
			</el-switch></div>
			<div><span class="switch-labels">静音播放</span><el-switch v-model="tempVideoMuted">
			</el-switch></div>
		</div>
	</div>
</template>

<script>
const baseURL = process.env.VUE_APP_BASE_API
export default {
	name: "attr-qk-videoSrc",
	props: {
		// prop只读
		videoSrc: String,
		videoControls: Boolean,
		videoAutoPlay: Boolean,
		androidId: String,
		localPath: String,
		videoLoop:Boolean,
		videoMuted:Boolean,
		fileName: String,
		fileSize: String
	},
	data() {
		return {
			uploadAction: baseURL + '/file/upload',
			tempValue: '',
			tempConytols: null,
			tempAutoPlay: null,
			tempAndroidId: "",
			tempLocalPath: "",
			tempVideoLoop:null,
			tempVideoMuted:false,
			tempFileSize:"",
			tempFileName:"",
			activeCss:false
		}
	},
	mounted() {
		this.tempValue = this.videoSrc;
		this.tempConytols = this.videoControls;
		this.tempAutoPlay = this.videoAutoPlay;
		this.tempAndroidId = this.androidId
		this.tempLocalPath = this.localPath
		this.tempVideoLoop = this.videoLoop
		this.tempVideoMuted = this.videoMuted;
		this.tempFileName = this.fileName;
		this.tempFileSize = this.fileSize
	},
	methods: {
		handleSuccess(res) {
			let response = res.data
			console.log("file1==", response);
			let param = {
				resourceId: response.fileId,
				resourceName: response.fileName,
				resourceTypeId: "2",
				resourceMd5: response.fileHash,
				fileSize: response.fileSize,
				fileType: response.fileId.substr(0, 1),
				fileUrl: baseURL + '/file/download/' + response.fileId
			}

			this.$API.addResource(param).then(() => {
				console.log("file2==", response);
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
			!this.activeCss ?'' : this.activeCss = false
			if (nodeData.resourceTypeId != "2") {
				this.$message.warning('请选择视频类型拖入覆盖');
				return false
			}
			this.tempValue = nodeData.fileUrl
			this.tempLocalPath = nodeData.filePath
			this.tempAndroidId = nodeData.resourceId
			this.tempFileSize = this.$mUtils.transFileSize(nodeData.fileSize)
			this.tempFileName = nodeData.resourceName
			ev.preventDefault();
		},
		dragenter(){
			this.activeCss ? '' : this.activeCss = true
		},
		changeSide(){
			let nowSide = this.$store.state.editor.activeSideBar
			if(nowSide!="resourceLibs") this.$store.commit('updateSideBar',"resourceLibs")
		}
	},
	watch: {
				/**
	 * 监听元素值改变，将新值传递给父元素
	 * @function tempValue 视频路径
	 * @function tempLocalPath 视频本地路径
	 * @function tempConytols 视频控制键展示与否
	 * @function tempAutoPlay 视频自动播放与否
	 * @function tempAndroidId 视频资源ID
	 * @function tempAndroidId 视频资源ID
	 * @function tempVideoLoop 视频循环播放
	 */
	 	videoLoop(val) {
			this.tempVideoLoop = val;
		},
		videoAutoPlay(val) {
			this.tempAutoPlay = val;
		},
		videoMuted(val) {
			this.tempVideoMuted = val;
		},
		videoControls(val) {
			this.tempConytols = val;
		},
		fileSize(val) {
			this.tempFileSize = val;
		},
		fileName(val) {
			this.tempFileName = val;
		},
		videoSrc(val) {
			this.tempValue = val;
		},
		tempValue() {
			this.$emit('update:videoSrc', this.tempValue);
		},
		tempConytols() {
			this.$emit('update:videoControls', this.tempConytols);
		},
		tempAutoPlay() {
			this.$emit('update:videoAutoPlay', this.tempAutoPlay);
		},
		tempAndroidId() {
			this.$emit('update:androidId', this.tempAndroidId);
		},
		tempLocalPath() {
			this.$emit('update:localPath', this.tempLocalPath);
		},
		tempVideoLoop() {
			this.$emit('update:videoLoop', this.tempVideoLoop);
		},
		tempVideoMuted() {
			this.$emit('update:videoMuted', this.tempVideoMuted);
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
