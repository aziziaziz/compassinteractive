<template>
	<div class="app-main">
		<table id="cityTable" class="city-table">
			<thead>
				<tr>
					<th>city</th>
					<th>state</th>
					<th>Country</th>
					<th>Lat/Lon</th>
				</tr>
			</thead>
		</table>
	</div>
</template>

<script>
/* eslint-disable */
export default {
	components: {},
	data: function () {
		return {
		};
	},
	props: {},
	methods: {},
	mounted() {
		$("#cityTable").DataTable({
      // data: this.testData,
      // ajax: 'http://localhost:3000/cities?page=100',
      // dataSrc: 'result',
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
		});
	},
	watch: {},
};
</script>

<style lang="scss" scoped>
.app-main {
  .city-table {
    border: 1px solid black;
  }
}
</style>