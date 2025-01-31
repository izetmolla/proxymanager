package routes

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/izetmolla/proxymanager/config"
	"github.com/izetmolla/proxymanager/frontend"
	"github.com/izetmolla/proxymanager/internal/auth"
	downloaddata "github.com/izetmolla/proxymanager/internal/downloadData"
	"gorm.io/gorm"
)

func NewHandler(db *gorm.DB, server *config.ServerTypes) (*fiber.App, error) {
	app := fiber.New()
	app.All("/", handleIndex)
	app.Get("/health", func(c *fiber.Ctx) error {
		c.Set("Access-Control-Allow-Origin", "*") // Allow all origins for /health
		return c.JSON(fiber.Map{"status": "OK"})
	})
	app.Get("/download.php", downloaddata.Download)
	// Auth routes
	if server.EnableSocialAuth {
		app.Get("/auth/:provider/callback", auth.CallBack)
		app.Get("/logout/:provider", auth.Logout)
		app.Get("/auth/:provider", auth.Provider)
	}

	app = handleAPI(app)
	app = handlePanelAPI(app, server)

	app.Use(filesystem.New(filesystem.Config{
		Root:       http.FS(frontend.Assets()),
		PathPrefix: "build",
		Browse:     true,
	}))

	app.Use(handleIndex)
	return app, nil
}

func handleIndex(c *fiber.Ctx) error {
	data, errdata := frontend.Assets().ReadFile("build/index.html")
	if errdata != nil {
		return c.SendString(fmt.Sprintf("Error reading embedded file: %s", errdata))
	}
	c.Set("Content-Type", "text/html; charset=utf-8")
	c.Status(fiber.StatusOK)
	return c.SendString(strings.Replace(string(data), "[[globalOptions]]", config.GetGlobalOptions(), 1))
}
