package config

import (
	"errors"

	"github.com/izetmolla/proxymanager/models"
	"gorm.io/gorm"
)

var (
	CliResponseFormat = []string{"json", "yaml", "plain"}
	Debug             = false
	DataPath          = "/usr/local/flowtrove"
)
var (
	NGINX_MAIN_FILE        = "nginx_main_file"
	NGINX_MAIN_FILE_BACKUP = "nginx_main_file_backup"
	HTML_MESSAGE_404       = "html_message_404"
	HTML_MESSAGE_500       = "html_message_500"
)

func SaveOption(db *gorm.DB, option, value string) error {
	backupFile := models.Option{}
	if res := db.Model(&models.Option{}).Select("value").Where("option = ?", option).First(&backupFile); res.Error != nil {
		if errors.Is(res.Error, gorm.ErrRecordNotFound) {
			if err := db.Create(&models.Option{Option: option, Value: value}).Error; err != nil {
				return err
			}
			return nil
		}
		return res.Error
	}
	if err := db.Where("id=?", backupFile.ID).Updates(&models.Option{Value: value}).Error; err != nil {
		return err
	}
	return nil
}

func GetOption(db *gorm.DB, option, defaultValue string) (string, error) {
	opt := models.Option{}
	if err := db.Model(&models.Option{}).Select("value").Where("option = ?", option).First(&opt).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			if res := db.Create(&models.Option{Option: option, Value: defaultValue}); res.Error != nil {
				return "", res.Error
			}
			return opt.Value, nil
		}
		return "", err
	}
	return opt.Value, nil
}
