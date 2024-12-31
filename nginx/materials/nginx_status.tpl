server {
    listen {{.host}}:{{.port}};
    server_name localhost;

    location /nginx_status {
        stub_status;
        allow 127.0.0.1;  # Allow only local access
        deny all;         # Deny access to others
    }
}