<!--test.vue-->
<template>
  <div class="qk-video">

    <video v-if="videoSrc!=''"  id="video" width="100%" height="100%"  style="object-fit:cover;background-color: black;" :src="notDevs ? localPath : videoSrc" 
      :controls="videoControls" :autoplay="videoAutoPlay" :muted="videoMuted" :loop="videoLoop">
      <p>当前浏览器不支持播放该视频</p>
    </video>
    <div class="def-medails" v-else-if="!notDevs">
      <img :src="defaultImg"  style="object-fit:cover" alt=""/>
      <span>请在右侧组件属性区域上传视频</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QkVideo', //它就是未来的标签模板名
  props: {
    videoSrc: {
      type: String,
      default: ''
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
      default: ''
    },
    localPath: {
      type: String,
      default: ''
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
			default: ''
		},
		fileSize: {
			type: String,
			default: ''
		}
  },
  data() {
    return {
      notDevs: false,
      defaultImg:require('@client/common/images/defvio.png'),
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
}
</style>
