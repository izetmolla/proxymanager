package config

import (
	"fmt"

	"github.com/izetmolla/proxymanager/nginx"
	"gorm.io/gorm"
)

type LoadConfigOptions struct {
	MainFileDB bool `json:"main_file_db"`
	File404DB  bool `json:"file_404_db"`
}

func LoadConfig(db *gorm.DB) (lco LoadConfigOptions, err error) {
	lco.MainFileDB, err = loadNginxFile(db)
	if err != nil {
		return lco, err
	}
	lco.File404DB, err = loadCustom404(db)
	if err != nil {
		return lco, err
	}
	return lco, nil
}

func loadNginxFile(db *gorm.DB) (bool, error) {
	nginxFile, err := GetOption(db, NGINX_MAIN_FILE, "")
	if err != nil {
		return false, err
	}
	if nginxFile != "" {
		if err := nginx.WriteToFile(nginx.NginxMainFie, nginxFile); err != nil {
			return false, err
		}
		fmt.Printf("%s loaded from database\n", nginx.NginxMainFie)
		return true, nil
	}
	return false, nil
}

func loadCustom404(db *gorm.DB) (bool, error) {
	error404, err := GetOption(db, HTML_MESSAGE_404, "")
	if err != nil {
		return false, err
	}
	if error404 != "" {
		// if err := nginx.WriteToFile("/vat/www", customErrors); err != nil {
		// 	return err
		// }
		// fmt.Printf("%s loaded from database\n", nginx.NginxCustomErrors)
	}
	return false, nil
}
