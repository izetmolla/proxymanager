package nginx

import (
	"embed"
	"fmt"
	"path/filepath"
)

var (
	NginxMainFie        = "/etc/nginx/nginx.conf"
	ConfigPath          = "/etc/proxymanager/data"
	LogsPath            = "/etc/proxymanager/logs"
	BinaryMaterialsPath = "materials"
)

var (
	//go:embed all:materials/*
	Materials              embed.FS
	defaultSSLOrg          = "FlowTrove"
	ReadFilePermissionCode = 0644
	// mkdirPerm              = 0o700
)

type SSL struct {
	Org string
}

type Nginx struct {
	NginxPath       string
	ConfigPath      string
	StaticFilesPath string
	MainFilePath    string
	LogsPath        string
	EnableStreams   bool
	ConfigExtension string
	SSL             *SSL

	EnableNginxIpv6    bool   `json:"enableNginxIpv6"`
	EnableNginxStreams bool   `json:"enableNginxStreams"`
	NginxIpv4Address   string `json:"nginxIpv4Address"`
	NginxIpv6Address   string `json:"nginxIpv6Address"`
	NginxHTTPPort      string `json:"nginxHTTPPort"`
	NginxHTTPSPort     string `json:"nginxHTTPSPort"`
}

type NginxInitOptions struct {
	NginxPath       string
	ConfigPath      string
	StaticFilesPath string
	LogsPath        string
	ConfigExtension string
	EnableStreams   bool
	SSL             *SSL
	MainFileDB      bool
	File404DB       bool
	File500DB       bool

	EnableNginxIpv6    bool
	EnableNginxStreams bool
	NginxIpv4Address   string
	NginxIpv6Address   string
	NginxHTTPPort      string
	NginxHTTPSPort     string
}

func Open(opt *NginxInitOptions) (*Nginx, error) {
	ng := Nginx{}
	var err error
	if opt.NginxPath == "" {
		ng.NginxPath = "/etc/nginx"
	}
	if opt.SSL == nil {
		ng.SSL = &SSL{Org: defaultSSLOrg}
	}
	ng.ConfigPath = opt.ConfigPath
	if opt.ConfigPath == "" {
		ng.ConfigPath = ConfigPath
	}
	ng.LogsPath = opt.LogsPath
	if opt.LogsPath == "" {
		ng.LogsPath = LogsPath
	}
	ng.StaticFilesPath = opt.StaticFilesPath
	if opt.StaticFilesPath == "" {
		ng.StaticFilesPath = "/var/www/html"
	}
	ng.EnableStreams = opt.EnableStreams
	ng.ConfigExtension = opt.ConfigExtension
	ng.MainFilePath = filepath.Join(ng.ConfigPath, "main.conf")

	ng.EnableNginxIpv6 = opt.EnableNginxIpv6
	ng.EnableNginxStreams = opt.EnableNginxStreams
	ng.NginxIpv4Address = opt.NginxIpv4Address
	ng.NginxIpv6Address = opt.NginxIpv6Address
	ng.NginxHTTPPort = opt.NginxHTTPPort
	ng.NginxHTTPSPort = opt.NginxHTTPSPort

	if err = makeDirectories(ng.LogsPath); err != nil {
		return &ng, err
	}
	if err := createNginxDirectories(ng.ConfigPath); err != nil {
		return &ng, err
	}
	if !checkForSelfSSL(filepath.Join(ng.ConfigPath, "ssl"), "localhost") {
		if err := generateSelfSSL("localhost", filepath.Join(ng.ConfigPath, "ssl"), ng.SSL.Org); err != nil {
			fmt.Println("cant create localhost ssl")
		}
	}

	if err := SaveNginxStatusTemplate(&NginxStatusTemplateTypes{
		Address: "localhost",
		Port:    8088,
	}, filepath.Join(ng.NginxPath, "conf.d", "status.conf")); err != nil {
		return &ng, err
	}

	if err := SaveDefaultConfDTemplate(map[string]string{
		"LogsPath":   ng.LogsPath,
		"ConfigPath": ng.ConfigPath,
	}, filepath.Join(ng.NginxPath, "conf.d", "include")); err != nil {
		return &ng, err
	}

	if err := SaveNginxDefaultsTemplate(&NginxDefaultsTemplateTypes{
		Disabled:   false,
		ConfigPath: ng.ConfigPath,
		LogsPath:   ng.LogsPath,

		EnableNginxIpv6:    ng.EnableNginxIpv6,
		EnableNginxStreams: ng.EnableNginxStreams,
		NginxIpv4Address:   ng.NginxIpv4Address,
		NginxIpv6Address:   ng.NginxIpv6Address,
		NginxHTTPPort:      ng.NginxHTTPPort,
		NginxHTTPSPort:     ng.NginxHTTPSPort,
	}, filepath.Join(ng.NginxPath, "conf.d", "default.conf")); err != nil {
		return &ng, err
	}

	if !opt.MainFileDB {
		if err := SaveNginxMainFileTemplate(&NginxMainFileTemplateTypes{
			NginxPath:       ng.NginxPath,
			ConfigPath:      ng.ConfigPath,
			LogsPath:        ng.LogsPath,
			EnableNginxIpv6: ng.EnableNginxIpv6,
			EnableStreams:   ng.EnableStreams,
		}); err != nil {
			return &ng, err
		}
	}
	if !opt.File404DB {
		if err := SaveNginxHtml404Template(nil, filepath.Join(ng.StaticFilesPath, "error", "404", "index.html")); err != nil {
			return &ng, err
		}
	}
	if !opt.File500DB {
		if err := SaveNginxHtml50xTemplate(nil, filepath.Join(ng.StaticFilesPath, "error", "50x", "index.html")); err != nil {
			return &ng, err
		}
	}

	return &ng, nil
}
