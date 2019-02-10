#!/bin/bash
set -e

ver=1.5.8

dir=ogvjs-$ver
zip=$dir.zip
url=https://github.com/brion/ogv.js/releases/download/$ver/$zip

[ -e $zip ] || {
	wget $url ||
	curl -O $url
}

[ -e $dir ] ||
	unzip $zip

echo
grep -qE $dir/ the.js &&
	echo okay ||
	echo WARNING: incorrect version of ogv.js inside the.js
