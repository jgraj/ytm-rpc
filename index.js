const PORT = 3003;
const APP_ID = '1020451441393029231';

const express = require('express');
const cors = require('cors');
const discord = require('discord-rpc');

const app = express();
app.use(express.json());
app.use(cors());

let lastTitle;
let lastTime;
let timeout = 0;

app.post('/update', (req, res) => {
	const data = req.body;

	if (!data.title || !data.subtitle) {
		console.error('Invalid song data received. 😕')
		res.sendStatus(400);
		return;
	} else {
		res.sendStatus(200);
	}

	if (!connected) {
		return;
	}

	if (lastTitle != data.title) {
		console.log(`🎶 Now playing "${data.title}".`);
		timeout = 0;
	}

	const playing = lastTime != data.time;
	if (!playing) {
		if (++timeout > 60) {
			console.log('😴 Was idle for 60 seconds, clearing activity.');
			rpc.clearActivity();
			return;
		}
	} else {
		timeout = 0;
	}

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

	lastTitle = data.title;
	lastTime = data.time;
});

let rpc;
let connected = false;
let retrying;

const connectToDiscord = () => {
	if (retrying) {
		return;
	}

	rpc = new discord.Client({ transport: 'ipc' });
	process.stdout.write('Connecting to Discord...');

	rpc.login({ clientId: APP_ID }).then(() => {
		connected = true;
		console.log(' ✅.');
	}).catch(() => {
		console.log(' ❎. Retrying in 5 seconds... ⌛');

		retrying = setTimeout(() => {
			retrying = false;
			connectToDiscord();
		}, 5000);
	});

	rpc.on('disconnected', () => {
		connected = false;
		console.log('Disconnected from Discord... 🤨');
		
		connectToDiscord();
	});
};

process.stdout.write('Starting ytm-rpc...');
app.listen(PORT, () => {
	console.log(' ✅.');
	connectToDiscord();
});