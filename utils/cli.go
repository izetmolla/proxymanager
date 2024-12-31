package utils

import (
	"encoding/json"
	"fmt"
	"os"
)

func PrintCLi(format, res string, err error) {
	if format == "json" {
		if err != nil {
			jsonData, err := json.Marshal(map[string]interface{}{"error": map[string]interface{}{"message": err.Error()}})
			if err != nil {
				fmt.Printf(`{"error":{"message":"%s"}}`, err.Error())
				os.Exit(0)
			}
			fmt.Println(string(jsonData))
			os.Exit(0)
		} else {
			fmt.Print(res)
		}
	} else if format == "yaml" {
		if err != nil {
			fmt.Printf("error: %s\n", err.Error())
		} else {
			fmt.Println(res)
		}
	} else {
		if err != nil {
			fmt.Printf("%s\n", err.Error())
		} else {
			fmt.Println(res)
		}
	}
	os.Exit(0)
}
