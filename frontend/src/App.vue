<template>
	<div class="app-main">
		<table id="cityTable" class="city-table hover">
			<thead>
				<tr>
					<th>city</th>
					<th>state</th>
					<th>Country</th>
					<th>Lat/Lon</th>
				</tr>
			</thead>
		</table>

		<div v-if="selectedWeather" class="weather-popup">
			<div class="weather-content">
				<div class="title">Weather for<br />{{ selectedCity['city'] }}, {{ selectedCity['state'] }}, {{ selectedCity['country'] }}</div>
				<div>({{ selectedCity['latlong'] }})</div><br>
				<div class="title">Forecasted at<br/>{{ selectedWeather['datetime'] }}</div><br>
				<div class="temperature">
					<span class="value">{{ (selectedWeather['temp'][isMetric ? 'c' : 'f']).toFixed(2) }}</span>
					<span>{{ isMetric ? '℃' : '℉' }}</span>
				</div>
				<div class="description">
					<div>{{ selectedWeather['description'] }}</div>
					<img :src="selectedWeather['icon']" alt="" height="30" width="30">
				</div><br>
				<div>
					<div class="label">Feels Like</div>
					<span class="value">{{ (selectedWeather['feelslike'][isMetric ? 'c' : 'f']).toFixed(2) }}</span>
					<span>{{ isMetric ? '℃' : '℉' }}</span>
				</div><br>
				<div>
					<div class="label">Visibility</div>
					<span>{{ (selectedWeather['visibility'][isMetric ? 'km' : 'mp']).toFixed(2) }} {{ isMetric ? 'km' : 'mi' }}</span>
				</div><br>
				<div>
					<div class="label">Wind Speed</div>
					<span>{{ (selectedWeather['windspeed'][isMetric ? 'kmh' : 'mph']).toFixed(2) }} {{ isMetric ? 'kmh' : 'mph' }}</span>
				</div><br>

				<div class="close-popup" @click="selectedWeather = null">X</div>
				<div class="units">
					Unit : <span @click="isMetric = !isMetric">{{ isMetric ? 'Metric' : 'Imperial' }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
/* eslint-disable */
export default {
	components: {},
	data: function () {
		return {
			table: null,
			selectedCity: null,
			selectedWeather: null,
			isMetric: true
		};
	},
	computed: {
	},
	props: {},
	methods: {},
	mounted() {
		this.table = $("#cityTable").DataTable({
      ajax: {
        url: 'http://localhost:3000/cities',
        dataSrc: 'result'
      },
      columns : [
        { data : 'city' },
        { data : 'state' },
        { data : 'country' },
        { data : 'latlong' }
      ],
      oLanguage: {
        sSearch: 'Search City'
      },
      processing: true,
      serverSide: true,
			bLengthChange: false
		});

		$('#cityTable tbody').on('click', 'tr', async (e) => {
			let row = e.target.parentNode;
			this.selectedCity = this.table.row(row).data();
			console.log(this.selectedCity);
			this.selectedWeather = (await this.$axios.post('/weather', {
				time: new Date().getTime(),
				latlng: this.selectedCity['latlong']
			})).data;
			console.log(this.selectedWeather);
		});
	},
	watch: {},
};
</script>

<style lang="scss" scoped>
.app-main {
  > .city-table {
    border: 1px solid black;
  }

	> .weather-popup {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(128,128,128,0.5);
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;

		> .weather-content {
			background-color: white;
			border-radius: 10px;
			width: 90%;
			height: 75%;
			max-width: 500px;
			padding: 10px;
			display: flex;
			flex-direction: column;
			align-items: center;
			text-align: center;
			position: relative;
			overflow: auto;

			> .title {
				font-size: 1.5em;
			}

			> .temperature {
				display: flex;
				align-items: flex-start;

				> .value {
					font-size: 3em;
				}
			}

			> .description {
				display: flex;
				align-items: center;

				> img {
					background-color: rgba(128,128,128,0.3);
				}

				> * {
					margin: 5px;
				}
			}

			> div > .label {
				font-weight: bold;
				font-size: 1.2em;
				margin-bottom: 5px;
			}

			> .close-popup {
				position: absolute;
				right: 10px;
				top: 10px;
				background-color: red;
				color: white;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 30px;
				width: 30px;
				border-radius: 100%;
				cursor: pointer;
			}

			> .units {
				position: absolute;
				top: 10px;
				left: 10px;
				cursor: pointer;
			}
		}
	}
}
</style>