package utils

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/izetmolla/proxymanager/config"
)

func ErrJSON(err error) {
	if err != nil {
		jsonData, err := json.Marshal(map[string]interface{}{"error": map[string]interface{}{"message": err.Error()}})
		if err != nil {
			fmt.Printf(`{"error":{"message":"%s"}}`, err.Error())
			os.Exit(0)
		}
		fmt.Println(string(jsonData))
		os.Exit(0)
	}
}
func JSON(format string, a ...any) {
	fmt.Printf(format, a...)
	os.Exit(0)
}

func GetLastArg(args []string) string {
	if len(args) == 0 {
		return "plain"
	}
	return args[len(args)-1]
}
func GetResponseArg(args []string) string {
	if len(args) == 0 {
		return "plain"
	}
	lastRrg := GetLastArg(args)
	if ExistOnArray(config.CliResponseFormat, lastRrg) {
		return lastRrg
	}
	return "plain"
}

func ExistOnArray(array []string, value string) bool {
	for _, v := range array {
		if v == value {
			return true
		}
	}
	return false
}

func Em(err error) interface{} {
	return fiber.Map{
		"error": fiber.Map{"message": err.Error()},
	}
}

func Emp(err error, path string) interface{} {
	return fiber.Map{
		"error": fiber.Map{"message": err.Error(), "path": path},
	}
}
