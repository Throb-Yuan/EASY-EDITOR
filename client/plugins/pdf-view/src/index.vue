<!--test.vue-->
<template>
  <div  class="qk-pdf-view">
    <div v-if="pdfSrc">
    <div @click="prePage" class="next-hidden pre-hidden"></div>
    <div @click="nextPage" class="next-hidden"></div>
    <pdf v-if="!reSet" ref="pdf" @error="pdfErrors($event)" :src="notDevs ? pdfSrc : pdfSrc" :page="pageNum" @progress="loadedRatio = $event"  @num-pages="pageTotalNum=$event"></pdf>
    <div class="footed" v-if="showPageNum">第{{pageNum}}页,共{{pageTotalNum}}页</div>
  </div>
  <div v-else-if="!notDevs" class="noimg" style="justify-content: center;">
      <img :src="defaultImg"  style="object-fit:cover;width: 50%;height: 40%;" alt=""/>
      <span>请在右侧组件属性区域上传文档</span>
    </div>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
export default {
  name: 'QkPdfView', 
  components:{
      pdf
  },
  props: {
    pdfSrc: {
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
    autoPlay: {
      type: Boolean,
      default: false
    },
    speed: {
      type: Number,
      default: 3000
    },
    showPageNum: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      defaultImg:require('@client/common/images/defpdf.png'),
      notDevs: false,
      pageNum: 1,
      pageTotalNum: 1,
      loadedRatio:0,
      setIntervalFun:null,
      reSet:false

    }
  },
  watch: {
		autoPlay() {
      console.log("监听==");
			// this.autoPlay ? this.playPdf() : clearInterval(this.setIntervalFun)
      if(this.autoPlay){
        this.playPdf()
      }else{
        clearInterval(this.setIntervalFun)
        this.setIntervalFun = null
      }
		},
    pdfSrc(){
      this.reSet = true
      setTimeout(() => {
        Object.assign(this.$data, this.$options.data())
      }, 100);
    }
	},
  created() {
    if(!window.location.href.includes('http')) this.notDevs = true
    
 
  },
  mounted(){
    this.autoPlay ? this.playPdf() : ''
  },
  methods:{
    pdfErrors(error) {
      this.$message.warning(`文件正在转换中，请稍后重试`);
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
    playPdf(){
      this.setIntervalFun = setInterval(() => {
        this.nextPage()
      }, this.speed);
    },
  }
}
</script>

<style lang="scss" scoped>
.qk-pdf-view {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.next-hidden{
  width: 50%;
  height: 100%;
  position: fixed;
  opacity: 0;
  right: 0;
  top: 0;
  z-index: 2;
}
.footed{
  position: fixed;
  z-index: 3;
  bottom: 2%;
  width: 100%;
  height: 14px;
  text-align: center;
  color: #333;
  font-size: 12px;
}
.pre-hidden{
  left: 0;
}
// img {
//   display: block;
//   width: 100%;
//   height: 100%;
// }
</style>
