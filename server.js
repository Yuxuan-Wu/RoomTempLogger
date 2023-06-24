/** Config */
const express = require('express');
const { spawn } = require('child_process');
const app = express();
const port = 8080;
app.set('view engine', 'ejs');

/** Temperature reader */
let temperature = 'N/A';

const python = spawn('python3', ['./temp_reader.py'], { stdio: ['inherit', 'pipe', 'inherit', 'ipc'] });
python.stdout.on('data', (data) => {
	temperature = data.toString().trim();
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
		res.write(`data: ${temperature}\n\n`);
	}, 1000);
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
});