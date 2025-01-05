package config

import (
	"encoding/json"
)

func GetGlobalOptions() string {
	server, err := GetServer()

	if err != nil {
		return "{}"
	}
	opt := map[string]interface{}{
		"setup":            server.Setup,
		"googleLogin":      false,
		"githubLogin":      false,
		"credentialsLogin": server.CredentialsLogin,
		"firstUser":        server.FirstUser,
	}
	if server.EnableSocialAuth {
		if server.GoogleKey != "" && server.GoogleSecret != "" && server.GoogleCallback != "" {
			opt["googleLogin"] = true

		}
		if server.GithubKey != "" && server.GithubSecret != "" && server.GithubCallback != "" {
			opt["githubLogin"] = true
		}
	}

	jsonData, err := json.Marshal(opt)
	if err != nil {
		return "{}"
	}
	return string(jsonData)
}
