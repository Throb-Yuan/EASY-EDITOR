<!--test.vue-->
<template>
  <div class="qk-image-carsousel">
    <!--异步加载轮播图的情况;-->
    <Swiper class="image-carsousel-swiper" v-if="imageSrcList.length > 0"  :autoPlay='true' :showIndicator='true' :interval="interval" duration="500">
      <Slide class="image-carsousel-slide" v-for="(item,index) in imageSrcList" :key="index">
        <img  class="image-carsousel-image" :src="item" alt="">
      </Slide>
    </Swiper>
  </div>
</template>

<script>
	import { Swiper, Slide } from 'vue-swiper-component';
	export default {
		name: 'QkImageCarousel', // 这个名字很重要，它就是未来的标签名<qk-text></qk-text>
		components: {
			Swiper,
			Slide
		},
		props: {
			imageSrcList: {
				type: Array,
				default: () => {
					return [
						'https://img-baofun.zhhainiao.com/market/133/2d64f9b1d09b9c519b301d4d721adc0c.jpg',
						'https://img-baofun.zhhainiao.com/market/5/44de55ff8dd22fc6ee58d96c21edb195.jpg',
						'https://img-baofun.zhhainiao.com/pcwallpaper_ugc/live/9f99708b6e5d6c4beb4f6f1a42384183.mp4.jpg'
					]
        }
			},
			interval: {
				type: Number,
				default: 2500
			}
		},
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
.image-carsousel-swiper,
.image-carsousel-slide,
.image-carsousel-image{
  display: block;
  width: 100%;
  height: 100%;
}
</style>
<style>
  .image-carsousel-swiper .wh_swiper{
    height: 100%;
  }
</style>
