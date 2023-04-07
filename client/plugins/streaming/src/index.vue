<template>
  <div class="qk-streaming">
    <div v-show="streamingSrc" style="width: 100%;height:100%">
      <video v-show="hlsPlay" :id="'hls' + uuid" class="video-js vjs-default-skin vjs-big-play-centered"
        style="width: 100%;height:100%">
      </video>
      <video v-show="!hlsPlay" :id="'flv' + uuid" controls autoplay style="width: 100%;height:100%"></video>
    </div>

    <div class="def-medails" v-show="!notDevs && !streamingSrc">
      <img :src="defaultImg" style="object-fit:cover" alt="" />
      <span>请在右侧组件属性区域输入流媒体链接</span>
    </div>
  </div>
</template>


<script>
import 'video.js/dist/video-js.css'
import videojs from 'video.js'
import 'videojs-contrib-hls';
import { createUUID } from '../../../../common/uitls'
import flvjs from 'flv.js'
export default {
  name: 'QkStreaming',//流媒体
  props: {
    streamingSrc: {
      type: String,
      default: ''
    },
    streamingControls: {
      type: Boolean,
      default: true
    },
    streamingAutoPlay: {
      type: Boolean,
      default: true
    },
    streamingLoop: {
      type: Boolean,
      default: true
    },
    streamingMuted: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      defaultImg: require('@client/common/images/defvio.png'),
      options: {
        autoplay: true, // 设置自动播放
        muted: false, // 设置了它为true，才可实现自动播放,同时视频也被静音 （Chrome66及以上版本，禁止音视频的自动播放，因设备而异）
        preload: "auto", // 预加载
        loop: true,
        controls: false, // 显示播放的控件
      },
      player: null,
      videoId: "",
      notDevs: false,
      uuid: "",
      flvPlayer: null,
      playType: 'hls',
      hlsPlay: true
    }
  },
  created() {
    if (!window.location.href.includes('http')) this.notDevs = true
    this.uuid = createUUID()
  },
  mounted() {
    // 延迟唤起播放器
    this.$nextTick(() => {
      if (this.streamingSrc) this.getVideo(this.streamingSrc, this.uuid);
    });
  },
  watch: {
    streamingSrc() {
      if (this.player) {
        this.player.src(this.streamingSrc)
      } else {
        this.getVideo(this.streamingSrc, this.uuid);
      }
    }
  },
  methods: {
    play() {
      this.flvPlayer.play();
    },
    initFlv() {
      if (flvjs.isSupported()) {
        var videoElement = document.getElementById('flv' + this.uuid);
        this.flvPlayer = flvjs.createPlayer({
          type: 'flv',
          isLive: true,
          hasAudio: false,
          enableWorker: true,
          decreaseDurationStep: 1,
          enableDurationMonitor: true,
          enableVideoFrozenMonitor: true,
          url: window.ipConfig.transCoding + window.btoa(this.streamingSrc)
        }, {
          autoCleanupSourceBuffer: true,//对SourceBuffer进行自动清理
          autoCleanupMaxBackwardDuration: 12,//    当向后缓冲区持续时间超过此值（以秒为单位）时，请对SourceBuffer进行自动清理
          autoCleanupMinBackwardDuration: 8,//指示进行自动清除时为反向缓冲区保留的持续时间（以秒为单位）。
          enableStashBuffer: false, //关闭IO隐藏缓冲区
          isLive: true,
          lazyLoad: false,
        });
        this.flvPlayer.attachMediaElement(videoElement);
        this.flvPlayer.load();
        this.flvPlayer.play();
        this.flvPlayer.on(flvjs.Events.ERROR, (errorType, errorDetail, errorInfo) => {
          console.log("flvjserror", errorType, errorDetail, errorInfo);
          //视频出错后销毁重新创建
          if (this.flvPlayer) {
            // clearInterval(timer)
            this.flvPlayer.pause();
            this.flvPlayer.unload();
            this.flvPlayer.detachMediaElement();
            this.flvPlayer.destroy();
            this.flvPlayer = null;
            //重新加载当前停止的视频流，根据个人的方法来配置
            setTimeout(() => {
              this.initFlv()
            }, 1000);
          }
        });
      }
    },
    /**
     * 创建一个hls/flv流播放器
     */
    getVideo(nowPlayVideoUrl, nowPlayVideoId) {
      if (nowPlayVideoUrl.includes('rtsp://')) {
        // flv
        this.hlsPlay ? this.hlsPlay = false : ''
        this.initFlv()
      } else {
        // hls
        !this.hlsPlay ? this.hlsPlay = true : ''
        this.player = videojs('hls' + nowPlayVideoId, {
          autoplay: this.streamingAutoPlay,
          muted: this.streamingMuted,
          preload: 'auto',
          loop: this.streamingLoop,
          controls: this.streamingControls
        });
        this.player.src([
          {
            src: nowPlayVideoUrl,
            type: "application/x-mpegURL", // 告诉videojs,这是一个hls流
          },
        ]);
      }

    }
  },
  // 页面销毁时销毁创建的播放器
  beforeDestroy() {
    if (this.player) {
      this.player.dispose()
      this.player = null;
    }
    if (this.flvPlayer) {
      this.flvPlayer.pause();
      this.flvPlayer.unload();
      this.flvPlayer.detachMediaElement();
      this.flvPlayer.destroy();
      this.flvPlayer = null;
    }
  }
}
</script>
<style lang="scss" scoped>
.qk-streaming {
  width: 100%;
  height: 100%;
}

.video-js {
  width: 100%;
  height: 100%;
  background: #faf6fa;
}
</style>
