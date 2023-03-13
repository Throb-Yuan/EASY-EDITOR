<template>

	<div @drop="drop($event)" @dragover="allowDrop($event)" @dragenter="dragenter($event)">
		<div class="tip-drop">可将本地文件或媒体资源拖至下方替换<span @click="changeSide"> 查看资源库</span></div>
		<el-upload ref="upload" drag style="height: 100px;" :action="uploadAction" accept=".pdf" :auto-upload="true"
		 :on-success="handleSuccess" :show-file-list="false" :multiple="false">
			<div :class="activeCss ? 'drag-info-box active-css' : 'drag-info-box'">
				<div class="inline-block cropper-res-img">
					<div class="cropper-res-imgs">
						<img v-if="tempValue" src="../../../../../../common/images/myicons/pdf.png" alt="">
						<div v-else>
							<i class="el-icon-plus" style="font-size: 20px;"></i>
						</div>
						<p v-show="!tempValue" class="cropper-res-img-title">上传pdf</p>
					</div>
				</div>
				<div class="media-indo">
					<div class="media-name">{{ tempValue? tempFileName: '请点击或拖至此处上传' }}</div>
					<div class="media-size">{{ tempValue? tempFileSize: '支持本地文件与已上传媒体资源' }}</div>
				</div>
			</div>
		</el-upload>
		<div style="display: flex;align-items: center;justify-content: space-between;padding-right: 30px;margin-top: 14px;">
			<div><span class="switch-labels">自动翻页</span><el-switch v-model="tempAutoPlay"></el-switch>	</div>
			<div v-show="tempAutoPlay" style="font-size: 14px; display: flex;align-items: center;"><span>间隔：</span>
				<el-form  @submit.native.prevent>
					<el-input-number  @submit.native.prevent style="width:100px" size="mini" v-model="tempSpeed" :min="1000" controls-position="right" />
				</el-form>
			</div>
		</div>
		<div style="display: flex;align-items: center;justify-content: space-between;padding-top: 8px;">
			<div><span class="switch-labels">显示页码</span><el-switch v-model="tempShowPageNum"></el-switch></div>
		</div>
	</div>
</template>

<script>
const baseURL = process.env.VUE_APP_BASE_API
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
			activeCss:false,
			uploadAction: baseURL + '/file/upload',
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
			if (!nodeStr) return false
			let nodeData = JSON.parse(nodeStr)
			// 为图片则更改当前轮播项数据
			!this.activeCss ?'' : this.activeCss = false
			const sustainFm = [ '.xls', '.xlsx', '.doc', '.docx', '.pdf', '.ppt', '.pptx'];
			let isSustain = sustainFm.find(item => nodeData.resourceName.includes(item));
			if (!isSustain) {
				this.$message.warning('请选择office文档拖入替换');
				return false
			}
			if (!nodeData.resourceName.includes('.pdf')) {
				console.log("Not Pdf");
				this.tempValue = nodeData.fileUrl.replace('/download/','/preview/')
				console.log("Not Pdf",this.tempValue);
			}else{
				console.log("Is Pdf");
				this.tempValue = nodeData.fileUrl
			}
			this.tempLocalPath = nodeData.filePath
			// this.tempValue = nodeData.fileUrl
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
		},
		handleSuccess(res) {
			let response = res.data
			console.log("file1==", response);
			let param = {
				resourceId: response.fileId,
				resourceName: response.fileName,
				resourceTypeId: "4",
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
