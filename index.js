const CONFIG = JSON.parse(require('fs').readFileSync('config.json'));

const express = require('express');
const cors = require('cors');
const discord = require('discord-rpc');

const app = express();
app.use(express.json());
app.use(cors());

let lastTitle;
let lastTime;
let timeout;
let cleared;

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

	const subtitle = data.subtitle.split(' • ');
	const author = subtitle[0];

	if (lastTitle != data.title) {
		console.log(`🎶 Now playing "${data.title}" by "${author}".`);
		timeout = 0;
	}

	const playing = lastTime != data.time;

	if (playing) {
		timeout = Date.now();
		cleared = false;
	} else {
		const time = (Date.now() - timeout) / 1000;
		
		if (CONFIG.IDLE_TIMEOUT_SECONDS > 0) {
			if (!cleared && time >= CONFIG.IDLE_TIMEOUT_SECONDS) {
				console.log('😴 Was idle for 60 seconds, clearing activity.');
				rpc.clearActivity();
				cleared = true;
			}

			if (cleared) {
				return;
			}
		}
	}

	rpc.setActivity({
		state: subtitle.slice(1).join(' • '),
		details: `${data.title} • ${author}`,
		largeImageKey: 'logo',
		largeImageText: 'ytm-rpc',
		smallImageKey: lastTime ? (playing ? 'playing' : 'paused') : undefined,
		smallImageText: (playing ? 'Playing' : 'Paused') + (data.time ? ` • ${data.time}` : ''),
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

	rpc.login({ clientId: CONFIG.DISCORD_APP_ID }).then(() => {
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
app.listen(CONFIG.LOCAL_PORT, () => {
	console.log(' ✅.');
	connectToDiscord();
});