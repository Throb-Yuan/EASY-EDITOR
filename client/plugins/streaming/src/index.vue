<template>
  <div class="qk-streaming">
    <video :id='uuid' class="video-js vjs-default-skin vjs-big-play-centered" style="width: 100%;height:100%">
    </video>
  </div>
</template>


<script>
import 'video.js/dist/video-js.css'
import videojs from 'video.js'
import 'videojs-contrib-hls';
import { createUUID } from '../../../../common/uitls'
//不要忘记包括视频.js CSS，位于 .<code>video.js/dist/video-js.css</code>

export default {
  name: 'QkStreaming',
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
      options: {
        autoplay: true, // 设置自动播放
        muted: false, // 设置了它为true，才可实现自动播放,同时视频也被静音 （Chrome66及以上版本，禁止音视频的自动播放）
        preload: "auto", // 预加载
        loop: true,
        controls: false, // 显示播放的控件
      },
      player: null,
      videoId: "",
      uuid: ""
    }
  },
  created() {
    this.uuid = 'myvideo' + createUUID()
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
      } else{
        this.getVideo(this.streamingSrc, this.uuid);
      }
    }
  },
  methods: {
    getVideo(nowPlayVideoUrl, nowPlayVideoId) {
      console.log("视频已准备666");
      this.player = videojs(nowPlayVideoId, {
        autoplay:this.streamingAutoPlay,
        muted:this.streamingMuted,
        preload:'auto',
        loop:this.streamingLoop,
        controls:this.streamingControls
      });
      // 关键代码， 动态设置src，才可实现换台操作
      //不动态设置依然也可以这样写
      this.player.src([
        {
          src: nowPlayVideoUrl,
          type: "application/x-mpegURL", // 告诉videojs,这是一个hls流
        },
      ]);
    }
  },

  beforeDestroy() {
    if (this.player) {
      this.player.dispose()
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
