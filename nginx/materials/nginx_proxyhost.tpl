# HTTP config for {{.ID}}
server{
    server_name{{ range .Domains }} {{ . }}{{ end }};
    listen 80;
    listen [::]:80;
    {{ if .ProxyHostSSL.Enabled }}
    listen 443 ssl{{ if .ProxyHostSSL.HTTP2 }} http2{{ end }};
    listen [::]:443 ssl{{ if .ProxyHostSSL.HTTP2 }} http2{{ end }};
	ssl_certificate {{.HostPath}}/ssl/{{ .ProxyHostSSL.Certificate }};
    ssl_certificate_key {{.HostPath}}/ssl/{{ .ProxyHostSSL.CertificateKey }};
    {{ if  .ProxyHostSSL.Hsts }}# HSTS (ngx_http_headers_module is required) (63072000 seconds = 2 years)
    add_header Strict-Transport-Security $hsts_header always;{{end}}
    {{ if  .ProxyHostSSL.ForceHttps }}
    set $test "";
    if ($scheme = "http") {
        set $test "H";
    }
    if ($request_uri = /.well-known/acme-challenge/test-challenge) {
        set $test "${test}T";
    }
    if ($test = H) {
        return 301 https://$host$request_uri;
    }
    {{end}}{{ end }}
    {{ range .Locations }}
    location {{.Path}} { {{ if $.ProxyHostSSL.Hsts }} 
        # HSTS (ngx_http_headers_module is required) (63072000 seconds = 2 years)
        add_header Strict-Transport-Security $hsts_header always;{{end}}
        proxy_pass {{.ProxyPass}};
        {{ range .Properties }}{{.}};
        {{ end }}
    }
    {{ end }}
	include {{.HostPath}}/config/nginx.conf_*;
}