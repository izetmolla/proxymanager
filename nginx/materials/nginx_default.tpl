# "You are not configured" page, which is the default if another default doesn't exist
server {
	listen {{.NginxIpv4Address}}:{{.NginxHTTPPort}};{{if .EnableNginxIpv6 }}
	listen [{{.NginxIpv6Address}}]:{{.NginxHTTPPort}};{{end}}

	set $forward_scheme "http";
	set $server "127.0.0.1";
	set $port "{{.NginxHTTPPort}}";

	server_name localhost;
	access_log {{.LogsPath}}/fallback_access.log standard;
	error_log {{.LogsPath}}/fallback_error.log warn;
	#include conf.d/include/assets.conf;
	#include conf.d/include/block-exploits.conf;
	#include conf.d/include/letsencrypt-acme-challenge.conf;

	
	{{if .NoRespone }}location / {
		return 444
	}
	{{else if .RedirectTo }}location / {
		return 301 https://{{.RedirectTo}};
	}
	{{else}}location / {
		index index.html;
		root /var/www/html;
	}{{end}}
}

# First 443 Host, which is the default if another default doesn't exist
server {
	listen {{.NginxIpv4Address}}:{{.NginxHTTPSPort}} ssl;{{if $.EnableNginxIpv6 }}
	listen [{{.NginxIpv6Address}}]:{{.NginxHTTPSPort}} ssl;{{end}}

	set $forward_scheme "https";
	set $server "127.0.0.1";
	set $port "{{.NginxHTTPSPort}}";

	server_name localhost;
	access_log {{.LogsPath}}/fallback_access.log standard;
	error_log /dev/null crit;
	include conf.d/include/ssl-ciphers.conf;
	ssl_reject_handshake on;

	ssl_certificate {{.ConfigPath}}/ssl/auto/localhost.crt;
    ssl_certificate_key {{.ConfigPath}}/ssl/auto/localhost.key;

	{{if .NoRespone }}location / {
		return 444
	}
	{{else if .RedirectTo }}location / {
		return 301 https://{{.RedirectTo}};
	}
	{{else}}location / {
		index index.html;
		root /var/www/html;
	}{{end}}
}
