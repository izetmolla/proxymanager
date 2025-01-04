package utils

import (
	"fmt"
	"io"
	"net"
	"net/http"
)

type IpAddressItem struct {
	InterfaceName string `json:"interfaceName"`
	IpAddress     string `json:"ipAddress"`
	Type          string `json:"type"`
	IsPublic      bool   `json:"isPublic"`
}

func GetIpAddressesList() ([]IpAddressItem, error) {
	var ipAddresses []IpAddressItem
	interfaces, err := net.Interfaces()
	if err != nil {
		return ipAddresses, fmt.Errorf("error getting network interfaces: %v", err)
	}

	for _, iface := range interfaces {
		// Skip interfaces that are down or not suitable
		if iface.Flags&net.FlagUp == 0 || iface.Flags&net.FlagLoopback != 0 {
			continue
		}

		// Get addresses associated with the interface
		addresses, err := iface.Addrs()
		if err != nil {
			fmt.Printf("Error getting addresses for interface %s: %v\n", iface.Name, err)
			continue
		}

		for _, addr := range addresses {
			var ip net.IP

			// Check the type of address (IPv4/IPv6)
			switch v := addr.(type) {
			case *net.IPNet:
				ip = v.IP
			case *net.IPAddr:
				ip = v.IP
			}

			// Print the IP address if it's not a loopback address
			if ip != nil && !ip.IsLoopback() {
				ipAddresses = append(ipAddresses, IpAddressItem{
					InterfaceName: iface.Name,
					IpAddress:     ip.String(),
					IsPublic:      false,
				})
			}
		}
	}
	return ipAddresses, nil
}

func GetPublicIpAddress() (string, error) {
	urls := []string{
		"https://api.ipify.org?format=text",
		"https://icanhazip.com",
		"https://ifconfig.me",
	}

	for _, url := range urls {
		resp, err := http.Get(url)
		if err != nil {
			continue
		}
		defer resp.Body.Close()

		if resp.StatusCode == http.StatusOK {
			body, err := io.ReadAll(resp.Body)
			if err != nil {
				continue
			}
			if !IsValidIp(string(body)) {
				continue
			}
			return string(body), nil
		}
	}

	return "", fmt.Errorf("unable to determine public IP address")
}

func IsValidIp(ip string) bool {
	return net.ParseIP(ip) != nil
}
