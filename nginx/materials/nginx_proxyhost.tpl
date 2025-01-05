# HTTP config for {{.ID}}
server{
    server_name{{ range .Domains }} {{ . }}{{ end }};
    listen {{.NginxIpv4Address}}:{{.NginxHTTPPort}};{{if .EnableNginxIpv6 }}
	listen [{{.NginxIpv6Address}}]:{{.NginxHTTPPort}};{{end}}

    {{ if .ProxyHostSSL.Enabled }}
    listen {{.NginxIpv4Address}}:{{.NginxHTTPSPort}} ssl{{ if .ProxyHostSSL.HTTP2 }} http2{{ end }};
    listen [{{.NginxIpv6Address}}]:{{.NginxHTTPSPort}} ssl{{ if .ProxyHostSSL.HTTP2 }} http2{{ end }};
	ssl_certificate {{.SslPath}}/{{ .ProxyHostSSL.Certificate }};
    ssl_certificate_key {{.SslPath}}/{{ .ProxyHostSSL.CertificateKey }};
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