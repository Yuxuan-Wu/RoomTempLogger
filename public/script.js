var source = new EventSource('/temperature');
source.onmessage = function (event) {
	var temp = event.data;
	document.getElementById('temperature').innerHTML = temp;
	if (temp < 20) {
		document.getElementById('temperature').style.color = 'blue';
	} else if (temp > 30) {
		document.getElementById('temperature').style.color = 'red';
	} else {
		document.getElementById('temperature').style.color = 'orange';
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
