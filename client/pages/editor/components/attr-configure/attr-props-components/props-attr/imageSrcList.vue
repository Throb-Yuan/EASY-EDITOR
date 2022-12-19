<template>
	<el-form-item label="图片列表：">
		<div v-for="(item, index) in tempValue" :key="index">
			<imageSelect :url.sync="item.url" @change="change" />
			<span class="imageSelect-btn" @click="pushSwiperImg(index)">
				<i class="el-icon-circle-plus-outline"></i>
			</span>
			<span class="imageSelect-btn" @click="delSwiperImg(index)">
				<i class="el-icon-remove-outline"></i>
			</span>
		</div>
	</el-form-item>
</template>

<script>
import imageSelect from '@client/components/image-select'

export default {
	name: "attr-qk-imageSrcList",
	props: {
		imageSrcList: {
			type: Array,
			default: () => []
		}
	},
	components: {
		imageSelect
	},
	data() {
		return {
			tempValue: []
		}
	},
	created() {
		this.initData()
	},
	watch: {
		imageSrc() {
			this.initData()
		}
	},
	methods: {
		initData() {
			let list = [];
			this.imageSrcList.forEach(item => {
				list.push({ url: item })
			})
			this.tempValue = list;
		},
		getResultImageSrcList() {
			let list = [];
			for (let i = 0, len = this.tempValue.length; i < len; i++) {
				list.push(this.tempValue[i].url)
			}
			return list
		},
		change() {
			this.$emit('update:imageSrcList', this.getResultImageSrcList());
		},
		pushSwiperImg(index) {
			// return false;
			console.log("轮播结局1==", this.imageSrcList, this.tempValue);
			// this.imageSrcList.push("https://img-baofun.zhhainiao.com/market/133/2d64f9b1d09b9c519b301d4d721adc0c.jpg")
			this.tempValue.push({ url: "https://img-baofun.zhhainiao.com/market/133/2d64f9b1d09b9c519b301d4d721adc0c.jpg" })
			this.$emit('update:imageSrcList', this.tempValue);
			console.log("轮播结局2==", this.imageSrcList, this.tempValue);
		},
		delSwiperImg(index) {
			// return false;
			console.log("轮播结局3==", this.imageSrcList, this.tempValue);
			// this.imageSrcList.push("https://img-baofun.zhhainiao.com/market/133/2d64f9b1d09b9c519b301d4d721adc0c.jpg")
			this.tempValue.splice(index,1)
			this.$emit('update:imageSrcList', this.tempValue);
			console.log("轮播结局4==", this.imageSrcList, this.tempValue);
		},
	}
}
</script>

<style scoped>

</style>
