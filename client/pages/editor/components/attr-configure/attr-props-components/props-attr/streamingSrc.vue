<template>
	<div>
		<el-form-item label="流媒体链接：">
			<el-input type="textarea" :rows="2" placeholder="请输入流媒体资源链接" v-model="tempValueNow" @focus="oldInputValue = tempValueNow" @blur="changeValue">
			</el-input>
		</el-form-item>
		<div
			style="display: flex;align-items: center;justify-content: space-between;padding-right: 30px;flex-wrap: wrap; gap: 12px; ">
			<div><span class="switch-labels">播放控件</span><el-switch v-model="tempConytols">
				</el-switch></div>
			<div><span class="switch-labels">自动播放</span><el-switch v-model="tempAutoPlay">
				</el-switch></div>
			<div><span class="switch-labels">循环播放</span><el-switch v-model="tempVideoLoop">
				</el-switch></div>
			<div><span class="switch-labels">静音播放</span><el-switch v-model="tempVideoMuted">
				</el-switch></div>
		</div>
	</div>
</template>

<script>
export default {
	name: "attr-qk-streamingSrc",
	props: {
		// prop只读
		streamingSrc: String,
		streamingControls: Boolean,
		streamingAutoPlay: Boolean,
		streamingLoop: Boolean,
		streamingMuted: Boolean,
	},
	data() {
		return {
			tempValueNow:'',
			tempValue: '',
			tempConytols: null,
			tempAutoPlay: null,
			tempVideoLoop: null,
			tempVideoMuted: false,
			oldInputValue:''
		}
	},
	mounted() {
		// this.tempValue = this.streamingSrc;
		this.tempValueNow = this.streamingSrc
		this.tempConytols = this.streamingControls;
		this.tempAutoPlay = this.streamingAutoPlay
		this.tempVideoLoop = this.streamingLoop
		this.tempVideoMuted = this.streamingMuted
	},
	methods: {
		isURL(str_url) {
			let strRegex = `((http|ftp|https|rtsp|trmp)://)(([a-zA-Z0-9\._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,4})*(/[a-zA-Z0-9\&%_\./-~-]*)?`
			let re = new RegExp(strRegex);
			return re.test(str_url);
		},
		changeValue(event){
			let isurls = this.isURL(this.tempValueNow)
			if(!this.tempValueNow||isurls){
				this.tempValue = this.tempValueNow
				// this.$emit('update:streamingSrc', this.tempValue)
			}else{
				this.$message.warning('请输入正确格式的链接');
				this.tempValueNow = this.oldInputValue
			}
			// this.tempValue = this.tempValueNow
		}
	},
	watch: {
		/**
* 监听元素值改变，将新值传递给父元素
* @function tempValue 视频路径
* @function tempConytols 视频控制键展示与否
* @function tempAutoPlay 视频自动播放与否
* @function tempVideoLoop 视频循环播放
*/
		streamingLoop(val) {
			this.tempVideoLoop = val;
		},
		streamingAutoPlay(val) {
			this.tempAutoPlay = val;
		},
		streamingMuted(val) {
			this.tempVideoMuted = val;
		},
		streamingControls(val) {
			this.tempConytols = val;
		},
		streamingSrc(val) {
			this.tempValue = val;
		},
		tempValue() {
			this.$emit('update:streamingSrc', this.tempValue)
		},
		tempConytols() {
			this.$emit('update:streamingControls', this.tempConytols);
		},
		tempAutoPlay() {
			this.$emit('update:streamingAutoPlay', this.tempAutoPlay);
		},
		tempVideoLoop() {
			this.$emit('update:streamingLoop', this.tempVideoLoop);
		},
		tempVideoMuted() {
			this.$emit('update:streamingMuted', this.tempVideoMuted);
		},
	}
}
</script>

<style scoped></style>
