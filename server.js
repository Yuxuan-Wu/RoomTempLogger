/** Config */
const express = require('express');
const { spawn } = require('child_process');
const app = express();
const port = 8000;
app.set('view engine', 'ejs');
app.use(express.static('public'));

/** Database */
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./sensorData.db', (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to the sensorData database.');
});

db.run('CREATE TABLE IF NOT EXISTS data(id INTEGER PRIMARY KEY AUTOINCREMENT, temperature REAL, humidity REAL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)', (err) => {
	if (err) {
		console.error(err.message);
	}
});

/** DHT reader */
const dht_reader = spawn('python3', ['./dht_reader.py'], { stdio: ['inherit', 'pipe', 'inherit', 'ipc'] });
let sensorData = { temperature: 'N/A', humidity: 'N/A' };

dht_reader.stdout.on('data', (data) => {
	sensorData = JSON.parse(data);

	// Insert a row of data into SQLite
	db.run(`INSERT INTO data(temperature, humidity) VALUES(?, ?)`, [sensorData.temperature, sensorData.humidity], 
		function (err) {
			if (err) {
				return console.log(err.message);
			}
			console.log(`A row has been inserted with rowid ${this.lastID}`);
		}
	);
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

app.get('/history', (req, res) => {
	let query = `SELECT temperature, humidity, timestamp FROM data ORDER BY timestamp DESC`;
	db.all(query, [], (err, rows) => {
		if (err) {
			res.status(400).send(err.message);
		}
		else {
			res.json(rows);
		}
	});
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
});

process.on('SIGINT', () => {
	console.log('Received SIGINT. Shutting down gracefully...');
	db.close((err) => {
		if (err) {
			console.error(err.message);
		}
		console.log('Closed the database connection.');
	});
	process.exit(0);
});