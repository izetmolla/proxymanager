package setupApp

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/izetmolla/proxymanager/config"
	"github.com/izetmolla/proxymanager/utils"
)

func InitSetup(c *fiber.Ctx) error {
	server, err := config.GetServer()
	if err != nil {
		return c.JSON(utils.Em(err))
	}
	server.Setup = true
	_, err = config.SetServer(*server)
	if err != nil {
		return c.JSON(utils.Em(err))
	}

	return c.JSON(fiber.Map{"data": fiber.Map{"setup": true}})
}

func GetData(c *fiber.Ctx) error {
	ips := make([]map[string]interface{}, 0)

	server, err := config.GetServer()
	if err != nil {
		return c.JSON(utils.Em(err))
	}

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

	return c.JSON(fiber.Map{
		"data": fiber.Map{
			"server": server,
			"ips":    ips,
		}})
}
