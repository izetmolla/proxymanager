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
	HTTP2          bool         `json:"http2"`
	Hsts           bool         `json:"hsts"`
	SSLID          string       `json:"ssl_id"`
	SSLKey         string       `json:"ssl_key"`
	SSLCertificate string       `json:"ssl_certificate"`
	SSL            ProxyHostSSL `json:"ssl"`
	NoReload       bool         `json:"no_reload"`

	EnableNginxIpv6    bool
	EnableNginxStreams bool
	NginxIpv4Address   string
	NginxIpv6Address   string
	NginxHTTPPort      string
	NginxHTTPSPort     string
}

type ProxyHostSSL struct {
	ID             string `json:"id"`
	Type           string `json:"type"`
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

	EnableNginxIpv6  bool   `json:"enableNginxIpv6"`
	NginxIpv4Address string `json:"nginxIpv4Address"`
	NginxIpv6Address string `json:"nginxIpv6Address"`
	NginxHTTPPort    string `json:"nginxHTTPPort"`
	NginxHTTPSPort   string `json:"nginxHTTPSPort"`
}

func (ng *Nginx) UpdateProxyHost(options *CreateNewProxyHostOptions) (err error) {
	if len(options.Domains) == 0 {
		return fmt.Errorf("domain is required")
	}
	hostPath := createProxyHostDirectories(filepath.Join(ng.ConfigPath, "hosts", options.ID))
	sslPath := createProxyHostSslDirectories(filepath.Join(ng.ConfigPath, "ssl", options.SSLID))
	if options.SSLEnabled {
		options.SSLType = setStringOnEmpty(options.SSLType, "auto")
		if options.SSLType == "auto" && !checkForSelfSSL(sslPath, "auto") {
			_ = generateSelfSSL("ssl", sslPath, ng.SSL.Org)
		}
		if options.SSLType == "custom" && !existOnDisk(sslPath, "custom", "ssl.key") {
			return fmt.Errorf("custom ssl not found")
		}
	}

	fmt.Println("AAAAA: ", options)

	options.EnableNginxIpv6 = setBoolOnEmpty(options.EnableNginxIpv6, ng.EnableNginxIpv6)
	options.NginxHTTPPort = setStringOnEmpty(options.NginxHTTPPort, ng.NginxHTTPPort)
	options.NginxHTTPSPort = setStringOnEmpty(options.NginxHTTPSPort, ng.NginxHTTPSPort)
	options.NginxIpv4Address = setStringOnEmpty(options.NginxIpv4Address, ng.NginxIpv4Address)
	options.NginxIpv6Address = setStringOnEmpty(options.NginxIpv6Address, ng.NginxIpv6Address)

	_ = backupProxyHostCurrentConfig(hostPath)
	if err = setProxyPasConfigFile(hostPath, sslPath, options); err != nil {
		return err
	}

	err = ng.CheckAndUpdate(options.ID, options)
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
