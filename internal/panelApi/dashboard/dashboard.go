package dashboard

import (
	"github.com/gofiber/fiber/v2"
	"github.com/izetmolla/proxymanager/utils"
)

func GetData(c *fiber.Ctx) error {
	data, err := utils.FetchNginxStatus()
	if err != nil {
		return c.JSON(utils.Em(err))
	}
	return c.JSON(fiber.Map{"data": fiber.Map{"stat": data}})
}
