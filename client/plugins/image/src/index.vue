<!--test.vue-->
<template>
  <div class="qk-image">
    <img :src="notDevs ? localPath : imageSrc" style="object-fit:cover" alt="">
  </div>
</template>

<script>
export default {
  name: 'QkImage', //未来的标签模板名<qk-text></qk-text>
  props: {
    imageSrc: {
      type: String,
      default: 'http://192.168.101.250:2501/file/download/I30B65E69B78D44CEB2D45AB9A78A49AF'
    },
    androidId: {
      type: String,
      default: 'I30B65E69B78D44CEB2D45AB9A78A49AF'
    },
    localPath: {
      type: String,
      default: '../../resource/86ad8aa90f71d54c1a9dbce8d941eae5.jpg'
    },
    fileName: {
      type: String,
      default: 'hbfj3.jpg'
    },
    fileSize: {
      type: String,
      default: '56.39KB'
    }
  },
  data() {
    return {
      notDevs: false
    }
  },
  created() {
    if(!window.location.href.includes('http')) this.notDevs = true
  }
}
</script>

<style lang="scss" scoped>
.qk-image {
  width: 100%;
  height: 100%;
}

img {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
