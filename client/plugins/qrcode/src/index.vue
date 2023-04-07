<!--test.vue-->
<template>
  <div class="qk-qrcode">
	<QrcodeVue  :value="qrCodeValue" :size="codeSize" level="H"></QrcodeVue>
  </div>
</template>

<script>
	import QrcodeVue from 'qrcode.vue'
	export default {
		components: {
			QrcodeVue
		},
		name: 'QkQrcode', // 二维码
		props: {
			qrCodeValue: {
				type: String,
				default: "数智云屏"
			},
			codeSize:{
				type: Number,
				default: 120
			}
		},
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
.qk-iframe {
  width: 100%;
  height: 100%;
}
</style>
