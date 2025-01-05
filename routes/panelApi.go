package routes

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/izetmolla/proxymanager/config"
	"github.com/izetmolla/proxymanager/internal/panelApi/authorization"
	"github.com/izetmolla/proxymanager/internal/panelApi/dashboard"
	"github.com/izetmolla/proxymanager/internal/panelApi/nginxconfig"
	proxyhosts "github.com/izetmolla/proxymanager/internal/panelApi/proxyHosts"
	"github.com/izetmolla/proxymanager/internal/panelApi/setupApp"
	"github.com/izetmolla/proxymanager/internal/panelApi/sslkeys"
	"github.com/izetmolla/proxymanager/internal/panelApi/users"

	jwtware "github.com/gofiber/contrib/jwt"
)

func handlePanelAPI(app *fiber.App, server *config.ServerTypes) *fiber.App {
	app.Post("/panelapi/sign-in", authorization.SignIn)
	app.Post("/panelapi/refresh_token", authorization.GetRefreshToken)
	if !server.Setup {
		app.Get("/panelapi/setup/getdata", setupApp.GetData)
		app.Post("/panelapi/setup/save", setupApp.SaveData)
		app.Post("/panelapi/setup/apply", setupApp.Apply)
	}

	if !server.FirstUser {
		app.Post("/panelapi/setup/createuser", setupApp.CreateFirstUser)
	}

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
	api.Get("/proxyhosts/disable", proxyhosts.DisableProxyHost)
	api.Get("/proxyhosts/enable", proxyhosts.EnableProxyHost)

	api.Get("/dashboard/getdata", dashboard.GetData)

	api.Get("/users/getdata", users.GetUsersList)

	api.Get("/nginxconfig/getdata", nginxconfig.GetNginxConfigData)
	api.Post("/nginxconfig/save", nginxconfig.SaveNginxConfigFile)
	api.Get("/nginxconfig/restart", nginxconfig.RestartNginx)

	api.Get("/ssl/getdata", sslkeys.GetSslKeysList)
	api.Post("/ssl/create", sslkeys.CreateSslKey)
	api.Delete("/ssl/delete", sslkeys.DeleteSSLKey)
	api.Get("/ssl/download", sslkeys.DownloadSslKey)
	api.Get("/ssl/search", sslkeys.SearchKeys)

	// Catch all other routes
	api.All("*", func(c *fiber.Ctx) error {
		return c.SendStatus(fiber.StatusNotFound)
	})
	return app
}
