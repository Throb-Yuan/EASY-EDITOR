<!--矩形边框-->
<template>
  <div class="qk-rectangle-Line">
	<div></div>
  </div>
</template>

<script>
	export default {
		name: 'QkRectangleLine', //  分割线
	}
</script>

<style lang="scss" scoped>
.qk-rectangle-Line{
	width: 100%;
	height: 100%;
	div{
		width: 100%;
		height: 100%;
		background-color: #999;
		min-height: 1px;
	}
}
</style>
