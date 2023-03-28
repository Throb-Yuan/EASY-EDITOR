<template>
	<div @drop="drop($event)" @dragover="allowDrop($event)" @dragenter="dragenter($event)">
		<div class="tip-drop">可将本地文件或媒体资源拖至下方替换<span @click="changeSide"> 查看资源库</span></div>
		<el-upload ref="upload" drag style="height: 100px;" :action="uploadAction" accept="audio/*" :auto-upload="true"
		 :on-success="handleSuccess" :show-file-list="false" :multiple="false">
			<div class="drag-info-box">
				<div class="inline-block cropper-res-img">
					<div class="cropper-res-imgs">
						<img v-if="tempValue" src="../../../../../../common/images/myicons/musics.png" alt="">
						<div v-else>
							<i class="el-icon-plus" style="font-size: 20px;"></i>
						</div>
						<p v-show="!tempValue" class="cropper-res-img-title">上传音频</p>
					</div>
				</div>
				<div class="media-indo">
					<div class="media-name">{{ tempValue? tempFileName: '请点击或拖至此处上传' }}</div>
					<div class="media-size">{{ tempValue? tempFileSize: '支持本地文件与已上传媒体资源' }}</div>
				</div>
			</div>
		</el-upload>
		<div style="display: flex;align-items: center;justify-content: space-between;padding-right: 30px;margin-top: 14px;">
			<div><span class="switch-labels">循环播放</span><el-switch v-model="tempMusicLoop">
			</el-switch></div>
			<div><span class="switch-labels">自动播放</span><el-switch v-model="tempAutoPlay">
			</el-switch></div>

		</div>
	</div>
</template>

<script>
const baseURL = process.env.VUE_APP_BASE_API
export default {
	name: "attr-qk-musicSrc",
	props: {
		musicSrc: String,
		musicControls: Boolean,
		musicAutoPlay: Boolean,
		androidId: String,
		localPath: String,
		musicLoop:Boolean,
		fileName: String,
		fileSize: String
	},
	data() {
		return {
			uploadAction: baseURL + '/file/upload',
			tempValue: '',
			tempConytols: true,
			tempAutoPlay: true,
			tempAndroidId: "",
			tempLocalPath: "",
			tempMusicLoop:true,
			tempFileSize:"",
			tempFileName:"",
			activeCss:false
		}
	},
	mounted() {
		this.tempValue = this.musicSrc;
		this.tempConytols = this.musicControls;
		this.tempAutoPlay = this.musicAutoPlay;
		this.tempAndroidId = this.androidId
		this.tempLocalPath = this.localPath
		this.tempMusicLoop = this.musicLoop;
		this.tempFileName = this.fileName;
		this.tempFileSize = this.fileSize
	},
	methods: {
		handleSuccess(res) {
			let response = res.data
			let arrs = response.fileName.split('.')
			let param = {
				resourceId: response.fileId,
				resourceName: response.fileName,
				resourceTypeId: 3,
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
			if (nodeData.resourceTypeId != "3") {
				this.$message.warning('请选择音乐类型拖入覆盖');
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
	 * @function tempValue 音乐路径
	 * @function tempLocalPath 音乐本地路径
	 * @function tempConytols 音乐控制键展示与否
	 * @function tempAutoPlay 音乐自动播放与否
	 * @function tempAndroidId 音乐资源ID
	 */
		musicSrc(val) {
			this.tempValue = val;
		},
		fileSize(val) {
			this.tempFileSize = val;
		},
		fileName(val) {
			this.tempFileName = val;
		},
		musicLoop(val) {
			this.tempMusicLoop = val;
		},
		musicAutoPlay(val) {
			this.tempAutoPlay = val;
		},
		tempValue() {
			this.$emit('update:musicSrc', this.tempValue);
		},
		tempConytols() {
			this.$emit('update:musicControls', this.tempConytols);
		},
		tempAutoPlay() {
			this.$emit('update:musicAutoPlay', this.tempAutoPlay);
		},
		tempAndroidId() {
			this.$emit('update:androidId', this.tempAndroidId);
		},
		tempLocalPath() {
			this.$emit('update:localPath', this.tempLocalPath);
		},
		tempMusicLoop() {
			this.$emit('update:musicLoop', this.tempMusicLoop);
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

<style scoped>

</style>
