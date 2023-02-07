<!--test.vue-->
<template>
	<div class="qk-image-carsousel" v-if="changeShow">
		<!--异步加载轮播图的情况;-->
		<Swiper ref="swiper" class="image-carsousel-swiper" v-if="imageSrcList.length > 0" :autoPlay='autoPlay'
			:showIndicator='indicator' :interval="interval" duration="500" @transtionend="getNum"  >
			<Slide class="image-carsousel-slide" v-for="(item, index) in imageSrcList" :key="index">
				<video ref="videoswiper" v-if="item.fileType == 'V'" :id="'videoswiper'+index" width="100%" height="100%" style="object-fit:cover"
					:src="notDevs ? localPath : item.urls" controls="false" :autoplay="false" :loop="false" @ended="videoEnd"></video>
				<img v-else class="image-carsousel-image" :src="notDevs ? item.localPath : item.urls"
					style="object-fit:cover" alt="">
			</Slide>
		</Swiper>
	</div>
</template>

<script>
import { Swiper, Slide } from 'vue-swiper-component';
export default {
	name: 'QkImageCarousel', // 组件名 标签名
	components: {
		Swiper,
		Slide
	},
	props: {
		imageSrcList: {
			type: Array,
			default: () => [{
				urls: 'http://192.168.101.250:2501/file/download/I1516BF5E171E4D1E91F01AD375C53A99',
				localPath: '../../resource/1aae81ff57e02d9cd7db864926de38d2.jpg',
				androidId: 'I1516BF5E171E4D1E91F01AD375C53A99',
				fileName: "hbfj6.jpg",
				fileSize: "189.05KB",
				activeCss: false,
				fileType: 'I'
			}, {
				urls: 'http://192.168.101.250:2501/file/download/VDEA5E431C0CD4732BC7ECD6E8DD3E0B2',
				localPath: '../../resource/db3044531589f6f20d48d42ed8b9f382.jpg',
				androidId: 'I0BE3F53A3C9140C286D268D04E2E3768',
				fileName: "智慧海洋.mp4",
				fileSize: "272.91KB",
				activeCss: false,
				fileType: 'V'
			}, {
				urls: 'http://192.168.101.250:2501/file/download/IC58C80056F354F41A64D3899254BFFE6',
				localPath: '../../resource/c9667eb24ccd6ca0818a0b550752cf80.png',
				androidId: 'IC58C80056F354F41A64D3899254BFFE6',
				fileName: "hbfj7.png",
				fileSize: "2.70MB",
				activeCss: false,
				fileType: 'I'
			}, {
				urls: 'http://192.168.101.250:2501/file/download/I0BE3F53A3C9140C286D268D04E2E3768',
				localPath: '../../resource/db3044531589f6f20d48d42ed8b9f382.jpg',
				androidId: 'I0BE3F53A3C9140C286D268D04E2E3768',
				fileName: "hbfj5.jpg",
				fileSize: "272.91KB",
				activeCss: false,
				fileType: 'I'
			}]
		},
		interval: {
			type: Number,
			default: 2500
		},
		indicator: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		imageSrcList() {
			this.changeShow = false
			setTimeout(() => {
				this.changeShow = true
			}, 100);
		},
		indicator() {
			this.changeShow = false
			setTimeout(() => {
				this.changeShow = true
			}, 100);
		},
	},
	data() {
		return {
			notDevs: false,
			changeShow: true,
			autoPlay: true
		}
	},
	created() {
		// 判断环境赋值不同url
		if (!window.location.href.includes('http')) this.notDevs = true
		// if(this.notDevs) this.changeShow = true
	},
	methods: {
		/**
		 * 每次轮播出发事件，播放视频，暂停轮播
		 * @param data 参数表示轮播到第data个元素
		 * @Id 自定义id名+data,防止多个视频导致id重复
		 */
		getNum(data) {
			let videos = document.getElementById('videoswiper'+data)
			if(this.imageSrcList[data].fileType=="V"){
				videos.play()
				this.$refs.swiper.clearTimeOut()
			}
		 },
		/**
		 * 视频播放结束时间
		 * 重新启动轮播
		 */
		 videoEnd(){
			this.$refs.swiper.setTime()
		 }
	}
}
</script>

<style lang="scss" scoped>
.qk-image-carsousel {
	width: 100%;
	height: 100%;
}

.image-carsousel-swiper,
.image-carsousel-slide,
.image-carsousel-image {
	display: block;
	width: 100%;
	height: 100%;
	background-color: #fff;
}
</style>
<style>
.image-carsousel-swiper .wh_swiper {
	height: 100%;
}
</style>
