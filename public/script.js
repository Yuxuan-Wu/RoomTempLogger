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
	var currentView = document.getElementById("currentTempView");
	var historyView = document.getElementById("historyView");
	if (currentView.style.display === "none") {
		currentView.style.display = "block";
		historyView.style.display = "none";
	} else {
		currentView.style.display = "none";
		historyView.style.display = "block";
	}
}

// Chart.js code will go here for the history view
