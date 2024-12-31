package config

import (
	"encoding/json"
	"errors"

	"github.com/izetmolla/proxymanager/models"
	"gorm.io/gorm"
)

type ServerTypes struct {
	Address            string `json:"address"`
	Port               string `json:"port"`
	AccessTokenSecret  string `json:"access_token_secret"`
	RefreshTokenSecret string `json:"refresh_token_secret"`
	AccessTokenExp     string `json:"access_token_exp"`
	RefreshTokenExp    string `json:"refresh_token_exp"`
	TokensIssuer       string `json:"tokens_issuer"`
}

var server *ServerTypes

func SetServer(db *gorm.DB, newParams ServerTypes) (*ServerTypes, error) {
	if server != nil {
		server.Address = newParams.Address
		server.Port = newParams.Port
		server.AccessTokenSecret = newParams.AccessTokenSecret
		server.RefreshTokenSecret = newParams.RefreshTokenSecret
		server.AccessTokenExp = newParams.AccessTokenExp
		server.RefreshTokenExp = newParams.RefreshTokenExp
		server.TokensIssuer = newParams.TokensIssuer
	}
	st, err := serverTypesToString(server)
	if err != nil {
		return server, err
	}
	if res := db.Model(&models.Option{}).Where("option = ?", "server_config").Update("value", st); res.Error != nil {
		return server, res.Error
	}
	return server, nil
}

func GetServer(db *gorm.DB) (*ServerTypes, error) {
	opt := models.Option{}
	if server != nil {
		return server, nil
	}
	if res := db.Model(&models.Option{}).Where("option = ?", "server_config").First(&opt); res.Error != nil {
		if errors.Is(res.Error, gorm.ErrRecordNotFound) {
			st, _ := serverTypesToString(&ServerTypes{Address: "0.0.0.0", Port: "81"})
			opt.Value = st
			opt.Option = "server_config"
			if res := db.Create(&opt); res.Error != nil {
				return server, res.Error
			}
		} else {
			return server, res.Error
		}
	}
	srv, err := stringToServerTypes(opt.Value)
	if err != nil {
		return server, err
	}
	server = srv
	return srv, nil
}

func serverTypesToString(server *ServerTypes) (string, error) {
	bytes, err := json.Marshal(server)
	if err != nil {
		return "", err
	}
	return string(bytes), nil
}

func stringToServerTypes(data string) (*ServerTypes, error) {
	var server ServerTypes
	err := json.Unmarshal([]byte(data), &server)
	if err != nil {
		return nil, err
	}
	return &server, nil
}
