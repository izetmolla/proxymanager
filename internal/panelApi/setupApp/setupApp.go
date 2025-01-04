package setupApp

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/izetmolla/proxymanager/config"
	"github.com/izetmolla/proxymanager/models"
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

func SaveData(c *fiber.Ctx) error {
	var body = config.ServerTypes{}
	server, err := config.GetServer()
	if err != nil {
		return c.JSON(utils.Em(err))
	}

	if err := c.BodyParser(&body); err != nil {
		return c.JSON(utils.Em(err))
	}
	if body.Step == 0 {
		server.Address = body.Address
		server.Port = body.Port
		server.BaseUrl = body.BaseUrl
		server.Step = 1
		server.StepCompleted = []int{0}
	}
	if body.Step == 1 {
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
		server.Step = 2
		server.StepCompleted = []int{0, 1}
	}
	user := models.User{}
	tokens := config.Tokens{}
	if body.Step == 2 {
		user, err = models.InsertUser(config.DB, models.User{
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

		tokens, err = config.GenerateTokens(user.ID, []string{})
		if err != nil {
			return c.JSON(utils.Em(err))
		}
		server.CredentialsLogin = true
		server.Setup = true
		server.Step = 3
		server.StepCompleted = []int{0, 1, 2}
	}
	server, err = config.SetServer(*server)
	if err != nil {
		return c.JSON(utils.Em(err))
	}

	return c.JSON(fiber.Map{"data": fiber.Map{"step": body.Step, "server": server, "user": user, "tokens": tokens}})
}
