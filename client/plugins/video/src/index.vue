<!--test.vue-->
<template>
  <div class="qk-video">
    
<video
  id="video" 
  width="100%"
  height="100%"
  :src="videoSrc"
  object-fit='fill'
  :controls="videoControls"
  autoplay muted >
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
        default: 'https://f.video.weibocdn.com/o0/Y3fkLP4qlx081kSPiE5G010412006ZDC0E010.mp4?label=mp4_720p&template=1280x720.25.0&media_id=4843619975364646&tp=8x8A3El:YTkl0eM8&us=0&ori=1&bf=4&ot=h&lp=000023PB3H&ps=mZ6WB&uid=zlbOZdn&ab=8224-g0,7397-g1,9298-g1,8143-g0,8013-g0,7598-g0&Expires=1670400988&ssig=oLtYxh0Ur4&KID=unistore,video'
      },
      videoControls: {
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
  img{
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
