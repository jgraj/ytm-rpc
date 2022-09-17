const PORT = 3003;
const APP_ID = '1020451441393029231';

const express = require('express');
const cors = require('cors');
const discord = require('discord-rpc');

const app = express();
app.use(express.json());
app.use(cors());

let lastTime;

app.post('/update', (req, res) => {
	const data = req.body;

	console.log(data);

	if (!data.title || !data.subtitle) {
		console.error('Invalid song data received.')
		res.sendStatus(400);
		return;
	}

	if (!connected) {
		return;
	}

	const playing = lastTime != data.time;

	rpc.setActivity({
		state: data.subtitle,
		details: data.title + (data.time ? ` • ${data.time}` : ''),
		largeImageKey: 'logo',
		largeImageText: 'ytm-rpc',
		smallImageKey: lastTime ? (playing ? 'playing' : 'paused') : undefined,
		smallImageText: playing ? 'Playing' : 'Paused',
		buttons: data.url ? [{
			label: 'Play',
			url: data.url,
		}] : [],
	});

	lastTime = data.time;

	res.sendStatus(200);
});

let rpc;
let connected = false;

const connectToDiscord = () => {
	rpc = new discord.Client({ transport: 'ipc' });

	rpc.login({ clientId: APP_ID }).then(() => {
		connected = true;
		console.log('Connected to Discord.');
	}).catch(() => {
		console.log('Could not connect to Discord. Retrying in 5 seconds...');
		setTimeout(connectToDiscord, 5000);
	});

	rpc.on('disconnected', () => {
		connected = false;
		console.log('Disconnected from Discord...');
		connectToDiscord();
	});
};

process.stdout.write('Starting ytm-rpc...');
app.listen(PORT, () => console.log(' ytm-rpc is ready.'));
connectToDiscord();