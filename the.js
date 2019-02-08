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


function ebi(id) {
	return document.getElementById(id);
}


(function() {
	var css = `
#path a {
	margin: 0 0 0 -.6em;
	padding: 0 0 0 .6em;
}
#path a:after {
	content: '';
	width: 1.05em;
	height: 1.05em;
	margin: -.2em .5em -.2em -.5em;
	display: inline-block;
	border: 1px solid rgba(255,255,255,0.1);
	border-width: .1em .1em 0 0;
	transform: rotate(45deg);
	background: linear-gradient(45deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.2) 75%, rgba(0,0,0,0.3));
}
#path a:hover {
	color: #fff;
	background: linear-gradient(90deg, rgba(0,0,0,0), rgba(0,0,0,0.2), rgba(0,0,0,0));
}
a.play {
	color: #e70;
}
a.play.act {
	color: #af0;
}
#blocked {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: #333;
	font-size: 2.5em;
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
		var esc_node = encodeURIComponent(nodes[a]);
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
	var ret = {
		'au': null,
		'tracks': tracks,
		'cover_url': '',
		'have_opus': false
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
			if (m[1].toLowerCase() == 'opus')
				ret.have_opus = true;
			
			var ntrack = tracks.length;
			tracks.push([url, fn]);
			
			html.push('<tr><td><a id="trk'+ntrack+'" href="#trk'+ntrack+'" class="play">play</a></td>');
		}
		else if (url.endsWith('/'))
			html.push('<tr><td style="width:2.1em">dir</td>');
		else
			html.push('<tr><td></td>');
		
		html.push(trs[a].innerHTML);
		html.push('</tr>');
	}
	html.push('</tbody>');
	
	var tab = ebi('list');
	tab.innerHTML = html.join('\n');
	tab.style.borderLeft = '0';
	
	for (var a = 0, aa = tracks.length; a<aa; a++)
		ebi('trk'+a).onclick = ev_play;
	
	return ret;
})();


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
			<div id="pvol"></div>
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
		mp.au.play();
	};
})();


// periodic tasks
(function(){
	var nth = 0;
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
			var pos = mp.au.currentTime;
			var len = mp.au.duration;
			if (pos > 0 && pos > len - 0.1)
				play(mp.au.tid + 1);
		}
		setTimeout(progress_updater, 100);
	};
	progress_updater();
})();


// event from play button next to a file in the list
function ev_play(e) {
	e.preventDefault();
	play(parseInt(this.getAttribute('id').substr(3)));
}


function setclass(id, clas) {
	ebi(id).setAttribute('class', clas);
}


// plays the tid'th audio file on the page
function play(tid) {
	if (mp.au) {
		mp.au.pause();
		mp.au.src = '';
		setclass('trk'+mp.au.tid, 'play');
	}
	else {
		mp.au = new Audio();
		mp.au.addEventListener('error', evau_error, true);
		mp.au.addEventListener('progress', pbar.drawpos, false);
		widget.open();
	}
	
	if (mp.tracks.length == 0)
		return alert('no audio found wait what');

	while (tid >= mp.tracks.length)
		tid -= mp.tracks.length;
	
	while (tid < 0)
		tid += mp.tracks.length;
	
	mp.au.tid = tid;
	mp.au.src = mp.tracks[tid][0];
	setclass('trk'+tid, 'play act');
	
	try {
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
	
	alert(err);
	play(eplaya.tid+1);
}


// hide the ui below
function unblocked() {
	var dom = ebi('blocked');
	if (dom)
		dom.remove();
}


// show ui to manually start playback of a linked song
function autoplay_blocked()
{
	var body = document.body || document.getElementsByTagName('body')[0];
	var div = document.createElement('div');
	div.setAttribute('id', 'blocked');
	div.innerHTML = `
		<div id="blk_play">
			<a id="blk_go"></a>
		</div>
		<div id="blk_abrt">
			<a id="blk_na">Cancel<br /><br />(show file list)</a>
		</div>`;
	
	unblocked();
	body.appendChild(div);
	var go = ebi('blk_go');
	var na = ebi('blk_na');
	
	go.textContent = 'Play "' + mp.tracks[mp.au.tid][1] + '"';
	go.onclick = function() {
		mp.au.play();
		unblocked();
	};
	na.onclick = unblocked;
}


// autoplay linked track
(function(){
	var v = location.hash;
	if (v && v.length > 4 && v.indexOf('#trk') === 0)
		play(parseInt(v.substr(4)));
})();
