package routes

import (
	"fmt"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/izetmolla/proxymanager/config"
	"github.com/izetmolla/proxymanager/frontend"
	downloaddata "github.com/izetmolla/proxymanager/internal/downloadData"
	"gorm.io/gorm"
)

func NewHandler(db *gorm.DB, server *config.ServerTypes) (*fiber.App, error) {
	app := fiber.New()
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "OK"})
	})
	app.Get("/download.php", downloaddata.Download)
	app = handleAPI(app)
	app = handlePanelAPI(app)

	app.Use(filesystem.New(filesystem.Config{
		Root:       http.FS(frontend.Assets()),
		PathPrefix: "build",
		Browse:     true,
	}))

	app.Use(func(c *fiber.Ctx) error {
		data, errdata := frontend.Assets().ReadFile("build/index.html")
		if errdata != nil {
			return c.SendString(fmt.Sprintf("Error reading embedded file: %s", errdata))
		}
		c.Set("Content-Type", "text/html; charset=utf-8")
		c.Status(fiber.StatusOK)
		return c.SendString(string(data))
	})
	return app, nil
}
