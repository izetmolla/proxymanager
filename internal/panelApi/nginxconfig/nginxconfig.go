package nginxconfig

import (
	"github.com/gofiber/fiber/v2"
	"github.com/izetmolla/proxymanager/config"
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
