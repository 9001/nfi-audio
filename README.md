# nfi-audio
nginx media player


# this project is end-of-life and should not be used
because the dependency `ngx-fancyindex` is dangerously unmtaintained:
* https://github.com/aperezdc/ngx-fancyindex/issues/104
* https://github.com/aperezdc/ngx-fancyindex/pull/128


# status
* works
* volume slider #wow #whoa
* opus and vorbis support on iOS (iPhone/iPad)


# soon
* super fancy album art view
* visualizer? maybe


# bugs
* `"<>&` in filenames is a bad idea, see https://github.com/aperezdc/ngx-fancyindex/issues/104


# installation
run one of these depending on distro:
* alpine: `apk add nginx-mod-http-fancyindex`
* centos: `yum install nginx-module-fancyindex`
* debian: `apt install libnginx-mod-http-fancyindex`
* gentoo: [maybe you have more luck](https://ocv.me/stuff/gentoops.png)


#### `vim /etc/nginx/nginx.conf`
add this near the top, before the includes (if any):
```
load_module modules/ngx_http_fancyindex_module.so;
```


#### `vim /etc/nginx/conf.d/your-website.conf`
add this anywhere inside `server {` and optionally
replace `/music` with `/` to enable globally:

```
location /music {
	autoindex off;
	fancyindex on;
	fancyindex_name_length 9001;
	fancyindex_header /.nfi-audio/1.html;
	fancyindex_footer /.nfi-audio/2.html;
}
```


#### `cd` into `/var/www/your-website` and...
```
git clone https://github.com/9001/nfi-audio .nfi-audio
```


# ogg/vorbis/opus on iPhone/iPad

special thanks to apple for refusing to support open standards which just happens to have higher compression efficiencies than the proprietary patent-encumbered audio codecs haha

```
cd /var/www/your-website/.nfi-audio && ./deps.sh
```
