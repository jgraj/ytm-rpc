chrome.tabs.onUpdated.addListener(tabID => {
	chrome.tabs.sendMessage(tabID, { message: '' });
});

chrome.runtime.onMessage.addListener(req => {
	fetch('http://localhost:3003/update', {
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(req),
		method: 'POST',
	});
});