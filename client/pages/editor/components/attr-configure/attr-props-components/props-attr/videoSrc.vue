<template>
	<div>
		<el-form-item label="资源地址：">
			<el-input type="textarea" :rows="3" placeholder="请输入视频地址" v-model="tempValue">
			</el-input>
		</el-form-item>
		<el-form-item label="本地路径：">
			<el-input type="textarea" :rows="2" placeholder="请输入视频本地路径" v-model="tempLocalPath">
			</el-input>
		</el-form-item>
		<el-form-item label="资源主键：">
			<el-input type="text" placeholder="请输入资源主键" v-model="tempAndroidId">
			</el-input>
		</el-form-item>
		<div style="display: flex;align-items: center;justify-content: space-between;padding-right: 30px;">
			<el-switch v-model="tempConytols" inactive-text="播放控件">
			</el-switch>
			<el-switch v-model="tempAutoPlay" inactive-text="自动播放">
			</el-switch>

		</div>
	</div>
</template>

<script>
export default {
	name: "attr-qk-videoSrc",
	props: {
		// prop只读
		videoSrc: String,
		videoControls: Boolean,
		videoAutoPlay: Boolean,
		androidId: String,
		localPath: String
	},
	data() {
		return {
			tempValue: '',
			tempConytols: true,
			tempAutoPlay: true,
			tempAndroidId: "",
			tempLocalPath: ""
		}
	},
	mounted() {
		this.tempValue = this.videoSrc;
		this.tempConytols = this.videoControls;
		this.tempAutoPlay = this.videoAutoPlay;
		this.tempAndroidId = this.androidId
		this.tempLocalPath = this.localPath
	},
	watch: {
				/**
	 * 监听元素值改变，将新值传递给父元素
	 * @function tempValue 视频路径
	 * @function tempLocalPath 视频本地路径
	 * @function tempConytols 视频控制键展示与否
	 * @function tempAutoPlay 视频自动播放与否
	 * @function tempAndroidId 视频资源ID
	 */
		videoControls(val) {
			this.tempConytols = val;
		},
		videoSrc(val) {
			this.tempValue = val;
		},
		tempValue() {
			this.$emit('update:videoSrc', this.tempValue);
		},
		tempConytols() {
			this.$emit('update:videoControls', this.tempConytols);
		},
		tempAutoPlay() {
			this.$emit('update:videoAutoPlay', this.tempAutoPlay);
		},
		tempAndroidId() {
			this.$emit('update:tempAndroidId', this.tempAndroidId);
		},
		tempLocalPath() {
			this.$emit('update:tempLocalPath', this.tempLocalPath);
		}
	}
}
</script>

<style scoped>

</style>
