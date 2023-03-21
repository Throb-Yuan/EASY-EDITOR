<!--test.vue-->
<template>
	<div class="qk-week-time">
		{{ weekTime }}
	</div>
</template>

<script>
export default {
	name: 'QkWeekTime',//星期
	props: {
		weekType: {
			type: String,
			default: '星期'
		}
	},
	data() {
		return {
			weekTime: '',
			interFuns: null
		}
	},
	watch: {
		weekType() {
			this.weekTime = this.formatTime()
		},
	},
	created() {
		this.weekTime = this.formatTime()
		this.runMarquee()

	},
	methods: {
		/**	每隔一分钟重新获取最新日期
		 * @param {week} 
		 */
		runMarquee() {
			this.interFuns = setInterval(() => {
				this.weekTime == this.formatTime() ? '' : this.weekTime = this.formatTime()
			}, 60000); //周期
		},
		/**	匹配weekType展示类型，周一||星期一||Mon
		 * @param {week} 
		 */
		formatTime() {
			let a = new Array("日", "一", "二", "三", "四", "五", "六");
			let b = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
			let c = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
			let week = new Date()
			let lastWeek = week.getDay()
			let str = ""
			if (this.weekType == "周" || this.weekType == "星期") {
				str = this.weekType + a[lastWeek];
			} else {
				this.weekType == "Mon" ? str = b[lastWeek] : str = c[lastWeek]
			}
			return str
		}
	},
	// 页面销毁时销毁定时器任务
	beforeDestroy() {
		if (this.interFuns) clearTimeout(this.interFuns)
	}
}
</script>

<style lang="scss" scoped></style>
