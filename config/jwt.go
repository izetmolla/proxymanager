package config

import (
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/izetmolla/proxymanager/models"
)

const bearerVar = "Bearer"

type Tokens struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

func GenerateTokens(usrID string, roles []string) (tokens Tokens, err error) {
	srv, _ := GetServer(DB)
	access_token, err := GenerateAccessToken(usrID, roles, srv.AccessTokenSecret, srv.AccessTokenExp, srv.TokensIssuer)
	if err != nil {
		return tokens, err
	}
	refresh_token, err := GenerateRefreshToken(usrID, roles, srv.RefreshTokenSecret, srv.RefreshTokenExp, srv.TokensIssuer)
	if err != nil {
		return tokens, err
	}
	return Tokens{
		AccessToken:  access_token,
		RefreshToken: refresh_token,
	}, err
}

func GenerateAccessToken(userID string, roles []string, secret, exp, issuer string) (string, error) {
	duration1, err := time.ParseDuration(exp)
	if err != nil {
		return "", err
	}

	// Create the Claims
	claims := jwt.MapClaims{
		"isAdmin": isAdminUser(roles),
		"roles":   roles,
		"exp":     jwt.NewNumericDate(time.Now().Add(duration1)),
		"Issuer":  issuer,
		"sub":     userID,
	}

	// Create token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Generate encoded token and send it as response.
	t, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", err
	}
	return t, nil
}

func GenerateRefreshToken(userID string, roles []string, secret, exp, issuer string) (string, error) {
	duration, err := time.ParseDuration(exp)
	if err != nil {
		return "", err
	}

	// Create the Claims
	claims := jwt.MapClaims{
		"isAdmin": isAdminUser(roles),
		"roles":   roles,
		"exp":     jwt.NewNumericDate(time.Now().Add(duration)),
		"Issuer":  issuer,
		"sub":     userID,
	}

	// Create token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Generate encoded token and send it as response.
	t, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", err
	}

	_, err = models.CreateRefreshToken(DB, userID, t)
	if err != nil {
		return "", err
	}

	return t, nil
}

func ExtractToken(authorizationHeader string) (string, error) {
	// Check if the authorization header starts with "Bearer "
	if strings.HasPrefix(authorizationHeader, "Bearer ") {
		// Remove "Bearer " from the header to get the token
		token := strings.TrimPrefix(authorizationHeader, "Bearer ")
		return token, nil
	}

	// If the header doesn't start with "Bearer ", return an error
	return "", fmt.Errorf("invalid authorization header")
}

type CurrentUser struct {
	ID      uint     `json:"id"`
	Roles   []string `json:"roles"`
	IsAdmin bool     `json:"isAdmin"`
}

func GetCurrentUser(c *fiber.Ctx) CurrentUser {
	user := c.Locals("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	return CurrentUser{ID: StringToUint(claims["sub"].(string)), IsAdmin: claims["isAdmin"].(bool), Roles: claims["roles"].([]string)}
}

func isAdminUser(roles []string) bool {
	for _, role := range roles {
		if role == "Administrator" {
			return true
		}
	}
	return false
}

func StringToUint(s string) uint {
	i, _ := strconv.ParseUint(s, 10, 32)
	return uint(i)
}

func GetToken(tokenStr string) string {
	parts := strings.Split(tokenStr, " ")
	if len(parts) != 2 || parts[0] != bearerVar {
		// fmt.Println("Invalid token format")
		return ""
	}
	return parts[1]
}
