<template>
	<div>
		<div @drop="drop($event)" @dragover="allowDrop($event)">
			<el-form-item label="图片：">
				<imageSelect :url.sync="tempValue" />
			</el-form-item>
			<el-form-item label="本地路径：">
				<el-input type="textarea" :rows="2" placeholder="请输入图片本地路径" v-model="tempLocalPath">
				</el-input>
			</el-form-item>
			<el-form-item label="资源主键：">
				<el-input type="text" placeholder="请输入资源主键" v-model="tempAndroidId">
				</el-input>
			</el-form-item>
		</div>

	</div>


</template>

<script>
import imageSelect from '@client/components/image-select'
export default {
	name: "attr-qk-imageSrc",
	props: {
		imageSrc: String,
		androidId: String,
		localPath: String
	},
	components: {
		imageSelect
	},
	data() {
		return {
			tempValue: '',
			tempAndroidId: '',
			tempLocalPath: ""
		}
	},
	mounted() {
		this.tempValue = this.imageSrc;
		this.tempAndroidId = this.androidId;
		this.tempLocalPath = this.localPath
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
			if (nodeData.fileType != "I") {
				this.$message.warning('请选择图片类型拖入覆盖');
				return false
			}
			this.tempValue = nodeData.fileUrl
			this.tempLocalPath = nodeData.filePath
			this.tempAndroidId = nodeData.resourceId
			ev.preventDefault();
		}
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
		tempValue() {
			this.$emit('update:imageSrc', this.tempValue);
		},
		tempAndroidId() {
			this.$emit('update:androidId', this.tempAndroidId);
		},
		tempLocalPath() {
			this.$emit('update:localPath', this.tempLocalPath);
		}
	}
}
</script>

<style scoped>

</style>
