const find = selector => document.querySelector(selector);
const findText = selector => find(selector)?.innerText;

const update = () => {
	if (find('ytmusic-app-layout[player-visible_]')) {
		let image = find('#song-image img');
		if (image && image.src.startsWith('https')) {
			image = image.src;
		} else {
			image = `https://i.ytimg.com/vi/${new URLSearchParams(location.search).get('v')}/hqdefault.jpg`;
		}
		chrome.runtime.sendMessage({
			title: findText('.ytmusic-player-bar.title'),
			subtitle: findText('.ytmusic-player-bar.subtitle')?.replaceAll('\n', ''),
			time: findText('.ytmusic-player-bar.time-info')?.replaceAll(' ', ''),
			image: image,
			url: location.href,
		});
	}
}

let loop;

chrome.runtime.onMessage.addListener(() => {
	if (!loop) {
		loop = setInterval(update, 100);
	}
});