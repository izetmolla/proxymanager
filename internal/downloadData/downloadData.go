package downloaddata

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func Download(c *fiber.Ctx) error {
	id := c.Params("id")
	return c.SendString(fmt.Sprintf("Download data with id %s", id))
}
