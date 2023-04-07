<!--test.vue-->
<template>
	<div class="qk-iframe" @mousedown="changeIframeDivStyle('')" @mouseup="changeIframeDivStyle('none')">
		<div id="iframeDiv"></div>
		<div class="inner-if" style="width: 100%;height: 100%">
			<iframe :src="url" v-show="showScroll"  frameborder="0" style="background-color:transparent;width: 100%; min-height: 100%;overflow: hidden;"></iframe>
			<iframe :src="url" v-show="!showScroll" scrolling="no" frameborder="0" style="background-color:transparent;width: 100%; min-height: 100%;overflow: hidden;"></iframe>
		</div>
		
	</div>
</template>

<script>
export default {
	name: 'QkIframe', //内嵌iframe
	props: {
		url: {
			type: String,
			default: "http://m.baidu.com/"
		},
		showScroll:{
			type: Boolean,
			default:true
		}
	},
	data() {
		return {

		}
	},

	created() {

	},
	mounted() {
		this.changeIframeDivStyle('none');
	},
	methods: {
		/**
		 * 解决拖拽时，鼠标拖拽过程中移入iframe内，导致事件冲突而引起拖拽卡顿，释放延迟问题，
		 */
		changeIframeDivStyle(display) {
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

.inner-if::-webkit-scrollbar {
            width: 1px;
            height: 1px;
        }
        .inner-if::-webkit-scrollbar-thumb{
            background-color: #999;
            -webkit-border-radius: 1px;
            border-radius: 1px;
        }
        .inner-if::-webkit-scrollbar-thumb:vertical:hover{
            background-color: #666;
        }
        .inner-if::-webkit-scrollbar-thumb:vertical:active{
            background-color: #333;
        }
        .inner-if::-webkit-scrollbar-button{
            display: none;
        }
        .inner-if::-webkit-scrollbar-track{
            background-color: #f1f1f1;
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
