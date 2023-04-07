<template>
<div>
	<el-form-item label="url地址：">
    <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入url地址"
            v-model="tempValue">
    </el-input>
  </el-form-item>
  <div style="display: flex;align-items: center;justify-content: space-between;padding-top: 8px;">
			<div><span class="switch-labels">允许滚动</span><el-switch v-model="tempShowScroll"></el-switch></div>
		</div>
</div>
</template>

<script>
	export default {
		name: "attr-qk-url",
		props: {
			url: String,
			showScroll:Boolean
		},
		data() {
			return {
				tempValue: '',
				tempShowScroll:true
			}
		},
		mounted() {
			console.log("this.url==",this.showScroll);
			this.tempValue = this.url;
			this.tempShowScroll = this.showScroll
		},
		watch: {
			url(val) {
				this.tempValue = val;
			},
			tempValue() {
				this.$emit('update:url', this.tempValue);
			},showScroll(val) {
				this.tempShowScroll = val;
			},
			tempShowScroll() {
				this.$emit('update:showScroll', this.tempShowScroll);
			}
		}
	}
</script>

<style scoped>

</style>
