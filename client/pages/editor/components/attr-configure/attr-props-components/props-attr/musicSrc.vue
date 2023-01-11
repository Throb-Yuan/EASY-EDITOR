<template>
	<div @drop="drop($event)" @dragover="allowDrop($event)">
		<div class="tip-drop">可将媒体资源拖拽至下方替换<span @click="changeSide"> 查看资源库</span></div>
		<!-- <el-form-item label="资源地址：">
			<el-input type="textarea" :rows="3" placeholder="请输入url地址" v-model="tempValue">
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
		<div class="drag-info-box">
			<img src="../../../../../../common/images/myicons/musics.png" alt="">
			<div class="media-indo">
				<div class="media-name">{{ tempFileName }}</div>
				<div class="media-size">{{ tempFileSize }}</div>
			</div>
		</div>
		<div style="display: flex;align-items: center;justify-content: space-between;padding-right: 30px;">
			<el-switch v-model="tempMusicLoop" inactive-text="循环播放">
			</el-switch>
			<el-switch v-model="tempAutoPlay" inactive-text="自动播放">
			</el-switch>	

		</div>
	</div>
</template>

<script>
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
			tempValue: '',
			tempConytols: true,
			tempAutoPlay: true,
			tempAndroidId: "",
			tempLocalPath: "",
			tempMusicLoop:true,
			tempFileSize:"",
			tempFileName:""
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
			if (nodeData.resourceTypeName != "音乐") {
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
