const find = selector => document.querySelector(selector);
const findText = selector => find(selector)?.innerText;

const update = () => {
	if (find('ytmusic-app-layout[player-visible_]')) {
		chrome.runtime.sendMessage({
			title: findText('.ytmusic-player-bar.title'),
			subtitle: findText('.ytmusic-player-bar.subtitle')?.replaceAll('\n', ''),
			time: findText('.ytmusic-player-bar.time-info')?.replaceAll(' ', ''),
			url: find('.ytp-title-link').href,
		});
	}
}

let loop;

chrome.runtime.onMessage.addListener(() => {
	if (!loop) {
		loop = setInterval(update, 100);
	}
});