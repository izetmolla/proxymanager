package routes

import (
	"github.com/gofiber/fiber/v2"
)

func handleAPI(app *fiber.App) *fiber.App {
	api := app.Group("/api")
	api.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "OK"})
	})

	return app
}
