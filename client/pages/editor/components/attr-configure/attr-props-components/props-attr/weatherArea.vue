<template>
	<div>
		<el-form-item label="选择城市：">
			<el-select v-model="tempArea.cityZh" filterable placeholder="请选择">
				<el-option v-for="item in areaData" :key="item.locationId" :label="item.cityZh" :value="item.cityZh"
					@click.native="checkCity(item)">
				</el-option>
			</el-select>
			<!-- <el-cascader v-model="casData" :props="{ label: 'label', value: 'label' }" :options="areaData"
			:show-all-levels="false" :filterable="true" @change="checkCity"></el-cascader> -->
		</el-form-item>
		<el-form-item label="展示模式：">
			<el-select v-model="tempType" placeholder="请选择">
				<el-option v-for="item in weatherTypeArr" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
		</el-form-item>
		<!-- <el-form-item label="展示大小：">
			<el-input-number size="mini" v-model="tempScale" :step="0.1" :precision="1" :max="5" :min="0.2" controls-position="right"   />
		</el-form-item> -->
		<div style="color:#fcbd71;font-size:14px">*天气数据仅为预览，实际以终端为准</div>
	</div>

</template>

<script>
import areaData from '../../../../../../common/js/chinaCity.js'
export default {
	name: "attr-qk-weatherArea",
	props: {
		weatherArea: Object,
		weatherType: String,
		weatherScale:Number,
	},
	data() {
		return {
			tempArea: {
				cityZh: '北京市',
				locationId: '101010100',
			},
			tempType: '',
			areaData,
			casData: "",
			tempScale:0,
			weatherTypeArr: [{
				value: 'easy',
				label: '简单'
			}, {
				value: 'plane',
				label: '扁平'
			}]
		}
	},
	created() {
	},
	mounted() {
		this.tempArea = this.weatherArea;
		this.tempType = this.weatherType;
		this.tempScale = this.weatherScale;
	},
	methods: {
		checkCity(e) {
			console.log("checkCity", e);
			let newDatas = {
				cityZh: e.cityZh,
				locationId: e.locationId
			}
			this.tempArea = newDatas
		}
	},
	watch: {
		weatherArea() {
			this.tempArea = this.weatherArea;
		},
		tempArea() {
			this.$emit('update:weatherArea', this.tempArea)
		},
		weatherType() {
			this.tempType = this.weatherType;
		},
		tempType() {
			this.$emit('update:weatherType', this.tempType)
		},
		weatherScale() {
			this.tempScale = this.weatherScale;
		},
		tempScale() {
			this.$emit('update:weatherScale', this.tempScale)
		}
	}
}
</script>

<style scoped>

</style>
