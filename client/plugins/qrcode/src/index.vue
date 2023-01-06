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
		name: 'QkQrcode', // 这个名字很重要，它就是未来的标签名
		props: {
			qrCodeValue: {
				type: String,
				default: "慧集互联"
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
