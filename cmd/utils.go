package cmd

import (
	"log"
	"math/rand"
	"os"
	"path/filepath"
	"time"

	"github.com/izetmolla/proxymanager/config"
	"github.com/izetmolla/proxymanager/models"
	"github.com/izetmolla/proxymanager/utils"
	"github.com/spf13/pflag"
	"gorm.io/gorm"
)

func checkErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func checkOrCreateSystemFile(filepathName string) (string, error) {
	if !existOnDisk(filepathName) {
		err := os.MkdirAll(filepath.Dir(filepathName), os.ModePerm)
		if err != nil {
			return filepathName, err
		}
		file, err := os.Create(filepathName)
		if err != nil {
			return filepathName, err
		}
		defer file.Close()
	}
	return filepathName, nil
}

func existOnDisk(files ...string) bool {
	_, errfileExist := os.Stat(filepath.Join(files...))
	return !os.IsNotExist(errfileExist)
}

func setOnEmptyString(val, def string) string {
	if val == "" {
		return def
	}
	return val
}

func getRunParams(flags *pflag.FlagSet, db *gorm.DB) *config.ServerTypes {
	server, err := config.GetServer(db)
	checkErr(err)

	if val, set := getParamB(flags, "address"); set {
		server.Address = val
	} else {
		server.Address = setOnEmptyString(server.Address, "0.0.0.0")
	}

	if val, set := getParamB(flags, "port"); set {
		server.Port = val
	} else {
		server.Port = setOnEmptyString(server.Port, "81")
	}

	if val, set := getParamB(flags, "access_token_secret"); set {
		server.AccessTokenSecret = val
		os.Setenv("access_token_secret", server.AccessTokenSecret)
	} else {
		server.AccessTokenSecret = setOnEmptyString(server.AccessTokenSecret, randomString(32))
		os.Setenv("access_token_secret", server.AccessTokenSecret)
	}

	if val, set := getParamB(flags, "refresh_token_secret"); set {
		server.RefreshTokenSecret = val
		os.Setenv("refresh_token_secret", server.RefreshTokenSecret)
	} else {
		server.RefreshTokenSecret = setOnEmptyString(server.RefreshTokenSecret, randomString(32))
		os.Setenv("refresh_token_secret", server.RefreshTokenSecret)
	}

	if val, set := getParamB(flags, "access_token_exp"); set {
		server.AccessTokenExp = val
		os.Setenv("access_token_exp", server.AccessTokenExp)
	} else {
		server.AccessTokenExp = setOnEmptyString("", "1m")
		os.Setenv("access_token_exp", server.AccessTokenExp)
	}

	if val, set := getParamB(flags, "refresh_token_exp"); set {
		server.RefreshTokenExp = val
		os.Setenv("refresh_token_exp", server.RefreshTokenExp)
	} else {
		server.RefreshTokenExp = setOnEmptyString("", "8760h")
		os.Setenv("refresh_token_exp", server.RefreshTokenExp)
	}

	if val, set := getParamB(flags, "token_issuer"); set {
		server.TokensIssuer = val
	} else {
		server.TokensIssuer = setOnEmptyString("", "FLowTrove")
	}

	_, _ = config.SetServer(db, *server)
	return server

}
func randomString(length int) string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	seededRand := rand.New(rand.NewSource(time.Now().UnixNano()))
	b := make([]byte, length)
	for i := range b {
		b[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(b)
}

func insertAdminUser(db *gorm.DB) error {
	var count int64
	db.Model(&models.User{}).Count(&count)
	if count == 0 {
		if res := db.Model(&models.User{}).Create(&models.User{
			Name:     "Admin",
			Username: "admin",
			Password: utils.CreatePassword("admin"),
		}); res.Error != nil {
			return res.Error
		}
	}
	return nil
}
