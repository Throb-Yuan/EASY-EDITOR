<template>
	<el-form-item label="图片列表：">
		<div v-for="(item, index) in tempValue" :key="index" @drop="drop($event,item)" @dragover="allowDrop($event,item)">
			<imageSelect :url.sync="item.urls" @change="change" />
			<el-form-item label="本地路径：">
				<el-input type="textarea" :rows="2" placeholder="请输入图片本地路径" v-model="item.localPath" @change="change">
				</el-input>
			</el-form-item>
			<el-form-item label="资源主键：">
				<el-input type="text" placeholder="请输入资源主键" v-model="item.androidId" @change="change">
				</el-input>
			</el-form-item>
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
const defaultEle = {
	urls: 'https://img-baofun.zhhainiao.com/market/133/2d64f9b1d09b9c519b301d4d721adc0c.jpg',
	localPath: '',
	androidId: ''
}
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
				// list.push({ url: item })
				list.push(item)
			})
			this.tempValue = list;
		},
		getResultImageSrcList() {
			let list = [];
			for (let i = 0, len = this.tempValue.length; i < len; i++) {
				list.push(this.tempValue[i])
			}
			return list
		},
		/**
		* 调用父组件方法传值
	 	*/
		change() {
			this.$emit('update:imageSrcList', this.getResultImageSrcList());
		},
		/**
		* 新增轮播项
	 	* @param index
	 	*/
		pushSwiperImg(index) {
			this.tempValue.push(defaultEle)
			this.$emit('update:imageSrcList', this.tempValue);
		},
		/**
		* 删除轮播项
	 	* @param index 需删除的下标
	 	*/
		delSwiperImg(index) {
			this.tempValue.splice(index, 1)
			this.$emit('update:imageSrcList', this.tempValue);
		},
		/**
 		* 资源列表拖拽联动，将对应图片数据覆盖至拖拽的节点数据
 		* @param ev 承载node节点数据
 		*/
		 allowDrop(ev) {
			// console.log("allowDrop函数移动时", ev);
			ev.preventDefault();
		},
		drop(ev,item) {
			// nodeData：获取拖拽节点数据信息
			let nodeStr = ev.dataTransfer.getData("node")
			let nodeData = JSON.parse(nodeStr)
			// 为图片则更改当前轮播项数据
			if(nodeData.fileType !="I"){
				this.$message.warning('请选择图片类型拖入覆盖');
				return false
			}
			item.urls = nodeData.fileUrl
			item.localPath = nodeData.filePath
			item.androidId = nodeData.resourceId
			ev.preventDefault();
		},
	}
}
</script>

<style scoped>

</style>
