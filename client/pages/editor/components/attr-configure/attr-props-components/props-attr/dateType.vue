<template>
	<div>
		<el-form-item label="展示格式：">
			<el-select v-model="tempValue" placeholder="请选择">
				<el-option v-for="item in dateTypeArr" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>

		</el-form-item>
	</div>
</template>

<script>
export default {
	name: "attr-qk-dateType",
	props: {
		dateType: String
	},
	data() {
		return {
			tempValue: '',
			dateTypeArr: [{
				value: 'yyyy年MM月dd日 HH:mm:ss',
				label: 'yyyy年MM月dd日 时分秒'
			}, {
				value: 'yyyy-MM-dd HH:mm:ss',
				label: 'yyyy-MM-dd 时分秒'
			}, {
				value: 'yyyy年MM月dd日',
				label: 'yyyy年MM月dd日'
			}, {
				value: 'MM月dd日 HH:mm',
				label: 'MM月dd日 时分'
			}, {
				value: 'MM-dd HH:mm',
				label: 'MM-dd 时分'
			}, {
				value: 'HH:mm:ss',
				label: '时分秒'
			}, {
				value: 'HH:mm',
				label: '时分'
			}]
		}
	},
	mounted() {
		this.tempValue = this.dateType;
	},
	watch: {
		tempValue() {
			console.log("dateType==", this.tempValue);
			this.$emit('update:dateType', this.tempValue);
		},
	}
}
</script>

<style scoped>

</style>
