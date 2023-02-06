<template>
	<div>
		<el-form-item label="展示格式：">
			<el-select v-model="tempValue" placeholder="请选择">
				<el-option v-for="item in weekTypeArr" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>

		</el-form-item>
	</div>
</template>

<script>
export default {
	name: "attr-qk-weekType",
	props: {
		weekType: String
	},
	data() {
		return {
			tempValue: '',
			weekTypeArr: [{
				value: '星期',
				label: '星期'
			}, {
				value: '周',
				label: '周'
			}]
		}
	},
	mounted() {
		this.tempValue = this.weekType;
	},
	watch: {
		weekType(val) {
			this.tempValue = val;
		},
		tempValue() {
			this.$emit('update:weekType', this.tempValue);
		},
	}
}
</script>

<style scoped>

</style>
