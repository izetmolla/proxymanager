package config

import (
	"github.com/izetmolla/proxymanager/nginx"
	"gorm.io/gorm"
)

var NGINX *nginx.Nginx

func InitNginx(config *nginx.NginxInitOptions, db *gorm.DB) (ng *nginx.Nginx, err error) {
	NGINX, err = nginx.Open(config)
	return NGINX, err
}
