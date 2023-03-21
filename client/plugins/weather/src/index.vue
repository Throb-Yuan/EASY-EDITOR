<!--test.vue-->
<template>
	<div class="qk-weather" v-show="requestOk">
		<div class="easy-weather flexs" :style="{transform:'scale('+ weatherScale+')'}" v-if="weatherType == 'easy'">
			<div class="left_du flexs">
				<div class="bignow">{{ weatherData.tempMin }}~{{ weatherData.tempMax }}℃</div>
				<div class="maxminarea flexs">
					<div class="areas">{{ weatherArea.cityZh }}</div>
				</div>
			</div>
			<div class="right_view flexs">
				<span :class="'qi-'+ weatherData.iconDay+'-fill'" style="font-size: 40px;"></span>
				<!-- <img src="../../../common/images/weather/icon_xiaoyu.png" alt=""> -->
				<div>{{ weatherData.textDay }}</div>
			</div>
		</div>
		<div class="weather-in flexs" v-else>
			<span :class="'qi-'+ weatherData.iconDay+'-fill'" style="font-size: 60px;"></span>
			<div class="right_tex flexs">
				<div class="wendu">{{ weatherData.tempMin }}~{{ weatherData.tempMax }}℃</div>
				<div class="areas">{{ weatherArea.cityZh }}</div>
			</div>
		</div>
	</div>
</template>

<script>
import { todayWeather } from '../../../api/modules/eleBus'
export default {
	name: 'QkWeather',//天气
	props: {
		weatherArea: {
			type: Object,
			default: () => {
				return {
					cityZh: '北京市',
					locationId: '101010100',
				}
			}
		},
		weatherType: {
			type: String,
			default: 'easy'
		},
		weatherScale: {
			type: Number,
			default:1
		}
	},
	data() {
		return {
			weatherData: {
				tempMax: '26',
				tempMin: '18',
				textDay: '多云 ',
				iconDay: '101'
			},
			requestOk:false
		}
	},
	created(){
	},
	mounted() {
		/**
		 * 检测是否为终端环境，避免资源浪费，实际终端才获取真实天气数据
		 */
		if(!window.location.href.includes('http')){
			todayWeather(this.weatherArea.locationId).then(response => {
				console.log("weather In request",response);
				if(!response.data&&!response.data.textDay) return false
				this.weatherData =  response.data
				this.requestOk = true
			});
		}else{
			this.requestOk = true
		}
	}
}
</script>

<style lang="scss" scoped>
.weather-in {
	justify-content: space-around;

	img {
		width: 40%;
	}

	.right_tex {
		justify-content: center;
		align-items: flex-start;
		flex-direction: column;
		font-size: 120%;
		transform: translateY(15%);
	}
}

.flexs {
	display: flex;
	align-items: center;
}

.easy-weather {
	width: 100%;
	height: 100%;
	justify-content: center;

	.left_du {
		width: 60%;
		height: 100%;
		flex-direction: column;
		justify-content: end;

		.bignow {
			font-size: 24px;
		}

		.maxminarea {
			font-size: 70%;

			.areas {
				margin-left: 12px;
			}
		}
	}

	.right_view {
		width: 50%;
		height: 100%;
		flex-direction: column;
		justify-content: end;
		transform: translateX(-10%);

		img {
			width: 60%;
			// height: 40%;
		}

		div {
			font-size: 70%;
		}
	}
}
</style>
