/** Config */
const express = require('express');
const { spawn } = require('child_process');
const app = express();
const port = 8080;
app.set('view engine', 'ejs');
app.use(express.static('public'));

/** DHT reader */
const dht_reader = spawn('python3', ['./dht_reader.py'], { stdio: ['inherit', 'pipe', 'inherit', 'ipc'] });
let sensorData = { temperature: 'N/A', humidity: 'N/A' };

dht_reader.stdout.on('data', (data) => {
	sensorData = JSON.parse(data);
});

/** Routes */
app.get('/', (req, res) => {
	res.render('index');
});

app.get('/temperature', (req, res) => {
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	setInterval(() => {
		res.write(`data: ${JSON.stringify(sensorData)}\n\n`);
	}, 1000);
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
});