package nginx

import (
	"path/filepath"
)

type NginxMainFileTemplateTypes struct {
	NginxPath     string `json:"nginx_path"`
	ConfigPath    string `json:"config_path"`
	LogsPath      string `json:"logs_path"`
	EnableIpv6    bool   `json:"enable_ipv6"`
	EnableStreams bool   `json:"enable_streams"`
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
	EnableIpv6 bool   `json:"enable_ipv6"`
}

func SaveNginxDefaultsTemplate(data *NginxDefaultsTemplateTypes, filePath string) error {
	if _, err := checkOrCreateSystemFile(filePath); err != nil {
		return err
	}
	return createFromBinary(&Materials, "nginx_default.tpl", filePath, data)
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
