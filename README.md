# Discord Rich Presence for YouTube Music

Display currently playing song from YouTube Music on your Discord profile.

## Dependencies

* `npm`
* `node`

## Installation

```sh
git clone https://github.com/jgraj/ytm-rpc
cd ytm-rpc
npm install
```

### In Chrome
1. Go to `chrome://extensions`
2. Toggle `Developer mode`
3. Click `Load unpacked`
4. Select `ytm-rpc/extension-chrome`

### In Firefox
Will only work on Firefox Developer or Nightly because it's unsigned.

1. Go to `about:config`
2. Set `xpinstall.signatures.required` to `false`
3. Go to `about:addons`
4. Click `Install Add-on From File...`
5. Select `ytm-rpc/extension-firefox/extension.xpi`

## Running

```sh
npm start
```