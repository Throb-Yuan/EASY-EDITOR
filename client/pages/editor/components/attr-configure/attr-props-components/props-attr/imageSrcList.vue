<template>
	<div>
		<el-form @submit.native.prevent>
			<el-form-item label="切换时间(毫秒)：" style="margin-bottom:0">
				<el-input-number size="mini" v-model="tempInterval" controls-position="right" :min="1000" />
			</el-form-item>
			<el-form-item label="轮播指针：">
				<el-switch v-model="tempIndicator">
				</el-switch>
			</el-form-item>
		</el-form>
		<div class="tip-drop" style="padding: 0 0 10px 0;">可将媒体资源拖拽至下方替换2<span @click="changeSide"> 查看资源库</span></div>

		<div v-for="(item, index) in tempValue" :key="index" @drop="drop($event, item, index)"
			@dragover="allowDrop($event, item)" @dragenter="dragenter(item)">


			<el-upload ref="upload" drag style="height: 100px;" :action="uploadAction" :auto-upload="true"
				:on-error="errors" :on-success="handleSuccess.bind(null, { 'index': index, 'item': item })"
				accept="image/*,video/*" :show-file-list="false" :multiple="false">
				<div :class="item.activeCss ? 'drag-info-box active-css' : 'drag-info-box'">
					<div class="inline-block cropper-res-img">
						<div class="cropper-res-imgs">
							<img v-if="item.urls && item.fileType == 'I'" :src="item.urls" alt="">
							<img v-else-if="item.urls" src="../../../../../../common/images/myicons/videosss.jpg" alt="">
							<div v-else>
								<i class="el-icon-plus" style="font-size: 20px;"></i>
							</div>
							<p v-show="!item.urls" class="cropper-res-img-title">上传图片</p>
						</div>
					</div>
					<div class="media-indo">
						<div class="media-name">{{ item.urls ? item.fileName : '请点击或拖至此处上传' }}</div>
						<div class="media-size">{{ item.urls ? item.fileSize : '支持本地文件与已上传媒体资源' }}</div>
					</div>
				</div>
			</el-upload>
			<div class="edit-addsub">
				<el-tooltip class="item" effect="dark" content="在此处插入图片" placement="top-start">
					<span class="imageSelect-btn" @click="pushSwiperImg(index)">
						<i class="el-icon-circle-plus-outline"></i>
					</span>
				</el-tooltip>
				<el-tooltip class="item" effect="dark" content="删除此图片" placement="top-start">
					<span class="imageSelect-btn" style="margin-left: 10px;" @click="delSwiperImg(index)">
						<i class="el-icon-remove-outline"></i>
					</span>
				</el-tooltip>

			</div>


		</div>

	</div>
</template>

<script>
import { deepClone } from '../../../../../../../common/uitls'

const defaultEle = {
	urls: '',
	localPath: '',
	androidId: '',
	fileName: "",
	fileSize: "",
	activeCss: false,
	fileType: "I"
}
const baseURL = process.env.VUE_APP_BASE_API
export default {
	name: "attr-qk-imageSrcList",
	props: {
		imageSrcList: {
			type: Array,
			default: () => []
		},
		interval: {
			type: Number,
			default: 2500
		},
		indicator: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {
			defaultCoverImage: require('@client/common/images/defimgs.png'),
			uploadAction: baseURL + '/file/upload',
			tempValue: [],
			tempInterval: 0,
			tempIndicator: false
		}
	},
	created() {
		this.initData()
		this.tempInterval = this.interval
	},
	watch: {
		imageSrcList(val) {
			this.tempValue = val
		},
		interval(val) {
			this.tempInterval = val;
		},
		indicator(val) {
			this.tempIndicator = val;
		},
		tempValue() {
			this.$emit('update:imageSrcList', this.tempValue);
		},
		tempInterval() {
			this.$emit('update:interval', this.tempInterval);
		},
		tempIndicator() {
			this.$emit('update:indicator', this.tempIndicator);
		}
	},
	methods: {
		errors(res) {
		},
		handleSuccess(obj, res) {
			// console.log("");
			let imgTypes = ['BMP', 'JPG', 'JPEG', 'PNG', 'GIF', 'WEBP', 'png', 'jpeg', 'jpg', 'gif', 'bmp', 'webp']
			let response = res.data
			let suffix = res.data.fileName.split('.')
			let param = {
				resourceId: response.fileId,
				resourceName: response.fileName,
				resourceTypeId: imgTypes.includes(suffix[suffix.length - 1]) ? "1" : '2',
				resourceMd5: response.fileHash,
				fileSize: response.fileSize,
				fileType: response.fileId.substr(0, 1),
				fileUrl: baseURL + '/file/download/' + response.fileId
			}

			this.$API.addResource(param).then(() => {
				console.log("file2==", res);
				this.$modal.msgSuccess("上传成功");
				this.open = false;
				let deepTemp = deepClone(this.tempValue)
				deepTemp[obj.index] = {
					urls: baseURL + '/file/download/' + response.fileId,
					androidId: response.fileId,
					fileName: response.fileName,
					fileSize: this.$mUtils.transFileSize(response.fileSize),
					fileType: param.fileType,
					localPath: '../../resource/' + response.fileHash + '.' + suffix[suffix.length - 1]
				}
				this.tempValue = deepTemp
				console.log("this.tempValue ", this.tempValue);
			});
			this.loading = false;
		},
		initData() {
			let list = [];
			this.imageSrcList.forEach(item => {
				// list.push({ url: item })
				list.push(item)
			})
			this.tempValue = list;
		},
		getResultImageSrcList() {
			let list = [];
			for (let i = 0, len = this.tempValue.length; i < len; i++) {
				list.push(this.tempValue[i])
			}
			return list
		},
		/**
		* 调用父组件方法传值
		  */
		change() {
			this.$emit('update:imageSrcList', this.getResultImageSrcList());
		},
		/**
		* 新增轮播项
		  * @param index
		  */
		pushSwiperImg(index) {
			let deepDef = JSON.parse(JSON.stringify(defaultEle))
			// this.tempValue.push(deepDef)
			this.tempValue.splice(index + 1, 0, deepDef)
			// this.$emit('update:imageSrcList', this.tempValue);
		},
		/**
		* 删除轮播项
		  * @param index 需删除的下标
		  */
		delSwiperImg(index) {
			this.tempValue.splice(index, 1)
			this.$emit('update:imageSrcList', this.tempValue);
		},
		/**
			* 资源列表拖拽联动，将对应图片数据覆盖至拖拽的节点数据
			* @param ev 承载node节点数据
			*/
		allowDrop(ev) {
			// console.log("allowDrop函数移动时", ev);
			ev.preventDefault();
		},
		drop(ev, item, index) {

			let eles = deepClone(this.tempValue)
			// nodeData：获取拖拽节点数据信息
			let nodeStr = ev.dataTransfer.getData("node")
			if (!nodeStr) return false
			let nodeData = JSON.parse(nodeStr)
			// 为图片则更改当前轮播项数据
			!eles[index].activeCss ? '' : eles[index].activeCss = false
			if (nodeData.fileType != "I" && nodeData.fileType != "V") {
				this.$message.warning('请选择图片视频类型拖入覆盖');
				return false
			}
			eles[index].urls = nodeData.fileUrl
			eles[index].localPath = nodeData.filePath
			eles[index].androidId = nodeData.resourceId
			eles[index].fileSize = this.$mUtils.transFileSize(nodeData.fileSize)
			eles[index].fileName = nodeData.resourceName
			eles[index].fileType = nodeData.fileType
			this.tempValue = eles
			console.log("this.tempValue", this.tempValue);
			ev.preventDefault();
		},
		dragenter(item) {
			item.activeCss ? '' : item.activeCss = true
		},
		changeSide() {
			let nowSide = this.$store.state.editor.activeSideBar
			if (nowSide != "resourceLibs") this.$store.commit('updateSideBar', "resourceLibs")
		}
	}
}
</script>

<style lang="scss" scoped>
.imageSelect-btn {
	font-size: 18px;
	cursor: pointer;
}

.edit-addsub {
	line-height: 1;
	margin-top: 10px;
	margin-bottom: 10px;
}

.cropper-res-imgs {
	img {
		object-fit: cover;
	}
}
</style>
