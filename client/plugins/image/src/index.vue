<!--test.vue-->
<template>
  <div class="qk-image">
    <img v-if="imageSrc!=''" :src="notDevs ? localPath : imageSrc" style="object-fit:cover" alt="">
    <div v-else-if="!notDevs">
      <img :src="defaultImg"  style="object-fit:cover" alt=""/>
      <span>请在右侧组件属性区域上传图片</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QkImage', //未来的标签模板名<qk-text></qk-text>
  props: {
    // imageSrc: {
    //   type: String,
    //   default: 'http://192.168.101.250:2501/file/download/I30B65E69B78D44CEB2D45AB9A78A49AF'
    // },
    imageSrc: {
      type: String,
      default: ''
    },
    androidId: {
      type: String,
      default: ''
    },
    localPath: {
      type: String,
      default: ''
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
      defaultImg:require('@client/common/images/defimgs.png'),
    }
  },
  created() {
    if(!window.location.href.includes('http')) this.notDevs = true
    setTimeout(() => {
      console.log("imageSrc",this.imageSrc,!this.imageSrc);
    }, 1000);
  }
}
</script>

<style lang="scss" scoped>
.qk-image {
  width: 100%;
  height: 100%;
  div{
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
    padding: 10px;
    box-sizing: border-box;
    background-color: #fff;
    width: 100%;
    height: 100%;
    img{
      width: 70%;
      height: 70%;
    }
    span{
      margin-top: 6px;
    }
  }
}

img {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
