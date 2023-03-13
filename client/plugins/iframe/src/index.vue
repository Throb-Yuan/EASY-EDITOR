<!--test.vue-->
<template>
	<div class="qk-iframe" @mousedown="changeIframeDivStyle('')" @mouseup="changeIframeDivStyle('none')">
		<div id="iframeDiv"></div>
		<iframe :src="url" frameborder="0" style="background-color:transparent;width: 100%; min-height: 100%;"></iframe>
	</div>
</template>

<script>
export default {
	name: 'QkIframe', // 这个名字很重要，它就是未来的标签名
	props: {
		url: {
			type: String,
			default: "http://m.baidu.com/"
		}
	},
	data() {
		return {

		}
	},

	created(){
		
	},
	mounted(){
		this.changeIframeDivStyle('none');
	},
	methods: {
		changeIframeDivStyle(display) {
			// 解决拖拽时，鼠标拖拽过程中移入iframe内，导致事件冲突而引起拖拽卡顿，释放延迟问题，
			let iframeDiv = document.getElementById('iframeDiv');
			iframeDiv.style.display = display;
		}
	}
}
</script>

<style lang="scss" scoped>
.qk-iframe {
	width: 100%;
	height: 100%;
}

#iframeDiv {
	width: 100%;
	height: 100%;
	position: absolute;
	z-index: 1111;
	filter: alpha(opacity=0);
	opacity: 0;
	background: transparent;
}
</style>
