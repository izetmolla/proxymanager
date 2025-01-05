package nginxconfig

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/izetmolla/proxymanager/config"
	"github.com/izetmolla/proxymanager/models"
	"github.com/izetmolla/proxymanager/nginx"
	"github.com/izetmolla/proxymanager/utils"
)

func GetNginxConfigData(c *fiber.Ctx) error {
	file, err := utils.ReadFromFile(nginx.NginxMainFie)
	if err != nil {
		return c.JSON(utils.Em(err))
	}

	return c.JSON(fiber.Map{"data": fiber.Map{"file": file}})
}

type SaveNginxConfigFileBody struct {
	File string `json:"file"`
}

func SaveNginxConfigFile(c *fiber.Ctx) error {
	var body SaveNginxConfigFileBody
	if err := c.BodyParser(&body); err != nil {
		return c.JSON(utils.Em(err))
	}
	currentFile, err := utils.ReadFromFile(nginx.NginxMainFie)
	if err != nil {
		return c.JSON(utils.Em(err))
	}
	if err := config.SaveOption(config.DB, config.NGINX_MAIN_FILE_BACKUP, currentFile); err != nil {
		return c.JSON(utils.Em(err))
	}
	if err := utils.WriteToFile(nginx.NginxMainFie, body.File); err != nil {
		return c.JSON(utils.Em(err))
	}
	if _, err := config.NGINX.Status(); err != nil {
		utils.WriteToFile(nginx.NginxMainFie, currentFile)
		return c.JSON(utils.Em(err))
	}
	if err := config.SaveOption(config.DB, config.NGINX_MAIN_FILE, body.File); err != nil {
		return c.JSON(utils.Em(err))
	}
	if err := config.SaveOption(config.DB, config.NGINX_MAIN_FILE_BACKUP, ""); err != nil {
		return c.JSON(utils.Em(err))
	}

	return c.JSON(fiber.Map{"data": fiber.Map{"id": "file"}})
}

func RestartNginx(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"data": fiber.Map{"id": "file"}})
}

func General(c *fiber.Ctx) error {

	ips := make([]map[string]interface{}, 0)

	privateIps, err := utils.GetIpAddressesList()
	if err != nil {
		return c.JSON(utils.Em(err))
	}
	publicIp, _ := utils.GetPublicIpAddress()
	if publicIp != "" {
		privateIps = append(privateIps, utils.IpAddressItem{
			InterfaceName: "Public",
			IpAddress:     publicIp,
			IsPublic:      true,
		})
	}
	ips = append(ips, map[string]interface{}{
		"value": "0.0.0.0",
		"label": "0.0.0.0 - All interfaces",
	})

	for i := 0; i < len(privateIps); i++ {
		isPublic := "Public"
		if !privateIps[i].IsPublic {
			isPublic = "Private"
		}
		ips = append(ips, map[string]interface{}{
			"value": privateIps[i].IpAddress,
			"label": fmt.Sprintf("%s - %s (%s)", privateIps[i].IpAddress, privateIps[i].InterfaceName, isPublic),
		})
	}

	ips = append(ips, map[string]interface{}{
		"value": "127.0.0.1",
		"label": "127.0.0.1 - Localhost",
	})

	ips = append(ips, map[string]interface{}{
		"value": "::",
		"label": ":: - All interfaces (IPv6)",
	})
	server, err := config.GetServer()
	if err != nil {
		return c.JSON(utils.Em(err))
	}

	return c.JSON(fiber.Map{"data": fiber.Map{
		"enableNginxIpv6":    server.EnableNginxIpv6,
		"enableNginxStreams": server.EnableNginxStreams,
		"nginxIpv4Address":   server.NginxIpv4Address,
		"nginxIpv6Address":   server.NginxIpv6Address,
		"nginxHTTPPort":      server.NginxHTTPPort,
		"nginxHTTPSPort":     server.NginxHTTPSPort,
		"ips":                utils.GroupIpAddressesByType(ips),
	}})
}

type SaveGeneralDataBody struct {
	EnableNginxIpv6    bool   `json:"enableNginxIpv6"`
	EnableNginxStreams bool   `json:"enableNginxStreams"`
	NginxIpv4Address   string `json:"nginxIpv4Address"`
	NginxIpv6Address   string `json:"nginxIpv6Address"`
	NginxHTTPPort      string `json:"nginxHTTPPort"`
	NginxHTTPSPort     string `json:"nginxHTTPSPort"`
}

func SaveGeneralData(c *fiber.Ctx) error {
	var body = SaveGeneralDataBody{}
	server, err := config.GetServer()
	if err != nil {
		return c.JSON(utils.Em(err))
	}
	if err := c.BodyParser(&body); err != nil {
		fmt.Println(err)

		return c.JSON(utils.Em(err))
	}

	server.EnableNginxIpv6 = body.EnableNginxIpv6
	server.EnableNginxStreams = body.EnableNginxStreams
	server.NginxIpv4Address = body.NginxIpv4Address
	server.NginxIpv6Address = body.NginxIpv6Address
	server.NginxHTTPPort = body.NginxHTTPPort
	server.NginxHTTPSPort = body.NginxHTTPSPort

	if _, err := config.SetServer(*server); err != nil {
		return c.JSON(utils.Em(err))
	}

	return c.JSON(fiber.Map{"data": fiber.Map{}})
}

func updateAllproxyHosts(server *config.ServerTypes) error {
	proxyHosts := make([]models.ProxyHost, 0)
	if err := config.DB.Find(&proxyHosts).Error; err != nil {
		return err
	}

	return nil
}
