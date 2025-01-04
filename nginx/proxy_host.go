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
	ID             string
	Domains        []string
	Locations      []ProxyHostLocation
	SSLEnabled     bool
	SSLType        string
	ForceHttps     bool
	HTTP2          bool   `json:"http2"`
	Hsts           bool   `json:"hsts"`
	SSLID          string `json:"ssl_id"`
	SSLKey         string `json:"ssl_key"`
	SSLCertificate string `json:"ssl_certificate"`
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
	SslPath      string              `json:"ssl_path"`
	Domains      []string            `json:"domains"`
	Locations    []ProxyHostLocation `json:"locations"`
}

func (ng *Nginx) UpdateProxyHost(options *CreateNewProxyHostOptions) (err error) {
	fmt.Println("SSLEnabled", options.SSLEnabled)
	if len(options.Domains) == 0 {
		return fmt.Errorf("domain is required")
	}
	hostPath := createProxyHostDirectories(filepath.Join(ng.ConfigPath, "hosts", options.ID))
	sslPath := createProxyHostSslDirectories(filepath.Join(ng.ConfigPath, "ssl", options.SSLID))
	if options.SSLEnabled {
		if options.SSLType == "" {
			options.SSLType = "auto"
		}
		if options.SSLType == "auto" && !checkForSelfSSL(sslPath, "auto") {
			_ = generateSelfSSL("ssl", sslPath, ng.SSL.Org)
		}
		if options.SSLType == "custom" && !existOnDisk(sslPath, "custom", "ssl.key") {
			return fmt.Errorf("custom ssl not found")
		}
	}

	_ = backupProxyHostCurrentConfig(hostPath)
	if err = setProxyPasConfigFile(hostPath, sslPath, options); err != nil {
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
	if _, err := ng.Reload(); err != nil {
		return err
	}

	return nil
}

func (ng *Nginx) DisableProxyHost(ID string, domsina []string) (err error) {
	hostPath := filepath.Join(ng.ConfigPath, "hosts", ID)
	if err := removeLineFromFile(ng.MainFilePath, mainFileLine(hostPath)); err != nil {
		return err
	}
	if _, err := ng.Reload(); err != nil {
		return err
	}

	return nil
}
