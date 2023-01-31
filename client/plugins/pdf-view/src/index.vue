<!--test.vue-->
<template>
  <div class="qk-pdf-view">
    <div @click="prePage" class="next-hidden pre-hidden"></div>
    <div @click="nextPage" class="next-hidden"></div>
    <pdf v-if="!reSet" ref="pdf" :src="notDevs ? pdfSrc : pdfSrc" :page="pageNum" @progress="loadedRatio = $event"  @num-pages="pageTotalNum=$event"></pdf>
    <div class="footed" v-if="showPageNum">第{{pageNum}}页,共{{pageTotalNum}}页</div>
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
      default: 'http://192.168.101.250:2501/file/download/D469F02C582134D42A04B9F6AD6911AE1'
    },
    androidId: {
      type: String,
      default: 'D469F02C582134D42A04B9F6AD6911AE1'
    },
    localPath: {
      type: String,
      default: '../../resource/e2be05f213c312a82f0a1169615fe541.pdf'
    },
    fileName: {
      type: String,
      default: '2023政府补贴细则.pdf'
    },
    fileSize: {
      type: String,
      default: '6.34MB'
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
img {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
