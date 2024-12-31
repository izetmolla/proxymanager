package routes

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/izetmolla/proxymanager/internal/panelApi/authorization"
	"github.com/izetmolla/proxymanager/internal/panelApi/dashboard"
	"github.com/izetmolla/proxymanager/internal/panelApi/nginxconfig"
	proxyhosts "github.com/izetmolla/proxymanager/internal/panelApi/proxyHosts"
	"github.com/izetmolla/proxymanager/internal/panelApi/users"

	jwtware "github.com/gofiber/contrib/jwt"
)

func handlePanelAPI(app *fiber.App) *fiber.App {
	app.Post("/panelapi/sign-in", authorization.SignIn)
	app.Post("/panelapi/refresh_token", authorization.GetRefreshToken)
	api := app.Group("/panelapi")
	api.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "OK"})
	})
	api.Use(jwtware.New(jwtware.Config{
		SigningKey: jwtware.SigningKey{Key: []byte(os.Getenv("access_token_secret"))},
	}))

	api.Get("/proxyhosts/getdata", proxyhosts.GetProxyHosts)
	api.Get("/proxyhosts/getitem", proxyhosts.GetProxyHost)
	api.Post("/proxyhosts/create", proxyhosts.CreateProxyHost)
	api.Post("/proxyhosts/overview/save", proxyhosts.SaveProxyHostOverview)
	api.Delete("/proxyhosts/delete", proxyhosts.DeleteProxyHost)

	api.Get("/dashboard/getdata", dashboard.GetData)

	api.Get("/users/getdata", users.GetUsersList)

	api.Get("/nginxconfig/getdata", nginxconfig.GetNginxConfigData)
	api.Post("/nginxconfig/save", nginxconfig.SaveNginxConfigFile)
	api.Get("/nginxconfig/restart", nginxconfig.RestartNginx)

	// Catch all other routes
	api.All("*", func(c *fiber.Ctx) error {
		return c.SendStatus(fiber.StatusNotFound)
	})
	return app
}
