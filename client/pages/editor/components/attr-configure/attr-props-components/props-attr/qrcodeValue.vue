<template>
	<div>
		<el-form-item label="二维码内容：">
			<el-input type="textarea" :rows="2" placeholder="请输入二维码内容" v-model="tempValue">
			</el-input>

		</el-form-item>
		<el-form-item label="二维码大小">
			<el-input-number size="mini" v-model="tempCodeSize" controls-position="right" />
		</el-form-item>
	</div>
</template>

<script>
	export default {
		name: "attr-qk-qrCodeValue",
		props: {
			qrCodeValue: String,
			codeSize:Number
		},
		data() {
			return {
				tempValue: '',
				tempCodeSize:0
			}
		},
		mounted() {
			this.tempValue = this.qrCodeValue;
			this.tempCodeSize = this.codeSize;
		},
		watch: {
			qrCodeValue(val) {
				this.tempValue = val;
			},
			codeSize(val) {
				this.tempCodeSize = val;
			},
			tempValue() {
				this.$emit('update:qrCodeValue', this.tempValue);
			},
			tempCodeSize() {
				this.$emit('update:codeSize', this.tempCodeSize);
			}
		}
	}
</script>

<style scoped>

</style>
