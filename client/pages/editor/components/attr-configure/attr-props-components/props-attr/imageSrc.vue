<template>
	<div>
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
			this.$emit('update:androidId', this.androidId);
		},
		tempLocalPath() {
			this.$emit('update:tempLocalPath', this.tempLocalPath);
		}
	}
}
</script>

<style scoped>

</style>
