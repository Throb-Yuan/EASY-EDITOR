<!--test.vue-->
<template>
  <div class="qk-text">
    {{text}}
  </div>
</template>

<script>
	export default {
		name: 'QkText', // 文本
		props: {
			text: {
				type: String,
        default: '这是一段文字'
      }
		},
    data(){
			return {
				defaultStyle: {
					height: 40
				}
      }
    }
	}
</script>

<style lang="scss" scoped>

</style>
