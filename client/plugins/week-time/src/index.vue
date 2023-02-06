<!--test.vue-->
<template>
	<div class="qk-week-time">
		{{ weekTime }}
	</div>
</template>

<script>
export default {
	name: 'QkWeekTime',
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
		runMarquee() {
			this.interFuns = setInterval(() => {
				this.weekTime == this.formatTime() ? '' : this.weekTime = this.formatTime()
			}, 60000); //周期
		},
		/**
			 * @param {week} 
			 */
		formatTime() {
				const date = new Date()
				let a = new Array("日", "一", "二", "三", "四", "五", "六");
				let week = new Date()
				let lastWeek = week.getDay()
				let str = this.weekType + a[lastWeek];
				return str
		}
	}
}
</script>

<style lang="scss" scoped>

</style>
