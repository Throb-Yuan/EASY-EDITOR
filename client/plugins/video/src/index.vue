<!--test.vue-->
<template>
  <div class="qk-video">

    <video id="video" width="100%" height="100%"  style="object-fit:cover" :src="notDevs ? localPath : videoSrc" 
      :controls="videoControls" :autoplay="true" :muted="videoMuted" :loop="videoLoop">
      <p>当前浏览器不支持播放该视频</p>
      <!-- <source   /> -->
      <!-- <source :src="videoSrc" @canplay="isReady()" /> :autoplay="videoAutoPlay"在此处使用将造成视图不更新问题，将需要大量代码支撑 x5解决层级最高问题，但仅限x5内核-->
    </video>
  </div>
</template>

<script>
export default {
  name: 'QkVideo', //它就是未来的标签模板名
  props: {
    videoSrc: {
      type: String,
      default: 'http://192.168.101.250:2501/file/download/V1C2864384FA34B2A95B812E0ADB5724A'
      // default:'https://www.runoob.com/try/demo_source/movie.mp4'
    },
    videoControls: {
      type: Boolean,
      default: true
    },
    videoAutoPlay: {
      type: Boolean,
      default: true
    },
    androidId: {
      type: String,
      default: 'V1C2864384FA34B2A95B812E0ADB5724A'
    },
    localPath: {
      type: String,
      default: '../../resource/62783f8c09823931c3068d84c8668724.mp4'
    },
    videoLoop: {
      type: Boolean,
      default: true
    },
    videoMuted: {
      type: Boolean,
      default: false
    },
		fileName: {
			type: String,
			default: '智慧海洋.mp4'
		},
		fileSize: {
			type: String,
			default: '56.76MB'
		}
  },
  data() {
    return {
      notDevs: false
    }
  },
  created() {
    if(!window.location.href.includes('http')) this.notDevs = true
    // process.env.NODE_ENV == 'development' ? "" : this.notDevs = true
  },
  methods: {
    isReady(){
      // console.log("视频已准备");
    }
  },
}
</script>

<style lang="scss" scoped>
.qk-video {
  width: 100%;
  height: 100%;
  background-color: black;
}
</style>
