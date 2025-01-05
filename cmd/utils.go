package cmd

import (
	"log"
	"math/rand"
	"os"
	"path/filepath"
	"time"

	"github.com/izetmolla/proxymanager/config"
	"github.com/izetmolla/proxymanager/nginx"
	"github.com/spf13/pflag"
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

func getRunParams(flags *pflag.FlagSet) (*config.ServerTypes, error) {
	server, err := config.GetServer()
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

	if val, set := getParamB(flags, "config_path"); set {
		server.ConfigPath = val
	} else {
		server.ConfigPath = setOnEmptyString(server.ConfigPath, nginx.ConfigPath)
	}

	if val, set := getParamB(flags, "logs_path"); set {
		server.LogsPath = val
	} else {
		server.LogsPath = setOnEmptyString(server.LogsPath, nginx.LogsPath)
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

	// Goauth
	if val, set := getParamB(flags, "google_key"); set {
		server.GoogleKey = val
	} else {
		server.GoogleKey = setOnEmptyString(server.GoogleKey, "")
	}

	if val, set := getParamB(flags, "google_secret"); set {
		server.GoogleSecret = val
	} else {
		server.GoogleSecret = setOnEmptyString(server.GoogleSecret, "")
	}

	if val, set := getParamB(flags, "google_callback"); set {
		server.GoogleCallback = val
	} else {
		server.GoogleCallback = setOnEmptyString(server.GoogleCallback, "")
	}

	if val, set := getParamB(flags, "github_key"); set {
		server.GithubKey = val
	} else {
		server.GithubKey = setOnEmptyString(server.GithubKey, "")
	}

	if val, set := getParamB(flags, "github_secret"); set {
		server.GithubSecret = val
	} else {
		server.GithubSecret = setOnEmptyString(server.GithubSecret, "")
	}
	if val, set := getParamB(flags, "github_callback"); set {
		server.GithubCallback = val
	} else {
		server.GithubCallback = setOnEmptyString(server.GithubCallback, "")
	}

	if val, set := getParamB(flags, "credentials_login"); set {
		server.CredentialsLogin = val == "true"
	} else {
		server.CredentialsLogin = setOnEmptyString("", "true") == "true"
	}

	server, err = config.SetServer(*server)
	if err != nil {
		return server, err
	}
	return server, nil

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
