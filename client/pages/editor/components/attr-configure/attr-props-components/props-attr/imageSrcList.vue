<template>
	<div>
		<el-form-item label="切换时间(毫秒)：" style="margin-bottom:0">
			<el-input-number size="mini" v-model="tempInterval" controls-position="right" />
		</el-form-item>
		<el-form-item label="轮播指针：">
			<el-switch v-model="tempIndicator">
			</el-switch>
		</el-form-item>
		<div class="tip-drop" style="padding: 0 0 10px 0;">可将媒体资源拖拽至下方替换<span @click="changeSide"> 查看资源库</span></div>
		<el-form-item label="图片列表：">
			<div v-for="(item, index) in tempValue" :key="index" @drop="drop($event, item)"
				@dragover="allowDrop($event, item)" @dragenter="dragenter(item)">
				<!-- <imageSelect :url.sync="item.urls" @change="change" />
			<el-form-item label="本地路径：">
				<el-input type="textarea" :rows="2" placeholder="请输入图片本地路径" v-model="item.localPath" @change="change">
				</el-input>
			</el-form-item>
			<el-form-item label="资源主键：">
				<el-input type="text" placeholder="请输入资源主键" v-model="item.androidId" @change="change">
				</el-input> 
			</el-form-item> -->
				<div :class="item.activeCss ? 'drag-info-box active-css':'drag-info-box'" style="line-height: 1;">
					<img :src="item.urls" alt="">
					<div class="media-indo">
						<div class="media-name">{{ item.fileName }}</div>
						<div class="media-size">{{ item.fileSize }}</div>
					</div>
				</div>
				<div class="edit-addsub">
					<el-tooltip class="item" effect="dark" content="在此处插入图片" placement="top-start">
						<span class="imageSelect-btn" @click="pushSwiperImg(index)">
							<i class="el-icon-circle-plus-outline"></i>
						</span>
					</el-tooltip>
					<el-tooltip class="item" effect="dark" content="删除此图片" placement="top-start">
						<span class="imageSelect-btn" style="margin-left: 10px;" @click="delSwiperImg(index)">
							<i class="el-icon-remove-outline"></i>
						</span>
					</el-tooltip>

				</div>
			</div>
		</el-form-item>

	</div>
</template>

<script>
const defaultEle = {
	urls: 'http://192.168.101.250:2501/file/download/I30B65E69B78D44CEB2D45AB9A78A49AF',
	localPath: '../../resource/86ad8aa90f71d54c1a9dbce8d941eae5.jpg',
	androidId: 'I30B65E69B78D44CEB2D45AB9A78A49AF',
	fileName: "hbfj3.jpg",
	fileSize: "56.39KB",
	activeCss:false
}
export default {
	name: "attr-qk-imageSrcList",
	props: {
		imageSrcList: {
			type: Array,
			default: () => []
		},
		interval: {
			type: Number,
			default: 2500
		},
		indicator: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {
			tempValue: [],
			tempInterval: 0,
			tempIndicator:false
		}
	},
	created() {
		this.initData()
		this.tempInterval = this.interval
	},
	watch: {
		imageSrc() {
			this.initData()
		},
		interval(val) {
			this.tempInterval = val;
		},
		indicator(val) {
			this.tempIndicator = val;
		},
		tempInterval() {
			this.$emit('update:interval', this.tempInterval);
		},
		tempIndicator() {
			this.$emit('update:indicator', this.tempIndicator);
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
			let deepDef = JSON.parse(JSON.stringify(defaultEle))
			// this.tempValue.push(deepDef)
			this.tempValue.splice(index + 1, 0, deepDef)
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
		drop(ev, item) {
			// nodeData：获取拖拽节点数据信息
			let nodeStr = ev.dataTransfer.getData("node")
			let nodeData = JSON.parse(nodeStr)
			// 为图片则更改当前轮播项数据
			!item.activeCss ?'' : item.activeCss = false
			if (nodeData.fileType != "I") {
				this.$message.warning('请选择图片类型拖入覆盖');
				return false
			}
			item.urls = nodeData.fileUrl
			item.localPath = nodeData.filePath
			item.androidId = nodeData.resourceId
			item.fileSize = this.$mUtils.transFileSize(nodeData.fileSize)
			item.fileName = nodeData.resourceName
			ev.preventDefault();
		},
		dragenter(item){
			item.activeCss ? '' : item.activeCss = true
		},
		changeSide(){
			let nowSide = this.$store.state.editor.activeSideBar
			if(nowSide!="resourceLibs") this.$store.commit('updateSideBar',"resourceLibs")
		}
	}
}
</script>

<style scoped>
.imageSelect-btn {
	font-size: 18px;
	cursor: pointer;
}

.edit-addsub {
	line-height: 1;
}
</style>
