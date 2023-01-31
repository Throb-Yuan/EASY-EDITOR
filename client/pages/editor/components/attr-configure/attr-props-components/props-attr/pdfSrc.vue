<template>
	<div @drop="drop($event)" @dragover="allowDrop($event)" @dragenter="dragenter($event)">
		<div class="tip-drop">可将对应媒体资源拖拽至下方替换<span @click="changeSide"> 查看资源库</span></div>
		<div :class="activeCss ? 'drag-info-box active-css':'drag-info-box'">
			<img src="../../../../../../common/images/myicons/pdf.png" alt="">
			<div class="media-indo">
				<div class="media-name">{{ tempFileName }}</div>
				<div class="media-size">{{ tempFileSize }}</div>
			</div>
		</div>
		<div style="display: flex;align-items: center;justify-content: space-between;padding-right: 30px;">
			<div><span class="switch-labels">自动翻页</span><el-switch v-model="tempAutoPlay"></el-switch>	</div>
			<div v-show="tempAutoPlay" style="font-size: 14px;">间隔：<el-input-number style="width:100px" size="mini" v-model="tempSpeed" controls-position="right" /></div>
		</div>
		<div style="display: flex;align-items: center;justify-content: space-between;padding-top: 8px;">
			<div><span class="switch-labels">显示页码</span><el-switch v-model="tempShowPageNum"></el-switch></div>
		</div>
	</div>
</template>

<script>
export default {
	name: "attr-qk-pdfSrc",
	props: {
		pdfSrc: String,
		androidId: String,
		localPath: String,
		fileName: String,
		fileSize: String,
		autoPlay:Boolean,
		speed:Number,
		showPageNum:Boolean
	},
	data() {
		return {
			tempValue: '',
			tempAndroidId: '',
			tempLocalPath: "",
			tempFileSize:"",
			tempFileName:"",
			tempAutoPlay:false,
			tempSpeed:3000,
			tempShowPageNum:true,
			activeCss:false
		}
	},
	mounted() {
		this.tempValue = this.pdfSrc;
		this.tempAndroidId = this.androidId;
		this.tempLocalPath = this.localPath;
		this.tempFileName = this.fileName;
		this.tempFileSize = this.fileSize
		this.tempAutoPlay = this.autoPlay;
		this.tempSpeed = this.speed
		this.tempShowPageNum = this.showPageNum
	},
	methods: {
		/**
		* 
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
			// 为图片则更改当前轮播项数据
			!this.activeCss ?'' : this.activeCss = false
			if (!nodeData.resourceName.includes('.pdf')) {
				this.$message.warning('请选择PDF文档拖入替换');
				return false
			}
			this.tempValue = nodeData.fileUrl
			this.tempLocalPath = nodeData.filePath
			this.tempAndroidId = nodeData.resourceId
			this.tempFileSize = this.$mUtils.transFileSize(nodeData.fileSize)
			this.tempFileName = nodeData.resourceName
			this.tempAutoPlay = false
			this.tempSpeed = 3000
			this.tempShowPageNum = true
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
* @function tempValue 图片路径
* @function tempLocalPath 图片本地路径
* @function tempAndroidId 图片资源ID
*/
		pdfSrc(val) {
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
		showPageNum(val) {
			this.tempShowPageNum = val;
		},
		autoPlay(val) {
			this.tempAutoPlay = val;
		},
		speed(val) {
			this.tempSpeed = val;
		},
		tempValue() {
			this.$emit('update:pdfSrc', this.tempValue);
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
		},
		tempAutoPlay() {
			this.$emit('update:autoPlay', this.tempAutoPlay);
		},
		tempSpeed() {
			this.$emit('update:speed', this.tempSpeed);
		},
		tempShowPageNum() {
			this.$emit('update:showPageNum', this.tempShowPageNum);
		}
	}
}
</script>

<style scoped>

</style>
