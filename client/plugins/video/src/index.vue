<!--test.vue-->
<template>
  <div class="qk-video">

    <video id="video" width="100%" height="100%" :src="notDevs ? localPath : videoSrc" style="object-fit:cover"
      :controls="videoControls" :autoplay="videoAutoPlay" :loop="videoLoop" muted>
      <!-- <source :src="videoSrc" /> 在此处使用将造成视图不更新问题，将需要大量代码支撑-->
    </video>
  </div>
</template>

<script>
export default {
  name: 'QkVideo', //它就是未来的标签模板名
  props: {
    videoSrc: {
      type: String,
      default: 'https://www.cainiaojc.com/run/movie.mp4'
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
      default: '1'
    },
    localPath: {
      type: String,
      default: ''
    },
    videoLoop: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      notDevs: false
    }
  },
  created() {
    process.env.NODE_ENV == 'development' ? "" : this.notDevs = true
  }
}
</script>

<style lang="scss" scoped>
.qk-video {
  width: 100%;
  height: 100%;
}
</style>
