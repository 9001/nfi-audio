# nfi-audio
nginx media player


# status
* capable of playing audio
* just stops when a track finishes


# soon
* playback control widget
* super fancy album art view
* visualizer? maybe
* opus support for iCrap


# installation
run one of these depending on distro:
* alpine: `apk add nginx-mod-http-fancyindex`
* centos: `yum install nginx-module-fancyindex`


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