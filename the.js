// https://github.com/9001/nfi-audio
// ed <irc.rizon.net> MIT-licensed


// error handler for mobile devices
function hcroak(msg) {
	document.body.innerHTML = msg;
	window.onerror = undefined;
	throw 'fatal_err';
}
function croak(msg) {
	document.body.textContent = msg;
	window.onerror = undefined;
	throw msg;
}
function esc(txt) {
	return txt.replace(/[&"<>]/g, function(c) {
		return {
			'&': '&amp;',
			'"': '&quot;',
			'<': '&lt;',
			'>': '&gt;'
		}[c];
	});
}
window.onerror = function(msg, url, lineNo, columnNo, error) {
	window.onerror = undefined;
	var html = ['<h1>you hit a bug!</h1><p>please screenshot this error and send me a copy arigathanks gozaimuch (ed/irc.rizon.net or ed#2644)</p><p>',
		esc(String(msg)), '</p><p>', esc(url + ' @' + lineNo + ':' + columnNo), '</p>'];
	
	if (error) {
		var find = ['desc','stack','trace'];
		for (var a = 0; a < find.length; a++)
			if (String(error[find[a]]) !== 'undefined')
				html.push('<h2>' + find[a] + '</h2>' + 
					esc(String(error[find[a]])).replace(/\n/g, '<br />\n'));
	}
	document.body.style.fontSize = '0.8em';
	hcroak(html.join('\n'));
};


// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
if (!String.prototype.endsWith) {
	String.prototype.endsWith = function(search, this_len) {
		if (this_len === undefined || this_len > this.length) {
			this_len = this.length;
		}
		return this.substring(this_len - search.length, this_len) === search;
	};
}


// https://stackoverflow.com/a/950146
function import_js(url, cb) {
	var head = document.head || document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;
	
	script.onreadystatechange = cb;
	script.onload = cb;
	
	head.appendChild(script);
}


function ebi(id) {
	return document.getElementById(id);
}


(function() {
	var css = `
#path a {
	margin: 0 0 0 -.2em;
	padding: 0 0 0 .4em;
}
/*
#path a+a, #path a+a+a+a { box-shadow: 1px 1px 1px #0f0; }
#path a, #path a+a+a { box-shadow: 1px 1px 1px #f0f inset; }
*/
#path a:after {
	content: '';
	width: 1.05em;
	height: 1.05em;
	margin: -.2em .3em -.2em -.4em;
	display: inline-block;
	border: 1px solid rgba(255,224,192,0.3);
	border-width: .05em .05em 0 0;
	transform: rotate(45deg);
	background: linear-gradient(45deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.25) 75%, rgba(0,0,0,0.35));
}
#path a:hover {
	color: #fff;
	background: linear-gradient(90deg, rgba(0,0,0,0), rgba(0,0,0,0.2), rgba(0,0,0,0));
}
#path span {
	padding-left: .2em;
}
a.play {
	color: #e70;
}
a.play.act {
	color: #af0;
}
a.dl {
	color: #5cf;
}
#blocked {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: #333;
	font-size: 2.5em;
	z-index:99;
}
#dl_overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
    background: rgba(0,0,0,0.8);
    z-index: 90;
    padding-top: 5em;
    padding-left: 1em;
}
#blk_play,
#blk_abrt {
	position: fixed;
	display: table;
	width: 80%;
}
#blk_play {
	height: 60%;
	left: 10%;
	top: 5%;
}
#blk_abrt {
	height: 25%;
	left: 10%;
	bottom: 5%;
}
#blk_play a,
#blk_abrt a {
	display: table-cell;
	vertical-align: middle;
	text-align: center;
	background: #444;
	border-radius: 2em;
}
#widget {
	position: fixed;
	font-size: 1.5em;
	left: 0;
	right: 0;
	bottom: -6em;
	height: 6em;
	width: 100%;
	transition: bottom 0.15s;
}
#widget.open {
	box-shadow: 0 0 1em rgba(0,48,64,0.2);
	bottom: 0;
}
#widgeti {
	position: relative;
	z-index: 10;
	width: 100%;
	height: 100%;
	background: #3c3c3c;
}
#wtoggle {
	position: absolute;
	top: -1em;
	right: 0;
	width: 1.2em;
	height: 1em;
	font-size: 2em;
	line-height: 1em;
	text-align: center;
	text-shadow: none;
	background: #3c3c3c;
	box-shadow: 0 0 .5em #222;
	border-radius: .3em 0 0 0;
	padding-left: .07em;
	color: #fff;
}
#barpos,
#barbuf {
	position: absolute;
	bottom: 1em;
	left: 1em;
	height: 2em;
	border-radius: 9em;
	width: calc(100% - 2em);
}
#barbuf {
	background: rgba(0,0,0,0.2);
	z-index: 21;
}
#barpos {
	box-shadow: -.03em -.03em .7em rgba(0,0,0,0.5) inset;
	z-index: 22;
}
#pctl {
	position: absolute;
	top: .5em;
	left: 1em;
}
#pctl a {
	background: rgba(0,0,0,0.1);
	display: inline-block;
	font-size: 1.25em;
	width: 1.3em;
	height: 1.2em;
	line-height: 1em;
	text-align: center;
	margin-right: .5em;
	border-radius: .3em;
	box-shadow: -.02em -.02em .3em rgba(0,0,0,0.2) inset;
}
#pvol {
	position: absolute;
	top: .7em;
	right: 1em;
	height: 1.6em;
	border-radius: 9em;
	max-width: 12em;
	width: calc(100% - 10.5em);
	background: rgba(0,0,0,0.2);
}
`;
	var head = document.head || document.getElementsByTagName('head')[0];
	var style = document.createElement('style');
	style.appendChild(document.createTextNode(css));
	head.appendChild(style);
})();


// decompose path into buttons
(function(){
	var path_dom = ebi('path');
	var nodes = path_dom.textContent.split(/\/+/);
	nodes.shift();
	nodes.pop();
	var path = '/';
	var html = [];
	for (var a = 0, aa = nodes.length; a<aa; a++) {
		// encodeURI          A-Z a-z 0-9 ; , / ? : @ & = + $ - _ . ! ~ * ' ( ) #
		// encodeURIComponent A-Z a-z 0-9                     - _ . ! ~ * ' ( )
		var esc_node = esc(nodes[a]);
		
		path += esc_node + '/';
		if (a == aa - 1)
			html.push('<span>' + esc_node + '</span>');
		else
			html.push('<a href="' + path + '">' + esc_node + '</a>');
	}
	path_dom.innerHTML = html.join('');
})();


// extract songs + add play column
var mp = (function(){
	var tracks = [];
	var files = [];
	var ret = {
		'au': null,
		'au_native': null,
		'au_ogvjs': null,
		'tracks': tracks,
		'files': files,
		'cover_url': ''
	};
	var re_audio = new RegExp(/\.(opus|ogg|m4a|aac|mp3|wav|flac)$/, 'i');
	var re_cover = new RegExp(/^(cover|folder|cd|front|back)\.(jpe?g|png|gif)$/, 'i');
	
	var hdr = document.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0].innerHTML;
	hdr = hdr.replace(/ style="width:[0-9]+%"/g, '');
	
	var html = [];
	html.push('<thead><th></th>');
	html.push(hdr);
	html.push('</thead><tbody>');
	
	var trs = document.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
	for (var a = 0, aa = trs.length; a<aa; a++) {
		var link = trs[a].getElementsByTagName('a')[0];
		var url = link.getAttribute('href');
		var fn = link.getAttribute('title');
		
		var m = re_audio.exec(fn);
		if (m) {
			var ntrack = tracks.length;
			tracks.push([url, fn]);
			files.push([url, fn]);
			
			html.push('<tr><td><a id="trk'+ntrack+'" href="#trk'+ntrack+'" class="play">play</a></td>');
		}
		else if (url.endsWith('/'))
			html.push('<tr><td style="width:2.1em">dir</td>');
		else {
			html.push('<tr><td></td>');
			files.push([url, fn]);
		}
		
		html.push(trs[a].innerHTML);
		html.push('</tr>');
	}
	// If we found files, push a download link.
	if (files.length > 0)
		html.push('<tr><td></td><td><a id="dl" href="#dl" class="dl">Download all files as .zip</a></td><td></td><td></td></tr>');

	html.push('</tbody>');
	//alert(tracks.join('\n\n'));
	
	var tab = ebi('list');
	tab.innerHTML = html.join('\n');
	tab.style.borderLeft = '0';
	
	for (var a = 0, aa = tracks.length; a<aa; a++)
		ebi('trk'+a).onclick = ev_play;
	if (ebi('dl'))
		ebi('dl').onclick = downloadZip;

	
	ret.vol = localStorage.getItem('vol');
	if (ret.vol !== null)
		ret.vol = parseFloat(ret.vol);
	else
		ret.vol = 0.5;
	
	ret.expvol = function() {
		return 0.5 * ret.vol + 0.5 * ret.vol * ret.vol;
	};
	
	ret.setvol = function(vol) {
		ret.vol = Math.max(Math.min(vol, 1), 0);
		localStorage.setItem('vol', vol);
		
		if (ret.au)
			ret.au.volume = ret.expvol();
	};
	
	return ret;
})();


// libarchive management

var SIMUL_DLS = 2;

var AE_IFREG = 32768;
var AE_IFDIR = 16384;
var archive_write_new;
var archive_write_set_format_zip;
var archive_write_open;
var archive_entry_new;
var archive_entry_set_pathname;
var archive_entry_set_size;
var archive_entry_set_filetype;
var archive_write_header;
var archive_write_data;
var archive_entry_free;
var archive_write_free;
var archive_entry_clear;

var libarchive_loaded = false;

var Module = {
	preRun: [],
	postRun: [],
	print: function(text) {
		if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
		console.log(text);
	},
	printErr: function(text) {
		if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
		console.error(text);
	},
	totalDependencies: 0,
	onRuntimeInitialized: function() {
		archive_write_new = Module.cwrap("archive_write_new", 'number', []);
		archive_write_set_format_zip = Module.cwrap("archive_write_set_format_zip", 'number', ['number']);
		archive_write_open = Module.cwrap("archive_write_open", 'number', ['number', 'number', 'number', 'number', 'number']);
		archive_entry_new = Module.cwrap("archive_entry_new", 'number', []);
		archive_entry_set_pathname = Module.cwrap("archive_entry_set_pathname", null, ['number', 'string']);
		archive_entry_set_size = Module.cwrap("archive_entry_set_size", null, ['number', 'number']);
		archive_entry_set_filetype = Module.cwrap("archive_entry_set_filetype", null, ['number', 'number']);
		archive_write_header = Module.cwrap("archive_write_header", 'number', ['number', 'number']);
		archive_write_data = Module.cwrap("archive_write_data", 'number', ['number', 'number', 'number']);
		archive_entry_free = Module.cwrap("archive_entry_free", 'number', ['number', 'number', 'number']);
		archive_write_free = Module.cwrap("archive_write_free", 'number', ['number']);
		archive_entry_clear = Module.cwrap("archive_entry_clear", 'number', ['number']);
		libarchive_loaded = true;
		// zip immediately
		downloadZip();
	}
};

function setDLStatus(s) {
	if (s === false) {
		if (ebi('dl_overlay'))
			ebi('dl_overlay').remove();
	} else if (!ebi('dl_overlay')) {
		var body = document.body || document.getElementsByTagName('body')[0];
		var div = document.createElement('div');
		div.setAttribute('id', 'dl_overlay');
		div.innerHTML = '<h2></h2>';
		div.children[0].innerText = s;
		body.appendChild(div)
	} else {
		ebi('dl_overlay').children[0].innerText = s;
	}
}

function pushDLUpdate(s) {
	var ovl = ebi('dl_overlay');
	if (!ovl)
		return;
	var div = document.createElement('div');
	div.innerText = s;
	ovl.appendChild(div);
	return div;
}

function filterFilenameChars(f) {
	return f.replace(/[\/\<\>:"\\\|\?\*]+/g, "_");
}

function makeZip(zipName, dls) {
	var buffers = [];
	var open_close_cb = Module.addFunction(function (a, cd) {
		return 0;
	});
	var write_cb = Module.addFunction(function (a, cd, buf, len) {
		var heapView = new Uint8Array(Module.HEAP8.buffer, buf, len);
		var localBuffer = new Uint8Array(len);
		localBuffer.set(heapView);
		buffers.push(localBuffer);
		return heapView.length;
	});

	var arch = archive_write_new();
	archive_write_set_format_zip(arch);
	archive_write_open(arch, 0, open_close_cb, write_cb, open_close_cb);
	var entry = archive_entry_new();


	var finalize = function() {
		archive_entry_free(entry);
		archive_write_free(arch);

		Module.removeFunction(open_close_cb);
		Module.removeFunction(write_cb);

		// concatenate all of the buffers into one.
		// doing this at the end is more performant than concating as we
		// go along.
		var totalSize = buffers.reduce(function(a, e) { return a + e.length; }, 0);
		var zipBuffer = new Uint8Array(totalSize);
		var written = 0;
		while (buffers.length > 0) {
			var buf = buffers.shift();
			zipBuffer.set(buf, written);
			written += buf.length;
		}

		// we now have the zip file in the zipBuffer.
		// download it. Taken from:
		// https://stackoverflow.com/questions/16086162/handle-file-download-from-ajax-post
		var zipType = "application/zip";
		var blob = typeof File === 'function'
			? new File([zipBuffer], zipName, { type: zipType })
			: new Blob([zipBuffer], zipName, { type: zipType });
		if (typeof window.navigator.msSaveBlob !== 'undefined') {
			window.navigator.msSaveBlob(blob, zipFilename);
		} else {
			var URL = window.URL || window.webkitURL;
			var downloadUrl = URL.createObjectURL(blob);

			var a = document.createElement("a");
			if (typeof a.download === 'undefined') {
				window.location = downloadUrl;
			} else {
				a.href = downloadUrl;
				a.download = zipName;
				document.body.appendChild(a);
				a.click();
			}
			setTimeout(function () {
				URL.revokeObjectURL(downloadUrl);
				a.remove();
			}, 100); // cleanup
			setDLStatus(false);
		}
	};
	setDLStatus("Zipping...");
	var updateEl = pushDLUpdate("Zipping " + dls[0].filename + "...");
	var writeEntry = function() {
		var dl = dls.shift();
		updateEl.innerHTML += ' <span style="color:#cf5">Done!</span>';
		archive_entry_set_pathname(entry, filterFilenameChars(dl.filename));
		archive_entry_set_size(entry, dl.blob.length);
		archive_entry_set_filetype(entry, AE_IFREG);
		archive_write_header(arch, entry);

		var heapPtr = Module._malloc(dl.blob.length);
		var heapView = new Uint8Array(Module.HEAP8.buffer, heapPtr, dl.blob.length);
		heapView.set(dl.blob);
		archive_write_data(arch, heapPtr, dl.blob.length);
		Module._free(heapPtr);

		archive_entry_clear(entry);

		if (dls.length == 0) {
			finalize();
		} else {
			updateEl = pushDLUpdate("Zipping " + dls[0].filename + "...");
			setTimeout(writeEntry, 50);
		}
	};

	writeEntry();
}

function downloadZip() {

	setDLStatus('Loading...');

	// Load the runtime if necessary. It will invoke this again
	// when it's loaded.
	if (!libarchive_loaded) {
		import_js("/.nfi-audio/libarchive.js", function() {});
		return;
	}

	setDLStatus('Downloading...');

	// Get a file name. Filter pesky characters.
	var zipName = ebi('path').getElementsByTagName('span')[0].innerText;
	zipName = filterFilenameChars(zipName) + ".zip";

	// Take a copy of the tracklist.
	var toDownload = [];
	for (i in mp.files) {
		toDownload.push(mp.files[i]);
	}

	var downloads = [];
	var download = function(track) {
		var url = track[0];
		var fileName = track[1];
		var updateEl = pushDLUpdate("Downloading " + track[1] + "...");

		var xhr = new XMLHttpRequest();
		xhr.responseType = 'arraybuffer';
		xhr.onload = function (e) {
			var fileBlob = new Uint8Array(e.target.response);
			downloads.push({
				"filename" : fileName,
				"blob" : fileBlob
			});
			updateEl.innerHTML += ' <span style="color:#cf5">Done!</span>';
			if (toDownload.length == 0) {
				if (downloads.length != mp.files.length)
					return; // TODO: error handling
				makeZip(zipName, downloads);
			} else {
				download(toDownload.shift());
			}
		};
		xhr.open("GET", url);
		xhr.send();
	};
	// Keep SIMUL_DLS downloads going.
	for (var i = 0; i < SIMUL_DLS && toDownload.length > 0; i++)
		download(toDownload.shift());
}

// create ui
(function(){
	var body = document.body || document.getElementsByTagName('body')[0];
	var widget = document.createElement('div');
	widget.setAttribute('id', 'widget');
	widget.innerHTML = `
		<div id="wtoggle">=</div>
		<div id="widgeti">
			<div id="pctl"><a
				href="#" id="bprev">⏮</a><a
				href="#" id="bplay">▶</a><a
				href="#" id="bnext">⏭</a></div>
			<canvas id="pvol"></canvas>
			<canvas id="barpos"></canvas>
			<canvas id="barbuf"></canvas>
		</div>
	`;
	// ⏮▶⏸⏭
	body.appendChild(widget);
})();


// toggle player widget
var widget = (function(){
	var ret = {};
	var widget = document.getElementById('widget');
	var wtoggle = document.getElementById('wtoggle');
	var touchmode = false;
	var side_open = false;
	var was_paused = true;
	
	ret.open = function() {
		if (side_open)
			return false;
		
		widget.className = 'open';
		side_open = true;
		return true;
	};
	ret.close = function() {
		if (!side_open)
			return false;
		
		widget.className = '';
		side_open = false;
		return true;
	};
	ret.toggle = function(e) {
		ret.open() || ret.close();
		e.preventDefault();
		return false;
	};
	ret.paused = function(paused) {
		if (was_paused != paused) {
			was_paused = paused;
			ebi('bplay').innerHTML = paused ? '▶' : '⏸';
		}
	};
	var click_handler = function(e) {
		if (!touchmode)
			ret.toggle(e);
		
		return false;
	};
	if (window.Touch) {
		var touch_handler = function(e) {
			touchmode = true;
			return ret.toggle(e);
		};
		wtoggle.addEventListener('touchstart', touch_handler, false);
	}
	wtoggle.onclick = click_handler;
	return ret;
})();


// buffer/position bar
var pbar = (function(){
	var r = {};
	r.bcan = ebi('barbuf');
	r.pcan = ebi('barpos');
	r.bctx = r.bcan.getContext('2d');
	r.pctx = r.pcan.getContext('2d');
	
	var bctx = r.bctx;
	var pctx = r.pctx;
	var scale = (window.devicePixelRatio || 1) / (
		bctx.webkitBackingStorePixelRatio ||
		bctx.mozBackingStorePixelRatio ||
		bctx.msBackingStorePixelRatio ||
		bctx.oBackingStorePixelRatio ||
		bctx.BackingStorePixelRatio || 1);
	
	var gradh = 0;
	var grad = null;
	
	r.drawbuf = function() {
		var cs = getComputedStyle(r.bcan);
		var sw = parseInt(cs['width']);
		var sh = parseInt(cs['height']);
		var sm = sw * 1.0 / mp.au.duration;
		
		r.bcan.width = (sw * scale);
		r.bcan.height = (sh * scale);
		bctx.setTransform(scale, 0, 0, scale, 0, 0);
		
		if (!grad || gradh != sh) {
			grad = bctx.createLinearGradient(0,0,0,sh);
			grad.addColorStop(0,   'hsl(85,35%,42%)');
			grad.addColorStop(0.49,'hsl(85,40%,49%)');
			grad.addColorStop(0.50,'hsl(85,37%,47%)');
			grad.addColorStop(1,   'hsl(85,35%,42%)');
			gradh = sh;
		}
		bctx.fillStyle = grad;
		bctx.clearRect(0, 0, sw, sh);
		for (var a = 0; a < mp.au.buffered.length; a++) {
			var x1 = sm * mp.au.buffered.start(a);
			var x2 = sm * mp.au.buffered.end(a);
			bctx.fillRect(x1, 0, x2-x1, sh);
		}
	};
	r.drawpos = function() {
		var cs = getComputedStyle(r.bcan);
		var sw = parseInt(cs['width']);
		var sh = parseInt(cs['height']);
		var sm = sw * 1.0 / mp.au.duration;
		
		r.pcan.width = (sw * scale);
		r.pcan.height = (sh * scale);
		pctx.setTransform(scale, 0, 0, scale, 0, 0);
		pctx.clearRect(0, 0, sw, sh);
		
		var w = 8;
		var x = sm * mp.au.currentTime;
		pctx.fillStyle = '#573'; pctx.fillRect((x-w/2)-1, 0, w+2, sh);
		pctx.fillStyle = '#dfc'; pctx.fillRect((x-w/2),   0,   8, sh);
	};
	return r;
})();


// volume bar
var vbar = (function(){
	var r = {};
	r.can = ebi('pvol');
	r.ctx = r.can.getContext('2d');
	
	var bctx = r.ctx;
	var scale = (window.devicePixelRatio || 1) / (
		bctx.webkitBackingStorePixelRatio ||
		bctx.mozBackingStorePixelRatio ||
		bctx.msBackingStorePixelRatio ||
		bctx.oBackingStorePixelRatio ||
		bctx.BackingStorePixelRatio || 1);
	
	var gradh = 0;
	var grad1 = null;
	var grad2 = null;
	
	r.draw = function() {
		var cs = getComputedStyle(r.can);
		var sw = parseInt(cs['width']);
		var sh = parseInt(cs['height']);
		
		r.can.width = (sw * scale);
		r.can.height = (sh * scale);
		bctx.setTransform(scale, 0, 0, scale, 0, 0);
		
		if (!grad1 || gradh != sh) {
			gradh = sh;
			
			grad1 = bctx.createLinearGradient(0,0,0,sh);
			grad1.addColorStop(0,   'hsl(50,45%,42%)');
			grad1.addColorStop(0.49,'hsl(50,50%,49%)');
			grad1.addColorStop(0.50,'hsl(50,47%,47%)');
			grad1.addColorStop(1,   'hsl(50,45%,42%)');
			
			grad2 = bctx.createLinearGradient(0,0,0,sh);
			grad2.addColorStop(0,   'hsl(205,10%,16%)');
			grad2.addColorStop(0.49,'hsl(205,15%,20%)');
			grad2.addColorStop(0.50,'hsl(205,13%,18%)');
			grad2.addColorStop(1,   'hsl(205,10%,16%)');
		}
		bctx.fillStyle = grad2; bctx.fillRect(0,0,sw,sh);
		bctx.fillStyle = grad1; bctx.fillRect(0,0,sw*mp.vol,sh);
	};
	
	var rect;
	function mousedown(e) {
		rect = r.can.getBoundingClientRect();
		mousemove(e);
	}
	function mousemove(e) {
		if (e.changedTouches && e.changedTouches.length > 0) {
			e = e.changedTouches[0];
		}
		else if (e.buttons === 0) {
			r.can.onmousemove = null;
			return;
		}
		
		var x = e.clientX - rect.left;
		var mul = x * 1.0 / rect.width;
		if (mul > 0.98)
			mul = 1;
		
		mp.setvol(mul);
		r.draw();
	}
	r.can.onmousedown = function(e) {
		if (e.button !== 0)
			return;
		
		r.can.onmousemove = mousemove;
		mousedown(e);
	};
	r.can.onmouseup = function(e) {
		if (e.button === 0)
			r.can.onmousemove = null;
	};
	if (window.Touch) {
		r.can.ontouchstart = mousedown;
		r.can.ontouchmove = mousemove;
	}
	r.draw();
	return r;
})();


// hook up the widget buttons
(function(){
	var bskip = function(n) {
		var tid = null;
		if (mp.au)
			tid = mp.au.tid;
		
		if (tid !== null)
			play(tid + n);
		else
			play(0);
	};
	ebi('bplay').onclick = function(e) {
		e.preventDefault();
		if (mp.au) {
			if (mp.au.paused)
				mp.au.play();
			else
				mp.au.pause();
		}
		else
			play(0);
	};
	ebi('bprev').onclick = function(e) {
		e.preventDefault();
		bskip(-1);
	};
	ebi('bnext').onclick = function(e) {
		e.preventDefault();
		bskip(1);
	};
	ebi('barpos').onclick = function(e) {
		if (!mp.au)
			return play(0);
		
		var rect = pbar.pcan.getBoundingClientRect();
		var x = e.clientX - rect.left;
		var mul = x * 1.0 / rect.width;
		mp.au.currentTime = mp.au.duration * mul;
		if (mp.au === mp.au_native)
			// hack: ogv.js breaks on .play() during playback
			mp.au.play();
	};
})();


// periodic tasks
(function(){
	var nth = 0;
	var last_skip_url = '';
	var progress_updater = function() {
		if (!mp.au) {
			widget.paused(true);
		}
		else {
			// indicate playback state in ui
			widget.paused(mp.au.paused);
		
			// draw current position in song
			if (!mp.au.paused)
				pbar.drawpos();

			// occasionally draw buffered regions
			if (++nth == 10) {
				pbar.drawbuf();
				nth = 0;
			}
			
			// switch to next track if approaching the end
			if (last_skip_url != mp.au.src) {
				var pos = mp.au.currentTime;
				var len = mp.au.duration;
				if (pos > 0 && pos > len - 0.1) {
					last_skip_url = mp.au.src;
					play(mp.au.tid + 1);
				}
			}
		}
		setTimeout(progress_updater, 100);
	};
	progress_updater();
})();


// event from play button next to a file in the list
function ev_play(e) {
	e.preventDefault();
	play(parseInt(this.getAttribute('id').substr(3)));
	return false;
}


function setclass(id, clas) {
	ebi(id).setAttribute('class', clas);
}


var iOS = !!navigator.platform &&
	/iPad|iPhone|iPod/.test(navigator.platform);


// plays the tid'th audio file on the page
function play(tid, call_depth) {
	if (mp.tracks.length == 0)
		return alert('no audio found wait what');

	while (tid >= mp.tracks.length)
		tid -= mp.tracks.length;
	
	while (tid < 0)
		tid += mp.tracks.length;
	
	if (mp.au) {
		mp.au.pause();
		setclass('trk'+mp.au.tid, 'play');
	}
	
	// ogv.js breaks on .play() unless directly user-triggered
	var hack_attempt_play = true;
	
	var url = mp.tracks[tid][0];
	if (iOS && /\.(ogg|opus)$/i.test(url)) {
		if (mp.au_ogvjs) {
			mp.au = mp.au_ogvjs;
		}
		else if (window['OGVPlayer']) {
			mp.au = mp.au_ogvjs = new OGVPlayer();
			hack_attempt_play = false;
			mp.au.addEventListener('error', evau_error, true);
			mp.au.addEventListener('progress', pbar.drawpos, false);
			widget.open();
		}
		else {
			if (call_depth !== undefined)
				return alert('failed to load ogv.js');
			
			show_modal('<h1>loading ogv.js</h1><h2>thanks apple</h2>');
			
			import_js('/.nfi-audio/ogvjs-1.5.8/ogv.js', function() {
				play(tid, 1);
			});
			
			return;
		}
	}
	else {
		if (!mp.au_native) {
			mp.au = mp.au_native = new Audio();
			mp.au.addEventListener('error', evau_error, true);
			mp.au.addEventListener('progress', pbar.drawpos, false);
			widget.open();
		}
		mp.au = mp.au_native;
	}
	
	mp.au.tid = tid;
	mp.au.src = url;
	mp.au.volume = mp.expvol();
	setclass('trk'+tid, 'play act');
	
	try {
		if (hack_attempt_play)
			mp.au.play();
		
		if (mp.au.paused)
			autoplay_blocked();
		
		location.hash = 'trk' + tid;
		pbar.drawbuf();
		return true;
	}
	catch (ex) {
		alert('playback failed: ' + ex);
	}
	setclass('trk'+mp.au.tid, 'play');
	setTimeout('play(' + (mp.au.tid+1) + ');', 500);
}


// event from the audio object if something breaks
function evau_error(e) {
	var err = '';
	var eplaya = (e && e.target) || (window.event && window.event.srcElement);
	var url = eplaya.src;
	
	switch (eplaya.error.code) {
		case eplaya.error.MEDIA_ERR_ABORTED:
			err = "You aborted the playback attempt (how tho)";
			break;
		case eplaya.error.MEDIA_ERR_NETWORK:
			err = "Your internet connection is wonky";
			break;
		case eplaya.error.MEDIA_ERR_DECODE:
			err = "This file is supposedly corrupted??";
			break;
		case eplaya.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
			err = "Your browser does not understand this audio format";
			break;
		default:
			err = 'Unknown Errol';
			break;
	}
	if (eplaya.error.message)
		err += '\n\n' + eplaya.error.message;
	
	err += '\n\nFile: «' + decodeURIComponent(eplaya.src.split('/').slice(-1)[0]) + '»';
	
	alert(err);
	play(eplaya.tid+1);
}


// show a fullscreen message
function show_modal(html) {
	var body = document.body || document.getElementsByTagName('body')[0];
	var div = document.createElement('div');
	div.setAttribute('id', 'blocked');
	div.innerHTML = html;
	unblocked();
	body.appendChild(div);
}


// hide fullscreen message
function unblocked() {
	var dom = ebi('blocked');
	if (dom)
		dom.remove();
}


// show ui to manually start playback of a linked song
function autoplay_blocked(tid)
{
	show_modal(`
		<div id="blk_play">
			<a id="blk_go"></a>
		</div>
		<div id="blk_abrt">
			<a id="blk_na">Cancel<br /><br />(show file list)</a>
		</div>`);
	
	var go = ebi('blk_go');
	var na = ebi('blk_na');
	
	go.textContent = 'Play "' + mp.tracks[mp.au.tid][1] + '"';
	go.onclick = function() {
		unblocked();
		mp.au.play();
	};
	na.onclick = unblocked;
}


// autoplay linked track
(function(){
	var v = location.hash;
	if (v && v.length > 4 && v.indexOf('#trk') === 0)
		play(parseInt(v.substr(4)));
})();


//widget.open();
