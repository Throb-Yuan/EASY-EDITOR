<!--test.vue-->
<template>
	<div class="qk-image-carsousel" v-if="changeShow">
		<!--异步加载轮播图的情况;-->
		<Swiper class="image-carsousel-swiper" v-if="imageSrcList.length > 0" :autoPlay='true' :showIndicator='true'
			:interval="interval" duration="500">
			<Slide class="image-carsousel-slide" v-for="(item, index) in imageSrcList" :key="index">
				<img class="image-carsousel-image" :src="notDevs ? item.localPath : item.urls" alt="">
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
				fileSize: "189.05KB"
			}, {
				urls: 'http://192.168.101.250:2501/file/download/IC58C80056F354F41A64D3899254BFFE6',
				localPath: '../../resource/c9667eb24ccd6ca0818a0b550752cf80.png',
				androidId: 'IC58C80056F354F41A64D3899254BFFE6',
				fileName: "hbfj7.png",
				fileSize: "2.70MB"
			}, {
				urls: 'http://192.168.101.250:2501/file/download/I0BE3F53A3C9140C286D268D04E2E3768',
				localPath: '../../resource/db3044531589f6f20d48d42ed8b9f382.jpg',
				androidId: 'I0BE3F53A3C9140C286D268D04E2E3768',
				fileName: "hbfj5.jpg",
				fileSize: "272.91KB"
			}]
		},
		interval: {
			type: Number,
			default: 2500
		}
	},
	watch: {
		imageSrcList() {
			this.changeShow = false
			setTimeout(() => {
				this.changeShow = true
			}, 100);
		}
	},
	data() {
		return {
			notDevs: false,
			changeShow: true
		}
	},
	created() {
		// 判断环境赋值不同url
		if (process.env.NODE_ENV == 'development' && !window.location.href.includes('http')) this.notDevs = true
		// process.env.NODE_ENV == 'development' ? "" : this.notDevs = true
		// if(this.notDevs) this.changeShow = true
	},
	methods: {

	}
}
</script>

<style lang="scss" scoped>
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
