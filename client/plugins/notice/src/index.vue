<template>
	<div class="qk-notice">
		<div class="advert-top" v-if="noticeText">
			<!-- <div class="ico-horn">
				<img src="https://t7.baidu.com/it/u=2222012502,2910942051&fm=193" alt="">
			</div> -->
			<!-- 滚动文字区域 -->
			<div class="marquee-wrap" :id="sportType">
				<ul class="marquee-box" :id="'marquee-box' + uuid">
					<li class="marquee-list" v-for="i in 8" :key="i" v-html="noticeText"
						:id="i == 1 ? 'marquee' + uuid : ''">
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
import { createUUID } from '../../../../common/uitls'
export default {
	name: 'QkNotice', // 这个名字很重要，它就是未来的标签名
	props: {
		noticeText: {
			type: String,
			default: '在那些插着稻草人的田野里，我急促的甚至奔跑起来，风吹拂金黄颜色的大地，让我带走这里成熟的消息。'
		},
		speed: {
			type: Number,
			default: 20
		},
		sportType: {
			type: String,
			default: 'left'
		}
	},
	data() {
		return {
			interFuns: null,
			uuid: ''
		};
	},
	watch: {
		speed() {
			/**
			 * 速度改变，重置定时器使用新速度播放
			 */
			console.log("speed", this.speed);
			clearInterval(this.interFuns)
			setTimeout(() => {
				this.runMarquee();
			}, 500);
		},
		sportType() {
			/**
			 * 方向改变，重置定时器使用新速度播放
			 */
			console.log("sportType", this.sportType);
			clearInterval(this.interFuns)
			setTimeout(() => {
				this.runMarquee();
			}, 500);
		},
	},
	mounted: function () {
		this.creatId()
		// 延时滚动
		setTimeout(() => {
			this.runMarquee();
		}, 1000);
	},
	methods: {
		/**
		 * 创建ID标识，这样就支持可同时播放多个公告栏
		 */
		creatId() {
			this.uuid = createUUID()
		},
		runMarquee() {
			if (this.sportType == "top" || this.sportType == "bottom") {
				// 获取文字 计算后宽度
				let height = document.getElementById(`marquee${this.uuid}`).getBoundingClientRect().height,
					marquee = document.getElementById(`marquee-box${this.uuid}`),
					disx = 0; // 位移距离
				//设置位移
				this.interFuns = setInterval(() => {
					disx--; // disx-=1; 滚动步长
					if (-disx >= height * 5) {
						disx = 0; // 如果位移超过文字宽度，则回到起点  marquee-list的margin值
					}
					// marquee.style.transform = 'translateX(' + disx + 'px)'
					marquee.style.left = '10px'
					marquee.style.width = "100%"
					this.sportType == "top" ? marquee.style.top = disx + "px" : marquee.style.top = -disx + "px"
				}, this.speed); //滚动速度
			} else {
				// 获取文字 计算后宽度
				let width = document.getElementById(`marquee${this.uuid}`).getBoundingClientRect().width,
					marquee = document.getElementById(`marquee-box${this.uuid}`),
					disx = 0; // 位移距离
				if(this.sportType == 'right') disx = width*5+100
				//设置位移
				this.interFuns = setInterval(() => {
					disx--; // disx-=1; 滚动步长
					// console.log("disx==",disx);
					if (-disx >= width * 5 ) {
						disx = 0; // 如果位移超过文字宽度，则回到起点  marquee-list的margin值
					}
					if (this.sportType == 'right' && disx == 0 ) {
						disx = width*5+100; // 如果位移超过文字宽度，则回到起点  marquee-list的margin值
					}
					marquee.style.top = '50%'
					// marquee.style.transform = 'translateX(' + disx + 'px)'
					this.sportType == "left" ? marquee.style.left = disx + "px" : marquee.style.left = -disx + "px"
				}, this.speed); //滚动速度
			}

		}

	}
};

</script>
<style lang="scss" scoped>
.qk-notice {
	width: 100%;
	height: 100%;
}

body,
div,
html,
img,
li,
ul {
	margin: 0;
	padding: 0;
	border: 0;
}

li {
	list-style: none;
}

.advert-top {
	position: relative;
	display: flex;
	width: 100%;
	// height: 30px;
	height: 100%;
	top: 50%;
	transform: translateY(-50%);
	// font-size: 24px;
	align-items: center;
}

.ico-horn {
	display: flex;
	margin-right: 10px;
	width: 14px;
	height: 14px;
	justify-content: center;
	align-items: center;
}

.ico-horn>img {
	width: 30px;
	height: 30px;
}

/* 以下代码与滚动相关 */
.marquee-wrap {
	position: relative;
	display: flex;
	overflow: hidden;
	width: 100%;
	height: 100%;
	// margin-left: 8px;

}

.marquee-box {
	position: absolute;
	top: 50%;
	display: flex;
	white-space: nowrap;
	transform: translateY(-50%);
}

.marquee-list {
	margin-right: 100px;
}

.marquee-list span {
	// padding: 0 0.04rem;
	// color: #ffe17b;
	// font-weight: 700;
}

#top {
	.marquee-box {
		flex-direction: column;
		white-space: normal;
		text-align: left;
	}
}

#bottom {
	.marquee-box {
		flex-direction: column;
		white-space: normal;
		text-align: left;
	}
}
</style>