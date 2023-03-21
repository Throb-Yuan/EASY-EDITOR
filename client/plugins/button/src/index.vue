<!--button.vue-->
<template>
  <div class="qk-button">
    {{text}}
  </div>
</template>

<script>
	export default {
		name: 'QkButton', // 按钮
		props: {
			text: {
				type: String,
				default: '按 钮'
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
