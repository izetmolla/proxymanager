package config

import (
	"errors"

	"github.com/izetmolla/proxymanager/models"
	"github.com/izetmolla/proxymanager/nginx"
	"gorm.io/gorm"
)

var NGINX *nginx.Nginx

func InitNginx(config *nginx.NginxInitOptions, db *gorm.DB) (ng *nginx.Nginx, err error) {
	NGINX, err = nginx.Open(config)
	db.Where(&models.Option{Option: "nginx_configured"}).Updates(&models.Option{Value: "true"})
	return NGINX, err
}

func IsNginxConfigured(db *gorm.DB) bool {
	opt := models.Option{}
	if err := db.Model(&models.Option{}).Where("option = ?", "nginx_configured").First(&opt).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			if err := db.Create(&models.Option{Option: "nginx_configured", Value: "false"}).Error; err != nil {
				return false
			}
		}
		return false
	}
	return opt.Value == "true"
}
