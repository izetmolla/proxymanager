# "You are not configured" page, which is the default if another default doesn't exist
server {
	listen 80;
	listen [::]:80;

	set $forward_scheme "http";
	set $server "127.0.0.1";
	set $port "80";

	#server_name localhost-nginx-proxy-manager;
	server_name _;
	access_log {{.LogsPath}}/fallback_access.log standard;
	error_log {{.LogsPath}}/fallback_error.log warn;
	include conf.d/include/assets.conf;
	include conf.d/include/block-exploits.conf;
	include conf.d/include/letsencrypt-acme-challenge.conf;

	location / {
		index index.html;
		root /var/www/html;
	}
}

# First 443 Host, which is the default if another default doesn't exist
server {
	listen 443 ssl;
	listen [::]:443 ssl;

	set $forward_scheme "https";
	set $server "127.0.0.1";
	set $port "443";

	server_name localhost;
	access_log {{.LogsPath}}/fallback_access.log standard;
	error_log /dev/null crit;
	include conf.d/include/ssl-ciphers.conf;
	ssl_reject_handshake on;

	return 444;
}
