<template>
	<div>
		<el-form-item label="资源地址：">
			<el-input type="textarea" :rows="3" placeholder="请输入url地址" v-model="tempValue">
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
	name: "attr-qk-musicSrc",
	props: {
		musicSrc: String,
		musicControls: Boolean,
		musicAutoPlay: Boolean,
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
		this.tempValue = this.musicSrc;
		this.tempConytols = this.musicControls;
		this.tempAutoPlay = this.musicAutoPlay;
		this.tempAndroidId = this.androidId
		this.tempLocalPath = this.localPath
	},
	watch: {
		/**
	 * 监听元素值改变，将新值传递给父元素
	 * @function tempValue 音乐路径
	 * @function tempLocalPath 音乐本地路径
	 * @function tempConytols 音乐控制键展示与否
	 * @function tempAutoPlay 音乐自动播放与否
	 * @function tempAndroidId 音乐资源ID
	 */
		musicSrc(val) {
			this.tempValue = val;
		},
		tempValue() {
			this.$emit('update:musicSrc', this.tempValue);
		},
		tempConytols() {
			this.$emit('update:musicControls', this.tempConytols);
		},
		tempAutoPlay() {
			this.$emit('update:musicAutoPlay', this.tempAutoPlay);
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
