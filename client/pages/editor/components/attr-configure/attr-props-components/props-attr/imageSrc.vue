<template>
	<div @drop="drop($event)" @dragover="allowDrop($event)" @dragenter="dragenter($event)">
		<div class="tip-drop">可将对应媒体资源拖拽至下方替换<span @click="changeSide"> 查看资源库</span></div>
		<!-- <el-form-item label="图片：">
			<imageSelect :url.sync="tempValue" />
		</el-form-item>
		<el-form-item label="本地路径：">
			<el-input type="textarea" :rows="2" placeholder="请输入图片本地路径" v-model="tempLocalPath">
			</el-input>
		</el-form-item>
		<el-form-item label="资源主键：">
			<el-input type="text" placeholder="请输入资源主键" v-model="tempAndroidId">
			</el-input>
		</el-form-item> -->
		<div :class="activeCss ? 'drag-info-box active-css':'drag-info-box'">
			<img :src="tempValue" alt="">
			<div class="media-indo">
				<div class="media-name">{{ tempFileName }}</div>
				<div class="media-size">{{ tempFileSize }}</div>
			</div>
		</div>
	</div>
</template>

<script>
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
			tempValue: '',
			tempAndroidId: '',
			tempLocalPath: "",
			tempFileSize:"",
			tempFileName:"",
			activeCss:false
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
			// console.log("allowDrop函数移动时", ev);
			ev.preventDefault();
		},
		drop(ev) {
			// nodeData：获取拖拽节点数据信息
			let nodeStr = ev.dataTransfer.getData("node")
			let nodeData = JSON.parse(nodeStr)
			// 为图片则更改当前轮播项数据
			!this.activeCss ?'' : this.activeCss = false
			if (nodeData.fileType != "I") {
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
		// imageSrc(val) {
		// 	this.tempValue = val;
		// },
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

<style scoped>

</style>
