package nginx

import (
	"path/filepath"
)

type NginxMainFileTemplateTypes struct {
	NginxPath       string `json:"nginx_path"`
	ConfigPath      string `json:"config_path"`
	LogsPath        string `json:"logs_path"`
	EnableNginxIpv6 bool   `json:"enable_ipv6"`
	EnableStreams   bool   `json:"enable_streams"`
}

func SaveNginxMainFileTemplate(data *NginxMainFileTemplateTypes) error {
	if _, err := checkOrCreateSystemFile(NginxMainFie); err != nil {
		return err
	}
	return createFromBinary(&Materials, "nginx.tpl", NginxMainFie, data)
}

type NginxDefaultsTemplateTypes struct {
	LogsPath   string `json:"logs_path"`
	ConfigPath string `json:"config_path"`
	Disabled   bool   `json:"disabled"`
	NoRespone  bool   `json:"no_respone"`
	RedirectTo string `json:"redirect_to"`

	EnableNginxIpv6    bool   `json:"enableNginxIpv6"`
	EnableNginxStreams bool   `json:"enableNginxStreams"`
	NginxIpv4Address   string `json:"nginxIpv4Address"`
	NginxIpv6Address   string `json:"nginxIpv6Address"`
	NginxHTTPPort      string `json:"nginxHTTPPort"`
	NginxHTTPSPort     string `json:"nginxHTTPSPort"`
}

func SaveNginxDefaultsTemplate(data *NginxDefaultsTemplateTypes, filePath string) error {
	if _, err := checkOrCreateSystemFile(filePath); err != nil {
		return err
	}
	return createFromBinary(&Materials, "nginx_default.tpl", filePath, data)
}

type NginxStatusTemplateTypes struct {
	Address string `json:"address"`
	Port    int    `json:"port"`
}

func SaveNginxStatusTemplate(data *NginxStatusTemplateTypes, filePath string) error {
	if _, err := checkOrCreateSystemFile(filePath); err != nil {
		return err
	}
	return createFromBinary(&Materials, "nginx_status.tpl", filePath, data)
}

func SaveNginxHtml404Template(data any, filePath string) error {
	if _, err := checkOrCreateSystemFile(filePath); err != nil {
		return err
	}
	return createFromBinary(&Materials, "html_404.html", filePath, data)
}

func SaveNginxHtml50xTemplate(data any, filePath string) error {
	if _, err := checkOrCreateSystemFile(filePath); err != nil {
		return err
	}
	return createFromBinary(&Materials, "50x.html", filePath, data)
}

func SaveDefaultConfDTemplate(data any, folderPath string) error {
	files, _ := readBinaryFolder(&Materials, "conf.d")
	for _, file := range files {
		if path, err := checkOrCreateSystemFile(filepath.Join(folderPath, file)); err == nil {
			createFromBinary(&Materials, filepath.Join("conf.d", file), path, data)
		}
	}
	return nil
}
