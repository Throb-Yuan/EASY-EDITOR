<template>
	<div @drop="drop($event)" @dragover="allowDrop($event)" @dragenter="dragenter($event)">
		<div class="tip-drop">可将媒体资源拖拽至下方替换<span @click="changeSide"> 查看资源库</span></div>
		<!-- <el-form-item label="资源地址：">
			<el-input type="textarea" :rows="3" placeholder="请输入视频地址" v-model="tempValue">
			</el-input>
		</el-form-item>
		<el-form-item label="本地路径：">
			<el-input type="textarea" :rows="2" placeholder="请输入视频本地路径" v-model="tempLocalPath">
			</el-input>
		</el-form-item>
		<el-form-item label="资源主键：">
			<el-input type="text" placeholder="请输入资源主键" v-model="tempAndroidId">
			</el-input>
		</el-form-item> -->
		<div :class="activeCss ? 'drag-info-box active-css':'drag-info-box'">
			<img src="../../../../../../common/images/myicons/videosss.jpg" alt="">
			<div class="media-indo">
				<div class="media-name">{{ tempFileName }}</div>
				<div class="media-size">{{ tempFileSize }}</div>
			</div>
		</div>
		<div style="display: flex;align-items: center;justify-content: space-between;padding-right: 30px;flex-wrap: wrap; gap: 12px; ">
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
			let nodeData = JSON.parse(nodeStr)
			// 为图片则更改当前轮播项数据
			!this.activeCss ?'' : this.activeCss = false
			if (nodeData.resourceTypeName != "视频") {
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

<style scoped>

</style>
