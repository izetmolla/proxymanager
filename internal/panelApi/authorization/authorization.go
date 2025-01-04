package authorization

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/izetmolla/proxymanager/config"
	"github.com/izetmolla/proxymanager/models"
	"github.com/izetmolla/proxymanager/utils"
)

type SignInBody struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func SignIn(c *fiber.Ctx) error {
	var body SignInBody
	if err := c.BodyParser(&body); err != nil {
		return c.JSON(utils.Em(err))
	}
	user, err := models.GetUserByUsername(config.DB, body.Username)
	if err != nil {
		return c.JSON(utils.Em(err))
	}
	if !utils.IsValidPassword(user.Password, body.Password) {
		return c.JSON(utils.Emp(fmt.Errorf("wrong password"), "password"))
	}
	tokens, err := config.GenerateTokens(user.ID, []string{})
	if err != nil {
		return c.JSON(utils.Em(err))
	}

	return c.JSON(fiber.Map{
		"user":   fiber.Map{"username": user.Username, "email": user.Email, "name": user.Name, "id": user.ID},
		"tokens": tokens,
	})
}

func GetRefreshToken(c *fiber.Ctx) error {
	token, ok := c.GetReqHeaders()["Authorization"]
	if !ok {
		return c.Status(401).JSON("token not present in the header")
	}

	tk, err := models.GetRefreshToken(config.DB, config.GetToken(token[0]))
	if err != nil {
		return c.Status(401).JSON(err)
	}

	srv, _ := config.GetServer()
	accessToken, err := config.GenerateAccessToken(tk.UserID, []string{}, srv.AccessTokenSecret, srv.AccessTokenExp, srv.TokensIssuer)
	if err != nil {
		return c.Status(401).JSON(err)
	}
	return c.JSON(fiber.Map{
		"accessToken": accessToken,
	})
}
