<template>
	<div class="qk-bg-music" :class="{ playing: playing }" @click="handleMusicPlay">
		<div class="video-play-audio" v-if="musicSrc">
			<audio ref="audioPlayer" id="video-play-audio" :src="notDevs ? localPath : musicSrc" style="opacity: 0;" :controls="musicControls"
				:autoplay="musicAutoPlay" loop preload></audio>
		</div>
		<img class="yinyue-img" :src="muimageSrc" alt="bg">
	</div>
</template>

<script>
export default {
	name: 'qkBgMusic',
	props: {
		musicSrc: {
			type: String,
			default: 'http://192.168.101.250:2501/file/download/V5114A7622F774D43B29EA2C7CD85C660'
		},
		muimageSrc: {
			type: String,
			default: require('./music.png')
		},
		musicControls: {
			type: Boolean,
			default: true
		},
		musicAutoPlay: {
			type: Boolean,
			default: true
		},
		androidId: {
			type: String,
			default: 'VEB24E7A9AF994CD8AD6C2A7E102EC15B'
		},
		localPath: {
			type: String,
			default: '../../resource/7dfe04d852b10ffa052991a9f8aae4d0.mp3'
		},
	},
	data() {
		return {
			audioEl: undefined,
			playing: true,
			notDevs:false
		}
	},
	created() {
		// process.env.NODE_ENV == 'development' ? "" : this.notDevs = true
		if(process.env.NODE_ENV == 'development'&&!window.location.href.includes('http')) this.notDevs = true
	},
	mounted() {
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
	methods: {
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
