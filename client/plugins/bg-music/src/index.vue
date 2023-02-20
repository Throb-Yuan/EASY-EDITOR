<template>
	<div class="qk-bg-music" :class="{ playing: playing }" @click="handleMusicPlay">
		<div>
			<div class="video-play-audio">
				<audio ref="audioPlayer" id="video-play-audio" :src="notDevs ? localPath : musicSrc" style="opacity: 0;"
					:controls="musicControls" :autoplay="musicAutoPlay" :loop="musicLoop" preload></audio>
			</div>
			<img class="yinyue-img" :src="muimageSrc" alt="bg">
		</div>
		<!-- <div class="def-medails" v-else-if="!notDevs">
			<img :src="defaultImg" style="object-fit:cover" alt="" />
			<span>请在右侧组件属性区域上传视频</span>
		</div> -->
</div>
</template>

<script>
export default {
	name: 'qkBgMusic',
	props: {
		musicSrc: {
			type: String,
			default: ''
		},
		muimageSrc: {
			type: String,
			default: require('./music.png')
		},
		musicControls: {
			type: Boolean,
			default: true
		},
		musicLoop: {
			type: Boolean,
			default: true
		},
		musicAutoPlay: {
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
			audioEl: undefined,
			playing: false,
			notDevs: false,
			defaultImg: require('@client/common/images/defmus.png'),
		}
	},
	watch:{
		musicSrc() {
			this.playing ? '' :  this.playing = true
		},
	},
	created() {
		// process.env.NODE_ENV == 'development' ? "" : this.notDevs = true
		if (!window.location.href.includes('http')) {
			this.notDevs = true
			this.playing = true
		}
	},
	mounted() {
		if (this.musicSrc) this.firstPlay()
	},
	methods: {
		firstPlay() {
			this.audioEl = document.getElementById('video-play-audio')
			this.audioEl.load();
			const audio = this.$refs.audioPlayer;
			audio.play().catch(() => {
				this.playError = true;
				let event = ["click", "WeixinJSBridgeReady"];// "touchstart"
				let pageClick = () => {
					if (this.playError) {
						this.playError = false;
						audio.load();
						audio.play().catch(() => {
							this.playError = true;
						});
						event.forEach((item) => {
							document.removeEventListener(item, pageClick);
						});
					}
				};
				event.forEach((item) => {
					document.addEventListener(item, pageClick);
				});
			})
		},
		handleMusicPlay() {
			if (!this.musicSrc) return;
			if (this.playing) {
				this.pause()
			} else {
				this.play();
			}
		},
		play() {
			this.playing = true;
			this.audioEl.play();
		}
		,
		pause() {
			this.playing = false;
			this.audioEl.pause();
		}
	}
}
</script>

<style lang="scss" scoped>
.video-play-audio {
	position: absolute;
	left: -9999px;
	top: -9999px;
	width: 0;
	height: 0;
	z-index: -1;
	opacity: 1;
	overflow: hidden;
}

.yinyue-img {
	position: relative;
	display: inline-block;
	width: 100%;
	height: 100%;
}

.qk-bg-music {
	position: relative;
	width: 100%;
	height: 100%;
	padding: 10px;
	border-radius: 50%;
	overflow: hidden;
	cursor: pointer;

	&.playing {
		animation: spin 3s linear infinite;
	}
}

/* 无限旋转 */
@keyframes spin {
	from {
		transform: rotate(0);
	}

	to {
		transform: rotate(360deg);
	}
}
</style>
