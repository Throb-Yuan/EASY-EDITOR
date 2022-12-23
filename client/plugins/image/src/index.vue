<!--test.vue-->
<template>
  <div class="qk-image">
    <img :src="notDevs ? localPath : imageSrc" alt="">
  </div>
</template>

<script>
export default {
  name: 'QkImage', //未来的标签模板名<qk-text></qk-text>
  props: {
    imageSrc: {
      type: String,
      default: 'https://dss2.bdstatic.com/8_V1bjqh_Q23odCf/pacific/1993944121.jpg'
    },
    androidId: {
      type: String,
      default: ''
    },
    localPath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      notDevs: false
    }
  },
  created() {
    process.env.NODE_ENV == 'development' ? "" : this.notDevs = true
  },
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
