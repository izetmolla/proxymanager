package nginx

import (
	"fmt"
	"path/filepath"
)

type ProxyHostLocation struct {
	Path       string   `json:"path"`
	ProxyPass  string   `json:"proxy_pass"`
	Properties []string `json:"properties"`
}

type CreateNewProxyHostOptions struct {
	ID         string
	Domains    []string
	Locations  []ProxyHostLocation
	SSLEnabled bool
	SSLType    string
	ForceHttps bool
	HTTP2      bool `json:"http2"`
	Hsts       bool `json:"hsts"`
}

type ProxyHostSSL struct {
	Enabled        bool   `json:"enabled"`
	Certificate    string `json:"certificate"`
	CertificateKey string `json:"certificate_key"`
	HTTP2          bool   `json:"http2"`
	ForceHttps     bool   `json:"force_https"`
	Hsts           bool   `json:"hsts"`
}

type ProxyHost struct {
	ID           string              `json:"id"`
	ProxyHostSSL ProxyHostSSL        `json:"ssl"`
	HostPath     string              `json:"host_path"`
	Domains      []string            `json:"domains"`
	Locations    []ProxyHostLocation `json:"locations"`
}

func (ng *Nginx) UpdateProxyHost(options *CreateNewProxyHostOptions) (err error) {
	if options.SSLType == "" {
		options.SSLType = "auto"
	}
	if len(options.Domains) == 0 {
		return fmt.Errorf("domain is required")
	}
	hostPath := createProxyHostDirectories(filepath.Join(ng.ConfigPath, "hosts", options.ID))

	if !checkForSelfSSL(hostPath, options.Domains[0]) {
		_ = generateSelfSSL(options.Domains[0], hostPath, ng.SSL.Org)
	}
	_ = backupProxyHostCurrentConfig(hostPath)
	if err = setProxyPasConfigFile(hostPath, options); err != nil {
		return err
	}

	err = ng.CheckAndUpdate(options.ID, options.Domains, options.SSLEnabled, "")
	if err != nil {
		if err := deleteFolder(hostPath); err != nil {
			return err
		}
		return err
	}
	return err
}

func (ng *Nginx) DeleteProxyHost(ID string) (err error) {
	hostPath := filepath.Join(ng.ConfigPath, "hosts", ID)
	if err := removeLineFromFile(ng.MainFilePath, mainFileLine(hostPath)); err != nil {
		return err
	}
	return nil
}
