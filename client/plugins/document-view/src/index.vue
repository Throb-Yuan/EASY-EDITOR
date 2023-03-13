<!--test.vue-->
<template>
  <div class="qk-pdf-view">
    <div v-if="documentSrc" class="noimg backimg">
      <img src="../../../common/images/docoment.png" class="bg_img" alt="">
      <span class="names">{{ fileName }}</span>
      <span class="btns" @click="viewDocs">立即查看</span>
    </div>
    <div v-else-if="!notDevs" class="noimg backimg" style="justify-content: center;">
      <img src="../../../common/images/docoment.png" class="bg_img" alt="">
      <span class="tips">请在右侧组件属性区域上传文档</span>
    </div>
    <Dialog :title="fileName" :visible.sync="open" :lock-scroll="true" :modal="true" width="90%" top="2vh" append-to-body>
      <iframe style="width: 100%;height:80vh;" :src="openUrl" frameborder="0"></iframe>
    </Dialog>
  </div>
</template>

<script>
import base from "../../../common/js/base64Encode";
import '../../../common/styles/element-variables.scss'
import { Dialog } from 'element-ui';
export default {
  name: 'QkDocumentView',
  components: {
    Dialog
  },
  props: {
    documentSrc: {
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
    },
    md5: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      notDevs: false,
      pageNum: 1,
      pageTotalNum: 1,
      loadedRatio: 0,
      setIntervalFun: null,
      reSet: false,
      open: false,
      openUrl: ''

    }
  },
  watch: {
    autoPlay() {
      if (this.autoPlay) {
        this.playPdf()
      } else {
        clearInterval(this.setIntervalFun)
        this.setIntervalFun = null
      }
    },
    pdfSrc() {
      this.reSet = true
      setTimeout(() => {
        Object.assign(this.$data, this.$options.data())
      }, 100);
    }
  },
  created() {
    if (!window.location.href.includes('http')) this.notDevs = true

  },
  mounted() {
    this.autoPlay ? this.playPdf() : ''
  },
  methods: {
    viewDocs() {
      let base1 = new base();
      let suffix = ''; // 后缀获取
      const flieArr = this.fileName.split('.'); // 根据.分割数组
      suffix = flieArr[flieArr.length - 1]; // 取最后一个
      console.log("md5===", this.md5);
      let baseUrl = `${process.env.VUE_APP_BASE_API}/file/download?fileId=${this.androidId}&fullfilename=${this.md5}.${suffix}`
      this.openUrl = 'http://192.168.101.250:8012/onlinePreview?url=' + encodeURIComponent(base1.encode(baseUrl))
      console.log("this.open",this.open);
      this.open = true
      // this.notDevs ? window.location.href = 'http://192.168.101.250:8012/onlinePreview?url=' + encodeURIComponent(base1.encode(baseUrl)) : window.open('http://192.168.101.250:8012/onlinePreview?url=' + encodeURIComponent(base1.encode(baseUrl)));
    },
    prePage() {
      let page = this.pageNum
      page = page > 1 ? page - 1 : this.pageTotalNum
      this.pageNum = page
    },

    // 下一页
    nextPage() {
      let page = this.pageNum
      page = page < this.pageTotalNum ? page + 1 : 1
      this.pageNum = page
    },
    playPdf() {
      this.setIntervalFun = setInterval(() => {
        this.nextPage()
      }, this.speed);
    },
  }
}
</script>
<style lang="scss" scoped>
.noimg {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  padding: 10px;
  box-sizing: border-box;
  background-color: #fff;
  width: 100%;
  height: 100%;
}

.backimg {
  // background: url(../../../common/images/docoment.png) no-repeat;
  // background-size: contain;
  position: relative;
  top: 0;
  left: 0;
  justify-content: space-between;
  width: 100%;
  height: 100%;

  .bg_img {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    object-fit: cover;
  }

  .tips {
    font-size: 14px;
    position: absolute;
  }

  .names {
    position: absolute;
    font-size: 18px;
    font-weight: bolder;
    color: #f4f4f5;
    text-shadow: 0px 0px 10px black;
    margin-top: 0;
    top: 20%;
  }

  .btns {
    width: 30%;
    height: 20%;
    min-width: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: absolute;
    color: #409eff;
    background: #ecf5ff;
    border-color: #b3d8ff;
    border-radius: 6px;
    // line-height: 1.5;
    padding: 10px;
    top: 50%;

    &:hover {
      background: #409eff;
      color: #fff;
    }
  }
}

.qk-pdf-view {
  width: 100%;
  height: 100%;
  background-color: #fff;
}

.next-hidden {
  width: 50%;
  height: 100%;
  position: fixed;
  opacity: 0;
  right: 0;
  top: 0;
  z-index: 2;
}

.footed {
  position: fixed;
  z-index: 3;
  bottom: 2%;
  width: 100%;
  height: 14px;
  text-align: center;
  color: #333;
  font-size: 12px;
}

.pre-hidden {
  left: 0;
}

.iframe-box {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, .5);
  z-index: 9999;
  top: 0;
  left: 0;
}

// img {
//   display: block;
//   width: 100%;
//   height: 100%;
// }
</style>
<style>
.el-dialog__body{
    width: 100%;
    height: 100%;
    padding-bottom: 0;
    padding-top: 10px;
}
</style>
