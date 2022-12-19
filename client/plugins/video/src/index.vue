<!--test.vue-->
<template>
  <div class="qk-video">
    
<video
  id="video" 
  width="100%"
  height="100%"
  :src="videoSrc"
  style="object-fit:cover"
  :controls="videoControls"
  :autoplay="videoAutoPlay" muted >
  <!-- <source :src="videoSrc" /> -->
</video>
  </div>
</template>

<script>
	export default {
		name: 'QkVideo', // 这个名字很重要，它就是未来的标签名<qk-text></qk-text>
		props: {
			videoSrc: {
				type: String,
        default: 'https://www.cainiaojc.com/run/movie.mp4'
      },
      videoControls: {
        type: Boolean,
        default:true
      },
      videoAutoPlay: {
        type: Boolean,
        default:true
      }
		}
	}
</script>

<style lang="scss" scoped>
  .qk-video{
    width: 100%;
    height: 100%;
  }
</style>
