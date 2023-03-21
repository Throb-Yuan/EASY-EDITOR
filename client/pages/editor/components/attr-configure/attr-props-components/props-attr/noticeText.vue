<template>
	<div>
		<el-form-item label="文本内容：">
			<el-input type="textarea" :rows="5" placeholder="请输入滚动文本内容" v-model="tempText">
			</el-input>

		</el-form-item>
		<el-form-item label="速度(用时)：">
			<el-input-number size="mini" v-model="tempSpeed" controls-position="right" :min="1" />
		</el-form-item>
		<el-form-item label="滚动方向：">
			<el-select v-model="tempSport" placeholder="请选择">
				<el-option v-for="item in sportTypeArr" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
		</el-form-item>
	</div>
</template>

<script>
export default {
	name: "attr-qk-noticeText",
	props: {
		noticeText: String,
		speed: Number,
		sportType: String
	},
	data() {
		return {
			tempText: '',
			tempSpeed: 20,
			tempSport: '',
			sportTypeArr: [{
				value: 'left',
				label: '从右到左'
			}, {
				value: 'right',
				label: '从左到右'
			}, {
				value: 'top',
				label: '从下到上'
			}, {
				value: 'bottom',
				label: '从上到下'
			}]
		}
	},
	created() {
		this.tempText = this.noticeText;
		this.tempSpeed = this.speed
		this.tempSport = this.sportType
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
		},
		sportType() {
			this.tempSport = this.sportType;
		},
		tempSport() {
			this.$emit('update:sportType', this.tempSport)
		},
	}
}
</script>

<style scoped></style>
