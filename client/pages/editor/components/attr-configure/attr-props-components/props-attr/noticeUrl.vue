<template>
	<div>
		<el-form-item label="rss链接：">
			<el-input type="textarea" :rows="3" placeholder="请输入rss链接" v-model="tempValueNow" @blur="changeValue">
			</el-input>

		</el-form-item>
		<el-form-item label="速度(用时)：">
			<el-input-number size="mini" v-model="tempSpeed" controls-position="right" />
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
	name: "attr-qk-noticeUrl",
	props: {
		noticeUrl: String,
		speed:Number,
		sportType:String
	},
	data() {
		return {
			tempValueNow:'',
			tempText: '',
			tempSpeed: 20,
			tempSport: '',
			sportTypeArr: [{
				value: 'left',
				label: '从左到右'
			}, {
				value: 'right',
				label: '从右到左'
			}, {
				value: 'top',
				label: '从上到下'
			}, {
				value: 'bottom',
				label: '从下到上'
			}]
		}
	},
	created() {
		this.tempValueNow = this.noticeUrl;
		this.tempSpeed = this.speed
		this.tempSport = this.sportType
	},
	watch: {
		noticeUrl() {
			this.tempText = this.noticeUrl;
		},
		tempText() {
			this.$emit('update:noticeUrl', this.tempText)
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
	},
	methods: {
		isURL(str_url) {
			var strRegex = "((http|ftp|https)://)(([a-zA-Z0-9\._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,4})*(/[a-zA-Z0-9\&%_\./-~-]*)?"
			var re = new RegExp(strRegex);
			return re.test(str_url);
		},
		changeValue(){
			let isurls = this.isURL(this.tempValueNow)
			if(isurls){
				this.tempText = this.tempValueNow
			}else{
				this.$message.warning('请输入正确格式的链接');
			}
		}
	}
}
</script>

<style scoped>

</style>
