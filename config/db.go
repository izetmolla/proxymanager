package config

import (
	"github.com/izetmolla/proxymanager/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB(database_url string, conf *gorm.Config) (*gorm.DB, error) {
	var err error
	DB, err = gorm.Open(sqlite.Open(database_url), conf)
	if err := AutoMigrate(DB); err != nil {
		return DB, err
	}
	return DB, err
}
func AutoMigrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&models.Domain{}, &models.ProxyHost{}, &models.Location{}, &models.LocationProperty{}, &models.SslKey{},
		&models.Option{},
		&models.User{}, &models.RefreshToken{},
	)
}
