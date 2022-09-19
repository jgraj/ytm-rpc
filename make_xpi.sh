#!/bin/bash
mkdir extension-xpi
cp extension-chrome/* extension-xpi
cp extension-firefox/manifest.json extension-xpi/manifest.json
cd extension-xpi
7z a ../extension-firefox/extension.xpi *
cd ..
rm -rf extension-xpi