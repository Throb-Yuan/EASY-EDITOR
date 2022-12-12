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
  <el-switch
  v-model="videoControls"
  inactive-text="播放控件">
</el-switch>
  </div>
</template>

<script>
	export default {
		name: "attr-qk-videoSrc",
		props: {
			videoSrc: String,
			videoControls:Boolean
		},
		data() {
			return {
				tempValue: '',
				tempConytols:true
			}
		},
		mounted() {
			this.tempValue = this.videoSrc;
			this.tempConytols = this.videoControls;
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
			}
		}
	}
</script>

<style scoped>

</style>
