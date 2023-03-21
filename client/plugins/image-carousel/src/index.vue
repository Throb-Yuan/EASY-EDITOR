<template>
	<div class="qk-image-carsousel" v-if="changeShow">
		<Swiper ref="swiper" class="image-carsousel-swiper" v-if="imageSrcList.length > 0" :autoPlay='autoPlay'
			:showIndicator='indicator' :interval="interval" duration="500" @transtionend="getNum">
			<Slide class="image-carsousel-slide" v-for="(item, index) in imageSrcList" :key="index">
				<div v-if="imageSrcList[index].urls" style="width: 100%;height: 100%;">
					<video ref="videoswiper" v-if="item.fileType == 'V'" class="image-carsousel-image image-carsousel-v"
						:id="'videoswiper' + index" width="100%" height="100%" style="object-fit:cover"
						:src="notDevs ? item.localPath : item.urls" controls="false" :autoplay="false" :loop="false"
						@ended="videoEnd"></video>
					<img v-else class="image-carsousel-image" :src="notDevs ? item.localPath : item.urls"
						style="object-fit:cover" alt="">
				</div>

				<div class="noimg" v-else-if="!notDevs">
					<img :src="defaultImg" style="object-fit:cover" alt="" />
					<span>请在右侧组件属性区域上传资源</span>
				</div>
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
				urls: '',
				localPath: '',
				androidId: '',
				fileName: "",
				fileSize: "",
				activeCss: false,
				fileType: 'I'
			}, {
				urls: '',
				localPath: '',
				androidId: '',
				fileName: "",
				fileSize: "",
				activeCss: false,
				fileType: 'I'
			}, {
				urls: '',
				localPath: '',
				androidId: '',
				fileName: "",
				fileSize: "",
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
			defaultImg: require('@client/common/images/defimgs.png'),
			autoPlay: true
		}
	},
	created() {
		// 判断环境赋值不同url
		if (!window.location.href.includes('http')) this.notDevs = true

	},
	mounted(){
		/**
		 * 当首个轮播项为视频时，首次进入未触发transtionend时间，导致作为普通图片轮播划过
		 * @param data 参数表示轮播到第data个元素
		 * 增加判断 暂停轮播播放视频
		 */
		if (this.imageSrcList[0].urls&&this.imageSrcList[0].fileType=='V') {
			this.$refs.swiper.auto = false
			let videos = document.getElementById('videoswiper0')
			videos.play()
		}
	},
	methods: {
		/**
		 * 每次轮播出发事件，播放视频，暂停轮播
		 * @param data 参数表示轮播到第data个元素
		 * @Id 自定义id名+data,防止多个视频导致id重复
		 */
		getNum(data) {
			let videos = document.getElementById('videoswiper' + data)
			let videoList = document.getElementsByClassName('image-carsousel-v')
			if (videoList.length ) {
					for (let i = 0; i < videoList.length; i++) {
						videoList[i].pause()
					}
				}
			if (this.imageSrcList[data].fileType == "V") {
				this.$refs.swiper.clearTimeOut()
				videos.play()
			}
		},
		/**
		 * 视频播放结束事件
		 * 重新启动轮播
		 */
		videoEnd() {
			if(!this.$refs.swiper.auto && this.imageSrcList[0].fileType=='V'){
				// 首次首个轮播项为视频时一次性触发
				this.$refs.swiper.auto  = true
			}
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
	// background-color: #fff;
}
</style>
<style>
.image-carsousel-swiper .wh_swiper {
	height: 100%;
}
</style>
