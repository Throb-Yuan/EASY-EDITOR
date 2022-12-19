<template>
  <div>
	<el-form-item label="资源地址：">
    <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入视频地址"
            v-model="tempValue">
    </el-input>
  </el-form-item>
  <div style="display: flex;align-items: center;justify-content: space-between;padding-right: 30px;">
	<el-switch
  v-model="tempConytols"
  inactive-text="播放控件">
</el-switch>
<el-switch
  v-model="tempAutoPlay"
  inactive-text="自动播放">
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
			videoControls:Boolean,
			videoAutoPlay:Boolean
		},
		data() {
			return {
				tempValue: '',
				tempConytols:true,
				tempAutoPlay:true
			}
		},
		mounted() {
			this.tempValue = this.videoSrc;
			this.tempConytols = this.videoControls;
			this.tempAutoPlay = this.videoAutoPlay;
		},
		watch: {
			videoControls(val){
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
			}
		}
	}
</script>

<style scoped>

</style>
