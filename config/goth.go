package config

import (
	"github.com/markbates/goth"
	"github.com/markbates/goth/providers/github"
	"github.com/markbates/goth/providers/google"
	"gorm.io/gorm"
)

func InitSocialAuth(db *gorm.DB) error {
	server, err := GetServer()
	if err != nil {
		return err
	}
	// Init Social Auth
	providers := []goth.Provider{}
	if server.GoogleKey != "" && server.GoogleSecret != "" && server.GoogleCallback != "" {
		providers = append(providers, google.New(server.GoogleKey, server.GoogleSecret, server.GoogleCallback))
	}
	if server.GithubKey != "" && server.GithubSecret != "" && server.GithubCallback != "" {
		providers = append(providers, github.New(server.GithubKey, server.GithubSecret, server.GithubCallback))
	}
	if len(providers) > 0 {
		server.EnableSocialAuth = true
		goth.UseProviders(providers...)
	} else {
		server.EnableSocialAuth = false
	}

	return nil
}
