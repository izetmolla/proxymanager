package config

import "encoding/json"

func GetGlobalOptions() string {
	opt := make(map[string]interface{})
	opt["setup"] = true
	jsonData, err := json.Marshal(opt)
	if err != nil {
		return "{}"
	}
	return string(jsonData)
}
