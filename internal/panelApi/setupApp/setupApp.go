package setupApp

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/izetmolla/proxymanager/config"
	"github.com/izetmolla/proxymanager/models"
	"github.com/izetmolla/proxymanager/nginx"
	"github.com/izetmolla/proxymanager/utils"
)

func GetData(c *fiber.Ctx) error {

	server, err := config.GetServer()
	if err != nil {
		return c.JSON(utils.Em(err))
	}
	if server.Setup {
		return c.JSON(utils.Em(fmt.Errorf("server already setup")))
	}
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
	return c.JSON(fiber.Map{
		"data": fiber.Map{
			"server":     server,
			"ips":        ips,
			"groupedIps": utils.GroupIpAddressesByType(ips),
		}})
}

func SaveData(c *fiber.Ctx) error {
	var body = config.ServerTypes{}
	server, err := config.GetServer()
	if err != nil {
		return c.JSON(utils.Em(err))
	}
	if server.Setup {
		return c.JSON(utils.Em(fmt.Errorf("server already setup")))
	}

	if err := c.BodyParser(&body); err != nil {
		return c.JSON(utils.Em(err))
	}
	//General settings
	if body.Step == 0 {
		server.Step = 1
		server.Address = body.Address
		server.Port = body.Port
		server.BaseUrl = body.BaseUrl
		server.StepCompleted = []int{0}
	}
	//Secret keys settings
	if body.Step == 1 {
		server.Step = 2
		server.AccessTokenSecret = body.AccessTokenSecret
		server.RefreshTokenSecret = body.RefreshTokenSecret
		server.AccessTokenExp = body.AccessTokenExp
		server.RefreshTokenExp = body.RefreshTokenExp
		server.TokensIssuer = body.TokensIssuer
		server.GoogleKey = body.GoogleKey
		server.GoogleSecret = body.GoogleSecret
		server.GoogleCallback = body.GoogleCallback
		server.GithubKey = body.GithubKey
		server.GithubSecret = body.GithubSecret
		server.GithubCallback = body.GithubCallback
		server.EnableSocialAuth = body.EnableSocialAuth
		server.StepCompleted = []int{0, 1}
	}
	//Nginx settings
	if body.Step == 2 {
		server.Step = 3
		server.EnableNginxIpv6 = body.EnableNginxIpv6
		server.EnableNginxStreams = body.EnableNginxStreams
		server.NginxIpv4Address = body.NginxIpv4Address
		server.NginxIpv6Address = body.NginxIpv6Address
		server.NginxHTTPPort = body.NginxHTTPPort
		server.NginxHTTPSPort = body.NginxHTTPSPort
		server.StepCompleted = []int{0, 1, 2}
	}

	server, err = config.SetServer(*server)
	if err != nil {
		return c.JSON(utils.Em(err))
	}

	return c.JSON(fiber.Map{"data": fiber.Map{"finished": server.Setup, "step": body.Step, "server": server}})
}

type ApplyRequest struct {
	IpAddress string `json:"ipAddress"`
	Port      string `json:"port"`
}

func Apply(c *fiber.Ctx) error {
	var body = ApplyRequest{}
	if err := c.BodyParser(&body); err != nil {
		return c.JSON(utils.Em(err))
	}
	server, err := config.GetServer()
	if err != nil {
		return c.JSON(utils.Em(err))
	}
	if server.Setup {
		return c.JSON(utils.Em(fmt.Errorf("server already setup")))
	}

	_, err = config.InitNginx(&nginx.NginxInitOptions{
		ConfigPath:      server.ConfigPath,
		LogsPath:        server.LogsPath,
		ConfigExtension: "json",

		EnableNginxIpv6:    server.EnableNginxIpv6,
		EnableNginxStreams: server.EnableNginxStreams,
		NginxIpv4Address:   server.NginxIpv4Address,
		NginxIpv6Address:   server.NginxIpv6Address,
		NginxHTTPPort:      server.NginxHTTPPort,
		NginxHTTPSPort:     server.NginxHTTPSPort,
	}, config.DB)
	if err != nil {
		return c.JSON(utils.Em(err))
	}

	if body.Port != server.Port {
		server.Setup = true
		_, err := config.SetServer(*server)
		if err != nil {
			return c.JSON(utils.Em(err))
		}

		nginxPids := nginx.FindProcessByName("nginx")
		for _, pid := range nginxPids {
			err = nginx.KillProcess(pid)
			if err != nil {
				return c.JSON(utils.Em(err))
			}
		}
		return c.JSON(fiber.Map{"data": fiber.Map{"redirect": true}})
	}
	server.Setup = true
	server.Step = 4
	_, err = config.SetServer(*server)
	if err != nil {
		return c.JSON(utils.Em(err))
	}
	nginxPids := nginx.FindProcessByName("nginx")
	for _, pid := range nginxPids {
		err = nginx.KillProcess(pid)
		if err != nil {
			return c.JSON(utils.Em(err))
		}
	}
	return c.JSON(fiber.Map{"data": fiber.Map{"finished": server.Setup, "step": 4, "server": server}})
}

func CreateFirstUser(c *fiber.Ctx) error {
	var body = models.User{}
	if err := c.BodyParser(&body); err != nil {
		return c.JSON(utils.Em(err))
	}
	server, err := config.GetServer()
	if err != nil {
		return c.JSON(utils.Em(err))
	}
	if server.FirstUser {
		return c.JSON(utils.Em(fmt.Errorf("first user already created")))
	}
	user, err := models.InsertUser(config.DB, models.User{
		Username: body.Username,
		Password: utils.CreatePassword(body.Password),
		Name:     body.Name,
		Email:    body.Email,
		Status:   "active",
	})
	user.Password = ""
	if err != nil {
		return c.JSON(utils.Em(err))
	}

	tokens, err := config.GenerateTokens(user.ID, []string{})
	if err != nil {
		return c.JSON(utils.Em(err))
	}
	server.FirstUser = true
	server.Setup = true
	server, err = config.SetServer(*server)
	if err != nil {
		return c.JSON(utils.Em(err))
	}
	return c.JSON(fiber.Map{"data": fiber.Map{"finished": server.FirstUser, "server": server, "user": user, "tokens": tokens}})
}
