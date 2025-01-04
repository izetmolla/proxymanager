package setupApp

import (
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
