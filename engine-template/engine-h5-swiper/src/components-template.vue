<template>
	<div class="quark-element-wrapper" @click="handleClick">
		<component :is="element.elName" class="quark-element ani" v-bind="element.propsValue" />
	</div>
</template>

<script>
import { _qk_register_components_object } from '@client/plugins/index'
import runAnimations from '@client/common/js/runAnimations'
import elementEvents from '@client/mixins/elementEvents'

export default {
	name: "components-template",
	components: {
		// 批量注册qk组件
		..._qk_register_components_object,
	},
	props: {
		loaded: Boolean,
		// 元素数据
		element: {
			type: Object,
			require: true
		}
	},
	mixins: [elementEvents],
	mounted() {
		if (this.loaded) {
			this.cssAnimations();
		}
	},
	watch: {
		loaded(val) {
			if (val) {
				this.cssAnimations();
			}
		}
	},
	created() {
		/**
		 * @function hjJsWebApi js暴露给webView的构造函数
		 * @function mediaControl 媒体控制方法
		 * @param act 执行动作
		 * 
		 * @play 暂停播放 hjJsWebApi.videoControl('play','')
		 * @pause 停止播放
		 * @playbackRate 倍速播放@value Number 0.5~2
		 * 
		 * @param value 动作所需附带参数
		 */
		function hjJsWebApi() { }
		hjJsWebApi.prototype = {
			mediaControl: function (act, value) {
				let videoList = document.getElementsByTagName('video')
				let audioList = document.getElementsByTagName('audio')
				if (videoList.length) {
					for (let i = 0; i < videoList.length; i++) {
						videoList[i][act](value || '')
					}
				}
				if (audioList.length) {
					for (let i = 0; i < audioList.length; i++) {
						audioList[i][act](value || '')
					}
				}

			},
		}
		window.hjJsWebApi = new hjJsWebApi()
	},
	methods: {
		async handleClick() {
			for (let i = 0, len = this.element.events.length; i < len; i++) {
				if (this['_event_' + this.element.events[i].type]) {
					await this['_event_' + this.element.events[i].type](this.element.events[i])
				}
			}
		},
		cssAnimations() {
			let cssText = this.$el.style.cssText;
			let animations = this.element.animations || [];
			runAnimations(this.$el, animations, false, () => {
				this.$el.style.cssText = cssText
			})
		}
	},
}
</script>
