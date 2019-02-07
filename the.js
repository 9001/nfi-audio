// https://github.com/9001/nfi-audio
// ed <irc.rizon.net> MIT-licensed


// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
if (!String.prototype.endsWith) {
	String.prototype.endsWith = function(search, this_len) {
		if (this_len === undefined || this_len > this.length) {
			this_len = this.length;
		}
		return this.substring(this_len - search.length, this_len) === search;
	};
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
}`;
	var head = document.head || document.getElementsByTagName('head')[0];
	var style = document.createElement('style');
	style.appendChild(document.createTextNode(css));
	head.appendChild(style);
})();


// decompose path into buttons
(function(){
	var path_dom = document.getElementById('path');
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
var tmp = (function(){
	var tracks = [];
	var ret = {
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
				ret['have_opus'] = true;
			
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
	
	var tab = document.getElementById('list');
	tab.innerHTML = html.join('\n');
	tab.style.marginLeft = '0';
	
	for (var a = 0, aa = tracks.length; a<aa; a++)
		document.getElementById('trk'+a).onclick = ev_play;
	
	return ret;
})();


var playa = null;
var tracks = tmp.tracks;
var cover_url = tmp.cover_url;
var have_opus = tmp.have_opus;


function ev_play(e) {
	e.preventDefault();
	play(parseInt(this.getAttribute('id').substr(3)));
}


function setclass(id, clas) {
	document.getElementById(id).setAttribute('class',clas);
}


function play(tid) {
	if (playa) {
		playa.pause();
		playa.src = '';
		setclass('trk'+playa.tid, 'play');
	}
	else {
		playa = new Audio();
		playa.addEventListener('error', playa_error, true);
		playa.addEventListener('progress', playa_progress, false);
	}
	
	playa.tid = tid;
	playa.src = tracks[tid][0];
	setclass('trk'+tid, 'play act');
	
	try {
		playa.play();
		if (playa.paused)
			autoplay_blocked();
		
		location.hash = 'trk' + tid;
		return true;
	}
	catch (ex) {
		alert('playback failed: ' + ex);
	}
	badfile();
}


function badfile()
{
	setclass('trk'+playa.tid, 'play');
	setTimeout('play(' + (playa.tid+1) + ');', 500);
}


function playa_error(e) {
	var err = '';
	var eplaya = (e && e.target) || (window.event && window.event.srcElement);
	var url = eplaya.src;
	
	switch (eplaya.error.code)
	{
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


function playa_progress(e) {
}


function unblocked() {
	var dom = document.getElementById('blocked');
	if (dom)
		dom.remove();
}


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
			<a id='blk_na">Cancel<br /><br />(show file list)</a>
		</div>`;
	
	unblocked();
	body.appendChild(div);
	var go = document.getElementById('blk_go');
	var na = document.getElementById('blk_na');
	
	go.textContent = 'Play "' + tracks[playa.tid][1] + '"';
	go.onclick = function() {
		playa.play();
		unblocked();
	}
	na.onclick = unblocked;
}
