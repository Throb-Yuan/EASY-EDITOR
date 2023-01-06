<template>
	<div>
		<el-form-item label="文本内容：">
			<el-input type="textarea" :rows="5" placeholder="请输入滚动文本内容" v-model="tempText">
			</el-input>

		</el-form-item>
		<el-form-item label="速度(用时)：">
			<el-input-number size="mini" v-model="tempSpeed" controls-position="right" />
		</el-form-item>
	</div>

</template>

<script>
export default {
	name: "attr-qk-noticeText",
	props: {
		noticeText: String,
		speed:Number
	},
	data() {
		return {
			tempText: '',
			tempSpeed: 20
		}
	},
	mounted() {
		this.tempText = this.noticeText;
		this.tempSpeed = this.speed
	},
	watch: {
		noticeText() {
			this.tempText = this.noticeText;
		},
		tempText() {
			this.$emit('update:noticeText', this.tempText)
		},
		speed() {
			this.tempSpeed = this.speed;
		},
		tempSpeed() {
			this.$emit('update:speed', this.tempSpeed)
		}
	}
}
</script>

<style scoped>

</style>
