<template>
	<div>
		<el-form-item label="结束时间：">
			<el-date-picker v-model="tempValue" type="datetime" placeholder="选择结束日期时间">
			</el-date-picker>

		</el-form-item>
	</div>
</template>

<script>
export default {
	name: "attr-qk-countDownTime",
	props: {
		countDownTime: [String, Number, Object, Array, Date,Function]
	},
	data() {
		return {
			tempValue: '',
			dateTypeArr: []
		}
	},
	mounted() {
		typeof this.countDownTime == 'function' ? this.tempValue = new Date(this.countDownTime()) : this.tempValue = new Date(this.countDownTime)
	},
	methods :{
		setTime(){
			return new Date(this.tempValue).getTime()
		}
	},
	watch: {
		countDownTime(val) {
			this.tempValue = val;
		},
		tempValue() {
			this.$emit('update:countDownTime', this.setTime());
		},
	}
}
</script>

<style scoped>

</style>
