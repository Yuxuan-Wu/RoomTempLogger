// Load the Visualization API and the corechart package.
google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawCharts);

realtimeTemp = document.getElementById('temperature');
realtimeHumidity = document.getElementById('humidity');

var source = new EventSource('/temperature');
source.onmessage = function (event) {
	var sensorData = JSON.parse(event.data);
	var temp = sensorData.temperature;
	var humidity = sensorData.humidity;

	realtimeTemp.innerHTML = temp;
	realtimeHumidity.innerHTML = humidity;

	if (temp < 20) {
		realtimeTemp.style.color = 'blue';
	} else if (temp > 30) {
		realtimeTemp.style.color = 'red';
	} else {
		realtimeTemp.style.color = 'orange';
	}
};


function toggleView() {
	var currentView = document.getElementById("currentDataView");
	var historyView = document.getElementById("historyView");
	if (currentView.style.display === "none") {
		currentView.style.display = "block";
		historyView.style.display = "none";
	} else {
		currentView.style.display = "none";
		historyView.style.display = "block";
		drawCharts();
	}
}

function drawCharts() {
	fetch('/history')
		.then(response => response.json())
		.then(data => {
			var tempDataTable = new google.visualization.DataTable();
			tempDataTable.addColumn('datetime', 'Time');
			tempDataTable.addColumn('number', 'Temperature (°C)');

			var humidityDataTable = new google.visualization.DataTable();
			humidityDataTable.addColumn('datetime', 'Time');
			humidityDataTable.addColumn('number', 'Humidity (%)');

			data.forEach(item => {
				// Convert timestamp to local time
				let localTime = new Date(item.timestamp);
				localTime.setMinutes(localTime.getMinutes() - localTime.getTimezoneOffset());

				tempDataTable.addRow([localTime, item.temperature]);
				humidityDataTable.addRow([localTime, item.humidity]);
			});

			// Set chart options
			var tempOptions = {
				title: 'Temperature Over Time',
				curveType: 'function',
				legend: { position: 'bottom' },
				height: 400,
				colors: ['#f1c40f']
			};

			var humidityOptions = {
				title: 'Humidity Over Time',
				curveType: 'function',
				legend: { position: 'bottom' },
				height: 400,
				colors: ['#3498db']
			};

			var tempChart = new google.visualization.LineChart(document.getElementById('temperatureView'));
			tempChart.draw(tempDataTable, tempOptions);

			var humidityChart = new google.visualization.LineChart(document.getElementById('humidityView'));
			humidityChart.draw(humidityDataTable, humidityOptions);
	});
}
